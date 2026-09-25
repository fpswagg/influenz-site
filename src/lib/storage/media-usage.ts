import { prisma } from '@/lib/db/prisma'

export interface MediaUsage {
  label: string
  href: string
}

/** Lists, for every file URL referenced in the database, where it is used on the site. */
export async function getMediaUsage(): Promise<Record<string, MediaUsage[]>> {
  const [projectMedia, solutionMedia, solutions, clients, settings] = await Promise.all([
    prisma.projectMedia.findMany({
      select: { url: true, project: { select: { id: true, translations: { where: { locale: 'fr' }, select: { title: true } } } } },
    }),
    prisma.solutionMedia.findMany({
      select: { url: true, solution: { select: { id: true, translations: { where: { locale: 'fr' }, select: { title: true } } } } },
    }),
    prisma.solution.findMany({
      where: { coverUrl: { not: null } },
      select: { id: true, coverUrl: true, translations: { where: { locale: 'fr' }, select: { title: true } } },
    }),
    prisma.client.findMany({ where: { imageUrl: { not: null } }, select: { id: true, name: true, imageUrl: true } }),
    prisma.siteConfig.findUnique({ where: { id: 'site' } }),
  ])

  const usage: Record<string, MediaUsage[]> = {}
  const add = (url: string | null | undefined, entry: MediaUsage) => {
    if (!url) return
    const list = (usage[url] ||= [])
    if (!list.some((item) => item.label === entry.label)) list.push(entry)
  }

  for (const item of projectMedia) {
    add(item.url, { label: `Projet « ${item.project.translations[0]?.title || 'sans titre'} »`, href: `/dashboard/projects/${item.project.id}` })
  }
  for (const item of solutionMedia) {
    add(item.url, { label: `Solution « ${item.solution.translations[0]?.title || 'sans titre'} »`, href: `/dashboard/solutions/${item.solution.id}` })
  }
  for (const item of solutions) {
    add(item.coverUrl, { label: `Solution « ${item.translations[0]?.title || 'sans titre'} »`, href: `/dashboard/solutions/${item.id}` })
  }
  for (const item of clients) {
    add(item.imageUrl, { label: `Partenaire « ${item.name} »`, href: `/dashboard/clients/${item.id}` })
  }
  if (settings) {
    add(settings.heroBannerUrl, { label: 'Bannière de la page d’accueil', href: '/dashboard/home' })
    add(settings.logoUrl, { label: 'Logo du site', href: '/dashboard/settings#logos' })
    add(settings.textLogoUrl, { label: 'Logo complet du site', href: '/dashboard/settings#logos' })
    add(settings.faviconUrl, { label: 'Icône de partage du site', href: '/dashboard/settings#logos' })
  }
  return usage
}
