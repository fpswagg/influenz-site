'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { getProjectBySlug, getProjectTranslation, getCategoryTranslation, getProjectServices } from '@/lib/data'
import Header from '../../components/Header'
import SimpleFooter from '../../components/SimpleFooter'

export default function ProjectDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const language = useAppStore((state) => state.language)
  const t = translations[language]
  const project = getProjectBySlug(params.slug as string)
  const redirect = searchParams.get('redirect')

  if (!project) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-purple-dark">{t.project.notFound}</h1>
          <Link href="/projets" className="text-purple-brand hover:underline">
            {t.project.backToProjects}
          </Link>
        </div>
      </main>
    )
  }

  const translation = getProjectTranslation(project, language)

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
              href={redirect || '/projets'}
              className="inline-flex items-center gap-2 text-purple-brand hover:text-purple-dark transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {redirect ? t.project.backSimple : t.project.back}
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-16"
          >
            <div className="text-sm uppercase tracking-wider text-purple-light mb-4">
              {getCategoryTranslation(project.categoryId, language)} • {project.year}
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-purple-dark">
              {translation.title}
            </h1>
            <p className="text-xl text-purple-brand/80 leading-relaxed">
              {translation.longDescription}
            </p>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="aspect-video bg-purple-brand/5 rounded-2xl border border-purple-light/20 flex items-center justify-center mb-16 shadow-sm"
          >
            <div className="text-8xl font-bold text-purple-brand/30">
              {getCategoryTranslation(project.categoryId, language).charAt(0)}
            </div>
          </motion.div>

          {/* Project Details */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="p-6 border border-purple-light/20 rounded-xl bg-white shadow-sm"
            >
              <div className="text-sm text-purple-light mb-2">{t.project.client}</div>
              <div className="font-medium text-purple-dark">{translation.client}</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="p-6 border border-purple-light/20 rounded-xl bg-white shadow-sm"
            >
              <div className="text-sm text-purple-light mb-2">{t.project.year}</div>
              <div className="font-medium text-purple-dark">{project.year}</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="p-6 border border-purple-light/20 rounded-xl bg-white shadow-sm"
            >
              <div className="text-sm text-purple-light mb-2">{t.project.category}</div>
              <div className="font-medium text-purple-dark">{getCategoryTranslation(project.categoryId, language)}</div>
            </motion.div>
          </div>

          {/* Challenge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6 text-purple-dark">{t.project.challenge}</h2>
            <p className="text-lg text-purple-brand/80 leading-relaxed">
              {translation.challenge}
            </p>
          </motion.div>

          {/* Solution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6 text-purple-dark">{t.project.solution}</h2>
            <p className="text-lg text-purple-brand/80 leading-relaxed">
              {translation.solution}
            </p>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.55 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6 text-purple-dark">{t.project.services}</h2>
            <div className="flex flex-wrap gap-3">
              {getProjectServices(project, language).map((service, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-purple-brand/5 border border-purple-light/20 rounded-lg text-purple-brand/80"
                >
                  {service}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="p-8 border border-purple-brand/30 rounded-2xl bg-purple-brand/5"
          >
            <h2 className="text-2xl font-bold mb-6 text-purple-dark">{t.project.results}</h2>
            <ul className="space-y-4">
              {translation.results.map((result, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-purple-brand flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg text-purple-brand/80">{result}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.65 }}
            className="mt-16 text-center"
          >
            <p className="text-purple-brand/80 mb-6">
              {t.project.similar}
            </p>
            <Link
              href="/#contact"
              className="inline-block px-8 py-4 bg-purple-brand text-white font-medium rounded-lg hover:bg-purple-dark transition-colors shadow-lg shadow-purple-brand/25 hover:shadow-xl hover:shadow-purple-brand/30"
            >
              {t.project.contactUs}
            </Link>
          </motion.div>
        </div>
      </div>
      
      <SimpleFooter />
    </main>
  )
}

