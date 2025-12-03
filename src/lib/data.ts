import { Language } from './i18n'

// ============================================
// TYPES
// ============================================

export interface ProjectData {
  id: string
  slug: string
  categoryId: string // ID de la catégorie (digital, events, press, strategy)
  year: string
  client: string
  serviceIds: string[] // IDs des services
  image: string
  images: string[]
  translations: {
    [key in Language]: {
      title: string
      description: string
      longDescription: string
      challenge: string
      solution: string
      results: string[]
      client: string // Client traduit
    }
  }
}

export interface Client {
  id: string
  name: string
  logo: string // Fallback letters if image is not provided
  image?: string // Optional image path (e.g., '/images/clients/microsoft.png')
}

// ============================================
// PROJECTS DATA
// ============================================

export const projectsData: ProjectData[] = [
  {
    id: '1',
    slug: 'strategie-digitale-premium',
    categoryId: 'digital',
    year: '2024',
    client: 'Marque de luxe internationale',
    serviceIds: ['digital-strategy', 'social-media', 'content-marketing', 'influence'],
    image: '/images/projects/project1.jpg',
    images: ['/images/projects/project1.jpg', '/images/projects/project1-2.jpg', '/images/projects/project1-3.jpg'],
    translations: {
      fr: {
        title: 'Stratégie Digitale Premium',
        description: 'Campagne de communication digitale multi-canal pour une marque de luxe. Augmentation de 320% du taux d\'engagement.',
        longDescription: 'Développement et déploiement d\'une stratégie de communication digitale complète pour une marque de luxe établie cherchant à rajeunir son image et élargir sa présence en ligne.',
        challenge: 'La marque faisait face à une baisse d\'engagement auprès des millennials et de la génération Z, tout en maintenant son image premium et son héritage.',
        solution: 'Création d\'une stratégie multi-canal intégrant les réseaux sociaux, le marketing d\'influence, et des contenus vidéo premium. Développement d\'une nouvelle ligne éditoriale moderne tout en préservant les codes de luxe.',
        results: [
          '+320% d\'engagement sur les réseaux sociaux',
          '+150% de trafic web qualifié',
          '+80% de mentions positives de la marque',
          'Rajeunissement de l\'audience de 12 ans en moyenne'
        ],
        client: 'Marque de luxe internationale',
      },
      en: {
        title: 'Premium Digital Strategy',
        description: 'Multi-channel digital communication campaign for a luxury brand. 320% increase in engagement rate.',
        longDescription: 'Development and deployment of a complete digital communication strategy for an established luxury brand looking to rejuvenate its image and expand its online presence.',
        challenge: 'The brand faced declining engagement among millennials and Gen Z, while maintaining its premium image and heritage.',
        solution: 'Creation of a multi-channel strategy integrating social media, influencer marketing, and premium video content. Development of a modern editorial line while preserving luxury codes.',
        results: [
          '+320% social media engagement',
          '+150% qualified web traffic',
          '+80% positive brand mentions',
          'Audience rejuvenation by 12 years on average'
        ],
        client: 'International luxury brand',
      },
    },
  },
  {
    id: '2',
    slug: 'evenement-corporate-international',
    categoryId: 'events',
    year: '2023',
    client: 'Entreprise technologique Fortune 500',
    serviceIds: ['events', 'press-relations', 'production', 'digital'],
    image: '/images/projects/project2.jpg',
    images: ['/images/projects/project2.jpg', '/images/projects/project2-2.jpg', '/images/projects/project2-3.jpg'],
    translations: {
      fr: {
        title: 'Événement Corporate International',
        description: 'Organisation et coordination d\'un événement corporate de 500 personnes avec couverture médiatique nationale.',
        longDescription: 'Conception et gestion complète d\'un événement corporate international marquant le lancement d\'une nouvelle division d\'entreprise.',
        challenge: 'Coordonner un événement multi-sites avec des intervenants internationaux, tout en assurant une couverture médiatique maximale et une expérience participant exceptionnelle.',
        solution: 'Mise en place d\'une stratégie événementielle intégrée incluant relations presse, gestion logistique, production audiovisuelle et activation digitale en temps réel.',
        results: [
          '500+ participants de 25 pays',
          '50+ publications dans les médias nationaux',
          '98% de satisfaction participants',
          '2M+ d\'impressions sur les réseaux sociaux'
        ],
        client: 'Entreprise technologique Fortune 500',
      },
      en: {
        title: 'International Corporate Event',
        description: 'Organization and coordination of a 500-person corporate event with national media coverage.',
        longDescription: 'Complete design and management of an international corporate event marking the launch of a new business division.',
        challenge: 'Coordinate a multi-site event with international speakers, while ensuring maximum media coverage and exceptional participant experience.',
        solution: 'Implementation of an integrated event strategy including press relations, logistics management, audiovisual production and real-time digital activation.',
        results: [
          '500+ participants from 25 countries',
          '50+ publications in national media',
          '98% participant satisfaction',
          '2M+ social media impressions'
        ],
        client: 'Fortune 500 technology company',
      },
    },
  },
  {
    id: '3',
    slug: 'relations-presse-tech',
    categoryId: 'press',
    year: '2024',
    client: 'Startup IA / Machine Learning',
    serviceIds: ['press-relations', 'storytelling', 'media-training', 'events'],
    image: '/images/projects/project3.jpg',
    images: ['/images/projects/project3.jpg', '/images/projects/project3-2.jpg', '/images/projects/project3-3.jpg'],
    translations: {
      fr: {
        title: 'Relations Presse Tech',
        description: 'Stratégie de relations presse pour le lancement d\'une startup technologique avec 50+ publications majeures.',
        longDescription: 'Campagne de relations presse stratégique pour positionner une startup technologique innovante dans l\'écosystème français et européen.',
        challenge: 'Faire émerger une jeune startup dans un marché saturé et obtenir une couverture médiatique de qualité malgré un budget limité.',
        solution: 'Développement d\'une stratégie de storytelling unique, création de relations avec les journalistes tech clés, et organisation d\'événements presse exclusifs.',
        results: [
          '50+ articles dans des médias majeurs',
          'Couverture dans TechCrunch, Les Échos, Le Monde',
          'Levée de fonds de 5M€ facilitée par la visibilité',
          'Positionnement comme leader sur le marché'
        ],
        client: 'Startup IA / Machine Learning',
      },
      en: {
        title: 'Tech Press Relations',
        description: 'Press relations strategy for launching a tech startup with 50+ major publications.',
        longDescription: 'Strategic press relations campaign to position an innovative tech startup in the French and European ecosystem.',
        challenge: 'Emerge a young startup in a saturated market and obtain quality media coverage despite a limited budget.',
        solution: 'Development of a unique storytelling strategy, building relationships with key tech journalists, and organizing exclusive press events.',
        results: [
          '50+ articles in major media',
          'Coverage in TechCrunch, Les Échos, Le Monde',
          '€5M fundraising facilitated by visibility',
          'Positioning as market leader'
        ],
        client: 'AI / Machine Learning Startup',
      },
    },
  },
  {
    id: '4',
    slug: 'transformation-strategique',
    categoryId: 'strategy',
    year: '2023-2024',
    client: 'Entreprise industrielle',
    serviceIds: ['strategic-consulting', 'branding', 'training', 'change-management'],
    image: '/images/projects/project4.jpg',
    images: ['/images/projects/project4.jpg', '/images/projects/project4-2.jpg', '/images/projects/project4-3.jpg'],
    translations: {
      fr: {
        title: 'Transformation Stratégique',
        description: 'Accompagnement stratégique d\'une entreprise en transformation digitale sur 18 mois.',
        longDescription: 'Accompagnement complet d\'une entreprise traditionnelle dans sa transformation digitale et repositionnement de marque.',
        challenge: 'Moderniser une entreprise centenaire sans perdre son identité, tout en adoptant les nouvelles technologies et pratiques du marché.',
        solution: 'Programme d\'accompagnement sur 18 mois incluant audit stratégique, refonte de l\'identité de marque, formation des équipes, et mise en place de nouveaux processus digitaux.',
        results: [
          'Refonte complète de l\'identité de marque',
          '+200% d\'efficacité opérationnelle',
          'Formation de 150+ collaborateurs',
          'Nouveau positionnement premium adopté avec succès'
        ],
        client: 'Entreprise industrielle',
      },
      en: {
        title: 'Strategic Transformation',
        description: 'Strategic support for a company in digital transformation over 18 months.',
        longDescription: 'Complete support of a traditional company in its digital transformation and brand repositioning.',
        challenge: 'Modernize a century-old company without losing its identity, while adopting new technologies and market practices.',
        solution: '18-month support program including strategic audit, brand identity redesign, team training, and implementation of new digital processes.',
        results: [
          'Complete brand identity redesign',
          '+200% operational efficiency',
          'Training of 150+ employees',
          'New premium positioning successfully adopted'
        ],
        client: 'Industrial company',
      },
    },
  },
]

// ============================================
// CLIENTS DATA
// ============================================

export const clientsData: Client[] = [
  { id: '1', name: 'Cameroon Civil Aviation Authority', logo: 'CAA', image: '/images/clients/cmr-civil-aviation-authority.png' },
  { id: '2', name: 'FIFPRO', logo: 'FF', image: '/images/clients/fifpro.png' },
  { id: '3', name: 'Ippon', logo: 'IP', image: '/images/clients/ippon.png' },
  { id: '4', name: 'Nexar', logo: 'NX', image: '/images/clients/nexar.png' },
  { id: '5', name: 'Press Club', logo: 'PC', image: '/images/clients/press-club.png' },
  { id: '6', name: 'SYNAFOC', logo: 'SY', image: '/images/clients/synafoc.png' },
  { id: '7', name: 'UPF', logo: 'UP', image: '/images/clients/upf.png' },
  { id: '8', name: 'BEAC', logo: 'BE', image: '/images/clients/beac.png' },
]

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getProjectBySlug(slug: string): ProjectData | undefined {
  return projectsData.find(project => project.slug === slug)
}

export function getAllProjectSlugs(): string[] {
  return projectsData.map(project => project.slug)
}

export function getProjectTranslation(project: ProjectData, language: Language) {
  return project.translations[language]
}

// ============================================
// CATEGORIES DATA
// ============================================

export const categoriesData = [
  { id: 'all', fr: 'Tous', en: 'All' },
  { id: 'digital', fr: 'Communication Digitale', en: 'Digital Communication' },
  { id: 'events', fr: 'Événementiel', en: 'Events' },
  { id: 'press', fr: 'Relations Presse', en: 'Press Relations' },
  { id: 'strategy', fr: 'Conseil & Stratégie', en: 'Consulting & Strategy' },
]

export const servicesData = [
  { id: 'digital-strategy', fr: 'Stratégie digitale', en: 'Digital Strategy' },
  { id: 'social-media', fr: 'Social Media', en: 'Social Media' },
  { id: 'content-marketing', fr: 'Content Marketing', en: 'Content Marketing' },
  { id: 'influence', fr: 'Influence', en: 'Influence' },
  { id: 'events', fr: 'Événementiel', en: 'Events' },
  { id: 'press-relations', fr: 'Relations Presse', en: 'Press Relations' },
  { id: 'production', fr: 'Production', en: 'Production' },
  { id: 'digital', fr: 'Digital', en: 'Digital' },
  { id: 'storytelling', fr: 'Storytelling', en: 'Storytelling' },
  { id: 'media-training', fr: 'Media Training', en: 'Media Training' },
  { id: 'strategic-consulting', fr: 'Conseil Stratégique', en: 'Strategic Consulting' },
  { id: 'branding', fr: 'Branding', en: 'Branding' },
  { id: 'training', fr: 'Formation', en: 'Training' },
  { id: 'change-management', fr: 'Change Management', en: 'Change Management' },
]

export function getCategoryTranslation(categoryId: string, language: Language): string {
  const category = categoriesData.find(c => c.id === categoryId)
  return category ? category[language] : categoryId
}

export function getServiceTranslation(serviceId: string, language: Language): string {
  const service = servicesData.find(s => s.id === serviceId)
  return service ? service[language] : serviceId
}

export function getProjectCategory(project: ProjectData): string {
  return project.categoryId || 'all'
}

export function getProjectServices(project: ProjectData, language: Language): string[] {
  return project.serviceIds.map(id => getServiceTranslation(id, language))
}

