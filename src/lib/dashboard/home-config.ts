/**
 * Describes, for each home page section, what the editor shows: friendly name,
 * explanation and the fields (texts, images, lists) that appear inside it on the site.
 */

export type HomeItem =
  | { type: 'copy'; key: string; label: string; hint?: string }
  | { type: 'heroBanner' }
  | { type: 'aboutServices' }
  | { type: 'contactIntro' }
  | { type: 'locationBlurb' }

export interface HomeBlock {
  title?: string
  items: HomeItem[]
}

export interface HomeSectionConfig {
  title: string
  description: string
  /** Whether the small label above the section title is displayed on the site */
  hasEyebrow: boolean
  blocks: HomeBlock[]
  /** Link to the page where the items shown in this section are managed */
  manage?: { href: string; label: string; note: string }
  /** Copy group holding the remaining (secondary) texts of this section */
  textsGroup?: string
}

export const HOME_SECTIONS: Record<string, HomeSectionConfig> = {
  hero: {
    title: 'Bannière d’accueil',
    description: 'Le grand visuel et le message d’accroche, en haut de la page.',
    hasEyebrow: false,
    textsGroup: 'hero',
    blocks: [
      {
        items: [
          { type: 'heroBanner' },
          { type: 'copy', key: 'hero.label', label: 'Petite étiquette', hint: 'Affichée au-dessus du titre, ex. « Agence Premium ».' },
          { type: 'copy', key: 'hero.title', label: 'Titre principal' },
          { type: 'copy', key: 'hero.subtitle', label: 'Sous-titre' },
          { type: 'copy', key: 'hero.cta', label: 'Texte du bouton principal', hint: 'Mène à la liste des projets.' },
          { type: 'copy', key: 'hero.ctaSecondary', label: 'Texte du bouton secondaire', hint: 'Mène au formulaire de contact.' },
        ],
      },
    ],
  },
  'trusted-by': {
    title: 'Partenaires',
    description: 'Les logos des organisations qui vous font confiance.',
    hasEyebrow: false,
    textsGroup: 'trustedBy',
    manage: { href: '/dashboard/clients', label: 'Gérer les partenaires', note: 'Les logos affichés se gèrent dans la page Partenaires.' },
    blocks: [
      {
        items: [
          { type: 'copy', key: 'trustedBy.title', label: 'Petit titre' },
          { type: 'copy', key: 'trustedBy.subtitle', label: 'Titre' },
          { type: 'copy', key: 'trustedBy.hoverHint', label: 'Phrase d’aide', hint: 'Invite le visiteur à survoler un logo.' },
        ],
      },
    ],
  },
  projects: {
    title: 'Projets',
    description: 'Une sélection de vos réalisations.',
    hasEyebrow: true,
    textsGroup: 'projects',
    manage: {
      href: '/dashboard/projects',
      label: 'Gérer les projets',
      note: 'Seuls les projets avec l’option « Afficher sur l’accueil » apparaissent ici.',
    },
    blocks: [
      {
        items: [
          { type: 'copy', key: 'projects.title', label: 'Titre' },
          { type: 'copy', key: 'projects.subtitle', label: 'Sous-titre' },
          { type: 'copy', key: 'projects.cta', label: 'Texte du lien sur chaque carte' },
          { type: 'copy', key: 'projects.viewAll', label: 'Texte du bouton « tout voir »' },
        ],
      },
    ],
  },
  solutions: {
    title: 'Solutions',
    description: 'Les problématiques que vous résolvez.',
    hasEyebrow: true,
    textsGroup: 'solutions',
    manage: {
      href: '/dashboard/solutions',
      label: 'Gérer les solutions',
      note: 'Seules les solutions avec l’option « Afficher sur l’accueil » apparaissent ici.',
    },
    blocks: [
      {
        items: [
          { type: 'copy', key: 'solutions.title', label: 'Titre' },
          { type: 'copy', key: 'solutions.subtitle', label: 'Sous-titre' },
          { type: 'copy', key: 'solutions.cta', label: 'Texte du lien sur chaque carte' },
          { type: 'copy', key: 'solutions.viewAll', label: 'Texte du bouton « tout voir »' },
        ],
      },
    ],
  },
  about: {
    title: 'À propos',
    description: 'Qui vous êtes, votre mission, vos domaines d’intervention et votre localisation.',
    hasEyebrow: true,
    textsGroup: 'about',
    blocks: [
      {
        title: 'En-tête',
        items: [
          { type: 'copy', key: 'about.title', label: 'Titre' },
          { type: 'copy', key: 'about.subtitle', label: 'Sous-titre' },
        ],
      },
      {
        title: 'Qui nous sommes',
        items: [
          { type: 'copy', key: 'about.whoWeAre.title', label: 'Titre du bloc' },
          { type: 'copy', key: 'about.whoWeAre.text1', label: 'Premier paragraphe' },
          { type: 'copy', key: 'about.whoWeAre.text2', label: 'Second paragraphe' },
        ],
      },
      {
        title: 'Notre raison d’être',
        items: [
          { type: 'copy', key: 'about.ourPurpose.title', label: 'Titre du bloc' },
          { type: 'copy', key: 'about.ourPurpose.text1', label: 'Premier paragraphe' },
          { type: 'copy', key: 'about.ourPurpose.text2', label: 'Second paragraphe' },
        ],
      },
      {
        title: 'Notre mission',
        items: [
          { type: 'copy', key: 'about.ourMission.title', label: 'Titre du bloc' },
          { type: 'copy', key: 'about.ourMission.text', label: 'Texte' },
          { type: 'copy', key: 'about.ourMission.points', label: 'Points clés' },
        ],
      },
      {
        title: 'Domaines d’intervention',
        items: [{ type: 'copy', key: 'about.services.title', label: 'Titre du bloc' }, { type: 'aboutServices' }],
      },
      {
        title: 'Localisation',
        items: [
          { type: 'copy', key: 'about.location.title', label: 'Titre du bloc' },
          { type: 'copy', key: 'about.location.city', label: 'Ville' },
          { type: 'copy', key: 'about.location.country', label: 'Pays' },
          { type: 'locationBlurb' },
        ],
      },
    ],
  },
  contact: {
    title: 'Contact',
    description: 'Le formulaire qui permet aux visiteurs de vous écrire.',
    hasEyebrow: true,
    textsGroup: 'contact',
    blocks: [
      {
        items: [{ type: 'copy', key: 'contact.title', label: 'Titre' }, { type: 'contactIntro' }],
      },
    ],
  },
}
