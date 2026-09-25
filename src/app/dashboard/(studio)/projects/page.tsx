import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'
import { EntityList, type EntityListItem } from '@/components/dashboard/EntityList'
import { PageHeader, buttonClasses } from '@/components/dashboard/ui/primitives'
import { IconBriefcase, IconPlus } from '@/components/dashboard/ui/icons'
import { mediaTypeOf, youtubeId } from '@/components/dashboard/media/media-utils'

function thumbnailFor(url?: string) {
  if (!url) return null
  if (mediaTypeOf(url) === 'image') return url
  const yt = youtubeId(url)
  return yt ? `https://img.youtube.com/vi/${yt}/mqdefault.jpg` : null
}

export default async function ProjectsAdminPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    include: {
      translations: true,
      category: true,
      media: { orderBy: { sortOrder: 'asc' }, take: 1 },
    },
  })

  const items: EntityListItem[] = projects.map((project) => {
    const fr = project.translations.find((item) => item.locale === 'fr')
    const en = project.translations.find((item) => item.locale === 'en')
    const badges: EntityListItem['badges'] = []
    if (project.featured) badges.push({ label: 'Sur l’accueil', tone: 'brand' })
    if (!en?.title || !en?.description) badges.push({ label: 'Anglais à compléter', tone: 'warning' })
    return {
      id: project.id,
      title: fr?.title || project.slug,
      subtitle: [project.category.labelFr, project.year, fr?.client].filter(Boolean).join(' · '),
      thumb: thumbnailFor(project.media[0]?.url),
      published: project.published,
      badges,
      editHref: `/dashboard/projects/${project.id}`,
      publicHref: `/projets/${project.slug}`,
      searchText: `${en?.title || ''} ${project.clientName}`,
    }
  })

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Projets"
        description="Vos réalisations, présentées comme des études de cas sur la page Projets et, pour une sélection, sur l’accueil."
        actions={
          <Link href="/dashboard/projects/new" className={buttonClasses('primary')}>
            <IconPlus size={16} /> Nouveau projet
          </Link>
        }
      />
      <EntityList
        kind="project"
        items={items}
        noun="ce projet"
        newHref="/dashboard/projects/new"
        newLabel="Créer le premier projet"
        emptyTitle="Aucun projet pour le moment"
        emptyDescription="Ajoutez vos réalisations pour les présenter à vos visiteurs."
        emptyIcon={<IconBriefcase size={22} />}
      />
    </div>
  )
}
