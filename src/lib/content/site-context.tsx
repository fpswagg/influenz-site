'use client'

import { createContext, useContext } from 'react'
import type { Language } from '@/lib/i18n'
import type {
  ClientData,
  HomeSectionData,
  LabelOption,
  NavSection,
  ProjectData,
  SiteBundle,
  SiteSettings,
  SolutionData,
} from '@/lib/content/types'
import { useAppStore } from '@/lib/store'

const SiteContext = createContext<SiteBundle | null>(null)

export function SiteProvider({
  bundle,
  children,
}: {
  bundle: SiteBundle
  children: React.ReactNode
}) {
  return <SiteContext.Provider value={bundle}>{children}</SiteContext.Provider>
}

export function useSiteBundle() {
  const bundle = useContext(SiteContext)
  if (!bundle) {
    throw new Error('useSiteBundle must be used within SiteProvider')
  }
  return bundle
}

export function useCopy() {
  const bundle = useSiteBundle()
  const language = useAppStore((state) => state.language)
  return bundle.copy[language]
}

export function useSettings(): SiteSettings {
  return useSiteBundle().settings
}

export function useProjects(): ProjectData[] {
  return useSiteBundle().projects
}

export function useSolutions(): SolutionData[] {
  return useSiteBundle().solutions
}

export function useClients(): ClientData[] {
  return useSiteBundle().clients
}

export function useCategories(): LabelOption[] {
  return useSiteBundle().categories
}

export function useSolutionCategories(): LabelOption[] {
  return useSiteBundle().solutionCategories
}

export function useServices(): LabelOption[] {
  return useSiteBundle().services
}

export function useHomeSections(): HomeSectionData[] {
  return useSiteBundle().homeSections
}

export function useHomeSection(key: string) {
  return useHomeSections().find((section) => section.key === key)
}

export function sectionIndexLabel(sortOrder: number) {
  return String(sortOrder).padStart(2, '0')
}

export function useNavSections(): NavSection[] {
  const bundle = useSiteBundle()
  const language = useAppStore((state) => state.language) as Language
  const sections = bundle.homeSections
    .filter((section) => section.enabled && section.showInNav)
    .sort((a, b) => a.sortOrder - b.sortOrder)

  return sections.map((section, index) => ({
    id: section.key,
    label: section.label[language],
    number: String(index + 1).padStart(2, '0'),
  }))
}

export function useExtras() {
  return useSiteBundle().extras
}

export function getLabel(options: LabelOption[], id: string, language: Language) {
  const option = options.find((item) => item.id === id || item.slug === id)
  return option ? option[language] : id
}
