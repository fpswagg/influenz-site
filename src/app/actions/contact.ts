'use server'

import { env } from '@/lib/config/env'

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

export async function submitContactForm(
  data: ContactFormData
): Promise<ContactFormResult> {
  try {
    // Validate form data
    if (!data.name || !data.email || !data.message) {
      return {
        success: false,
        message: 'Tous les champs sont requis',
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        message: 'Format d\'email invalide',
      }
    }

    // Get configuration from environment variables
    const recipientEmail = env.contactForm.recipientEmail
    const emailService = env.contactForm.emailService
    const contactApiEndpoint = env.api.contactEndpoint
    const contactApiKey = env.api.contactApiKey

    // Log submission (in production, you would send email or save to database)
    console.log('Contact form submission:', {
      ...data,
      recipientEmail,
      timestamp: new Date().toISOString(),
    })

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification using the configured service
    // 3. Integrate with CRM
    // 4. Use external API if configured
    
    // Example: Send email if email service is configured
    if (emailService && emailService !== 'smtp') {
      // Integration with email service (Resend, SendGrid, Mailgun, etc.)
      // This would be implemented based on the selected service
      console.log(`Email service configured: ${emailService}`)
    }

    // Example: Use external API if configured
    if (contactApiEndpoint && contactApiKey) {
      // Make API call to external service
      // This would be implemented based on your API requirements
      console.log('External API configured')
    }

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 1000))

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

