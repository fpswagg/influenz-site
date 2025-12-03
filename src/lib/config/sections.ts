// Configuration centralisée pour les sections du homepage
// Permet d'ajouter/modifier facilement des sections

export interface SectionConfig {
  id: string
  component: string
  enabled: boolean
  order: number
  props?: Record<string, any>
}

export const homeSections: SectionConfig[] = [
  {
    id: 'hero',
    component: 'Hero',
    enabled: true,
    order: 1,
  },
  {
    id: 'trusted-by',
    component: 'TrustedBy',
    enabled: false, // Caché de la navigation
    order: 2,
  },
  {
    id: 'projects',
    component: 'Projets',
    enabled: true,
    order: 3,
  },
  {
    id: 'about',
    component: 'About',
    enabled: true,
    order: 4,
  },
  {
    id: 'contact',
    component: 'ContactForm',
    enabled: true,
    order: 5,
  },
]

// Helper pour obtenir les sections actives triées
export function getActiveSections(): SectionConfig[] {
  return homeSections
    .filter(section => section.enabled)
    .sort((a, b) => a.order - b.order)
}

// Helper pour obtenir la navigation des sections
export interface NavSection {
  id: string
  label: string
  number: string
}

export function getNavSections(language: 'fr' | 'en' = 'fr'): NavSection[] {
  const labels: Record<string, Record<string, string>> = {
    hero: { fr: 'Accueil', en: 'Home' },
    projects: { fr: 'Projets', en: 'Projects' },
    about: { fr: 'À propos', en: 'About' },
    contact: { fr: 'Contact', en: 'Contact' },
  }

  // Ne retourne que les sections actives pour la navigation
  const activeSections = getActiveSections()
  
  return activeSections.map((section, index) => ({
    id: section.id,
    label: labels[section.id]?.[language] || section.id,
    number: String(index + 1).padStart(2, '0'),
  }))
}

