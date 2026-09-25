export const env = {
  contactForm: {
    recipientEmail: process.env.CONTACT_FORM_RECIPIENT_EMAIL || 'info@influenz.cm',
    emailService: process.env.EMAIL_SERVICE || 'smtp',
  },
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    fromName: process.env.SMTP_FROM_NAME || 'iNFLUENZ',
    fromEmail: process.env.SMTP_FROM_EMAIL || 'noreply@influenz.cm',
  },
  emailServices: {
    resendApiKey: process.env.RESEND_API_KEY || '',
    sendgridApiKey: process.env.SENDGRID_API_KEY || '',
    mailgunApiKey: process.env.MAILGUN_API_KEY || '',
    mailgunDomain: process.env.MAILGUN_DOMAIN || '',
  },
  api: {
    contactEndpoint: process.env.CONTACT_API_ENDPOINT || '',
    contactApiKey: process.env.CONTACT_API_KEY || '',
  },
  storage: {
    url: process.env.SA_STORAGE_URL || 'https://sastorage.fpswagg.site',
    publicUrl: process.env.SA_STORAGE_PUBLIC_URL || 'https://sastorage.fpswagg.site',
  },
  nodeEnv: process.env.NODE_ENV || 'development',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
}
