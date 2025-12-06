'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { getSolutionBySlug, getSolutionTranslation, getSolutionCategoryTranslation } from '@/lib/data'
import Header from '../../components/Header'
import SimpleFooter from '../../components/SimpleFooter'

export default function SolutionDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const language = useAppStore((state) => state.language)
  const t = translations[language]
  const solution = getSolutionBySlug(params.slug as string)
  const redirect = searchParams.get('redirect')

  if (!solution) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-purple-dark">{t.solution.notFound}</h1>
          <Link href="/solutions" className="text-purple-brand hover:underline">
            {t.solution.backToSolutions}
          </Link>
        </div>
      </main>
    )
  }

  const translation = getSolutionTranslation(solution, language)

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="px-6 py-24 lg:px-24 lg:py-32">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-12"
          >
            <Link
              href={redirect || '/solutions'}
              className="inline-flex items-center gap-2 text-purple-brand hover:text-purple-dark transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {redirect ? t.solution.backSimple : t.solution.back}
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="text-6xl">{solution.icon}</span>
              <div className="text-sm uppercase tracking-wider text-purple-light">
                {getSolutionCategoryTranslation(solution.categoryId, language)}
              </div>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-purple-dark">
              {translation.title}
            </h1>
            <p className="text-xl text-purple-brand/80 leading-relaxed">
              {translation.description}
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-8 text-purple-dark">{t.solution.features}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {translation.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                  className="flex items-start gap-3 p-4 bg-purple-brand/5 rounded-xl border border-purple-light/20"
                >
                  <svg className="w-6 h-6 text-purple-brand flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-purple-brand/80">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mb-16 p-8 border border-purple-brand/30 rounded-2xl bg-white"
          >
            <h2 className="text-2xl font-bold mb-8 text-purple-dark">{t.solution.benefits}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {translation.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-brand/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-brand font-bold text-sm">{index + 1}</span>
                  </div>
                  <span className="text-purple-brand/80 leading-relaxed">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="text-center p-12 bg-purple-brand/5 rounded-2xl border border-purple-light/20"
          >
            <h3 className="text-2xl font-bold mb-4 text-purple-dark">
              {t.solution.interested}
            </h3>
            <p className="text-purple-brand/70 mb-8 max-w-xl mx-auto">
              {translation.callToAction}
            </p>
            <Link
              href="/#contact"
              className="inline-block px-8 py-4 bg-purple-brand text-white font-medium rounded-lg hover:bg-purple-dark transition-colors shadow-lg shadow-purple-brand/25 hover:shadow-xl hover:shadow-purple-brand/30"
            >
              {t.solution.contactUs}
            </Link>
          </motion.div>
        </div>
      </div>
      
      <SimpleFooter />
    </main>
  )
}
