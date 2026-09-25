import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'
import { EntityList, type EntityListItem } from '@/components/dashboard/EntityList'
import { PageHeader, buttonClasses } from '@/components/dashboard/ui/primitives'
import { IconHandshake, IconPlus } from '@/components/dashboard/ui/icons'

export default async function ClientsAdminPage() {
  const clients = await prisma.client.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] })

  const items: EntityListItem[] = clients.map((client) => ({
    id: client.id,
    title: client.name,
    subtitle: client.descriptionFr ? client.descriptionFr.slice(0, 90) + (client.descriptionFr.length > 90 ? '…' : '') : 'Pas de description',
    thumb: client.imageUrl,
    fallback: client.logoLetters,
    published: client.published,
    badges: client.descriptionFr && !client.descriptionEn ? [{ label: 'Anglais à compléter', tone: 'warning' }] : [],
    editHref: `/dashboard/clients/${client.id}`,
  }))

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Partenaires"
        description="Les organisations affichées dans la section « Ils nous font confiance » de la page d’accueil."
        actions={
          <Link href="/dashboard/clients/new" className={buttonClasses('primary')}>
            <IconPlus size={16} /> Nouveau partenaire
          </Link>
        }
      />
      <EntityList
        kind="client"
        items={items}
        noun="ce partenaire"
        newHref="/dashboard/clients/new"
        newLabel="Ajouter le premier partenaire"
        emptyTitle="Aucun partenaire pour le moment"
        emptyDescription="Ajoutez les logos des organisations qui vous font confiance."
        emptyIcon={<IconHandshake size={22} />}
      />
    </div>
  )
}
