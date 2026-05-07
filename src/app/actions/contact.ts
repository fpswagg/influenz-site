'use server'

import { env } from '@/lib/config/env'
import nodemailer from 'nodemailer'

export interface ContactFormData {
  name: string
  enterprise?: string
  email: string
  message: string
}

export interface ContactFormResult {
  success: boolean
  message?: string
}

interface NormalizedContactFormData extends ContactFormData {
  enterprise: string
}

interface ContactDeliveryContext {
  data: NormalizedContactFormData
  recipientEmail: string
  timestamp: string
  subject: string
  text: string
  html: string
}

class ContactDeliveryError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ContactDeliveryError'
  }
}

export async function submitContactForm(
  data: ContactFormData
): Promise<ContactFormResult> {
  try {
    const normalizedData = normalizeContactFormData(data)

    if (!normalizedData.name || !normalizedData.email || !normalizedData.message) {
      return {
        success: false,
        message: 'Tous les champs sont requis',
      }
    }

    if (!isValidEmail(normalizedData.email)) {
      return {
        success: false,
        message: 'Format d\'email invalide',
      }
    }

    const recipientEmail = env.contactForm.recipientEmail
    const timestamp = new Date().toISOString()
    const deliveryContext = createDeliveryContext({
      data: normalizedData,
      recipientEmail,
      timestamp,
    })

    await deliverContactForm(deliveryContext)

    return {
      success: true,
      message: 'Message envoyé avec succès',
    }
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return {
      success: false,
      message: 'Une erreur est survenue',
    }
  }
}

function normalizeContactFormData(data: ContactFormData): NormalizedContactFormData {
  return {
    name: data.name?.trim() || '',
    enterprise: data.enterprise?.trim() || '',
    email: data.email?.trim().toLowerCase() || '',
    message: data.message?.trim() || '',
  }
}

function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function createDeliveryContext({
  data,
  recipientEmail,
  timestamp,
}: {
  data: NormalizedContactFormData
  recipientEmail: string
  timestamp: string
}): ContactDeliveryContext {
  const subject = `Nouvelle demande de contact - ${data.name}`
  const enterprise = data.enterprise || 'Non renseignée'
  const text = [
    'Nouvelle demande de contact',
    '',
    `Nom: ${data.name}`,
    `Entreprise: ${enterprise}`,
    `Email: ${data.email}`,
    `Destinataire: ${recipientEmail}`,
    `Date: ${timestamp}`,
    '',
    'Message:',
    data.message,
  ].join('\n')

  const html = [
    '<h2>Nouvelle demande de contact</h2>',
    '<dl>',
    `<dt>Nom</dt><dd>${escapeHtml(data.name)}</dd>`,
    `<dt>Entreprise</dt><dd>${escapeHtml(enterprise)}</dd>`,
    `<dt>Email</dt><dd>${escapeHtml(data.email)}</dd>`,
    `<dt>Destinataire</dt><dd>${escapeHtml(recipientEmail)}</dd>`,
    `<dt>Date</dt><dd>${escapeHtml(timestamp)}</dd>`,
    '</dl>',
    '<h3>Message</h3>',
    `<p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>`,
  ].join('')

  return {
    data,
    recipientEmail,
    timestamp,
    subject,
    text,
    html,
  }
}

async function deliverContactForm(context: ContactDeliveryContext) {
  const emailService = env.contactForm.emailService.trim().toLowerCase()

  switch (emailService) {
    case 'smtp':
      await sendWithSmtp(context)
      return
    case 'resend':
      await sendWithResend(context)
      return
    case 'sendgrid':
      await sendWithSendGrid(context)
      return
    case 'mailgun':
      await sendWithMailgun(context)
      return
    case 'api':
    case 'webhook':
      await sendToContactApi(context)
      return
    default:
      throw new ContactDeliveryError(`Unsupported EMAIL_SERVICE: ${emailService}`)
  }
}

async function sendWithSmtp(context: ContactDeliveryContext) {
  const host = requireConfig(env.smtp.host, 'SMTP_HOST')
  const fromEmail = requireConfig(env.smtp.fromEmail, 'SMTP_FROM_EMAIL')
  const auth = getSmtpAuth()

  const transport = nodemailer.createTransport({
    host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    ...(auth ? { auth } : {}),
  })

  await transport.sendMail({
    from: formatEmailAddress(fromEmail, env.smtp.fromName),
    to: context.recipientEmail,
    replyTo: formatEmailAddress(context.data.email, context.data.name),
    subject: context.subject,
    text: context.text,
    html: context.html,
  })
}

async function sendWithResend(context: ContactDeliveryContext) {
  const apiKey = requireConfig(env.emailServices.resendApiKey, 'RESEND_API_KEY')
  const fromEmail = requireConfig(env.smtp.fromEmail, 'SMTP_FROM_EMAIL')

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': createIdempotencyKey(context),
    },
    body: JSON.stringify({
      from: formatEmailAddress(fromEmail, env.smtp.fromName),
      to: [context.recipientEmail],
      reply_to: formatEmailAddress(context.data.email, context.data.name),
      subject: context.subject,
      text: context.text,
      html: context.html,
    }),
  })

  await assertProviderResponse(response, 'Resend')
}

async function sendWithSendGrid(context: ContactDeliveryContext) {
  const apiKey = requireConfig(env.emailServices.sendgridApiKey, 'SENDGRID_API_KEY')
  const fromEmail = requireConfig(env.smtp.fromEmail, 'SMTP_FROM_EMAIL')

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: context.recipientEmail }],
          subject: context.subject,
        },
      ],
      from: {
        email: fromEmail,
        name: env.smtp.fromName,
      },
      reply_to: {
        email: context.data.email,
        name: context.data.name,
      },
      content: [
        {
          type: 'text/plain',
          value: context.text,
        },
        {
          type: 'text/html',
          value: context.html,
        },
      ],
    }),
  })

  await assertProviderResponse(response, 'SendGrid')
}

async function sendWithMailgun(context: ContactDeliveryContext) {
  const apiKey = requireConfig(env.emailServices.mailgunApiKey, 'MAILGUN_API_KEY')
  const domain = requireConfig(env.emailServices.mailgunDomain, 'MAILGUN_DOMAIN')
  const fromEmail = requireConfig(env.smtp.fromEmail, 'SMTP_FROM_EMAIL')
  const body = new URLSearchParams({
    from: formatEmailAddress(fromEmail, env.smtp.fromName),
    to: context.recipientEmail,
    subject: context.subject,
    text: context.text,
    html: context.html,
    'h:Reply-To': formatEmailAddress(context.data.email, context.data.name),
  })

  const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })

  await assertProviderResponse(response, 'Mailgun')
}

async function sendToContactApi(context: ContactDeliveryContext) {
  const endpoint = requireConfig(env.api.contactEndpoint, 'CONTACT_API_ENDPOINT')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (env.api.contactApiKey) {
    headers.Authorization = `Bearer ${env.api.contactApiKey}`
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      ...context.data,
      recipientEmail: context.recipientEmail,
      timestamp: context.timestamp,
    }),
  })

  await assertProviderResponse(response, 'Contact API')
}

function getSmtpAuth() {
  if (!env.smtp.user && !env.smtp.password) {
    return undefined
  }

  return {
    user: requireConfig(env.smtp.user, 'SMTP_USER'),
    pass: requireConfig(env.smtp.password, 'SMTP_PASSWORD'),
  }
}

async function assertProviderResponse(response: Response, provider: string) {
  if (response.ok) {
    return
  }

  const body = await response.text().catch(() => '')
  throw new ContactDeliveryError(
    `${provider} request failed with status ${response.status}: ${body.slice(0, 500)}`
  )
}

function requireConfig(value: string | undefined, name: string) {
  const normalizedValue = value?.trim()

  if (!normalizedValue) {
    throw new ContactDeliveryError(`${name} is required for contact form delivery`)
  }

  return normalizedValue
}

function formatEmailAddress(email: string, name?: string) {
  const normalizedName = name?.trim()

  if (!normalizedName) {
    return email
  }

  return `"${normalizedName.replace(/"/g, '\\"')}" <${email}>`
}

function createIdempotencyKey(context: ContactDeliveryContext) {
  const normalizedTimestamp = context.timestamp.replace(/[^0-9TZ]/g, '')
  return `contact-form/${normalizedTimestamp}`
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

