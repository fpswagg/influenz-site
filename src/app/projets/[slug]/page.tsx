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
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{t.project.notFound}</h1>
          <Link href="/projets" className="text-violet-subtle hover:underline">
            {t.project.backToProjects}
          </Link>
        </div>
      </main>
    )
  }

  const translation = getProjectTranslation(project, language)

  return (
    <main className="min-h-screen">
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
              className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
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
            <div className="text-sm uppercase tracking-wider text-text-muted mb-4">
              {getCategoryTranslation(project.categoryId, language)} • {project.year}
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              {translation.title}
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              {translation.longDescription}
            </p>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="aspect-video bg-dark-surface rounded-2xl border border-dark-border flex items-center justify-center mb-16"
          >
            <div className="text-8xl font-bold text-violet-subtle/20">
              {getCategoryTranslation(project.categoryId, language).charAt(0)}
            </div>
          </motion.div>

          {/* Project Details */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="p-6 border border-dark-border rounded-xl bg-dark-surface/50"
            >
              <div className="text-sm text-text-muted mb-2">{t.project.client}</div>
              <div className="font-medium">{translation.client}</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="p-6 border border-dark-border rounded-xl bg-dark-surface/50"
            >
              <div className="text-sm text-text-muted mb-2">{t.project.year}</div>
              <div className="font-medium">{project.year}</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="p-6 border border-dark-border rounded-xl bg-dark-surface/50"
            >
              <div className="text-sm text-text-muted mb-2">{t.project.category}</div>
              <div className="font-medium">{getCategoryTranslation(project.categoryId, language)}</div>
            </motion.div>
          </div>

          {/* Challenge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6">{t.project.challenge}</h2>
            <p className="text-lg text-text-secondary leading-relaxed">
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
            <h2 className="text-2xl font-bold mb-6">{t.project.solution}</h2>
            <p className="text-lg text-text-secondary leading-relaxed">
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
            <h2 className="text-2xl font-bold mb-6">{t.project.services}</h2>
            <div className="flex flex-wrap gap-3">
              {getProjectServices(project, language).map((service, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-text-secondary"
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
            className="p-8 border border-violet-subtle/30 rounded-2xl bg-violet-subtle/5"
          >
            <h2 className="text-2xl font-bold mb-6">{t.project.results}</h2>
            <ul className="space-y-4">
              {translation.results.map((result, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-violet-subtle flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg">{result}</span>
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
            <p className="text-text-secondary mb-6">
              {t.project.similar}
            </p>
            <Link
              href="/#contact"
              className="inline-block px-8 py-4 bg-violet-subtle text-white font-medium rounded-lg hover:bg-violet-muted transition-colors"
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

