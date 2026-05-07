import { Language } from './i18n'

// ============================================
// TYPES
// ============================================

export interface ProjectLink {
  label: string
  url: string
}

export interface ProjectData {
  id: string
  slug: string
  categoryId: string // ID de la catégorie (digital, events, press, strategy)
  year: string
  client: string
  serviceIds: string[] // IDs des services
  media?: string[] // Optional media array (images and videos)
  link?: ProjectLink // Optional external link (e.g., to the live project)
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
  categoryId: string // Category ID (communication, strategy, digital, events)
  icon: string // Emoji or icon name
  featured: boolean // Show on homepage
  image?: string // Optional main image
  images?: string[] // Optional gallery images
  links?: SolutionLink[] // Optional external links (case studies, articles, etc.)
  translations: {
    [key in Language]: {
      title: string
      problem: string // La problématique
      approach: string // Notre approche
      steps: string[] // Les étapes clés
      results: string[] // Les résultats obtenus
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
    media: ['/images/projects/project1.jpg', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '/images/projects/project1-3.jpg'],
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
    media: ['/images/projects/project2.jpg', '/images/projects/project2-2.jpg', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'],
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
    media: ['/images/projects/project3.jpg', '/images/projects/project3-2.jpg', '/images/projects/project3-3.jpg'],
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
    media: ['/images/projects/project4.jpg', '/images/projects/project4-2.jpg', '/images/projects/project4-3.jpg'],
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
  { id: 'visibility', fr: 'Visibilité', en: 'Visibility' },
  { id: 'crisis', fr: 'Gestion de crise', en: 'Crisis Management' },
  { id: 'digital', fr: 'Digital', en: 'Digital' },
  { id: 'events', fr: 'Événements', en: 'Events' },
]

export const solutionsData: SolutionData[] = [
  
  {
    id: '1',
    slug: 'nson-ayan',
    categoryId: 'digital',
    icon: '🌍',
    featured: true,
    image: '/images/solutions/nson-ayan/01.png',
    images: [
      '/images/solutions/nson-ayan/01.png',
      '/images/solutions/nson-ayan/02.png',
    ],
    links: [
      { url: 'https://nson-ayan.vercel.app', labels: { fr: 'Voir le site', en: 'View website' } },
    ],
    translations: {
      fr: {
        title: 'Nsôn Ayañ - Plateforme communautaire',
        problem: 'Les membres de la tribu Mvae dispersés à travers le monde avaient besoin d\'un espace numérique pour se connecter, préserver leur histoire et partager des projets avec leur communauté.',
        approach: 'Nous avons conçu et développé une plateforme web complète permettant aux Mvae du monde entier de se retrouver, découvrir leurs membres et figures emblématiques, explorer leur histoire commune et collaborer sur des projets communautaires.',
        steps: [
          'Analyse des besoins de la communauté Mvae',
          'Conception UX/UI adaptée aux valeurs culturelles',
          'Développement d\'un annuaire des membres par pays et ville',
          'Création d\'une section historique et culturelle',
          'Mise en place d\'un espace de partage de projets',
          'Système multilingue (français/anglais)',
        ],
        results: [
          'Communauté Mvae connectée à l\'international',
          'Préservation de l\'histoire et de la culture',
          'Plateforme de collaboration pour les projets',
          'Renforcement des liens intergénérationnels',
        ],
        callToAction: 'Créons votre plateforme communautaire',
      },
      en: {
        title: 'Nsôn Ayañ - Community Platform',
        problem: 'Members of the Mvae tribe scattered around the world needed a digital space to connect, preserve their history and share projects with their community.',
        approach: 'We designed and developed a comprehensive web platform allowing Mvae people worldwide to reconnect, discover their members and iconic figures, explore their shared history and collaborate on community projects.',
        steps: [
          'Analysis of Mvae community needs',
          'UX/UI design adapted to cultural values',
          'Development of member directory by country and city',
          'Creation of historical and cultural section',
          'Implementation of project sharing space',
          'Multilingual system (French/English)',
        ],
        results: [
          'Mvae community connected internationally',
          'Preservation of history and culture',
          'Collaboration platform for projects',
          'Strengthened intergenerational bonds',
        ],
        callToAction: 'Let\'s create your community platform',
      },
    },
  },
  {
    id: '2',
    slug: 'gestion-crise',
    categoryId: 'crisis',
    icon: '🛡️',
    featured: true,
    translations: {
      fr: {
        title: 'Gérer une crise de communication',
        problem: 'Votre organisation fait face à une situation de crise qui menace sa réputation. Chaque minute compte pour reprendre le contrôle du narratif.',
        approach: 'Notre cellule de crise intervient rapidement pour évaluer la situation, définir une stratégie de réponse et protéger votre image tout en transformant la crise en opportunité.',
        steps: [
          'Évaluation immédiate de la situation et des risques',
          'Mise en place d\'une cellule de crise dédiée',
          'Élaboration des éléments de langage',
          'Communication proactive avec les médias',
          'Monitoring en temps réel des retombées',
          'Plan de sortie de crise et reconstruction d\'image',
        ],
        results: [
          'Maîtrise du narratif médiatique',
          'Limitation des dommages réputationnels',
          'Confiance restaurée des parties prenantes',
          'Transformation de la crise en opportunité',
        ],
        callToAction: 'Nous sommes disponibles 24/7',
      },
      en: {
        title: 'Manage a communication crisis',
        problem: 'Your organization is facing a crisis situation that threatens its reputation. Every minute counts to regain control of the narrative.',
        approach: 'Our crisis team intervenes quickly to assess the situation, define a response strategy and protect your image while turning the crisis into an opportunity.',
        steps: [
          'Immediate assessment of situation and risks',
          'Setting up a dedicated crisis cell',
          'Development of key messaging',
          'Proactive communication with media',
          'Real-time monitoring of coverage',
          'Crisis exit plan and image rebuilding',
        ],
        results: [
          'Control of media narrative',
          'Limited reputational damage',
          'Restored stakeholder confidence',
          'Crisis transformed into opportunity',
        ],
        callToAction: 'We are available 24/7',
      },
    },
  },
  {
    id: '3',
    slug: 'visibilite-mediatique',
    categoryId: 'visibility',
    icon: '📰',
    featured: true,
    translations: {
      fr: {
        title: 'Augmenter sa visibilité médiatique',
        problem: 'Votre organisation manque de visibilité dans les médias et vous peinez à faire entendre votre voix dans un environnement saturé d\'informations.',
        approach: 'Nous construisons une stratégie de relations presse sur mesure pour positionner votre organisation comme une référence dans son secteur et générer une couverture médiatique régulière.',
        steps: [
          'Audit de votre présence médiatique actuelle',
          'Identification des journalistes et médias cibles',
          'Création d\'angles et de contenus exclusifs',
          'Organisation de rencontres presse régulières',
          'Positionnement de vos experts comme sources',
          'Mesure et optimisation continue',
        ],
        results: [
          'Présence régulière dans les médias',
          'Reconnaissance comme expert du secteur',
          'Crédibilité renforcée auprès des cibles',
          'Meilleur référencement et visibilité web',
        ],
        callToAction: 'Boostons votre visibilité',
      },
      en: {
        title: 'Increase media visibility',
        problem: 'Your organization lacks media visibility and you struggle to be heard in an information-saturated environment.',
        approach: 'We build a custom press relations strategy to position your organization as a reference in its sector and generate regular media coverage.',
        steps: [
          'Audit of your current media presence',
          'Identification of target journalists and media',
          'Creation of exclusive angles and content',
          'Organization of regular press meetings',
          'Positioning your experts as sources',
          'Continuous measurement and optimization',
        ],
        results: [
          'Regular presence in media',
          'Recognition as industry expert',
          'Enhanced credibility with targets',
          'Better SEO and web visibility',
        ],
        callToAction: 'Let\'s boost your visibility',
      },
    },
  },
  {
    id: '4',
    slug: 'presence-digitale',
    categoryId: 'digital',
    icon: '📱',
    featured: true,
    translations: {
      fr: {
        title: 'Développer sa présence digitale',
        problem: 'Votre présence sur les réseaux sociaux est inexistante ou inefficace, et vous passez à côté d\'opportunités de connexion avec votre audience.',
        approach: 'Nous créons et déployons une stratégie digitale cohérente qui amplifie votre message, engage votre communauté et génère des résultats mesurables.',
        steps: [
          'Audit de votre écosystème digital actuel',
          'Définition de la stratégie et des objectifs',
          'Création de contenus engageants',
          'Animation quotidienne des communautés',
          'Campagnes publicitaires ciblées',
          'Analyse des performances et optimisation',
        ],
        results: [
          'Communauté engagée et croissante',
          'Notoriété de marque amplifiée',
          'Trafic qualifié vers vos supports',
          'Génération de leads et conversions',
        ],
        callToAction: 'Développons votre présence',
      },
      en: {
        title: 'Develop digital presence',
        problem: 'Your social media presence is non-existent or ineffective, and you are missing opportunities to connect with your audience.',
        approach: 'We create and deploy a coherent digital strategy that amplifies your message, engages your community and generates measurable results.',
        steps: [
          'Audit of your current digital ecosystem',
          'Definition of strategy and objectives',
          'Creation of engaging content',
          'Daily community management',
          'Targeted advertising campaigns',
          'Performance analysis and optimization',
        ],
        results: [
          'Engaged and growing community',
          'Amplified brand awareness',
          'Qualified traffic to your platforms',
          'Lead generation and conversions',
        ],
        callToAction: 'Let\'s develop your presence',
      },
    },
  },
  {
    id: '5',
    slug: 'evenement-corporate',
    categoryId: 'events',
    icon: '🎪',
    featured: true,
    translations: {
      fr: {
        title: 'Organiser un événement mémorable',
        problem: 'Vous devez organiser un événement corporate important mais vous manquez de temps, de ressources ou d\'expertise pour en faire un succès.',
        approach: 'Nous prenons en charge l\'intégralité de votre événement, de la conception à la réalisation, pour créer une expérience mémorable qui atteint vos objectifs.',
        steps: [
          'Définition des objectifs et du concept créatif',
          'Sélection du lieu et des prestataires',
          'Gestion logistique complète',
          'Production audiovisuelle et scénographie',
          'Coordination jour J et gestion des imprévus',
          'Bilan et mesure de l\'impact',
        ],
        results: [
          'Événement clé en main sans stress',
          'Expérience mémorable pour les participants',
          'Couverture médiatique de l\'événement',
          'Objectifs business atteints',
        ],
        callToAction: 'Créons votre événement',
      },
      en: {
        title: 'Organize a memorable event',
        problem: 'You need to organize an important corporate event but lack the time, resources or expertise to make it a success.',
        approach: 'We take full charge of your event, from design to execution, to create a memorable experience that achieves your objectives.',
        steps: [
          'Definition of objectives and creative concept',
          'Venue and vendor selection',
          'Complete logistics management',
          'Audiovisual production and scenography',
          'D-day coordination and contingency management',
          'Assessment and impact measurement',
        ],
        results: [
          'Turnkey event without stress',
          'Memorable experience for participants',
          'Media coverage of the event',
          'Business objectives achieved',
        ],
        callToAction: 'Let\'s create your event',
      },
    },
  },
  {
    id: '6',
    slug: 'repositionnement-marque',
    categoryId: 'visibility',
    icon: '✨',
    featured: false,
    translations: {
      fr: {
        title: 'Repositionner sa marque',
        problem: 'L\'image de votre marque ne reflète plus votre réalité actuelle ou vos ambitions. Vous avez besoin de vous réinventer pour rester pertinent.',
        approach: 'Nous accompagnons votre transformation de marque avec une approche stratégique qui aligne votre identité, votre communication et votre positionnement marché.',
        steps: [
          'Diagnostic de l\'image actuelle et des perceptions',
          'Définition du nouveau positionnement',
          'Refonte de l\'identité visuelle si nécessaire',
          'Élaboration de la nouvelle plateforme de marque',
          'Plan de communication du repositionnement',
          'Accompagnement dans la transition',
        ],
        results: [
          'Image de marque actualisée et cohérente',
          'Différenciation renforcée sur le marché',
          'Adhésion des parties prenantes',
          'Nouvelle dynamique commerciale',
        ],
        callToAction: 'Réinventons votre marque',
      },
      en: {
        title: 'Reposition your brand',
        problem: 'Your brand image no longer reflects your current reality or ambitions. You need to reinvent yourself to stay relevant.',
        approach: 'We support your brand transformation with a strategic approach that aligns your identity, communication and market positioning.',
        steps: [
          'Diagnosis of current image and perceptions',
          'Definition of new positioning',
          'Visual identity redesign if necessary',
          'Development of new brand platform',
          'Repositioning communication plan',
          'Support through the transition',
        ],
        results: [
          'Updated and coherent brand image',
          'Strengthened market differentiation',
          'Stakeholder buy-in',
          'New commercial momentum',
        ],
        callToAction: 'Let\'s reinvent your brand',
      },
    },
  },
  {
    id: '7',
    slug: 'lancement-produit',
    categoryId: 'visibility',
    icon: '🚀',
    featured: true,
    translations: {
      fr: {
        title: 'Lancer un produit avec impact',
        problem: 'Vous lancez un nouveau produit ou service et vous avez besoin d\'une couverture médiatique maximale pour marquer les esprits dès le premier jour.',
        approach: 'Nous orchestrons une campagne de lancement 360° combinant relations presse, événementiel et activation digitale pour créer un buzz authentique et durable autour de votre nouveauté.',
        steps: [
          'Analyse du marché et identification des angles médiatiques',
          'Élaboration du storytelling et des messages clés',
          'Organisation d\'un événement de lancement exclusif',
          'Campagne de relations presse ciblée',
          'Activation sur les réseaux sociaux',
          'Suivi et amplification des retombées',
        ],
        results: [
          'Couverture dans les médias majeurs',
          'Buzz sur les réseaux sociaux',
          'Positionnement fort dès le lancement',
          'Notoriété immédiate auprès des cibles',
        ],
        callToAction: 'Discutons de votre lancement',
      },
      en: {
        title: 'Launch a product with impact',
        problem: 'You are launching a new product or service and need maximum media coverage to make an impression from day one.',
        approach: 'We orchestrate a 360° launch campaign combining press relations, events and digital activation to create authentic and lasting buzz around your new offering.',
        steps: [
          'Market analysis and identification of media angles',
          'Development of storytelling and key messages',
          'Organization of an exclusive launch event',
          'Targeted press relations campaign',
          'Social media activation',
          'Monitoring and amplification of coverage',
        ],
        results: [
          'Coverage in major media',
          'Social media buzz',
          'Strong positioning from launch',
          'Immediate awareness among targets',
        ],
        callToAction: 'Let\'s discuss your launch',
      },
    },
  }
]

// ============================================
// CLIENTS DATA
// ============================================

export const clientsData: Client[] = [
  {
    id: '1',
    name: 'BEAC',
    logo: 'BE',
    image: '/images/clients/beac.png',
    description: {
      fr: "Banque des États de l’Afrique Centrale — banque centrale de la zone CEMAC, chargée de la politique monétaire et de l’émission de la monnaie.",
      en: "Banque des États de l’Afrique Centrale — central bank serving the CEMAC region, responsible for monetary policy and currency issuance.",
    },
  },
  {
    id: '2',
    name: 'EcoMatin',
    logo: 'EM',
    image: '/images/clients/ecomatin.png',
    description: {
      fr: 'Média économique camerounais proposant de l’information et de l’analyse sur le Cameroun et l’Afrique centrale, en formats papier et digital.',
      en: 'Cameroonian business and economic news outlet providing reporting and analysis on Cameroon and Central Africa across print and digital formats.',
    },
  },
  {
    id: '3',
    name: 'CCAA',
    logo: 'CC',
    image: '/images/clients/ccaa.png',
    description: {
      fr: "Cameroon Civil Aviation Authority — autorité publique chargée de la réglementation, de la supervision, de la sûreté et de la sécurité de l’aviation civile au Cameroun.",
      en: 'Cameroon Civil Aviation Authority — public authority in charge of civil aviation regulation, oversight, safety, and security in Cameroon.',
    },
  },
  {
    id: '4',
    name: 'FIFPRO',
    logo: 'FF',
    image: '/images/clients/fifpro.png',
    description: {
      fr: "Syndicat mondial des footballeurs professionnels, qui représente les joueurs via des unions nationales et défend leurs droits et conditions de travail dans le monde.",
      en: 'Global union for professional footballers, representing players through national unions and advocating for their rights and working conditions worldwide.',
    },
  },
  {
    id: '5',
    name: 'Ippon',
    logo: 'IP',
    image: '/images/clients/ippon.png',
    description: {
      fr: 'Cabinet international de conseil tech accompagnant la transformation digitale (software engineering, cloud, data et architectures modernes).',
      en: 'International technology consulting firm helping organizations with digital transformation, software engineering, cloud, data, and modern architectures.',
    },
  },
  {
    id: '6',
    name: 'Nexar',
    logo: 'NX',
    image: '/images/clients/nexar.png',
    description: {
      fr: "Plateforme de dashcam et application connectée dopées à l’IA, centrées sur la sécurité routière, la détection d’incidents et la preuve vidéo pour conducteurs et flottes.",
      en: 'AI-powered dashcam platform and connected driving app focused on road safety, incident detection, and video evidence for drivers and fleets.',
    },
  },
  {
    id: '7',
    name: 'Press Club',
    logo: 'PC',
    image: '/images/clients/press-club.png',
    description: {
      fr: "Press Club de France — association et réseau réunissant journalistes et professionnels de la communication, avec conférences, débats et événements médias.",
      en: 'Press Club de France — professional association and networking hub for journalists and communications leaders, hosting conferences, debates, and media-focused events.',
    },
  },
  {
    id: '8',
    name: 'SYNAFOC',
    logo: 'SY',
    image: '/images/clients/synafoc.png',
    description: {
      fr: 'Syndicat National des Footballeurs Camerounais — union nationale qui représente les footballeurs camerounais et défend leurs droits.',
      en: 'Syndicat National des Footballeurs Camerounais — national union representing Cameroonian footballers and defending players’ rights.',
    },
  },
  {
    id: '9',
    name: 'UPF',
    logo: 'UP',
    image: '/images/clients/upf.png',
    description: {
      fr: "Union internationale de la Presse francophone — ONG qui fédère des journalistes francophones et promeut la liberté de la presse et la collaboration professionnelle.",
      en: 'Union internationale de la Presse francophone — international NGO uniting Francophone journalists and promoting press freedom and professional collaboration.',
    },
  },
  {
    id: '10',
    name: 'AACB',
    logo: 'AA',
    image: '/images/clients/aacb.png',
    description: {
      fr: "Association of African Central Banks — association panafricaine réunissant les banques centrales pour renforcer la coopération sur le continent.",
      en: 'Association of African Central Banks — pan-African association bringing together central banks to support cooperation across the continent.',
    },
  },
  {
    id: '11',
    name: 'APN',
    logo: 'AP',
    image: '/images/clients/apn.png',
    description: {
      fr: "Autorité Portuaire Nationale (Cameroun) — organisme public chargé de mettre en œuvre la politique portuaire nationale et de réguler les activités portuaires.",
      en: 'Autorité Portuaire Nationale (Cameroon) — public authority responsible for implementing national port policy and regulating port activities.',
    },
  },
]

// ============================================
// HELPER FUNCTIONS
// ============================================

export function isVideoMedia(mediaUrl: string): boolean {
  // Check file extension for local video files
  if (mediaUrl.match(/\.(mp4|webm|ogg|mov|avi|mkv|m4v)$/i)) {
    return true;
  }
  // Check for video hosting platforms
  if (mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be')) {
    return true;
  }
  if (mediaUrl.includes('vimeo.com')) {
    return true;
  }
  return false;
}

export function getVideoType(mediaUrl: string): 'youtube' | 'vimeo' | 'local' | null {
  if (!isVideoMedia(mediaUrl)) return null;
  
  if (mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be')) {
    return 'youtube';
  }
  if (mediaUrl.includes('vimeo.com')) {
    return 'vimeo';
  }
  return 'local';
}

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

