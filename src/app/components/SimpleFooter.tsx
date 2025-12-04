'use client'

import { useAppStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { env } from '@/lib/config/env'

export default function SimpleFooter() {
  const language = useAppStore((state) => state.language)
  const t = translations[language]

  return (
    <footer className="py-12 px-4 lg:px-24 border-t border-purple-light/20 bg-white">
      <div className="max-w-content mx-auto">
        <div className="grid md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-purple-dark">iNFLUENZ</h3>
            <p className="text-purple-brand/70 text-sm">
              {t.footer.tagline}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-purple-dark">{t.footer.contact}</h4>
            <div className="space-y-2 text-sm text-purple-brand/70">
              <a 
                href={`mailto:${env.contact.email}`}
                className="block hover:text-purple-dark transition-colors"
              >
                {env.contact.email}
              </a>
              <div className="space-y-1">
                <a 
                  href={`tel:${env.contact.phone.replace(/\s/g, '')}`}
                  className="block hover:text-purple-dark transition-colors"
                >
                  {env.contact.phone}
                </a>
                <a 
                  href={`tel:${env.contact.phoneSecondary.replace(/\s/g, '')}`}
                  className="block hover:text-purple-dark transition-colors"
                >
                  {env.contact.phoneSecondary}
                </a>
              </div>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(env.contact.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-purple-dark transition-colors"
              >
                {env.contact.address}
              </a>
            </div>
          </div>

          {/* Legal Information */}
          <div>
            <h4 className="font-bold mb-4 text-purple-dark">{t.footer.legalInfo}</h4>
            <div className="space-y-2 text-sm text-purple-brand/70">
              <p>{env.company.legalForm}</p>
              <p>NIU: {env.company.niu}</p>
              <p>RCCM: {env.company.rccm}</p>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold mb-4 text-purple-dark">{t.footer.follow}</h4>
            <div className="space-y-2">
              {env.social.linkedin && (
                <a 
                  href={env.social.linkedin} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-purple-brand/70 hover:text-purple-dark transition-colors"
                >
                  LinkedIn
                </a>
              )}
              {env.social.twitter && (
                <a 
                  href={env.social.twitter} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-purple-brand/70 hover:text-purple-dark transition-colors"
                >
                  Twitter
                </a>
              )}
              {env.social.instagram && (
                <a 
                  href={env.social.instagram} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-purple-brand/70 hover:text-purple-dark transition-colors"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-purple-light/20 text-center text-purple-light text-sm">
          <p>&copy; {new Date().getFullYear()} INFLUENZ. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  )
}
