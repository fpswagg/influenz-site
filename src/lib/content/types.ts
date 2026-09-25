export type Language = 'fr' | 'en'

export interface ProjectLink {
  url: string
  labels: {
    fr: string
    en: string
  }
}

export interface ProjectData {
  id: string
  slug: string
  categoryId: string
  year: string
  client: string
  serviceIds: string[]
  media?: string[]
  link?: ProjectLink
  featured: boolean
  published: boolean
  translations: {
    [key in Language]: {
      title: string
      description: string
      longDescription: string
      challenge: string
      solution: string
      results: string[]
      client: string
    }
  }
}

export interface ClientData {
  id: string
  name: string
  logo: string
  image?: string
  description: {
    fr: string
    en: string
  }
}

export interface SolutionLink {
  url: string
  labels: {
    [key in Language]: string
  }
}

export interface SolutionData {
  id: string
  slug: string
  categoryId: string
  icon: string
  featured: boolean
  published: boolean
  image?: string
  images?: string[]
  links?: SolutionLink[]
  translations: {
    [key in Language]: {
      title: string
      problem: string
      approach: string
      steps: string[]
      results: string[]
      callToAction: string
    }
  }
}

export interface LabelOption {
  id: string
  slug: string
  fr: string
  en: string
  isAll?: boolean
}

export interface SiteSettings {
  siteName: string
  logoUrl: string
  textLogoUrl: string
  faviconUrl: string
  heroBannerUrl: string
  seoTitle: { fr: string; en: string }
  seoDescription: { fr: string; en: string }
  email: string
  phone: string
  phoneSecondary: string
  address: string
  postalBox: string
  legalForm: string
  niu: string
  rccm: string
  linkedinUrl: string
  twitterUrl: string
  instagramUrl: string
  mapsEmbedUrl: string
  contactIntro: { fr: string; en: string }
  locationBlurb: { fr: string; en: string }
}

export interface HomeSectionData {
  id: string
  key: string
  component: string
  enabled: boolean
  showInNav: boolean
  sortOrder: number
  label: { fr: string; en: string }
  eyebrow: { fr: string; en: string }
}

export interface NavSection {
  id: string
  label: string
  number: string
}

export interface AboutServiceData {
  id: string
  title: { fr: string; en: string }
  description: { fr: string; en: string }
}

export interface SiteBundle {
  settings: SiteSettings
  copy: Record<Language, import('@/lib/i18n').Translations>
  extras: {
    learnMore: { fr: string; en: string }
    viewAllProjects: { fr: string; en: string }
    trustedByHoverHint: { fr: string; en: string }
    trustedByPreview: { fr: string; en: string }
    trustedByPinned: { fr: string; en: string }
    trustedByAction: { fr: string; en: string }
    trustedByClose: { fr: string; en: string }
  }
  homeSections: HomeSectionData[]
  projects: ProjectData[]
  solutions: SolutionData[]
  clients: ClientData[]
  categories: LabelOption[]
  solutionCategories: LabelOption[]
  services: LabelOption[]
  aboutServices: AboutServiceData[]
}
