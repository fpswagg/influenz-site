'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { env } from '@/lib/config/env'

export default function About() {
  const language = useAppStore((state) => state.language)
  const t = translations[language]

  return (
    <section id="about" className="min-h-screen py-32 px-6 lg:px-24 bg-purple-brand/5">
      <div className="max-w-content mx-auto">
        {/* Header */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-medium text-purple-light uppercase tracking-wider">
              04
            </span>
            <div className="w-12 h-px bg-purple-brand" />
            <span className="text-sm font-medium text-purple-brand uppercase tracking-wider">
              {language === 'fr' ? 'À propos' : 'About'}
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-purple-dark">
            {t.about.title}
          </h2>
          <p className="text-xl text-purple-brand font-medium">
            {t.about.subtitle}
          </p>
        </div>

        {/* Qui nous sommes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold mb-6 text-purple-dark">{t.about.whoWeAre.title}</h3>
          <div className="space-y-4 text-lg text-purple-brand/80 leading-relaxed">
            <p>{t.about.whoWeAre.text1}</p>
            <p>{t.about.whoWeAre.text2}</p>
          </div>
        </motion.div>

        {/* Notre raison d'être */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold mb-6 text-purple-dark">{t.about.ourPurpose.title}</h3>
          <div className="space-y-4 text-lg text-purple-brand/80 leading-relaxed">
            <p>{t.about.ourPurpose.text1}</p>
            <p>{t.about.ourPurpose.text2}</p>
          </div>
        </motion.div>

        {/* Notre mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-20 p-8 lg:p-12 border border-purple-brand/30 rounded-2xl bg-white"
        >
          <h3 className="text-2xl font-bold mb-6 text-purple-dark">{t.about.ourMission.title}</h3>
          <p className="text-lg text-purple-brand/80 leading-relaxed mb-8">
            {t.about.ourMission.text}
          </p>
          <ul className="space-y-4">
            {t.about.ourMission.points.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <svg className="w-6 h-6 text-purple-brand flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-purple-brand/80 leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Services */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold mb-12 text-purple-dark">{t.about.services.title}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {t.about.services.items.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-8 border border-purple-light/20 rounded-2xl hover:border-purple-brand/30 transition-colors bg-white shadow-sm hover:shadow-lg hover:shadow-purple-brand/5"
              >
                <h4 className="text-xl font-bold mb-3 text-purple-dark">{service.title}</h4>
                <p className="text-purple-brand/70 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Location avec Google Maps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="grid lg:grid-cols-2 gap-12 p-12 border border-purple-light/20 rounded-2xl bg-white shadow-sm"
        >
          <div>
            <h3 className="text-2xl font-bold mb-4 text-purple-dark">{t.about.location.title}</h3>
            <div className="flex items-center gap-2 text-xl mb-6">
              <span className="text-3xl">📍</span>
              <div>
                <div className="font-bold text-purple-brand">{t.about.location.city}</div>
                <div className="text-purple-brand/70">{t.about.location.country}</div>
              </div>
            </div>
            <div className="mb-4 text-purple-brand/80">
              <p className="font-medium mb-2">{env.contact.address}</p>
              <div className="space-y-1 text-sm">
                <a 
                  href={`tel:${env.contact.phone.replace(/\s/g, '')}`}
                  className="block hover:text-purple-dark transition-colors"
                >
                  📞 {env.contact.phone}
                </a>
                <a 
                  href={`tel:${env.contact.phoneSecondary.replace(/\s/g, '')}`}
                  className="block hover:text-purple-dark transition-colors"
                >
                  📞 {env.contact.phoneSecondary}
                </a>
                <a 
                  href={`mailto:${env.contact.email}`}
                  className="block hover:text-purple-dark transition-colors"
                >
                  ✉️ {env.contact.email}
                </a>
              </div>
            </div>
            <p className="text-purple-brand/80 text-lg leading-relaxed">
              {language === 'fr' 
                ? 'Basé à Yaoundé, iNFLUENZ opère au Cameroun et à l\'échelle internationale. Notre équipe d\'experts en communication et stratégie vous accompagne dans tous vos projets.'
                : 'Based in Yaoundé, iNFLUENZ operates in Cameroon and internationally. Our team of communication and strategy experts supports you in all your projects.'}
            </p>
          </div>
          <div className="w-full h-full min-h-[300px] rounded-xl overflow-hidden border border-purple-light/20 shadow-inner">
            {/* Google Maps Embed pour Yaoundé */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127331.57082244655!2d11.438201299999999!3d3.8480325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcf7a309ff7dd%3A0x50c4c7460ec157e!2sYaound%C3%A9%2C%20Cameroon!5e0!3m2!1sen!2s!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '300px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Yaoundé, Cameroun"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
