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
    <section id="hero" className="relative min-h-screen flex items-center justify-center px-6 py-24 lg:px-24 lg:py-32 bg-gradient-to-br from-white via-violet-50/30 to-white">
      <div className="max-w-content mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Small label */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-px bg-violet-subtle" />
              <span className="text-sm font-medium text-text-secondary uppercase tracking-wider">
                {t.hero.label}
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-text-primary">
              {t.hero.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-text-secondary leading-relaxed max-w-xl">
              {t.hero.subtitle}
            </p>

            {/* CTA */}
            <div className="flex items-center gap-4 pt-4">
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
                className="px-8 py-4 border border-light-border text-text-primary font-medium rounded-lg hover:border-violet-subtle hover:text-violet-subtle transition-colors"
              >
                {t.hero.ctaSecondary}
              </button>
            </div>
          </motion.div>

          {/* Right: Banner Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-violet-subtle/10 border border-light-border">
              <Image
                src="/images/banner.jpg"
                alt="iNFLUENZ - Communication & Strategy"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-subtle/10 via-transparent to-transparent" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-violet-subtle/10 rounded-full blur-2xl" />
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-violet-subtle/5 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

