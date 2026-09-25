import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/db/prisma'
import type { Translations } from '@/lib/i18n'
import type {
  AboutServiceData,
  ClientData,
  HomeSectionData,
  LabelOption,
  Language,
  ProjectData,
  SiteBundle,
  SiteSettings,
  SolutionData,
} from '@/lib/content/types'

export const SITE_CACHE_TAG = 'site-content'

function emptyTranslations(): Translations {
  return {
    nav: { home: '', about: '', projects: '', solutions: '', contact: '' },
    hero: { label: '', title: '', subtitle: '', cta: '', ctaSecondary: '' },
    trustedBy: { title: '', subtitle: '' },
    projects: { title: '', subtitle: '', cta: '' },
    about: {
      title: '',
      subtitle: '',
      whoWeAre: { title: '', text1: '', text2: '' },
      ourPurpose: { title: '', text1: '', text2: '' },
      ourMission: { title: '', text: '', points: [] },
      services: { title: '', items: [] },
      location: { title: '', city: '', country: '' },
    },
    footer: { tagline: '', contact: '', follow: '', rights: '', address: '', phone: '', legalInfo: '' },
    contact: {
      title: '',
      name: '',
      enterprise: '',
      enterpriseOptional: '',
      email: '',
      message: '',
      send: '',
      sending: '',
      success: '',
      error: '',
      placeholders: { name: '', enterprise: '', email: '', message: '' },
    },
    project: {
      back: '',
      backSimple: '',
      client: '',
      year: '',
      category: '',
      challenge: '',
      solution: '',
      services: '',
      results: '',
      similar: '',
      contactUs: '',
      notFound: '',
      backToProjects: '',
    },
    projectsPage: { title: '', subtitle: '', back: '', noProjects: '', viewProject: '' },
    solutions: { title: '', subtitle: '', cta: '', viewAll: '' },
    solutionsPage: { title: '', subtitle: '', back: '', noSolutions: '', viewSolution: '' },
    solution: {
      back: '',
      backSimple: '',
      problem: '',
      approach: '',
      steps: '',
      results: '',
      contactUs: '',
      interested: '',
      notFound: '',
      backToSolutions: '',
    },
  }
}

function setPath(target: Record<string, unknown>, path: string, value: unknown) {
  const parts = path.split('.')
  let cursor: Record<string, unknown> = target
  for (let i = 0; i < parts.length - 1; i += 1) {
    const part = parts[i]
    const next = cursor[part]
    if (!next || typeof next !== 'object') {
      cursor[part] = {}
    }
    cursor = cursor[part] as Record<string, unknown>
  }
  cursor[parts[parts.length - 1]] = value
}

function parseList(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function pickLocale<T extends { locale: string }>(items: T[], locale: Language) {
  return items.find((item) => item.locale === locale)
}

function mapSettings(config: NonNullable<Awaited<ReturnType<typeof prisma.siteConfig.findUnique>>>): SiteSettings {
  return {
    siteName: config.siteName,
    logoUrl: config.logoUrl || '/images/logo.png',
    textLogoUrl: config.textLogoUrl || '/images/text-logo.png',
    faviconUrl: config.faviconUrl || '/images/logo.png',
    heroBannerUrl: config.heroBannerUrl || '/images/banner.jpg',
    seoTitle: { fr: config.seoTitleFr, en: config.seoTitleEn },
    seoDescription: { fr: config.seoDescriptionFr, en: config.seoDescriptionEn },
    email: config.email,
    phone: config.phone,
    phoneSecondary: config.phoneSecondary || '',
    address: config.address,
    postalBox: config.postalBox || '',
    legalForm: config.legalForm || '',
    niu: config.niu || '',
    rccm: config.rccm || '',
    linkedinUrl: config.linkedinUrl || '',
    twitterUrl: config.twitterUrl || '',
    instagramUrl: config.instagramUrl || '',
    mapsEmbedUrl: config.mapsEmbedUrl || '',
    contactIntro: {
      fr: config.contactIntroFr || '',
      en: config.contactIntroEn || '',
    },
    locationBlurb: {
      fr: config.locationBlurbFr || '',
      en: config.locationBlurbEn || '',
    },
  }
}

async function loadSiteBundle(): Promise<SiteBundle> {
  const [
    config,
    copyEntries,
    homeSections,
    projectCategories,
    solutionCategories,
    projectServices,
    projects,
    solutions,
    clients,
    aboutServices,
  ] = await Promise.all([
    prisma.siteConfig.findUnique({ where: { id: 'site' } }),
    prisma.copyEntry.findMany({ orderBy: [{ group: 'asc' }, { sortOrder: 'asc' }] }),
    prisma.homeSection.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.projectCategory.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.solutionCategory.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.projectService.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.project.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        translations: true,
        media: { orderBy: { sortOrder: 'asc' } },
        services: { orderBy: { sortOrder: 'asc' }, include: { service: true } },
        category: true,
      },
    }),
    prisma.solution.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        translations: true,
        media: { orderBy: { sortOrder: 'asc' } },
        links: { orderBy: { sortOrder: 'asc' } },
        category: true,
      },
    }),
    prisma.client.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.aboutService.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])

  const copyFr = emptyTranslations()
  const copyEn = emptyTranslations()
  const extras = {
    learnMore: { fr: 'En savoir plus', en: 'Learn more' },
    viewAllProjects: { fr: 'Voir tous les projets', en: 'View all projects' },
    trustedByHoverHint: { fr: '', en: '' },
    trustedByPreview: { fr: '', en: '' },
    trustedByPinned: { fr: '', en: '' },
    trustedByAction: { fr: '', en: '' },
    trustedByClose: { fr: '', en: '' },
  }

  for (const entry of copyEntries) {
    const frValue = entry.kind === 'LIST' ? parseList(entry.valueFr) : entry.valueFr
    const enValue = entry.kind === 'LIST' ? parseList(entry.valueEn) : entry.valueEn

    if (entry.key === 'projects.viewAll') {
      extras.viewAllProjects = { fr: entry.valueFr, en: entry.valueEn }
    } else if (entry.key === 'solution.learnMore') {
      extras.learnMore = { fr: entry.valueFr, en: entry.valueEn }
    } else if (entry.key === 'trustedBy.hoverHint') {
      extras.trustedByHoverHint = { fr: entry.valueFr, en: entry.valueEn }
    } else if (entry.key === 'trustedBy.preview') {
      extras.trustedByPreview = { fr: entry.valueFr, en: entry.valueEn }
    } else if (entry.key === 'trustedBy.pinned') {
      extras.trustedByPinned = { fr: entry.valueFr, en: entry.valueEn }
    } else if (entry.key === 'trustedBy.action') {
      extras.trustedByAction = { fr: entry.valueFr, en: entry.valueEn }
    } else if (entry.key === 'trustedBy.close') {
      extras.trustedByClose = { fr: entry.valueFr, en: entry.valueEn }
    } else {
      setPath(copyFr as unknown as Record<string, unknown>, entry.key, frValue)
      setPath(copyEn as unknown as Record<string, unknown>, entry.key, enValue)
    }
  }

  copyFr.about.services.items = aboutServices.map((item) => ({
    title: item.titleFr,
    description: item.descriptionFr,
  }))
  copyEn.about.services.items = aboutServices.map((item) => ({
    title: item.titleEn,
    description: item.descriptionEn,
  }))

  const settings: SiteSettings = config
    ? mapSettings(config)
    : {
        siteName: '',
        logoUrl: '/images/logo.png',
        textLogoUrl: '/images/text-logo.png',
        faviconUrl: '/images/logo.png',
        heroBannerUrl: '/images/banner.jpg',
        seoTitle: { fr: '', en: '' },
        seoDescription: { fr: '', en: '' },
        email: '',
        phone: '',
        phoneSecondary: '',
        address: '',
        postalBox: '',
        legalForm: '',
        niu: '',
        rccm: '',
        linkedinUrl: '',
        twitterUrl: '',
        instagramUrl: '',
        mapsEmbedUrl: '',
        contactIntro: { fr: '', en: '' },
        locationBlurb: { fr: '', en: '' },
      }

  const mappedProjects: ProjectData[] = projects.map((project) => {
    const fr = pickLocale(project.translations, 'fr')
    const en = pickLocale(project.translations, 'en')
    return {
      id: project.id,
      slug: project.slug,
      categoryId: project.category.slug,
      year: project.year,
      client: project.clientName,
      serviceIds: project.services.map((item) => item.service.slug),
      media: project.media.map((item) => item.url),
      featured: project.featured,
      published: project.published,
      link:
        project.linkUrl
          ? {
              url: project.linkUrl,
              labels: {
                fr: project.linkLabelFr || project.linkUrl,
                en: project.linkLabelEn || project.linkLabelFr || project.linkUrl,
              },
            }
          : undefined,
      translations: {
        fr: {
          title: fr?.title || '',
          description: fr?.description || '',
          longDescription: fr?.longDescription || '',
          challenge: fr?.challenge || '',
          solution: fr?.solution || '',
          results: fr?.results || [],
          client: fr?.client || project.clientName,
        },
        en: {
          title: en?.title || '',
          description: en?.description || '',
          longDescription: en?.longDescription || '',
          challenge: en?.challenge || '',
          solution: en?.solution || '',
          results: en?.results || [],
          client: en?.client || project.clientName,
        },
      },
    }
  })

  const mappedSolutions: SolutionData[] = solutions.map((solution) => {
    const fr = pickLocale(solution.translations, 'fr')
    const en = pickLocale(solution.translations, 'en')
    const images = solution.media.map((item) => item.url)
    return {
      id: solution.id,
      slug: solution.slug,
      categoryId: solution.category.slug,
      icon: solution.icon,
      featured: solution.featured,
      published: solution.published,
      image: solution.coverUrl || images[0],
      images,
      links: solution.links.map((link) => ({
        url: link.url,
        labels: { fr: link.labelFr, en: link.labelEn },
      })),
      translations: {
        fr: {
          title: fr?.title || '',
          problem: fr?.problem || '',
          approach: fr?.approach || '',
          steps: fr?.steps || [],
          results: fr?.results || [],
          callToAction: fr?.callToAction || '',
        },
        en: {
          title: en?.title || '',
          problem: en?.problem || '',
          approach: en?.approach || '',
          steps: en?.steps || [],
          results: en?.results || [],
          callToAction: en?.callToAction || '',
        },
      },
    }
  })

  const mappedClients: ClientData[] = clients.map((client) => ({
    id: client.id,
    name: client.name,
    logo: client.logoLetters,
    image: client.imageUrl || undefined,
    description: {
      fr: client.descriptionFr,
      en: client.descriptionEn,
    },
  }))

  const mapLabels = (items: { slug: string; labelFr: string; labelEn: string; isAll?: boolean }[]): LabelOption[] =>
    items.map((item) => ({
      id: item.slug,
      slug: item.slug,
      fr: item.labelFr,
      en: item.labelEn,
      isAll: item.isAll,
    }))

  const mappedHome: HomeSectionData[] = homeSections.map((section) => ({
    id: section.id,
    key: section.key,
    component: section.component,
    enabled: section.enabled,
    showInNav: section.showInNav,
    sortOrder: section.sortOrder,
    label: { fr: section.labelFr, en: section.labelEn },
    eyebrow: { fr: section.eyebrowFr || '', en: section.eyebrowEn || '' },
  }))

  const mappedAbout: AboutServiceData[] = aboutServices.map((item) => ({
    id: item.id,
    title: { fr: item.titleFr, en: item.titleEn },
    description: { fr: item.descriptionFr, en: item.descriptionEn },
  }))

  return {
    settings,
    copy: { fr: copyFr, en: copyEn },
    extras,
    homeSections: mappedHome,
    projects: mappedProjects,
    solutions: mappedSolutions,
    clients: mappedClients,
    categories: mapLabels(projectCategories),
    solutionCategories: mapLabels(solutionCategories),
    services: mapLabels(projectServices),
    aboutServices: mappedAbout,
  }
}

export const getSiteBundle = unstable_cache(loadSiteBundle, ['site-bundle'], {
  tags: [SITE_CACHE_TAG],
  revalidate: 60,
})

export async function getProjectSlugs() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    select: { slug: true },
  })
  return projects.map((project) => project.slug)
}

export async function getSolutionSlugs() {
  const solutions = await prisma.solution.findMany({
    where: { published: true },
    select: { slug: true },
  })
  return solutions.map((solution) => solution.slug)
}
