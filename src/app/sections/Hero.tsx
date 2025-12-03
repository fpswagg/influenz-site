'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAppStore } from '@/lib/store'
import { translations } from '@/lib/i18n'

export default function Hero() {
  const { language } = useAppStore()
  const t = translations[language]

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center px-6 py-24 lg:px-24 lg:py-32">
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
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
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
                className="px-8 py-4 bg-violet-subtle text-white font-medium rounded-lg hover:bg-violet-muted transition-colors"
              >
                {t.hero.cta}
              </Link>
              <button
                onClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-8 py-4 border border-dark-border text-text-primary font-medium rounded-lg hover:border-violet-subtle transition-colors"
              >
                {t.hero.ctaSecondary}
              </button>
            </div>
          </motion.div>

          {/* Right: Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="aspect-square rounded-2xl bg-dark-surface border border-dark-border overflow-hidden">
              {/* Decorative grid */}
              <div className="absolute inset-0 opacity-5">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                  }}
                />
              </div>

              {/* Central element */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 rounded-full bg-violet-subtle/10 blur-3xl" />
                  <div className="absolute inset-8 rounded-full bg-violet-subtle/20 blur-2xl" />
                  <div className="absolute inset-16 rounded-full bg-violet-subtle/30 blur-xl" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-8xl font-bold text-violet-subtle/20">
                      I
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

