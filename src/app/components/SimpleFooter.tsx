'use client'

import Image from 'next/image'
import { useAppStore } from '@/lib/store'
import { useCopy, useSettings } from '@/lib/content/site-context'

export default function SimpleFooter() {
  const language = useAppStore((state) => state.language)
  const t = useCopy()
  const settings = useSettings()

  return (
    <footer className="py-12 px-4 lg:px-24 border-t border-purple-light/20 bg-white">
      <div className="max-w-content mx-auto">
        <div className="grid md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <Image
                src={settings.textLogoUrl}
                alt={settings.siteName}
                width={140}
                height={38}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-purple-brand/70 text-sm">
              {t.footer.tagline}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-purple-dark">{t.footer.contact}</h4>
            <div className="space-y-2 text-sm text-purple-brand/70">
              <a 
                href={`mailto:${settings.email}`}
                className="block hover:text-purple-dark transition-colors"
              >
                {settings.email}
              </a>
              <div className="space-y-1">
              <a 
                href={`tel:${settings.phone.replace(/\s/g, '')}`}
                  className="block hover:text-purple-dark transition-colors"
              >
                {settings.phone}
              </a>
                {settings.phoneSecondary ? (
                <a 
                  href={`tel:${settings.phoneSecondary.replace(/\s/g, '')}`}
                  className="block hover:text-purple-dark transition-colors"
                >
                  {settings.phoneSecondary}
                </a>
                ) : null}
              </div>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-purple-dark transition-colors"
              >
                {settings.address}
              </a>
            </div>
          </div>

          {/* Legal Information */}
          <div>
            <h4 className="font-bold mb-4 text-purple-dark">{t.footer.legalInfo}</h4>
            <div className="space-y-2 text-sm text-purple-brand/70">
              <p>{settings.legalForm}</p>
              <p>NIU: {settings.niu}</p>
              <p>RCCM: {settings.rccm}</p>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold mb-4 text-purple-dark">{t.footer.follow}</h4>
            <div className="space-y-2">
              {settings.linkedinUrl && (
                <a 
                  href={settings.linkedinUrl} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-purple-brand/70 hover:text-purple-dark transition-colors"
                >
                  LinkedIn
                </a>
              )}
              {settings.twitterUrl && (
                <a 
                  href={settings.twitterUrl} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-purple-brand/70 hover:text-purple-dark transition-colors"
                >
                  Twitter
                </a>
              )}
              {settings.instagramUrl && (
                <a 
                  href={settings.instagramUrl} 
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

        <div className="pt-8 border-t border-purple-light/20 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-purple-light">
            <span>&copy; {new Date().getFullYear()}</span>
            <Image
              src={settings.textLogoUrl}
              alt={settings.siteName}
              width={100}
              height={27}
              className="h-6 w-auto"
            />
            <span>. {t.footer.rights}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
