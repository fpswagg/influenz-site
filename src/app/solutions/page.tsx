'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { solutionsData, solutionCategoriesData, getSolutionTranslation, getSolutionCategoryTranslation } from '@/lib/data'
import Header from '../components/Header'
import SimpleFooter from '../components/SimpleFooter'

export default function SolutionsPage() {
  const language = useAppStore((state) => state.language)
  const t = translations[language]
  const [activeFilter, setActiveFilter] = useState('all')

  // Filter solutions based on active filter
  const filteredSolutions = activeFilter === 'all' 
    ? solutionsData 
    : solutionsData.filter(solution => solution.categoryId === activeFilter)

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
              {t.solutionsPage.back}
            </Link>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-purple-dark">
              {t.solutionsPage.title}
            </h1>
            <p className="text-xl text-purple-brand/80 max-w-2xl">
              {t.solutionsPage.subtitle}
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-wrap gap-3 mb-12"
          >
            {solutionCategoriesData.map((category) => (
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

          {/* Solutions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSolutions.length === 0 ? (
              <div className="col-span-3 text-center py-20">
                <p className="text-xl text-purple-light">
                  {t.solutionsPage.noSolutions}
                </p>
              </div>
            ) : (
              filteredSolutions.map((solution, index) => {
                const translation = getSolutionTranslation(solution, language)
                return (
                  <motion.article
                    key={solution.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  >
                    <Link
                      href={`/solutions/${solution.slug}`}
                      className="group block h-full"
                    >
                      <div className="h-full border border-purple-light/20 rounded-2xl overflow-hidden hover:border-purple-brand/50 transition-colors bg-white shadow-sm hover:shadow-lg hover:shadow-purple-brand/10 flex flex-col">
                        {/* Header with icon */}
                        <div className="p-6 bg-purple-brand/5 border-b border-purple-light/20 flex items-center justify-between">
                          <span className="text-5xl">{solution.icon}</span>
                          <span className="text-xs font-medium text-purple-light uppercase tracking-wider">
                            {getSolutionCategoryTranslation(solution.categoryId, language)}
                          </span>
                        </div>
                        
                        {/* Content */}
                        <div className="p-6 flex-grow flex flex-col">
                          <h2 className="text-2xl font-bold mb-3 text-purple-dark group-hover:text-purple-brand transition-colors">
                            {translation.title}
                          </h2>
                          
                          <p className="text-purple-brand/70 leading-relaxed mb-6 flex-grow">
                            {translation.shortDescription}
                          </p>
                          
                          {/* Features preview */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {translation.features.slice(0, 3).map((feature, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-purple-brand/5 border border-purple-light/20 rounded-full text-xs text-purple-brand/70"
                              >
                                {feature}
                              </span>
                            ))}
                            {translation.features.length > 3 && (
                              <span className="px-3 py-1 text-xs text-purple-light">
                                +{translation.features.length - 3}
                              </span>
                            )}
                          </div>
                          
                          {/* CTA */}
                          <div className="flex items-center gap-2 text-purple-brand font-medium pt-4 border-t border-purple-light/10">
                            <span>{t.solutionsPage.viewSolution}</span>
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
