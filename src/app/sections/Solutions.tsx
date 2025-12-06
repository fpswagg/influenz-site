'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAppStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { getFeaturedSolutions, getSolutionTranslation, getSolutionCategoryTranslation } from '@/lib/data'

export default function Solutions() {
  const language = useAppStore((state) => state.language)
  const t = translations[language]
  const featuredSolutions = getFeaturedSolutions()

  return (
    <section id="solutions" className="min-h-screen py-32 px-6 lg:px-24 bg-purple-brand/5">
      <div className="max-w-content mx-auto">
        {/* Header */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-medium text-purple-light uppercase tracking-wider">
              03
            </span>
            <div className="w-12 h-px bg-purple-brand" />
            <span className="text-sm font-medium text-purple-brand uppercase tracking-wider">
              {language === 'fr' ? 'Services' : 'Services'}
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-purple-dark">
            {t.solutions.title}
          </h2>
          <p className="text-xl text-purple-brand/80 max-w-2xl">
            {t.solutions.subtitle}
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredSolutions.map((solution, index) => {
            const translation = getSolutionTranslation(solution, language)
            return (
              <motion.div
                key={solution.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group"
              >
                <Link href={`/solutions/${solution.slug}`} className="block h-full">
                  <div className="h-full p-8 border border-purple-light/20 rounded-2xl hover:border-purple-brand/30 transition-all bg-white hover:shadow-lg hover:shadow-purple-brand/5 flex flex-col">
                    {/* Icon & Category */}
                    <div className="flex items-start justify-between mb-6">
                      <span className="text-4xl">{solution.icon}</span>
                      <span className="text-xs font-medium text-purple-light uppercase tracking-wider">
                        {getSolutionCategoryTranslation(solution.categoryId, language)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold text-purple-dark group-hover:text-purple-brand transition-colors mb-4">
                        {translation.title}
                      </h3>
                      <p className="text-purple-brand/70 leading-relaxed mb-6">
                        {translation.shortDescription}
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-purple-brand font-medium mt-auto pt-4 border-t border-purple-light/10">
                      <span>{t.solutions.cta}</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* CTA to all solutions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link
            href="/solutions"
            className="inline-flex items-center gap-2 px-6 py-3 border border-purple-light/30 rounded-lg hover:border-purple-brand text-purple-brand hover:bg-purple-brand hover:text-white transition-colors shadow-sm"
          >
            <span className="font-medium">
              {t.solutions.viewAll}
            </span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
