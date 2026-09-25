/** Friendly names, in display order, for the groups of site texts (CopyEntry.group). */
export const TEXT_GROUPS: { id: string; label: string; description: string }[] = [
  { id: 'nav', label: 'Menu de navigation', description: 'Les liens du menu en haut du site.' },
  { id: 'hero', label: 'Bannière d’accueil', description: 'Le haut de la page d’accueil.' },
  { id: 'trustedBy', label: 'Partenaires', description: 'La section « Ils nous font confiance ».' },
  { id: 'projects', label: 'Projets (accueil)', description: 'La section Projets de la page d’accueil.' },
  { id: 'solutions', label: 'Solutions (accueil)', description: 'La section Solutions de la page d’accueil.' },
  { id: 'about', label: 'À propos', description: 'La section À propos de la page d’accueil.' },
  { id: 'contact', label: 'Formulaire de contact', description: 'Libellés, exemples et messages du formulaire.' },
  { id: 'projectsPage', label: 'Page « Tous les projets »', description: 'La page qui liste tous les projets.' },
  { id: 'project', label: 'Page d’un projet', description: 'Les intitulés de la page détaillée d’un projet.' },
  { id: 'solutionsPage', label: 'Page « Toutes les solutions »', description: 'La page qui liste toutes les solutions.' },
  { id: 'solution', label: 'Page d’une solution', description: 'Les intitulés de la page détaillée d’une solution.' },
  { id: 'footer', label: 'Pied de page', description: 'Le bas de chaque page.' },
]

/** Texts that exist in the database but are no longer displayed anywhere on the site. */
export const HIDDEN_TEXT_KEYS = new Set(['footer.address', 'footer.phone'])

/** "Hero — Titre" → "Titre": the group already gives the context. */
export function shortTextLabel(label: string) {
  const parts = label.split(' — ')
  const last = parts[parts.length - 1]
  return last.charAt(0).toUpperCase() + last.slice(1)
}
