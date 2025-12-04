'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import SideNav from './SideNav'

export default function Header() {
  const pathname = usePathname()
  const { language, setLanguage } = useAppStore()
  const [isSideNavVisible, setIsSideNavVisible] = useState(false)
  const isHomePage = pathname === '/'

  return (
    <>
      {/* Top Right Controls - toujours visible */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-white/95 backdrop-blur-sm border border-light-border rounded-xl p-3 shadow-lg">
        {/* Toggle Side Nav - seulement sur homepage et desktop uniquement */}
        {isHomePage && (
          <button
            onClick={() => setIsSideNavVisible(!isSideNavVisible)}
            className="hidden lg:flex px-4 py-2 text-sm font-medium text-purple-brand hover:text-purple-dark bg-light-surface border border-light-border rounded-lg transition-colors"
            aria-label="Toggle navigation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isSideNavVisible ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        )}

        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
          className="px-4 py-2 text-sm font-medium text-purple-brand hover:text-purple-dark bg-light-surface border border-light-border rounded-lg transition-colors"
        >
          {language === 'fr' ? 'EN' : 'FR'}
        </button>

        {/* Logo Image */}
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <Image
            src="/images/text-logo.png"
            alt="iNFLUENZ"
            width={120}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>
      </div>

      {/* Side Nav - seulement sur homepage */}
      {/* Sur mobile: toujours visible, sur desktop: toggleable */}
      {isHomePage && <SideNav isVisible={isSideNavVisible} />}
    </>
  )
}

