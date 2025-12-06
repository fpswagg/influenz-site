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

export interface SolutionData {
  id: string
  slug: string
  categoryId: string // Category ID (web, digital, press, strategy, events)
  icon: string // Emoji or icon name
  featured: boolean // Show on homepage
  translations: {
    [key in Language]: {
      title: string
      shortDescription: string
      description: string
      features: string[]
      benefits: string[]
      callToAction: string
    }
  }
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
// SOLUTIONS DATA
// ============================================

export const solutionCategoriesData = [
  { id: 'all', fr: 'Toutes', en: 'All' },
  { id: 'web', fr: 'Web & Digital', en: 'Web & Digital' },
  { id: 'communication', fr: 'Communication', en: 'Communication' },
  { id: 'strategy', fr: 'Stratégie', en: 'Strategy' },
  { id: 'events', fr: 'Événementiel', en: 'Events' },
]

export const solutionsData: SolutionData[] = [
  {
    id: '1',
    slug: 'site-web',
    categoryId: 'web',
    icon: '🌐',
    featured: true,
    translations: {
      fr: {
        title: 'Site Web',
        shortDescription: 'Création de sites web modernes et performants pour renforcer votre présence digitale.',
        description: 'Nous concevons des sites web sur mesure, alliant design moderne, performance technique et expérience utilisateur optimale. Du site vitrine au e-commerce, nous vous accompagnons dans tous vos projets web.',
        features: [
          'Design sur mesure et responsive',
          'Optimisation SEO intégrée',
          'Performance et rapidité',
          'Interface d\'administration intuitive',
          'Hébergement et maintenance',
          'Intégration réseaux sociaux',
        ],
        benefits: [
          'Visibilité accrue sur internet',
          'Image professionnelle renforcée',
          'Génération de leads qualifiés',
          'Disponibilité 24h/24',
        ],
        callToAction: 'Créer mon site web',
      },
      en: {
        title: 'Website',
        shortDescription: 'Creation of modern and high-performance websites to strengthen your digital presence.',
        description: 'We design custom websites combining modern design, technical performance and optimal user experience. From showcase sites to e-commerce, we support you in all your web projects.',
        features: [
          'Custom and responsive design',
          'Integrated SEO optimization',
          'Performance and speed',
          'Intuitive admin interface',
          'Hosting and maintenance',
          'Social media integration',
        ],
        benefits: [
          'Increased visibility on the internet',
          'Enhanced professional image',
          'Qualified lead generation',
          '24/7 availability',
        ],
        callToAction: 'Create my website',
      },
    },
  },
  {
    id: '2',
    slug: 'communication-digitale',
    categoryId: 'communication',
    icon: '📱',
    featured: true,
    translations: {
      fr: {
        title: 'Communication Digitale',
        shortDescription: 'Stratégie digitale complète pour maximiser votre impact sur les réseaux sociaux.',
        description: 'Développez votre présence en ligne avec une stratégie digitale cohérente et efficace. De la gestion des réseaux sociaux à la création de contenu, nous vous aidons à atteindre vos objectifs.',
        features: [
          'Gestion des réseaux sociaux',
          'Création de contenu engageant',
          'Community management',
          'Campagnes publicitaires ciblées',
          'Analyse et reporting',
          'Veille et e-réputation',
        ],
        benefits: [
          'Engagement accru de votre communauté',
          'Notoriété de marque renforcée',
          'Trafic qualifié vers votre site',
          'ROI mesurable',
        ],
        callToAction: 'Booster ma présence digitale',
      },
      en: {
        title: 'Digital Communication',
        shortDescription: 'Complete digital strategy to maximize your impact on social media.',
        description: 'Develop your online presence with a coherent and effective digital strategy. From social media management to content creation, we help you achieve your goals.',
        features: [
          'Social media management',
          'Engaging content creation',
          'Community management',
          'Targeted advertising campaigns',
          'Analysis and reporting',
          'Monitoring and e-reputation',
        ],
        benefits: [
          'Increased community engagement',
          'Enhanced brand awareness',
          'Qualified traffic to your site',
          'Measurable ROI',
        ],
        callToAction: 'Boost my digital presence',
      },
    },
  },
  {
    id: '3',
    slug: 'relations-presse',
    categoryId: 'communication',
    icon: '📰',
    featured: true,
    translations: {
      fr: {
        title: 'Relations Presse',
        shortDescription: 'Gestion stratégique de vos relations avec les médias pour une couverture optimale.',
        description: 'Bénéficiez d\'une visibilité médiatique maximale grâce à notre expertise en relations presse. Nous développons et entretenons vos relations avec les journalistes et influenceurs clés.',
        features: [
          'Stratégie médias personnalisée',
          'Rédaction de communiqués de presse',
          'Organisation de conférences de presse',
          'Media training',
          'Revue de presse quotidienne',
          'Gestion de crise médiatique',
        ],
        benefits: [
          'Couverture médiatique étendue',
          'Crédibilité renforcée',
          'Messages clés diffusés efficacement',
          'Relations durables avec les médias',
        ],
        callToAction: 'Développer ma visibilité médiatique',
      },
      en: {
        title: 'Press Relations',
        shortDescription: 'Strategic management of your media relations for optimal coverage.',
        description: 'Benefit from maximum media visibility thanks to our expertise in press relations. We develop and maintain your relationships with key journalists and influencers.',
        features: [
          'Personalized media strategy',
          'Press release writing',
          'Press conference organization',
          'Media training',
          'Daily press review',
          'Media crisis management',
        ],
        benefits: [
          'Extended media coverage',
          'Enhanced credibility',
          'Key messages effectively disseminated',
          'Lasting relationships with media',
        ],
        callToAction: 'Develop my media visibility',
      },
    },
  },
  {
    id: '4',
    slug: 'conseil-strategie',
    categoryId: 'strategy',
    icon: '🎯',
    featured: true,
    translations: {
      fr: {
        title: 'Conseil & Stratégie',
        shortDescription: 'Accompagnement stratégique pour définir et atteindre vos objectifs de communication.',
        description: 'Nos experts vous accompagnent dans l\'élaboration et la mise en œuvre de votre stratégie de communication. Audit, recommandations et accompagnement personnalisé pour maximiser votre impact.',
        features: [
          'Audit de communication',
          'Définition de la stratégie',
          'Plan de communication',
          'Positionnement de marque',
          'Accompagnement au changement',
          'Formation des équipes',
        ],
        benefits: [
          'Vision claire de vos objectifs',
          'Stratégie adaptée à vos enjeux',
          'Optimisation des ressources',
          'Résultats mesurables',
        ],
        callToAction: 'Définir ma stratégie',
      },
      en: {
        title: 'Consulting & Strategy',
        shortDescription: 'Strategic support to define and achieve your communication goals.',
        description: 'Our experts support you in developing and implementing your communication strategy. Audit, recommendations and personalized support to maximize your impact.',
        features: [
          'Communication audit',
          'Strategy definition',
          'Communication plan',
          'Brand positioning',
          'Change management support',
          'Team training',
        ],
        benefits: [
          'Clear vision of your objectives',
          'Strategy adapted to your challenges',
          'Resource optimization',
          'Measurable results',
        ],
        callToAction: 'Define my strategy',
      },
    },
  },
  {
    id: '5',
    slug: 'evenementiel',
    categoryId: 'events',
    icon: '🎪',
    featured: true,
    translations: {
      fr: {
        title: 'Événementiel',
        shortDescription: 'Organisation d\'événements corporate mémorables et impactants.',
        description: 'De la conception à la réalisation, nous créons des événements sur mesure qui marquent les esprits. Conférences, séminaires, lancements de produits ou soirées de gala, nous gérons tous les aspects de votre événement.',
        features: [
          'Conception créative',
          'Gestion logistique complète',
          'Production audiovisuelle',
          'Coordination des prestataires',
          'Communication événementielle',
          'Bilan et analyse post-événement',
        ],
        benefits: [
          'Événements clé en main',
          'Expériences mémorables',
          'Image de marque renforcée',
          'Objectifs atteints',
        ],
        callToAction: 'Organiser mon événement',
      },
      en: {
        title: 'Events',
        shortDescription: 'Organization of memorable and impactful corporate events.',
        description: 'From design to execution, we create custom events that leave a lasting impression. Conferences, seminars, product launches or gala evenings, we manage all aspects of your event.',
        features: [
          'Creative design',
          'Complete logistics management',
          'Audiovisual production',
          'Vendor coordination',
          'Event communication',
          'Post-event analysis and reporting',
        ],
        benefits: [
          'Turnkey events',
          'Memorable experiences',
          'Enhanced brand image',
          'Objectives achieved',
        ],
        callToAction: 'Organize my event',
      },
    },
  },
  {
    id: '6',
    slug: 'branding-identite',
    categoryId: 'strategy',
    icon: '✨',
    featured: false,
    translations: {
      fr: {
        title: 'Branding & Identité',
        shortDescription: 'Création et refonte d\'identité visuelle pour une image de marque forte.',
        description: 'Construisez une identité de marque distinctive et mémorable. Du logo à la charte graphique complète, nous créons l\'univers visuel qui vous ressemble et vous différencie.',
        features: [
          'Création de logo',
          'Charte graphique complète',
          'Supports de communication',
          'Guidelines de marque',
          'Déclinaison multi-supports',
          'Refonte d\'identité',
        ],
        benefits: [
          'Image cohérente et professionnelle',
          'Différenciation concurrentielle',
          'Reconnaissance de marque',
          'Confiance renforcée',
        ],
        callToAction: 'Créer mon identité',
      },
      en: {
        title: 'Branding & Identity',
        shortDescription: 'Creation and redesign of visual identity for a strong brand image.',
        description: 'Build a distinctive and memorable brand identity. From logo to complete graphic charter, we create the visual universe that reflects you and sets you apart.',
        features: [
          'Logo creation',
          'Complete graphic charter',
          'Communication materials',
          'Brand guidelines',
          'Multi-support adaptation',
          'Identity redesign',
        ],
        benefits: [
          'Coherent and professional image',
          'Competitive differentiation',
          'Brand recognition',
          'Enhanced trust',
        ],
        callToAction: 'Create my identity',
      },
    },
  },
]

// ============================================
// CLIENTS DATA
// ============================================

export const clientsData: Client[] = [
  { id: '1', name: 'CCAA', logo: 'CC', image: '/images/clients/ccaa.png' },
  { id: '2', name: 'FIFPRO', logo: 'FF', image: '/images/clients/fifpro.png' },
  { id: '3', name: 'Ippon', logo: 'IP', image: '/images/clients/ippon.png' },
  { id: '4', name: 'Nexar', logo: 'NX', image: '/images/clients/nexar.png' },
  { id: '5', name: 'Press Club', logo: 'PC', image: '/images/clients/press-club.png' },
  { id: '6', name: 'SYNAFOC', logo: 'SY', image: '/images/clients/synafoc.png' },
  { id: '7', name: 'UPF', logo: 'UP', image: '/images/clients/upf.png' },
  { id: '8', name: 'BEAC', logo: 'BE', image: '/images/clients/beac.png' },
  { id: '9', name: 'EcoMatin', logo: 'EM', image: '/images/clients/ecomatin.png' },
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

// ============================================
// SOLUTIONS HELPER FUNCTIONS
// ============================================

export function getSolutionBySlug(slug: string): SolutionData | undefined {
  return solutionsData.find(solution => solution.slug === slug)
}

export function getAllSolutionSlugs(): string[] {
  return solutionsData.map(solution => solution.slug)
}

export function getSolutionTranslation(solution: SolutionData, language: Language) {
  return solution.translations[language]
}

export function getFeaturedSolutions(): SolutionData[] {
  return solutionsData.filter(solution => solution.featured)
}

export function getSolutionCategoryTranslation(categoryId: string, language: Language): string {
  const category = solutionCategoriesData.find(c => c.id === categoryId)
  return category ? category[language] : categoryId
}

