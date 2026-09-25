import { prisma } from '@/lib/db/prisma'
import { saveHomePageAction } from '@/app/dashboard/actions'
import { DashboardForm } from '@/components/dashboard/form/DashboardForm'
import { HomePageEditor, type HomeCopyEntry } from '@/components/dashboard/HomePageEditor'
import { HOME_SECTIONS } from '@/lib/dashboard/home-config'
import { Callout } from '@/components/dashboard/ui/primitives'
import { IconInfo } from '@/components/dashboard/ui/icons'

export default async function HomeSectionsPage() {
  const copyKeys = Object.values(HOME_SECTIONS).flatMap((section) =>
    section.blocks.flatMap((block) => block.items.flatMap((item) => (item.type === 'copy' ? [item.key] : [])))
  )

  const [sections, copyEntries, settings, aboutServices] = await Promise.all([
    prisma.homeSection.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.copyEntry.findMany({ where: { key: { in: copyKeys } } }),
    prisma.siteConfig.findUnique({ where: { id: 'site' } }),
    prisma.aboutService.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])

  const copy: Record<string, HomeCopyEntry> = Object.fromEntries(
    copyEntries.map((entry) => [entry.key, { kind: entry.kind, valueFr: entry.valueFr, valueEn: entry.valueEn }])
  )

  return (
    <DashboardForm
      action={saveHomePageAction}
      title="Page d’accueil"
      subtitle="Ordre, visibilité et contenu de chaque section"
    >
      <div className="mb-6">
        <Callout icon={<IconInfo size={16} />}>
          Les sections apparaissent sur le site dans l’ordre ci-dessous. Ouvrez une section pour modifier ses textes et images,
          utilisez les flèches pour la déplacer et l’interrupteur pour la masquer. Pensez à <strong>enregistrer</strong>.
        </Callout>
      </div>
      <HomePageEditor
        sections={sections.map((section) => ({
          id: section.id,
          key: section.key,
          enabled: section.enabled,
          showInNav: section.showInNav,
          labelFr: section.labelFr,
          labelEn: section.labelEn,
          eyebrowFr: section.eyebrowFr,
          eyebrowEn: section.eyebrowEn,
        }))}
        copy={copy}
        settings={{
          heroBannerUrl: settings?.heroBannerUrl || '/images/banner.jpg',
          contactIntroFr: settings?.contactIntroFr || '',
          contactIntroEn: settings?.contactIntroEn || '',
          locationBlurbFr: settings?.locationBlurbFr || '',
          locationBlurbEn: settings?.locationBlurbEn || '',
        }}
        aboutServices={aboutServices.map((item) => ({
          id: item.id,
          values: {
            titleFr: item.titleFr,
            titleEn: item.titleEn,
            descriptionFr: item.descriptionFr,
            descriptionEn: item.descriptionEn,
          },
        }))}
      />
    </DashboardForm>
  )
}
