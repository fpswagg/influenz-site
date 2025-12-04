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
    enterprise: '',
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
        setFormData({ name: '', enterprise: '', email: '', message: '' })
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
        <label htmlFor="name" className="block text-sm font-medium text-purple-brand mb-2">
          {t.contact.name}
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full px-4 py-3 bg-white border border-purple-light/30 rounded-lg focus:outline-none focus:border-purple-brand focus:ring-2 focus:ring-purple-brand/20 transition-colors text-purple-dark placeholder:text-purple-light"
          placeholder={t.contact.placeholders.name}
        />
      </div>

      <div>
        <label htmlFor="enterprise" className="block text-sm font-medium text-purple-brand mb-2">
          {t.contact.enterprise} <span className="text-purple-light">{t.contact.enterpriseOptional}</span>
        </label>
        <input
          type="text"
          id="enterprise"
          value={formData.enterprise}
          onChange={(e) => setFormData({ ...formData, enterprise: e.target.value })}
          className="w-full px-4 py-3 bg-white border border-purple-light/30 rounded-lg focus:outline-none focus:border-purple-brand focus:ring-2 focus:ring-purple-brand/20 transition-colors text-purple-dark placeholder:text-purple-light"
          placeholder={t.contact.placeholders.enterprise}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-purple-brand mb-2">
          {t.contact.email}
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full px-4 py-3 bg-white border border-purple-light/30 rounded-lg focus:outline-none focus:border-purple-brand focus:ring-2 focus:ring-purple-brand/20 transition-colors text-purple-dark placeholder:text-purple-light"
          placeholder={t.contact.placeholders.email}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-purple-brand mb-2">
          {t.contact.message}
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          rows={6}
          className="w-full px-4 py-3 bg-white border border-purple-light/30 rounded-lg focus:outline-none focus:border-purple-brand focus:ring-2 focus:ring-purple-brand/20 transition-colors text-purple-dark placeholder:text-purple-light resize-none"
          placeholder={t.contact.placeholders.message}
        />
      </div>

      {submitStatus === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {t.contact.success}
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {t.contact.error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-8 py-4 bg-purple-brand text-white font-medium rounded-lg hover:bg-purple-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-brand/25 hover:shadow-xl hover:shadow-purple-brand/30"
      >
        {isSubmitting ? t.contact.sending : t.contact.send}
      </button>
    </form>
  )
}

