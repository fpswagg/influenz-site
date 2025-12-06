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
    features: string
    benefits: string
    contactUs: string
    interested: string
    notFound: string
    backToSolutions: string
  }
}

export const translations: Record<Language, Translations> = {
  fr: {
    nav: {
      home: 'Accueil',
      about: 'À propos',
      projects: 'Projets',
      solutions: 'Solutions',
      contact: 'Contact',
    },
    hero: {
      label: 'Agence Premium',
      title: 'Nous donnons de l\'impact à vos idées, vos actions',
      subtitle: 'Cabinet de Communication & Stratégie regroupant des experts chevronnés',
      cta: 'Découvrir nos projets',
      ctaSecondary: 'Nous contacter',
    },
    trustedBy: {
      title: 'Ils nous font confiance',
      subtitle: 'Nos clients',
    },
    projects: {
      title: 'Nos projets',
      subtitle: 'Découvrez nos réalisations qui marquent les esprits',
      cta: 'Voir le projet',
    },
    about: {
      title: 'Qui sommes-nous ?',
      subtitle: 'Créateurs de liens publics',
      whoWeAre: {
        title: 'Qui nous sommes',
        text1: 'Que ce soit à la télé, à la radio ou ailleurs, nos actions, nos mots ne sont jamais anodins, ils ont toujours un objectif qui est peut être de susciter une émotion, un sentiment ou une action auprès de ceux qui nous écoutent ou lisent. Notre ambition à travers iNFLUENZ est de donner un impact réellement mesurable à vos mots et actions et bien au-delà même à vos idées et projets.',
        text2: 'C\'est de cette ambition qu\'est né le Cabinet de Communication & Stratégie qui regroupe en son sein des experts chevronnés de la communication et du management. Nous accompagnons déjà de nombreuses organisations ainsi que des personnalités du monde du Sport ou de la politique.',
      },
      ourPurpose: {
        title: 'Notre raison d\'être',
        text1: 'La relation de vos collaborateurs ou même du public à l\'information a changé, contraignant ainsi les agences de communication, les gouvernements, les organisations et tous ceux qui communiquent à se réinventer.',
        text2: 'iNFLUENZ naît de ce besoin pour tous ces acteurs nationaux et internationaux de s\'adapter sans se renier. De communiquer rapidement et efficacement dans le respect des fondamentaux de la communication.',
      },
      ourMission: {
        title: 'Nous vous aidons à',
        text: 'Notre mission est d\'être cette tierce partie en qui vous placez votre confiance pour assurer la fluidité dans la transmission de vos informations à vos publics cibles (employés, acteurs économiques, sociaux et politiques, etc…).',
        points: [
          'Garder une parfaite maîtrise du fonctionnement de l\'écosystème informationnel pour déterminer la nature et la forme des contenus à adresser à vos différents publics',
          'Établir une communication d\'influence tant à l\'interne qu\'à l\'externe',
          'Veiller à la légitimité de vos sources pour renforcer votre crédibilité',
        ],
      },
      services: {
        title: 'Nos domaines d\'intervention',
        items: [
          {
            title: 'Conseil & Stratégie',
            description: 'Accompagnement stratégique et audit de communication',
          },
          {
            title: 'Relations Presse',
            description: 'Gestion des relations médias et couverture presse',
          },
          {
            title: 'Communication Digitale',
            description: 'Stratégie digitale et gestion des réseaux sociaux',
          },
          {
            title: 'Événementiel',
            description: 'Organisation et gestion d\'événements corporate',
          },
        ],
      },
      location: {
        title: 'Notre localisation',
        city: 'Yaoundé',
        country: 'Cameroun',
      },
    },
    contact: {
      title: 'Contactez-nous',
      name: 'Nom',
      enterprise: 'Entreprise',
      enterpriseOptional: '(optionnel)',
      email: 'Email',
      message: 'Message',
      send: 'Envoyer',
      sending: 'Envoi en cours...',
      success: 'Message envoyé avec succès !',
      error: 'Une erreur est survenue. Veuillez réessayer.',
      placeholders: {
        name: 'Votre nom',
        enterprise: 'Nom de votre entreprise',
        email: 'votre@email.com',
        message: 'Parlez-nous de votre projet...',
      },
    },
    footer: {
      tagline: 'Nous donnons de l\'impact à vos idées, vos actions',
      contact: 'Contact',
      follow: 'Suivez-nous',
      rights: 'Tous droits réservés.',
      address: 'BP 10107, Omnisports, Yaoundé, Cameroun',
      phone: '+237 699 22 24 40 / +237 652 20 93 23',
      legalInfo: 'Informations légales',
    },
    project: {
      back: 'Retour aux projets',
      backSimple: 'Retour',
      client: 'Client',
      year: 'Année',
      category: 'Catégorie',
      challenge: 'Le défi',
      solution: 'Notre solution',
      services: 'Services fournis',
      results: 'Résultats',
      similar: 'Vous avez un projet similaire ?',
      contactUs: 'Contactez-nous',
      notFound: 'Projet non trouvé',
      backToProjects: 'Retour aux projets',
    },
    projectsPage: {
      title: 'Nos projets',
      subtitle: 'Découvrez l\'ensemble de nos réalisations et les résultats obtenus pour nos clients.',
      back: 'Retour',
      noProjects: 'Aucun projet trouvé',
      viewProject: 'Voir le projet',
    },
    solutions: {
      title: 'Nos solutions',
      subtitle: 'Des services sur mesure pour répondre à tous vos besoins en communication',
      cta: 'En savoir plus',
      viewAll: 'Voir toutes nos solutions',
    },
    solutionsPage: {
      title: 'Nos solutions',
      subtitle: 'Découvrez l\'ensemble de nos services et trouvez la solution adaptée à vos besoins.',
      back: 'Retour',
      noSolutions: 'Aucune solution trouvée',
      viewSolution: 'Découvrir',
    },
    solution: {
      back: 'Retour aux solutions',
      backSimple: 'Retour',
      features: 'Ce que nous proposons',
      benefits: 'Les avantages',
      contactUs: 'Nous contacter',
      interested: 'Cette solution vous intéresse ?',
      notFound: 'Solution non trouvée',
      backToSolutions: 'Retour aux solutions',
    },
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      projects: 'Projects',
      solutions: 'Solutions',
      contact: 'Contact',
    },
    hero: {
      label: 'Premium Agency',
      title: 'We give impact to your ideas, your actions',
      subtitle: 'Communication & Strategy Cabinet gathering seasoned experts',
      cta: 'Discover our projects',
      ctaSecondary: 'Contact us',
    },
    trustedBy: {
      title: 'They trust us',
      subtitle: 'Our clients',
    },
    projects: {
      title: 'Our Projects',
      subtitle: 'Discover our impactful achievements',
      cta: 'View project',
    },
    about: {
      title: 'Who are we?',
      subtitle: 'Public link creators',
      whoWeAre: {
        title: 'Who we are',
        text1: 'Whether on TV, radio or elsewhere, our actions and words are never trivial, they always have an objective which may be to arouse an emotion, a feeling or an action among those who listen to or read us. Our ambition through iNFLUENZ is to give a truly measurable impact to your words and actions and well beyond even your ideas and projects.',
        text2: 'It is from this ambition that the Communication & Strategy Cabinet was born, bringing together seasoned communication and management experts. We already support numerous organizations as well as personalities from the world of sports or politics.',
      },
      ourPurpose: {
        title: 'Our purpose',
        text1: 'The relationship of your employees or even the public to information has changed, thus forcing communication agencies, governments, organizations and all those who communicate to reinvent themselves.',
        text2: 'iNFLUENZ was born from this need for all these national and international actors to adapt without denying themselves. To communicate quickly and effectively while respecting the fundamentals of communication.',
      },
      ourMission: {
        title: 'We help you',
        text: 'Our mission is to be that third party in whom you place your trust to ensure fluidity in the transmission of your information to your target audiences (employees, economic, social and political actors, etc.).',
        points: [
          'Keep perfect control of how the information ecosystem works to determine the nature and form of content to address to your different audiences',
          'Establish influential communication both internally and externally',
          'Ensure the legitimacy of your sources to strengthen your credibility',
        ],
      },
      services: {
        title: 'Our areas of expertise',
        items: [
          {
            title: 'Consulting & Strategy',
            description: 'Strategic support and communication audit',
          },
          {
            title: 'Press Relations',
            description: 'Media relations management and press coverage',
          },
          {
            title: 'Digital Communication',
            description: 'Digital strategy and social media management',
          },
          {
            title: 'Events',
            description: 'Corporate event organization and management',
          },
        ],
      },
      location: {
        title: 'Our location',
        city: 'Yaoundé',
        country: 'Cameroon',
      },
    },
    contact: {
      title: 'Contact us',
      name: 'Name',
      enterprise: 'Enterprise',
      enterpriseOptional: '(optional)',
      email: 'Email',
      message: 'Message',
      send: 'Send',
      sending: 'Sending...',
      success: 'Message sent successfully!',
      error: 'An error occurred. Please try again.',
      placeholders: {
        name: 'Your name',
        enterprise: 'Your enterprise name',
        email: 'your@email.com',
        message: 'Tell us about your project...',
      },
    },
    footer: {
      tagline: 'We give impact to your ideas, your actions',
      contact: 'Contact',
      follow: 'Follow us',
      rights: 'All rights reserved.',
      address: 'BP 10107, Omnisports, Yaoundé, Cameroon',
      phone: '+237 699 22 24 40 / +237 652 20 93 23',
      legalInfo: 'Legal information',
    },
    project: {
      back: 'Back to projects',
      backSimple: 'Back',
      client: 'Client',
      year: 'Year',
      category: 'Category',
      challenge: 'The challenge',
      solution: 'Our solution',
      services: 'Services provided',
      results: 'Results',
      similar: 'Do you have a similar project?',
      contactUs: 'Contact us',
      notFound: 'Project not found',
      backToProjects: 'Back to projects',
    },
    projectsPage: {
      title: 'Our Projects',
      subtitle: 'Discover all our achievements and the results obtained for our clients.',
      back: 'Back',
      noProjects: 'No projects found',
      viewProject: 'View project',
    },
    solutions: {
      title: 'Our Solutions',
      subtitle: 'Custom services to meet all your communication needs',
      cta: 'Learn more',
      viewAll: 'View all our solutions',
    },
    solutionsPage: {
      title: 'Our Solutions',
      subtitle: 'Discover all our services and find the solution that suits your needs.',
      back: 'Back',
      noSolutions: 'No solutions found',
      viewSolution: 'Discover',
    },
    solution: {
      back: 'Back to solutions',
      backSimple: 'Back',
      features: 'What we offer',
      benefits: 'The benefits',
      contactUs: 'Contact us',
      interested: 'Interested in this solution?',
      notFound: 'Solution not found',
      backToSolutions: 'Back to solutions',
    },
  },
}

