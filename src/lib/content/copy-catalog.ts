export type CopyKind = 'TEXT' | 'TEXTAREA' | 'LIST'

export interface CopySeed {
  key: string
  group: string
  kind: CopyKind
  label: string
  hint?: string
  valueFr: string
  valueEn: string
}

export const copyCatalog: CopySeed[] = [
  { key: 'nav.home', group: 'nav', kind: 'TEXT', label: 'Navigation — Accueil', valueFr: 'Accueil', valueEn: 'Home' },
  { key: 'nav.about', group: 'nav', kind: 'TEXT', label: 'Navigation — À propos', valueFr: 'À propos', valueEn: 'About' },
  { key: 'nav.projects', group: 'nav', kind: 'TEXT', label: 'Navigation — Projets', valueFr: 'Projets', valueEn: 'Projects' },
  { key: 'nav.solutions', group: 'nav', kind: 'TEXT', label: 'Navigation — Solutions', valueFr: 'Solutions', valueEn: 'Solutions' },
  { key: 'nav.contact', group: 'nav', kind: 'TEXT', label: 'Navigation — Contact', valueFr: 'Contact', valueEn: 'Contact' },

  { key: 'hero.label', group: 'hero', kind: 'TEXT', label: 'Hero — Pastille', valueFr: 'Agence Premium', valueEn: 'Premium Agency' },
  { key: 'hero.title', group: 'hero', kind: 'TEXTAREA', label: 'Hero — Titre', valueFr: "Nous donnons de l'impact à vos idées, vos actions", valueEn: 'We give impact to your ideas, your actions' },
  { key: 'hero.subtitle', group: 'hero', kind: 'TEXTAREA', label: 'Hero — Sous-titre', valueFr: 'Cabinet de Communication & Stratégie regroupant des experts chevronnés', valueEn: 'Communication & Strategy Cabinet gathering seasoned experts' },
  { key: 'hero.cta', group: 'hero', kind: 'TEXT', label: 'Hero — Bouton principal', valueFr: 'Découvrir nos projets', valueEn: 'Discover our projects' },
  { key: 'hero.ctaSecondary', group: 'hero', kind: 'TEXT', label: 'Hero — Bouton secondaire', valueFr: 'Nous contacter', valueEn: 'Contact us' },

  { key: 'trustedBy.title', group: 'trustedBy', kind: 'TEXT', label: 'Partenaires — Sur-titre', valueFr: 'Ils nous font confiance', valueEn: 'They trust us' },
  { key: 'trustedBy.subtitle', group: 'trustedBy', kind: 'TEXT', label: 'Partenaires — Titre', valueFr: 'Nos clients', valueEn: 'Our clients' },
  { key: 'trustedBy.hoverHint', group: 'trustedBy', kind: 'TEXTAREA', label: 'Partenaires — Aide au survol', valueFr: 'Survolez ou touchez un partenaire pour afficher ses informations.', valueEn: 'Hover or tap a partner to reveal details.' },
  { key: 'trustedBy.preview', group: 'trustedBy', kind: 'TEXT', label: 'Partenaires — Aperçu', valueFr: 'Aperçu rapide', valueEn: 'Quick preview' },
  { key: 'trustedBy.pinned', group: 'trustedBy', kind: 'TEXT', label: 'Partenaires — Fiche épinglée', valueFr: 'Fiche épinglée', valueEn: 'Pinned card' },
  { key: 'trustedBy.action', group: 'trustedBy', kind: 'TEXT', label: 'Partenaires — Action', valueFr: 'Cliquez sur un autre partenaire pour changer.', valueEn: 'Click another partner to switch.' },
  { key: 'trustedBy.close', group: 'trustedBy', kind: 'TEXT', label: 'Partenaires — Fermer', valueFr: 'Fermer', valueEn: 'Close' },

  { key: 'projects.title', group: 'projects', kind: 'TEXT', label: 'Accueil projets — Titre', valueFr: 'Nos projets', valueEn: 'Our Projects' },
  { key: 'projects.subtitle', group: 'projects', kind: 'TEXTAREA', label: 'Accueil projets — Sous-titre', valueFr: 'Découvrez nos réalisations qui marquent les esprits', valueEn: 'Discover our impactful achievements' },
  { key: 'projects.cta', group: 'projects', kind: 'TEXT', label: 'Accueil projets — CTA carte', valueFr: 'Voir le projet', valueEn: 'View project' },
  { key: 'projects.viewAll', group: 'projects', kind: 'TEXT', label: 'Accueil projets — Voir tout', valueFr: 'Voir tous les projets', valueEn: 'View all projects' },

  { key: 'about.title', group: 'about', kind: 'TEXT', label: 'À propos — Titre', valueFr: 'Qui sommes-nous ?', valueEn: 'Who are we?' },
  { key: 'about.subtitle', group: 'about', kind: 'TEXT', label: 'À propos — Sous-titre', valueFr: 'Créateurs de liens publics', valueEn: 'Public link creators' },
  { key: 'about.whoWeAre.title', group: 'about', kind: 'TEXT', label: 'À propos — Qui nous sommes (titre)', valueFr: 'Qui nous sommes', valueEn: 'Who we are' },
  { key: 'about.whoWeAre.text1', group: 'about', kind: 'TEXTAREA', label: 'À propos — Qui nous sommes (texte 1)', valueFr: "Que ce soit à la télé, à la radio ou ailleurs, nos actions, nos mots ne sont jamais anodins, ils ont toujours un objectif qui est peut être de susciter une émotion, un sentiment ou une action auprès de ceux qui nous écoutent ou lisent. Notre ambition à travers iNFLUENZ est de donner un impact réellement mesurable à vos mots et actions et bien au-delà même à vos idées et projets.", valueEn: 'Whether on TV, radio or elsewhere, our actions and words are never trivial, they always have an objective which may be to arouse an emotion, a feeling or an action among those who listen to or read us. Our ambition through iNFLUENZ is to give a truly measurable impact to your words and actions and well beyond even your ideas and projects.' },
  { key: 'about.whoWeAre.text2', group: 'about', kind: 'TEXTAREA', label: 'À propos — Qui nous sommes (texte 2)', valueFr: "C'est de cette ambition qu'est né le Cabinet de Communication & Stratégie qui regroupe en son sein des experts chevronnés de la communication et du management. Nous accompagnons déjà de nombreuses organisations ainsi que des personnalités du monde du Sport ou de la politique.", valueEn: 'It is from this ambition that the Communication & Strategy Cabinet was born, bringing together seasoned communication and management experts. We already support numerous organizations as well as personalities from the world of sports or politics.' },
  { key: 'about.ourPurpose.title', group: 'about', kind: 'TEXT', label: 'À propos — Raison d’être (titre)', valueFr: "Notre raison d'être", valueEn: 'Our purpose' },
  { key: 'about.ourPurpose.text1', group: 'about', kind: 'TEXTAREA', label: 'À propos — Raison d’être (texte 1)', valueFr: "La relation de vos collaborateurs ou même du public à l'information a changé, contraignant ainsi les agences de communication, les gouvernements, les organisations et tous ceux qui communiquent à se réinventer.", valueEn: 'The relationship of your employees or even the public to information has changed, thus forcing communication agencies, governments, organizations and all those who communicate to reinvent themselves.' },
  { key: 'about.ourPurpose.text2', group: 'about', kind: 'TEXTAREA', label: 'À propos — Raison d’être (texte 2)', valueFr: "iNFLUENZ naît de ce besoin pour tous ces acteurs nationaux et internationaux de s'adapter sans se renier. De communiquer rapidement et efficacement dans le respect des fondamentaux de la communication.", valueEn: 'iNFLUENZ was born from this need for all these national and international actors to adapt without denying themselves. To communicate quickly and effectively while respecting the fundamentals of communication.' },
  { key: 'about.ourMission.title', group: 'about', kind: 'TEXT', label: 'À propos — Mission (titre)', valueFr: 'Nous vous aidons à', valueEn: 'We help you' },
  { key: 'about.ourMission.text', group: 'about', kind: 'TEXTAREA', label: 'À propos — Mission (texte)', valueFr: "Notre mission est d'être cette tierce partie en qui vous placez votre confiance pour assurer la fluidité dans la transmission de vos informations à vos publics cibles (employés, acteurs économiques, sociaux et politiques, etc…).", valueEn: 'Our mission is to be that third party in whom you place your trust to ensure fluidity in the transmission of your information to your target audiences (employees, economic, social and political actors, etc.).' },
  { key: 'about.ourMission.points', group: 'about', kind: 'LIST', label: 'À propos — Points de mission', hint: 'Une ligne = un point', valueFr: "Garder une parfaite maîtrise du fonctionnement de l'écosystème informationnel pour déterminer la nature et la forme des contenus à adresser à vos différents publics\nÉtablir une communication d'influence tant à l'interne qu'à l'externe\nVeiller à la légitimité de vos sources pour renforcer votre crédibilité", valueEn: 'Keep perfect control of how the information ecosystem works to determine the nature and form of content to address to your different audiences\nEstablish influential communication both internally and externally\nEnsure the legitimacy of your sources to strengthen your credibility' },
  { key: 'about.services.title', group: 'about', kind: 'TEXT', label: 'À propos — Titre des domaines', valueFr: "Nos domaines d'intervention", valueEn: 'Our areas of expertise' },
  { key: 'about.location.title', group: 'about', kind: 'TEXT', label: 'À propos — Localisation (titre)', valueFr: 'Notre localisation', valueEn: 'Our location' },
  { key: 'about.location.city', group: 'about', kind: 'TEXT', label: 'À propos — Ville', valueFr: 'Yaoundé', valueEn: 'Yaoundé' },
  { key: 'about.location.country', group: 'about', kind: 'TEXT', label: 'À propos — Pays', valueFr: 'Cameroun', valueEn: 'Cameroon' },

  { key: 'footer.tagline', group: 'footer', kind: 'TEXTAREA', label: 'Pied de page — Signature', valueFr: "Nous donnons de l'impact à vos idées, vos actions", valueEn: 'We give impact to your ideas, your actions' },
  { key: 'footer.contact', group: 'footer', kind: 'TEXT', label: 'Pied de page — Contact', valueFr: 'Contact', valueEn: 'Contact' },
  { key: 'footer.follow', group: 'footer', kind: 'TEXT', label: 'Pied de page — Réseaux', valueFr: 'Suivez-nous', valueEn: 'Follow us' },
  { key: 'footer.rights', group: 'footer', kind: 'TEXT', label: 'Pied de page — Droits', valueFr: 'Tous droits réservés.', valueEn: 'All rights reserved.' },
  { key: 'footer.address', group: 'footer', kind: 'TEXT', label: 'Pied de page — Adresse (libellé interne)', valueFr: 'BP 10107, Omnisports, Yaoundé, Cameroun', valueEn: 'BP 10107, Omnisports, Yaoundé, Cameroon' },
  { key: 'footer.phone', group: 'footer', kind: 'TEXT', label: 'Pied de page — Téléphones (libellé interne)', valueFr: '+237 699 22 24 40 / +237 652 20 93 23', valueEn: '+237 699 22 24 40 / +237 652 20 93 23' },
  { key: 'footer.legalInfo', group: 'footer', kind: 'TEXT', label: 'Pied de page — Infos légales', valueFr: 'Informations légales', valueEn: 'Legal information' },

  { key: 'contact.title', group: 'contact', kind: 'TEXT', label: 'Contact — Titre', valueFr: 'Contactez-nous', valueEn: 'Contact us' },
  { key: 'contact.name', group: 'contact', kind: 'TEXT', label: 'Contact — Nom', valueFr: 'Nom', valueEn: 'Name' },
  { key: 'contact.enterprise', group: 'contact', kind: 'TEXT', label: 'Contact — Entreprise', valueFr: 'Entreprise', valueEn: 'Enterprise' },
  { key: 'contact.enterpriseOptional', group: 'contact', kind: 'TEXT', label: 'Contact — Optionnel', valueFr: '(optionnel)', valueEn: '(optional)' },
  { key: 'contact.email', group: 'contact', kind: 'TEXT', label: 'Contact — Email', valueFr: 'Email', valueEn: 'Email' },
  { key: 'contact.message', group: 'contact', kind: 'TEXT', label: 'Contact — Message', valueFr: 'Message', valueEn: 'Message' },
  { key: 'contact.send', group: 'contact', kind: 'TEXT', label: 'Contact — Envoyer', valueFr: 'Envoyer', valueEn: 'Send' },
  { key: 'contact.sending', group: 'contact', kind: 'TEXT', label: 'Contact — Envoi', valueFr: 'Envoi en cours...', valueEn: 'Sending...' },
  { key: 'contact.success', group: 'contact', kind: 'TEXT', label: 'Contact — Succès', valueFr: 'Message envoyé avec succès !', valueEn: 'Message sent successfully!' },
  { key: 'contact.error', group: 'contact', kind: 'TEXT', label: 'Contact — Erreur', valueFr: 'Une erreur est survenue. Veuillez réessayer.', valueEn: 'An error occurred. Please try again.' },
  { key: 'contact.placeholders.name', group: 'contact', kind: 'TEXT', label: 'Contact — Placeholder nom', valueFr: 'Votre nom', valueEn: 'Your name' },
  { key: 'contact.placeholders.enterprise', group: 'contact', kind: 'TEXT', label: 'Contact — Placeholder entreprise', valueFr: 'Nom de votre entreprise', valueEn: 'Your enterprise name' },
  { key: 'contact.placeholders.email', group: 'contact', kind: 'TEXT', label: 'Contact — Placeholder email', valueFr: 'votre@email.com', valueEn: 'your@email.com' },
  { key: 'contact.placeholders.message', group: 'contact', kind: 'TEXTAREA', label: 'Contact — Placeholder message', valueFr: 'Parlez-nous de votre projet...', valueEn: 'Tell us about your project...' },

  { key: 'project.back', group: 'project', kind: 'TEXT', label: 'Fiche projet — Retour', valueFr: 'Retour aux projets', valueEn: 'Back to projects' },
  { key: 'project.backSimple', group: 'project', kind: 'TEXT', label: 'Fiche projet — Retour simple', valueFr: 'Retour', valueEn: 'Back' },
  { key: 'project.client', group: 'project', kind: 'TEXT', label: 'Fiche projet — Client', valueFr: 'Client', valueEn: 'Client' },
  { key: 'project.year', group: 'project', kind: 'TEXT', label: 'Fiche projet — Année', valueFr: 'Année', valueEn: 'Year' },
  { key: 'project.category', group: 'project', kind: 'TEXT', label: 'Fiche projet — Catégorie', valueFr: 'Catégorie', valueEn: 'Category' },
  { key: 'project.challenge', group: 'project', kind: 'TEXT', label: 'Fiche projet — Défi', valueFr: 'Le défi', valueEn: 'The challenge' },
  { key: 'project.solution', group: 'project', kind: 'TEXT', label: 'Fiche projet — Solution', valueFr: 'Notre solution', valueEn: 'Our solution' },
  { key: 'project.services', group: 'project', kind: 'TEXT', label: 'Fiche projet — Services', valueFr: 'Services fournis', valueEn: 'Services provided' },
  { key: 'project.results', group: 'project', kind: 'TEXT', label: 'Fiche projet — Résultats', valueFr: 'Résultats', valueEn: 'Results' },
  { key: 'project.similar', group: 'project', kind: 'TEXT', label: 'Fiche projet — Projet similaire', valueFr: 'Vous avez un projet similaire ?', valueEn: 'Do you have a similar project?' },
  { key: 'project.contactUs', group: 'project', kind: 'TEXT', label: 'Fiche projet — Contact', valueFr: 'Contactez-nous', valueEn: 'Contact us' },
  { key: 'project.notFound', group: 'project', kind: 'TEXT', label: 'Fiche projet — Introuvable', valueFr: 'Projet non trouvé', valueEn: 'Project not found' },
  { key: 'project.backToProjects', group: 'project', kind: 'TEXT', label: 'Fiche projet — Retour liste', valueFr: 'Retour aux projets', valueEn: 'Back to projects' },

  { key: 'projectsPage.title', group: 'projectsPage', kind: 'TEXT', label: 'Page projets — Titre', valueFr: 'Nos projets', valueEn: 'Our Projects' },
  { key: 'projectsPage.subtitle', group: 'projectsPage', kind: 'TEXTAREA', label: 'Page projets — Sous-titre', valueFr: "Découvrez l'ensemble de nos réalisations et les résultats obtenus pour nos clients.", valueEn: 'Discover all our achievements and the results obtained for our clients.' },
  { key: 'projectsPage.back', group: 'projectsPage', kind: 'TEXT', label: 'Page projets — Retour', valueFr: 'Retour', valueEn: 'Back' },
  { key: 'projectsPage.noProjects', group: 'projectsPage', kind: 'TEXT', label: 'Page projets — Vide', valueFr: 'Aucun projet trouvé', valueEn: 'No projects found' },
  { key: 'projectsPage.viewProject', group: 'projectsPage', kind: 'TEXT', label: 'Page projets — Voir', valueFr: 'Voir le projet', valueEn: 'View project' },

  { key: 'solutions.title', group: 'solutions', kind: 'TEXT', label: 'Accueil solutions — Titre', valueFr: 'Nos solutions', valueEn: 'Our Solutions' },
  { key: 'solutions.subtitle', group: 'solutions', kind: 'TEXTAREA', label: 'Accueil solutions — Sous-titre', valueFr: 'Des problématiques concrètes que nous avons résolues pour nos clients', valueEn: 'Concrete problems we have solved for our clients' },
  { key: 'solutions.cta', group: 'solutions', kind: 'TEXT', label: 'Accueil solutions — CTA', valueFr: 'Voir la solution', valueEn: 'View solution' },
  { key: 'solutions.viewAll', group: 'solutions', kind: 'TEXT', label: 'Accueil solutions — Voir tout', valueFr: 'Voir toutes nos solutions', valueEn: 'View all our solutions' },

  { key: 'solutionsPage.title', group: 'solutionsPage', kind: 'TEXT', label: 'Page solutions — Titre', valueFr: 'Nos solutions', valueEn: 'Our Solutions' },
  { key: 'solutionsPage.subtitle', group: 'solutionsPage', kind: 'TEXTAREA', label: 'Page solutions — Sous-titre', valueFr: "Découvrez l'ensemble de nos services et trouvez la solution adaptée à vos besoins.", valueEn: 'Discover all our services and find the solution that suits your needs.' },
  { key: 'solutionsPage.back', group: 'solutionsPage', kind: 'TEXT', label: 'Page solutions — Retour', valueFr: 'Retour', valueEn: 'Back' },
  { key: 'solutionsPage.noSolutions', group: 'solutionsPage', kind: 'TEXT', label: 'Page solutions — Vide', valueFr: 'Aucune solution trouvée', valueEn: 'No solutions found' },
  { key: 'solutionsPage.viewSolution', group: 'solutionsPage', kind: 'TEXT', label: 'Page solutions — Découvrir', valueFr: 'Découvrir', valueEn: 'Discover' },

  { key: 'solution.back', group: 'solution', kind: 'TEXT', label: 'Fiche solution — Retour', valueFr: 'Retour aux solutions', valueEn: 'Back to solutions' },
  { key: 'solution.backSimple', group: 'solution', kind: 'TEXT', label: 'Fiche solution — Retour simple', valueFr: 'Retour', valueEn: 'Back' },
  { key: 'solution.problem', group: 'solution', kind: 'TEXT', label: 'Fiche solution — Problématique', valueFr: 'La problématique', valueEn: 'The problem' },
  { key: 'solution.approach', group: 'solution', kind: 'TEXT', label: 'Fiche solution — Approche', valueFr: 'Notre approche', valueEn: 'Our approach' },
  { key: 'solution.steps', group: 'solution', kind: 'TEXT', label: 'Fiche solution — Étapes', valueFr: 'Les étapes clés', valueEn: 'Key steps' },
  { key: 'solution.results', group: 'solution', kind: 'TEXT', label: 'Fiche solution — Résultats', valueFr: 'Les résultats', valueEn: 'The results' },
  { key: 'solution.contactUs', group: 'solution', kind: 'TEXT', label: 'Fiche solution — Contact', valueFr: 'Nous contacter', valueEn: 'Contact us' },
  { key: 'solution.interested', group: 'solution', kind: 'TEXT', label: 'Fiche solution — Intéressé', valueFr: 'Vous avez cette problématique ?', valueEn: 'Facing this problem?' },
  { key: 'solution.notFound', group: 'solution', kind: 'TEXT', label: 'Fiche solution — Introuvable', valueFr: 'Solution non trouvée', valueEn: 'Solution not found' },
  { key: 'solution.backToSolutions', group: 'solution', kind: 'TEXT', label: 'Fiche solution — Retour liste', valueFr: 'Retour aux solutions', valueEn: 'Back to solutions' },
  { key: 'solution.learnMore', group: 'solution', kind: 'TEXT', label: 'Fiche solution — En savoir plus', valueFr: 'En savoir plus', valueEn: 'Learn more' },
]
