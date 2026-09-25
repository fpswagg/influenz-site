'use server'

import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import { requireDashboardAuth } from '@/lib/auth/guard'
import { prisma } from '@/lib/db/prisma'
import { revalidateSite } from '@/lib/content/revalidate'
import { slugify } from '@/lib/content/media'
import { detectMediaKind } from '@/lib/storage/sastorage'
import type { ActionResult } from '@/lib/dashboard/action-result'

export type ListKind = 'project' | 'solution' | 'client'

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

function text(formData: FormData, name: string) {
  return String(formData.get(name) ?? '').trim()
}

function nullable(formData: FormData, name: string) {
  return text(formData, name) || null
}

function bool(formData: FormData, name: string) {
  return formData.getAll(name).map(String).includes('true')
}

function lines(formData: FormData, name: string) {
  return text(formData, name)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function all(formData: FormData, name: string) {
  return formData.getAll(name).map((value) => String(value).trim())
}

function refreshSite() {
  revalidateSite()
  revalidatePath('/', 'layout')
}

class UserError extends Error {}

function fail(message: string): never {
  throw new UserError(message)
}

async function run(task: () => Promise<ActionResult>): Promise<ActionResult> {
  try {
    await requireDashboardAuth()
    return await task()
  } catch (error) {
    if (error instanceof UserError) return { ok: false, error: error.message }
    if (error instanceof Error && error.message === 'Unauthorized') {
      return { ok: false, error: 'Votre session a expiré. Rechargez la page et reconnectez-vous.' }
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') return { ok: false, error: 'Un élément avec la même adresse de page existe déjà.' }
      if (error.code === 'P2003') return { ok: false, error: 'Cet élément est encore utilisé ailleurs sur le site.' }
      if (error.code === 'P2025') return { ok: false, error: 'Cet élément n’existe plus. Rechargez la page.' }
    }
    console.error('[dashboard action]', error)
    return { ok: false, error: 'Une erreur inattendue est survenue. Réessayez dans un instant.' }
  }
}

async function uniqueSlug(base: string, taken: (slug: string) => Promise<boolean>) {
  const root = base || 'element'
  let slug = root
  let suffix = 2
  while (await taken(slug)) {
    slug = `${root}-${suffix}`
    suffix += 1
  }
  return slug
}

function normalizeUrl(value: string) {
  if (!value) return null
  if (/^(https?:|mailto:|tel:|\/)/i.test(value)) return value
  return `https://${value}`
}

/** Accepts either the Google Maps `<iframe …>` snippet or its bare `src` URL. */
function extractMapsSrc(value: string) {
  if (!value) return null
  const match = value.match(/src=["']([^"']+)["']/i)
  return (match ? match[1] : value).trim() || null
}

function initialsOf(name: string) {
  return name
    .split(/[\s\-_.]+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

/* -------------------------------------------------------------------------- */
/*                               Site settings                                */
/* -------------------------------------------------------------------------- */

const REQUIRED_SETTINGS = ['siteName', 'email', 'phone', 'address', 'seoTitleFr', 'seoTitleEn', 'seoDescriptionFr', 'seoDescriptionEn'] as const
const OPTIONAL_SETTINGS = [
  'logoUrl',
  'textLogoUrl',
  'faviconUrl',
  'heroBannerUrl',
  'phoneSecondary',
  'postalBox',
  'legalForm',
  'niu',
  'rccm',
  'contactIntroFr',
  'contactIntroEn',
  'locationBlurbFr',
  'locationBlurbEn',
] as const
const URL_SETTINGS = ['linkedinUrl', 'twitterUrl', 'instagramUrl'] as const

/** Builds an update only from the settings fields present in the form, so several pages can share SiteConfig. */
function settingsFromForm(formData: FormData) {
  const data: Record<string, string | null> = {}
  for (const key of REQUIRED_SETTINGS) if (formData.has(key)) data[key] = text(formData, key)
  for (const key of OPTIONAL_SETTINGS) if (formData.has(key)) data[key] = nullable(formData, key)
  for (const key of URL_SETTINGS) if (formData.has(key)) data[key] = normalizeUrl(text(formData, key))
  if (formData.has('mapsEmbedUrl')) data.mapsEmbedUrl = extractMapsSrc(text(formData, 'mapsEmbedUrl'))

  if ('siteName' in data && !data.siteName) fail('Le nom du site est obligatoire.')
  if ('email' in data && data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    fail('L’adresse e-mail ne semble pas valide.')
  }
  return data
}

function upsertSettings(data: Record<string, string | null>) {
  return prisma.siteConfig.upsert({
    where: { id: 'site' },
    update: data,
    create: {
      id: 'site',
      siteName: 'iNFLUENZ',
      seoTitleFr: 'iNFLUENZ',
      seoTitleEn: 'iNFLUENZ',
      seoDescriptionFr: '',
      seoDescriptionEn: '',
      email: '',
      phone: '',
      address: '',
      ...(data as Partial<Prisma.SiteConfigCreateInput>),
    },
  })
}

export async function saveSettingsAction(formData: FormData): Promise<ActionResult> {
  return run(async () => {
    await upsertSettings(settingsFromForm(formData))
    refreshSite()
    return { ok: true, message: 'Informations du site enregistrées' }
  })
}

/* -------------------------------------------------------------------------- */
/*                              Texts (copy)                                  */
/* -------------------------------------------------------------------------- */

function copyOperations(formData: FormData) {
  return all(formData, 'copy.key').map((key) =>
    prisma.copyEntry.updateMany({
      where: { key },
      data: {
        valueFr: text(formData, `copy__${key}__Fr`),
        valueEn: text(formData, `copy__${key}__En`),
      },
    })
  )
}

export async function saveTextsAction(formData: FormData): Promise<ActionResult> {
  return run(async () => {
    await prisma.$transaction(copyOperations(formData))
    refreshSite()
    return { ok: true, message: 'Textes enregistrés' }
  })
}

/* -------------------------------------------------------------------------- */
/*                               Editable rows                                */
/* -------------------------------------------------------------------------- */

interface Row {
  id: string
  values: Record<string, string>
}

/** Reads rows posted by <RowsEditor>: `${prefix}.id` + one input per field, in display order. */
function readRows(formData: FormData, prefix: string, fields: string[]) {
  const ids = all(formData, `${prefix}.id`)
  const columns = Object.fromEntries(fields.map((field) => [field, all(formData, `${prefix}.${field}`)]))
  const rows: Row[] = ids.map((id, index) => ({
    id,
    values: Object.fromEntries(fields.map((field) => [field, columns[field][index] ?? ''])),
  }))
  return { rows, deleted: all(formData, `${prefix}.deleted`).filter(Boolean) }
}

/* -------------------------------------------------------------------------- */
/*                                  Home page                                 */
/* -------------------------------------------------------------------------- */

export async function saveHomePageAction(formData: FormData): Promise<ActionResult> {
  return run(async () => {
    const operations: Prisma.PrismaPromise<unknown>[] = []

    all(formData, 'section.id').forEach((id, index) => {
      const labelFr = text(formData, `section.${id}.labelFr`)
      if (!labelFr) fail('Chaque section doit avoir un nom dans le menu (en français).')
      operations.push(
        prisma.homeSection.update({
          where: { id },
          data: {
            sortOrder: index + 1,
            enabled: bool(formData, `section.${id}.enabled`),
            showInNav: bool(formData, `section.${id}.showInNav`),
            labelFr,
            labelEn: text(formData, `section.${id}.labelEn`) || labelFr,
            ...(formData.has(`section.${id}.eyebrowFr`)
              ? {
                  eyebrowFr: nullable(formData, `section.${id}.eyebrowFr`),
                  eyebrowEn: nullable(formData, `section.${id}.eyebrowEn`),
                }
              : {}),
          },
        })
      )
    })

    operations.push(...copyOperations(formData))

    const settings = settingsFromForm(formData)
    if (Object.keys(settings).length) operations.push(upsertSettings(settings))

    if (formData.has('about.present')) {
      const { rows, deleted } = readRows(formData, 'about', ['titleFr', 'titleEn', 'descriptionFr', 'descriptionEn'])
      if (deleted.length) operations.push(prisma.aboutService.deleteMany({ where: { id: { in: deleted } } }))
      rows.forEach((row, index) => {
        if (!row.values.titleFr) fail('Chaque domaine d’intervention doit avoir un titre en français.')
        const data = {
          titleFr: row.values.titleFr,
          titleEn: row.values.titleEn || row.values.titleFr,
          descriptionFr: row.values.descriptionFr,
          descriptionEn: row.values.descriptionEn,
          sortOrder: index,
        }
        operations.push(
          row.id ? prisma.aboutService.update({ where: { id: row.id }, data }) : prisma.aboutService.create({ data })
        )
      })
    }

    await prisma.$transaction(operations)
    refreshSite()
    return { ok: true, message: 'Page d’accueil enregistrée' }
  })
}

/* -------------------------------------------------------------------------- */
/*                                  Projects                                  */
/* -------------------------------------------------------------------------- */

export async function saveProjectAction(formData: FormData): Promise<ActionResult> {
  return run(async () => {
    const id = text(formData, 'id')
    const titleFr = text(formData, 'titleFr')
    if (!titleFr) fail('Le titre du projet (en français) est obligatoire.')

    const category = await prisma.projectCategory.findUnique({ where: { id: text(formData, 'categoryId') } })
    if (!category || category.isAll) fail('Choisissez une catégorie pour ce projet.')

    const slug = await uniqueSlug(slugify(text(formData, 'slug') || titleFr), async (candidate) =>
      Boolean(await prisma.project.findFirst({ where: { slug: candidate, ...(id ? { NOT: { id } } : {}) }, select: { id: true } }))
    )

    const serviceIds = all(formData, 'serviceIds')
    const services = await prisma.projectService.findMany({ where: { id: { in: serviceIds } }, select: { id: true } })
    const media = lines(formData, 'media')
    const clientFr = text(formData, 'clientFr')
    const clientEn = text(formData, 'clientEn') || clientFr

    const fields = {
      slug,
      year: text(formData, 'year'),
      clientName: clientFr || clientEn,
      categoryId: category.id,
      linkUrl: normalizeUrl(text(formData, 'linkUrl')),
      linkLabelFr: nullable(formData, 'linkLabelFr'),
      linkLabelEn: nullable(formData, 'linkLabelEn'),
      published: bool(formData, 'published'),
      featured: bool(formData, 'featured'),
    }

    const nested = {
      translations: {
        create: (['fr', 'en'] as const).map((locale) => {
          const suffix = locale === 'fr' ? 'Fr' : 'En'
          return {
            locale,
            title: text(formData, `title${suffix}`) || titleFr,
            description: text(formData, `description${suffix}`),
            longDescription: text(formData, `longDescription${suffix}`),
            challenge: text(formData, `challenge${suffix}`),
            solution: text(formData, `solution${suffix}`),
            client: locale === 'fr' ? clientFr : clientEn,
            results: lines(formData, `results${suffix}`),
          }
        }),
      },
      media: {
        create: media.map((url, index) => ({ url, kind: detectMediaKind(url), sortOrder: index })),
      },
      services: {
        create: serviceIds
          .filter((serviceId) => services.some((service) => service.id === serviceId))
          .map((serviceId, index) => ({ serviceId, sortOrder: index })),
      },
    }

    if (id) {
      await prisma.project.update({
        where: { id },
        data: {
          ...fields,
          translations: { deleteMany: {}, ...nested.translations },
          media: { deleteMany: {}, ...nested.media },
          services: { deleteMany: {}, ...nested.services },
        },
      })
      refreshSite()
      return { ok: true, message: 'Projet enregistré' }
    }

    const last = await prisma.project.aggregate({ _max: { sortOrder: true } })
    const created = await prisma.project.create({
      data: { ...fields, sortOrder: (last._max.sortOrder ?? 0) + 1, ...nested },
    })
    refreshSite()
    return { ok: true, redirectTo: `/dashboard/projects/${created.id}?created=1` }
  })
}

/* -------------------------------------------------------------------------- */
/*                                  Solutions                                 */
/* -------------------------------------------------------------------------- */

export async function saveSolutionAction(formData: FormData): Promise<ActionResult> {
  return run(async () => {
    const id = text(formData, 'id')
    const titleFr = text(formData, 'titleFr')
    if (!titleFr) fail('Le titre de la solution (en français) est obligatoire.')

    const category = await prisma.solutionCategory.findUnique({ where: { id: text(formData, 'categoryId') } })
    if (!category || category.isAll) fail('Choisissez une catégorie pour cette solution.')

    const slug = await uniqueSlug(slugify(text(formData, 'slug') || titleFr), async (candidate) =>
      Boolean(await prisma.solution.findFirst({ where: { slug: candidate, ...(id ? { NOT: { id } } : {}) }, select: { id: true } }))
    )

    const images = lines(formData, 'images')
    const { rows: linkRows } = readRows(formData, 'link', ['url', 'labelFr', 'labelEn'])
    const links = linkRows
      .map((row, index) => ({
        url: normalizeUrl(row.values.url) || '',
        labelFr: row.values.labelFr || row.values.url,
        labelEn: row.values.labelEn || row.values.labelFr || row.values.url,
        sortOrder: index,
      }))
      .filter((link) => link.url)

    const fields = {
      slug,
      categoryId: category.id,
      icon: text(formData, 'icon'),
      featured: bool(formData, 'featured'),
      published: bool(formData, 'published'),
      coverUrl: nullable(formData, 'coverUrl'),
    }

    const nested = {
      translations: {
        create: (['fr', 'en'] as const).map((locale) => {
          const suffix = locale === 'fr' ? 'Fr' : 'En'
          return {
            locale,
            title: text(formData, `title${suffix}`) || titleFr,
            problem: text(formData, `problem${suffix}`),
            approach: text(formData, `approach${suffix}`),
            callToAction: text(formData, `callToAction${suffix}`),
            steps: lines(formData, `steps${suffix}`),
            results: lines(formData, `results${suffix}`),
          }
        }),
      },
      media: { create: images.map((url, index) => ({ url, kind: detectMediaKind(url), sortOrder: index })) },
      links: { create: links },
    }

    if (id) {
      await prisma.solution.update({
        where: { id },
        data: {
          ...fields,
          translations: { deleteMany: {}, ...nested.translations },
          media: { deleteMany: {}, ...nested.media },
          links: { deleteMany: {}, ...nested.links },
        },
      })
      refreshSite()
      return { ok: true, message: 'Solution enregistrée' }
    }

    const last = await prisma.solution.aggregate({ _max: { sortOrder: true } })
    const created = await prisma.solution.create({
      data: { ...fields, sortOrder: (last._max.sortOrder ?? 0) + 1, ...nested },
    })
    refreshSite()
    return { ok: true, redirectTo: `/dashboard/solutions/${created.id}?created=1` }
  })
}

/* -------------------------------------------------------------------------- */
/*                                   Clients                                  */
/* -------------------------------------------------------------------------- */

export async function saveClientAction(formData: FormData): Promise<ActionResult> {
  return run(async () => {
    const id = text(formData, 'id')
    const name = text(formData, 'name')
    if (!name) fail('Le nom du partenaire est obligatoire.')

    const data = {
      name,
      logoLetters: text(formData, 'logoLetters').toUpperCase() || initialsOf(name),
      imageUrl: nullable(formData, 'imageUrl'),
      descriptionFr: text(formData, 'descriptionFr'),
      descriptionEn: text(formData, 'descriptionEn'),
      published: bool(formData, 'published'),
    }

    if (id) {
      await prisma.client.update({ where: { id }, data })
      refreshSite()
      return { ok: true, message: 'Partenaire enregistré' }
    }

    const last = await prisma.client.aggregate({ _max: { sortOrder: true } })
    const created = await prisma.client.create({ data: { ...data, sortOrder: (last._max.sortOrder ?? 0) + 1 } })
    refreshSite()
    return { ok: true, redirectTo: `/dashboard/clients/${created.id}?created=1` }
  })
}

/* -------------------------------------------------------------------------- */
/*                         List actions (order, status…)                      */
/* -------------------------------------------------------------------------- */

const LIST_LABELS: Record<ListKind, { deleted: string }> = {
  project: { deleted: 'Projet supprimé' },
  solution: { deleted: 'Solution supprimée' },
  client: { deleted: 'Partenaire supprimé' },
}

export async function reorderItemsAction(kind: ListKind, ids: string[]): Promise<ActionResult> {
  return run(async () => {
    const operations = ids.map((id, index) => {
      if (kind === 'project') return prisma.project.update({ where: { id }, data: { sortOrder: index } })
      if (kind === 'solution') return prisma.solution.update({ where: { id }, data: { sortOrder: index } })
      return prisma.client.update({ where: { id }, data: { sortOrder: index } })
    })
    await prisma.$transaction(operations)
    refreshSite()
    return { ok: true, message: 'Ordre mis à jour' }
  })
}

export async function setPublishedAction(kind: ListKind, id: string, published: boolean): Promise<ActionResult> {
  return run(async () => {
    if (kind === 'project') await prisma.project.update({ where: { id }, data: { published } })
    else if (kind === 'solution') await prisma.solution.update({ where: { id }, data: { published } })
    else await prisma.client.update({ where: { id }, data: { published } })
    refreshSite()
    return { ok: true, message: published ? 'Mis en ligne' : 'Passé en brouillon (masqué du site)' }
  })
}

export async function deleteItemAction(kind: ListKind, id: string): Promise<ActionResult> {
  return run(async () => {
    if (kind === 'project') await prisma.project.delete({ where: { id } })
    else if (kind === 'solution') await prisma.solution.delete({ where: { id } })
    else await prisma.client.delete({ where: { id } })
    refreshSite()
    return { ok: true, message: LIST_LABELS[kind].deleted }
  })
}

/* -------------------------------------------------------------------------- */
/*                                 Categories                                 */
/* -------------------------------------------------------------------------- */

type CategoryType = 'projectCategory' | 'solutionCategory' | 'projectService'

const CATEGORY_TYPES: CategoryType[] = ['projectCategory', 'solutionCategory', 'projectService']

async function categoryUsage(type: CategoryType, id: string) {
  if (type === 'projectCategory') return prisma.project.count({ where: { categoryId: id } })
  if (type === 'solutionCategory') return prisma.solution.count({ where: { categoryId: id } })
  return 0
}

async function findCategory(type: CategoryType, id: string) {
  if (type === 'projectCategory') return prisma.projectCategory.findUnique({ where: { id } })
  if (type === 'solutionCategory') return prisma.solutionCategory.findUnique({ where: { id } })
  const service = await prisma.projectService.findUnique({ where: { id } })
  return service ? { ...service, isAll: false } : null
}

async function slugTaken(type: CategoryType, slug: string) {
  if (type === 'projectCategory') return Boolean(await prisma.projectCategory.findUnique({ where: { slug } }))
  if (type === 'solutionCategory') return Boolean(await prisma.solutionCategory.findUnique({ where: { slug } }))
  return Boolean(await prisma.projectService.findUnique({ where: { slug } }))
}

export async function saveCategoriesAction(formData: FormData): Promise<ActionResult> {
  return run(async () => {
    const operations: Prisma.PrismaPromise<unknown>[] = []
    const reserved = new Set<string>()

    for (const type of CATEGORY_TYPES) {
      if (!formData.has(`${type}.present`)) continue
      const { rows, deleted } = readRows(formData, type, ['labelFr', 'labelEn'])

      for (const id of deleted) {
        const existing = await findCategory(type, id)
        if (!existing) continue
        if (existing.isAll) fail(`« ${existing.labelFr} » est le filtre général et ne peut pas être supprimé.`)
        const used = await categoryUsage(type, id)
        if (used > 0) {
          fail(`Impossible de supprimer « ${existing.labelFr} » : ${used} élément(s) l’utilisent encore. Changez d’abord leur catégorie.`)
        }
        if (type === 'projectCategory') operations.push(prisma.projectCategory.delete({ where: { id } }))
        if (type === 'solutionCategory') operations.push(prisma.solutionCategory.delete({ where: { id } }))
        if (type === 'projectService') operations.push(prisma.projectService.delete({ where: { id } }))
      }

      for (const [index, row] of rows.entries()) {
        const labelFr = row.values.labelFr
        if (!labelFr) fail('Chaque catégorie doit avoir un nom en français.')
        const labels = { labelFr, labelEn: row.values.labelEn || labelFr, sortOrder: index }

        if (row.id) {
          if (type === 'projectCategory') operations.push(prisma.projectCategory.update({ where: { id: row.id }, data: labels }))
          if (type === 'solutionCategory') operations.push(prisma.solutionCategory.update({ where: { id: row.id }, data: labels }))
          if (type === 'projectService') operations.push(prisma.projectService.update({ where: { id: row.id }, data: labels }))
          continue
        }

        const slug = await uniqueSlug(slugify(labelFr), async (candidate) => reserved.has(`${type}:${candidate}`) || slugTaken(type, candidate))
        reserved.add(`${type}:${slug}`)
        if (type === 'projectCategory') operations.push(prisma.projectCategory.create({ data: { ...labels, slug } }))
        if (type === 'solutionCategory') operations.push(prisma.solutionCategory.create({ data: { ...labels, slug } }))
        if (type === 'projectService') operations.push(prisma.projectService.create({ data: { ...labels, slug } }))
      }
    }

    await prisma.$transaction(operations)
    refreshSite()
    return { ok: true, message: 'Catégories enregistrées' }
  })
}
