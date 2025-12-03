'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { submitContactForm } from '../actions/contact'

export default function ContactForm() {
  const { language } = useAppStore()
  const t = translations[language]
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const result = await submitContactForm(formData)
      if (result.success) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">
          {t.contact.name}
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg focus:outline-none focus:border-violet-subtle transition-colors text-text-primary"
          placeholder={t.contact.placeholders.name}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
          {t.contact.email}
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg focus:outline-none focus:border-violet-subtle transition-colors text-text-primary"
          placeholder={t.contact.placeholders.email}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-2">
          {t.contact.message}
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          rows={6}
          className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg focus:outline-none focus:border-violet-subtle transition-colors text-text-primary resize-none"
          placeholder={t.contact.placeholders.message}
        />
      </div>

      {submitStatus === 'success' && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400">
          {t.contact.success}
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          {t.contact.error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-8 py-4 bg-violet-subtle text-white font-medium rounded-lg hover:bg-violet-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? t.contact.sending : t.contact.send}
      </button>
    </form>
  )
}

