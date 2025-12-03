// Configuration centralisée pour les variables d'environnement
// Les variables NEXT_PUBLIC_ sont accessibles côté client
// Les autres variables sont uniquement côté serveur

export const env = {
  // Contact Information (accessible côté client)
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || process.env.CONTACT_EMAIL || 'contact@influenz.cm',
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || process.env.CONTACT_PHONE || '+237 XX XX XX XX',
    address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || process.env.CONTACT_ADDRESS || 'Yaoundé, Cameroun',
  },

  // Social Media Links (accessible côté client)
  social: {
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || process.env.LINKEDIN_URL || '',
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || process.env.TWITTER_URL || '',
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || process.env.INSTAGRAM_URL || '',
  },

  // Contact Form Configuration (serveur uniquement)
  contactForm: {
    recipientEmail: process.env.CONTACT_FORM_RECIPIENT_EMAIL || 'contact@influenz.cm',
    emailService: process.env.EMAIL_SERVICE || 'smtp',
  },

  // SMTP Configuration (serveur uniquement)
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    fromName: process.env.SMTP_FROM_NAME || 'iNFLUENZ',
    fromEmail: process.env.SMTP_FROM_EMAIL || 'noreply@influenz.cm',
  },

  // Email Services API Keys (serveur uniquement)
  emailServices: {
    resendApiKey: process.env.RESEND_API_KEY || '',
    sendgridApiKey: process.env.SENDGRID_API_KEY || '',
    mailgunApiKey: process.env.MAILGUN_API_KEY || '',
    mailgunDomain: process.env.MAILGUN_DOMAIN || '',
  },

  // API Configuration (serveur uniquement)
  api: {
    contactEndpoint: process.env.CONTACT_API_ENDPOINT || '',
    contactApiKey: process.env.CONTACT_API_KEY || '',
  },

  // Environment
  nodeEnv: process.env.NODE_ENV || 'development',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
}
