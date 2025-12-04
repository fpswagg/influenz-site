'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useAppStore } from '@/lib/store'
import { translations } from '@/lib/i18n'

export default function Hero() {
  const { language } = useAppStore()
  const t = translations[language]

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/banner.jpg"
          alt="iNFLUENZ - Communication & Strategy"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Overlay for better text readability - lighter to show more of the image */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-content mx-auto w-full px-6 py-24 lg:px-24 lg:py-32">
        <div className="max-w-2xl">
          {/* Content Card with subtle glass effect for better readability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8 bg-white/60 backdrop-blur-sm rounded-2xl p-8 lg:p-10 shadow-xl shadow-black/5"
          >
            {/* Small label */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-px bg-violet-subtle" />
              <span className="text-sm font-medium text-violet-subtle uppercase tracking-wider">
                {t.hero.label}
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-text-primary">
              {t.hero.title}
            </h1>

            {/* Subtitle */}
            <p className="text-lg lg:text-xl text-text-secondary leading-relaxed">
              {t.hero.subtitle}
            </p>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/projets"
                className="px-8 py-4 bg-violet-subtle text-white font-medium rounded-lg hover:bg-violet-muted transition-colors shadow-lg shadow-violet-subtle/25 hover:shadow-xl hover:shadow-violet-subtle/30"
              >
                {t.hero.cta}
              </Link>
              <button
                onClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-8 py-4 bg-white/90 border border-light-border text-text-primary font-medium rounded-lg hover:border-violet-subtle hover:text-violet-subtle transition-colors"
              >
                {t.hero.ctaSecondary}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

