import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import type { PrismaClient } from '@prisma/client'
import { importRemoteFile } from './import-remote'
import {
  contentTypeFromName,
  getKeyPrefix,
  isEmbedVideoUrl,
  isStorageUrl,
  listStoredFiles,
  publicFileUrl,
  uploadStoredFile,
} from './sastorage'

/**
 * Moves every content file (project media, solution covers & galleries, partner logos,
 * home banner) to SA Storage and points the database at the stored copies.
 * Site identity files (logo, text logo, favicon) are intentionally left untouched.
 */

export type MediaField =
  | 'projectMedia.url'
  | 'solutionMedia.url'
  | 'solution.coverUrl'
  | 'client.imageUrl'
  | 'siteConfig.heroBannerUrl'

export interface MediaReference {
  field: MediaField
  id: string
  label: string
  url: string
}

export interface MediaChange extends MediaReference {
  to: string
}

export interface MigrationReport {
  changes: MediaChange[]
  uploaded: string[]
  reused: string[]
  skipped: { url: string; reason: string }[]
  failed: { url: string; reason: string; references: string[] }[]
}

/** Default banner used by the public site when none is set in the database. */
const DEFAULT_HERO_BANNER = '/images/banner.jpg'

async function collectReferences(prisma: PrismaClient): Promise<MediaReference[]> {
  const [projectMedia, solutionMedia, solutions, clients, settings] = await Promise.all([
    prisma.projectMedia.findMany({ select: { id: true, url: true, project: { select: { slug: true } } } }),
    prisma.solutionMedia.findMany({ select: { id: true, url: true, solution: { select: { slug: true } } } }),
    prisma.solution.findMany({ where: { coverUrl: { not: null } }, select: { id: true, slug: true, coverUrl: true } }),
    prisma.client.findMany({ where: { imageUrl: { not: null } }, select: { id: true, name: true, imageUrl: true } }),
    prisma.siteConfig.findUnique({ where: { id: 'site' }, select: { id: true, heroBannerUrl: true } }),
  ])

  return [
    ...projectMedia.map((item) => ({ field: 'projectMedia.url' as const, id: item.id, label: `projet ${item.project.slug}`, url: item.url })),
    ...solutionMedia.map((item) => ({ field: 'solutionMedia.url' as const, id: item.id, label: `solution ${item.solution.slug} (galerie)`, url: item.url })),
    ...solutions.map((item) => ({ field: 'solution.coverUrl' as const, id: item.id, label: `solution ${item.slug} (couverture)`, url: item.coverUrl! })),
    ...clients.map((item) => ({ field: 'client.imageUrl' as const, id: item.id, label: `partenaire ${item.name}`, url: item.imageUrl! })),
    ...(settings
      ? [{ field: 'siteConfig.heroBannerUrl' as const, id: settings.id, label: 'bannière d’accueil', url: settings.heroBannerUrl || DEFAULT_HERO_BANNER }]
      : []),
  ]
}

function folderFor(contentType: string) {
  if (contentType.startsWith('image/')) return 'media/images'
  if (contentType.startsWith('video/')) return 'media/videos'
  return 'files'
}

/** "/images/projects/project1.jpg" → "influenz-site/media/images/projects/project1.jpg" */
function keyForLocalFile(prefix: string, localPath: string) {
  const relative = localPath.replace(/^\/+/, '').replace(/^(images|videos|media)\//, '')
  return `${prefix}${folderFor(contentTypeFromName(localPath))}/${relative}`
}

async function listAllKeys(prefix: string) {
  const keys = new Set<string>()
  let cursor: string | undefined
  do {
    const page = await listStoredFiles({ prefix, cursor })
    page.objects.forEach((object) => keys.add(object.key))
    cursor = page.truncated ? page.cursor : undefined
  } while (cursor)
  return keys
}

export function applyChangesOperations(prisma: PrismaClient, changes: { field: MediaField; id: string; to: string }[]) {
  return changes.map((change) => {
    switch (change.field) {
      case 'projectMedia.url':
        return prisma.projectMedia.update({ where: { id: change.id }, data: { url: change.to } })
      case 'solutionMedia.url':
        return prisma.solutionMedia.update({ where: { id: change.id }, data: { url: change.to } })
      case 'solution.coverUrl':
        return prisma.solution.update({ where: { id: change.id }, data: { coverUrl: change.to } })
      case 'client.imageUrl':
        return prisma.client.update({ where: { id: change.id }, data: { imageUrl: change.to } })
      case 'siteConfig.heroBannerUrl':
        return prisma.siteConfig.update({ where: { id: change.id }, data: { heroBannerUrl: change.to } })
    }
  })
}

export async function migrateMediaToStorage(
  prisma: PrismaClient,
  options: { apply: boolean; publicDir: string; log?: (message: string) => void }
): Promise<MigrationReport> {
  const log = options.log || (() => undefined)
  const report: MigrationReport = { changes: [], uploaded: [], reused: [], skipped: [], failed: [] }

  const references = await collectReferences(prisma)
  const prefix = await getKeyPrefix()
  const existingKeys = await listAllKeys(prefix)

  const bySource = new Map<string, MediaReference[]>()
  for (const reference of references) {
    const url = reference.url.trim()
    if (!url) continue
    if (isStorageUrl(url)) continue
    if (isEmbedVideoUrl(url)) {
      report.skipped.push({ url, reason: 'vidéo YouTube/Vimeo (reste un lien)' })
      continue
    }
    const list = bySource.get(url) || []
    list.push(reference)
    bySource.set(url, list)
  }

  log(`${references.length} fichier(s) référencé(s), ${bySource.size} à placer dans le stockage.`)

  for (const [source, refs] of Array.from(bySource.entries())) {
    const labels = refs.map((ref) => ref.label)
    try {
      let target: string

      if (source.startsWith('/')) {
        const filePath = path.join(options.publicDir, decodeURIComponent(source.split('?')[0]))
        const info = await stat(filePath).catch(() => null)
        if (!info?.isFile()) throw new Error(`fichier introuvable : public${source}`)
        const key = keyForLocalFile(prefix, source.split('?')[0])
        target = publicFileUrl(key)

        if (existingKeys.has(key)) {
          report.reused.push(key)
          log(`= déjà présent  ${key}`)
        } else if (options.apply) {
          const buffer = await readFile(filePath)
          await uploadStoredFile(new Blob([buffer], { type: contentTypeFromName(filePath) }), key)
          existingKeys.add(key)
          report.uploaded.push(key)
          log(`↑ envoyé        ${key}`)
        } else {
          report.uploaded.push(key)
          log(`↑ à envoyer     ${source} → ${key}`)
        }
      } else if (/^https?:\/\//i.test(source)) {
        if (options.apply) {
          const object = await importRemoteFile(source, 'any')
          target = object.url
          report.uploaded.push(object.key)
          log(`↓ importé       ${source} → ${object.key}`)
        } else {
          target = '(copie dans le stockage)'
          report.uploaded.push(source)
          log(`↓ à importer    ${source}`)
        }
      } else {
        report.skipped.push({ url: source, reason: 'format d’adresse inconnu' })
        continue
      }

      for (const ref of refs) report.changes.push({ ...ref, to: target })
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error)
      report.failed.push({ url: source, reason, references: labels })
      log(`✗ échec         ${source} (${reason})`)
    }
  }

  if (options.apply && report.changes.length) {
    await prisma.$transaction(applyChangesOperations(prisma, report.changes))
    log(`${report.changes.length} référence(s) mise(s) à jour dans la base de données.`)
  }

  return report
}
