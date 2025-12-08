'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { projectsData, getProjectTranslation, categoriesData, getProjectCategory, getCategoryTranslation, getProjectServices, isVideoMedia } from '@/lib/data'
import Header from '../components/Header'
import SimpleFooter from '../components/SimpleFooter'
import VideoPlayer from '../components/VideoPlayer'

export default function ProjetsPage() {
  const language = useAppStore((state) => state.language)
  const t = translations[language]
  const [activeFilter, setActiveFilter] = useState('all')

  // Filter projects based on active filter
  const filteredProjects = activeFilter === 'all' 
    ? projectsData 
    : projectsData.filter(project => getProjectCategory(project) === activeFilter)

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="px-6 py-24 lg:px-24 lg:py-32">
        <div className="max-w-content mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-20"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-purple-brand hover:text-purple-dark transition-colors mb-8"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t.projectsPage.back}
            </Link>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-purple-dark">
              {t.projectsPage.title}
            </h1>
            <p className="text-xl text-purple-brand/80 max-w-2xl">
              {t.projectsPage.subtitle}
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-wrap gap-3 mb-12"
          >
            {categoriesData.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeFilter === category.id
                    ? 'bg-purple-brand text-white shadow-lg shadow-purple-brand/25'
                    : 'border border-purple-light/30 text-purple-brand hover:text-purple-dark hover:border-purple-brand/50 bg-white'
                }`}
              >
                {category[language]}
              </button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {filteredProjects.length === 0 ? (
              <div className="col-span-2 text-center py-20">
                <p className="text-xl text-purple-light">
                  {t.projectsPage.noProjects}
                </p>
              </div>
            ) : (
              filteredProjects.map((project, index) => {
                const translation = getProjectTranslation(project, language)
                return (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                >
                  <Link
                    href={`/projets/${project.slug}`}
                    className="group block"
                  >
                    <div className="border border-purple-light/20 rounded-2xl overflow-hidden hover:border-purple-brand/50 transition-colors bg-white shadow-sm hover:shadow-lg hover:shadow-purple-brand/10">
                      {/* Media */}
                      <div 
                        className="aspect-video bg-purple-brand/5 flex items-center justify-center border-b border-purple-light/20 relative overflow-hidden rounded-t-2xl select-none"
                        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                        onDragStart={(e: React.DragEvent) => e.preventDefault()}
                      >
                        {project.media && project.media[0] ? (
                          isVideoMedia(project.media[0]) ? (
                            <VideoPlayer 
                              src={project.media[0]} 
                              className="w-full h-full rounded-t-2xl" 
                              muted={true}
                            />
                          ) : (
                            <Image
                              src={project.media[0]}
                              alt={translation.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-2xl"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          )
                        ) : (
                          <div className="text-6xl font-bold text-purple-brand/30">
                            {getCategoryTranslation(project.categoryId, language).charAt(0)}
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <div className="text-xs uppercase tracking-wider text-purple-light mb-3">
                          {getCategoryTranslation(project.categoryId, language)} • {project.year}
                        </div>
                        
                        <h2 className="text-2xl font-bold mb-3 text-purple-dark group-hover:text-purple-brand transition-colors">
                          {translation.title}
                        </h2>
                        
                        <p className="text-purple-brand/70 leading-relaxed mb-4">
                          {translation.description}
                        </p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {getProjectServices(project, language).slice(0, 3).map((service, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-purple-brand/5 border border-purple-light/20 rounded-full text-xs text-purple-brand/70"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                        
                        {/* CTA */}
                        <div className="flex items-center gap-2 text-purple-brand font-medium">
                          <span>{t.projectsPage.viewProject}</span>
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                </Link>
              </motion.article>
                )
              })
            )}
          </div>
        </div>
      </div>
      
      <SimpleFooter />
    </main>
  )
}

