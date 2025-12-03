'use client'

import { motion } from 'framer-motion'
import Header from './components/Header'
import SimpleFooter from './components/SimpleFooter'
import Hero from './sections/Hero'
import TrustedBy from './sections/TrustedBy'
import Projets from './sections/Projets'
import About from './sections/About'
import ContactForm from './components/ContactForm'
import { useAppStore } from '@/lib/store'
import { translations } from '@/lib/i18n'

export default function Home() {
  const { language } = useAppStore()
  const t = translations[language]

  return (
    <main className="min-h-screen">
      <Header />
      
      <Hero />
      
      <TrustedBy />
      
      <Projets />
      
      <About />
      
      <section id="contact" className="min-h-screen py-32 px-6 lg:px-24">
        <div className="max-w-content mx-auto">
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-medium text-text-muted uppercase tracking-wider">
                04
              </span>
              <div className="w-12 h-px bg-violet-subtle" />
              <span className="text-sm font-medium text-text-secondary uppercase tracking-wider">
                Contact
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              {t.contact.title}
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl">
              {language === 'fr' 
                ? 'Parlons de votre projet. Nous vous répondons sous 24h.'
                : 'Let\'s talk about your project. We respond within 24 hours.'}
            </p>
          </div>

          <div className="max-w-2xl">
            <ContactForm />
          </div>
        </div>
      </section>
      
      <SimpleFooter />
    </main>
  )
}

