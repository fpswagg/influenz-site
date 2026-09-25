export type Language = 'fr' | 'en'

export interface Translations {
  nav: {
    home: string
    about: string
    projects: string
    solutions: string
    contact: string
  }
  hero: {
    label: string
    title: string
    subtitle: string
    cta: string
    ctaSecondary: string
  }
  trustedBy: {
    title: string
    subtitle: string
  }
  projects: {
    title: string
    subtitle: string
    cta: string
  }
  about: {
    title: string
    subtitle: string
    whoWeAre: {
      title: string
      text1: string
      text2: string
    }
    ourPurpose: {
      title: string
      text1: string
      text2: string
    }
    ourMission: {
      title: string
      text: string
      points: string[]
    }
    services: {
      title: string
      items: Array<{ title: string; description: string }>
    }
    location: {
      title: string
      city: string
      country: string
    }
  }
  footer: {
    tagline: string
    contact: string
    follow: string
    rights: string
    address: string
    phone: string
    legalInfo: string
  }
  contact: {
    title: string
    name: string
    enterprise: string
    enterpriseOptional: string
    email: string
    message: string
    send: string
    sending: string
    success: string
    error: string
    placeholders: {
      name: string
      enterprise: string
      email: string
      message: string
    }
  }
  project: {
    back: string
    backSimple: string
    client: string
    year: string
    category: string
    challenge: string
    solution: string
    services: string
    results: string
    similar: string
    contactUs: string
    notFound: string
    backToProjects: string
  }
  projectsPage: {
    title: string
    subtitle: string
    back: string
    noProjects: string
    viewProject: string
  }
  solutions: {
    title: string
    subtitle: string
    cta: string
    viewAll: string
  }
  solutionsPage: {
    title: string
    subtitle: string
    back: string
    noSolutions: string
    viewSolution: string
  }
  solution: {
    back: string
    backSimple: string
    problem: string
    approach: string
    steps: string
    results: string
    contactUs: string
    interested: string
    notFound: string
    backToSolutions: string
  }
}
