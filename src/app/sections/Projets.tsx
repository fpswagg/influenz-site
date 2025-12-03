'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAppStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { projectsData, getProjectTranslation, getCategoryTranslation } from '@/lib/data'

export default function Projets() {
  const language = useAppStore((state) => state.language)
  const t = translations[language]

  return (
    <section id="projects" className="min-h-screen py-32 px-6 lg:px-24">
      <div className="max-w-content mx-auto">
        {/* Header */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-medium text-text-muted uppercase tracking-wider">
              02
            </span>
            <div className="w-12 h-px bg-violet-subtle" />
            <span className="text-sm font-medium text-text-secondary uppercase tracking-wider">
              {language === 'fr' ? 'Portfolio' : 'Portfolio'}
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            {t.projects.title}
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl">
            {t.projects.subtitle}
          </p>
        </div>

        {/* Projects Grid */}
        <div className="space-y-8">
          {projectsData.map((project, index) => {
            const translation = getProjectTranslation(project, language)
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group"
              >
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center p-8 lg:p-12 border border-dark-border rounded-2xl hover:border-violet-subtle/30 transition-colors bg-dark-surface/30">
                  {/* Number */}
                  <div className="lg:col-span-1">
                    <span className="text-5xl font-bold text-text-muted group-hover:text-violet-subtle transition-colors">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="lg:col-span-7 space-y-4">
                    <div>
                      <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                        {getCategoryTranslation(project.categoryId, language)}
                      </span>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold group-hover:text-violet-subtle transition-colors">
                      {translation.title}
                    </h3>
                    <p className="text-lg text-text-secondary leading-relaxed">
                      {translation.description}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="lg:col-span-4 flex lg:justify-end">
                    <Link
                      href={`/projets/${project.slug}?redirect=/#projects`}
                      className="inline-flex items-center gap-3 px-6 py-3 bg-dark-surface border border-dark-border rounded-lg text-text-primary hover:text-violet-subtle hover:border-violet-subtle transition-all group/btn"
                    >
                      <span className="font-medium">{t.projects.cta}</span>
                      <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA to all projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link
            href="/projets"
            className="inline-flex items-center gap-2 px-6 py-3 border border-dark-border rounded-lg hover:border-violet-subtle/50 text-text-primary hover:text-violet-subtle transition-colors"
          >
            <span className="font-medium">
              {language === 'fr' ? 'Voir tous les projets' : 'View all projects'}
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

