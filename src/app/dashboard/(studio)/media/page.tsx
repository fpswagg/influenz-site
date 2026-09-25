import { MediaLibrary } from '@/components/dashboard/media/MediaLibrary'
import { PageHeader } from '@/components/dashboard/ui/primitives'

export default function MediaPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Médiathèque"
        description="Toutes les images, vidéos et documents du site. Envoyez-les depuis votre ordinateur ou importez-les depuis un lien : ils pourront ensuite être choisis dans n’importe quelle fiche."
      />
      <MediaLibrary />
    </div>
  )
}
