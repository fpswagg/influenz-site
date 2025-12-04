'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { getNavSections } from '@/lib/config/sections'

interface SideNavProps {
  isVisible: boolean
}

export default function SideNav({ isVisible }: SideNavProps) {
  const language = useAppStore((state) => state.language)
  const sections = getNavSections(language)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    // Fonction pour calculer quelle section est la plus visible
    const calculateActiveSection = () => {
      const viewportHeight = window.innerHeight
      const viewportCenter = viewportHeight / 2
      
      let bestSection = sections[0]?.id || 'hero'
      let bestScore = -Infinity
      
      sections.forEach((section) => {
        const element = document.getElementById(section.id)
        if (!element) return
        
        const rect = element.getBoundingClientRect()
        
        // Calculer combien de la section est visible dans le viewport
        const visibleTop = Math.max(0, rect.top)
        const visibleBottom = Math.min(viewportHeight, rect.bottom)
        const visibleHeight = Math.max(0, visibleBottom - visibleTop)
        
        // Calculer la distance du centre de la section visible au centre du viewport
        const visibleCenter = visibleTop + visibleHeight / 2
        const distanceFromCenter = Math.abs(visibleCenter - viewportCenter)
        
        // Score basé sur la visibilité et la proximité au centre
        // Plus la section est visible et proche du centre, plus le score est élevé
        const visibilityScore = visibleHeight / viewportHeight
        const centerScore = 1 - (distanceFromCenter / viewportHeight)
        
        // Combiner les scores (visibilité compte plus)
        const totalScore = visibilityScore * 0.6 + centerScore * 0.4
        
        // Bonus si la section couvre le centre du viewport
        const coversCenter = rect.top <= viewportCenter && rect.bottom >= viewportCenter
        const finalScore = coversCenter ? totalScore + 1 : totalScore
        
        if (finalScore > bestScore && visibleHeight > 0) {
          bestScore = finalScore
          bestSection = section.id
        }
      })
      
      setActiveSection(bestSection)
    }

    // Observer pour détecter les changements et recalculer
    const observer = new IntersectionObserver(
      () => {
        calculateActiveSection()
      },
      { 
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: '0px'
      }
    )

    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    })

    // Aussi écouter le scroll pour une mise à jour plus fluide
    const handleScroll = () => {
      requestAnimationFrame(calculateActiveSection)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Calcul initial
    calculateActiveSection()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [sections])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      })
    }
  }

  return (
    <>
      {/* Desktop Side Navigation - Design épuré avec background */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ 
          opacity: isVisible ? 1 : 0, 
          x: isVisible ? 0 : -20,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
        style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
      >
        <nav className="flex flex-col gap-2 bg-white/95 backdrop-blur-sm border border-purple-light/20 rounded-2xl p-3 shadow-lg">
          {sections.map((section) => {
            const isActive = activeSection === section.id
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-purple-brand/10 border border-purple-brand/30' 
                    : 'border border-transparent hover:bg-purple-brand/5'
                }`}
              >
                {/* Number */}
                <span className={`text-xs font-bold w-8 text-left transition-colors duration-200 ${
                  isActive 
                    ? 'text-purple-brand' 
                    : 'text-purple-light group-hover:text-purple-brand'
                }`}>
                  {section.number}
                </span>
                
                {/* Separator bar */}
                <div className={`w-px h-8 transition-all duration-200 ${
                  isActive 
                    ? 'bg-purple-brand shadow-sm shadow-purple-brand/50' 
                    : 'bg-purple-light/30 group-hover:bg-purple-light'
                }`} />
                
                {/* Label */}
                <span className={`text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-purple-brand'
                    : 'text-purple-light group-hover:text-purple-brand'
                }`}>
                  {section.label}
                </span>
              </button>
            )
          })}
        </nav>
      </motion.div>

      {/* Mobile Bottom Nav - toujours visible, design simplifié */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-purple-light/20 shadow-lg">
        <div className="flex">
          {sections.map((section) => {
            const isActive = activeSection === section.id
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`flex-1 flex flex-col items-center gap-2 py-3 transition-all active:scale-95 ${
                  isActive ? 'bg-purple-brand/5' : ''
                }`}
              >
                {/* Number */}
                <span className={`text-xs font-bold transition-colors duration-200 ${
                  isActive 
                    ? 'text-purple-brand' 
                    : 'text-purple-light'
                }`}>
                  {section.number}
                </span>
                
                {/* Label */}
                <span className={`text-xs font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-purple-brand'
                    : 'text-purple-light'
                }`}>
                  {section.label}
                </span>
                
                {/* Active indicator en bas */}
                <div className={`w-8 h-0.5 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-purple-brand shadow-sm shadow-purple-brand/50' 
                    : 'bg-transparent'
                }`} />
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}

