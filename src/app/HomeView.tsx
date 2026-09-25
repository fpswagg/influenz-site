'use client'

import Header from './components/Header'
import SimpleFooter from './components/SimpleFooter'
import Hero from './sections/Hero'
import TrustedBy from './sections/TrustedBy'
import Projets from './sections/Projets'
import Solutions from './sections/Solutions'
import About from './sections/About'
import ContactForm from './components/ContactForm'
import { useAppStore } from '@/lib/store'
import { sectionIndexLabel, useCopy, useHomeSections, useSettings } from '@/lib/content/site-context'

const SECTION_MAP = {
  hero: Hero,
  'trusted-by': TrustedBy,
  projects: Projets,
  solutions: Solutions,
  about: About,
}

export default function HomeView() {
  const language = useAppStore((state) => state.language)
  const t = useCopy()
  const settings = useSettings()
  const sections = useHomeSections().filter((section) => section.enabled)

  return (
    <main className="min-h-screen">
      <Header />
      {sections.map((section) => {
        if (section.key === 'contact') {
          return (
            <section key={section.key} id="contact" className="min-h-screen py-32 px-6 lg:px-24 bg-white">
              <div className="max-w-content mx-auto">
                <div className="mb-20">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-sm font-medium text-purple-light uppercase tracking-wider">
                      {sectionIndexLabel(section.sortOrder)}
                    </span>
                    <div className="w-12 h-px bg-purple-brand" />
                    <span className="text-sm font-medium text-purple-brand uppercase tracking-wider">
                      {section.eyebrow[language] || t.contact.title}
                    </span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-purple-dark">
                    {t.contact.title}
                  </h2>
                  <p className="text-xl text-purple-brand/80 max-w-2xl">
                    {settings.contactIntro[language]}
                  </p>
                </div>
                <div className="max-w-2xl bg-purple-brand/5 p-8 lg:p-12 rounded-2xl border border-purple-light/20">
                  <ContactForm />
                </div>
              </div>
            </section>
          )
        }

        const Component = SECTION_MAP[section.key as keyof typeof SECTION_MAP]
        return Component ? <Component key={section.key} /> : null
      })}
      <SimpleFooter />
    </main>
  )
}
