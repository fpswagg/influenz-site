import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'
import { EntityList, type EntityListItem } from '@/components/dashboard/EntityList'
import { PageHeader, buttonClasses } from '@/components/dashboard/ui/primitives'
import { IconLightbulb, IconPlus } from '@/components/dashboard/ui/icons'

export default async function SolutionsAdminPage() {
  const solutions = await prisma.solution.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    include: {
      translations: true,
      category: true,
      media: { orderBy: { sortOrder: 'asc' }, take: 1 },
    },
  })

  const items: EntityListItem[] = solutions.map((solution) => {
    const fr = solution.translations.find((item) => item.locale === 'fr')
    const en = solution.translations.find((item) => item.locale === 'en')
    const badges: EntityListItem['badges'] = []
    if (solution.featured) badges.push({ label: 'Sur l’accueil', tone: 'brand' })
    if (!en?.title || !en?.problem) badges.push({ label: 'Anglais à compléter', tone: 'warning' })
    return {
      id: solution.id,
      title: fr?.title || solution.slug,
      subtitle: solution.category.labelFr,
      thumb: solution.coverUrl || solution.media[0]?.url || null,
      fallback: solution.icon,
      published: solution.published,
      badges,
      editHref: `/dashboard/solutions/${solution.id}`,
      publicHref: `/solutions/${solution.slug}`,
      searchText: en?.title || '',
    }
  })

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Solutions"
        description="Les problématiques que vous résolvez pour vos clients : le problème, votre approche et les résultats obtenus."
        actions={
          <Link href="/dashboard/solutions/new" className={buttonClasses('primary')}>
            <IconPlus size={16} /> Nouvelle solution
          </Link>
        }
      />
      <EntityList
        kind="solution"
        items={items}
        noun="cette solution"
        newHref="/dashboard/solutions/new"
        newLabel="Créer la première solution"
        emptyTitle="Aucune solution pour le moment"
        emptyDescription="Décrivez les problèmes que vous savez résoudre pour vos clients."
        emptyIcon={<IconLightbulb size={22} />}
      />
    </div>
  )
}
