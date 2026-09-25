export type StorageKind = 'image' | 'video' | 'file' | 'any'

export interface StoredObject {
  key: string
  size: number
  lastModified: string | null
  contentType: string | null
  etag: string | null
  url: string
}

export interface ListFilesResult {
  objects: StoredObject[]
  truncated: boolean
  cursor?: string
}

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg|bmp|ico)$/i
const VIDEO_EXT = /\.(mp4|webm|ogg|mov|avi|mkv|m4v)$/i

function storageBaseUrl() {
  return (process.env.SA_STORAGE_URL || 'https://sastorage.fpswagg.site').replace(/\/$/, '')
}

function storagePublicUrl() {
  return (process.env.SA_STORAGE_PUBLIC_URL || storageBaseUrl()).replace(/\/$/, '')
}

function storageToken() {
  const token = process.env.SA_STORAGE_TOKEN
  if (!token) {
    throw new Error('SA_STORAGE_TOKEN is not configured')
  }
  return token
}

function authHeaders(extra?: HeadersInit): Headers {
  const headers = new Headers(extra)
  headers.set('Authorization', `Bearer ${storageToken()}`)
  return headers
}

export function publicFileUrl(key: string) {
  const encoded = key.split('/').map(encodeURIComponent).join('/')
  return `${storagePublicUrl()}/files/${encoded}`
}

export function isImageUrl(url: string) {
  return IMAGE_EXT.test(url.split('?')[0])
}

export function isVideoUrl(url: string) {
  if (VIDEO_EXT.test(url.split('?')[0])) return true
  return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')
}

export function detectMediaKind(url: string): 'IMAGE' | 'VIDEO' | 'FILE' {
  if (isVideoUrl(url)) return 'VIDEO'
  if (isImageUrl(url)) return 'IMAGE'
  return 'FILE'
}

let cachedKeyPrefix: string | null = null

export async function getKeyPrefix() {
  if (cachedKeyPrefix !== null) return cachedKeyPrefix

  const response = await fetch(`${storageBaseUrl()}/api/me`, {
    headers: authHeaders(),
    cache: 'no-store',
  })
  if (!response.ok) {
    throw new Error(`SA Storage identity failed: ${await parseError(response)}`)
  }
  const data = await response.json()
  const prefix = String(data.keyPrefix || '')
  cachedKeyPrefix = prefix && !prefix.endsWith('/') ? `${prefix}/` : prefix
  return cachedKeyPrefix
}

export async function prefixForKind(kind: StorageKind) {
  const root = await getKeyPrefix()
  if (kind === 'image') return `${root}media/images/`
  if (kind === 'video') return `${root}media/videos/`
  if (kind === 'file') return `${root}files/`
  return root || 'influenz-site/'
}

async function parseError(response: Response) {
  try {
    const body = await response.json()
    return body.error || response.statusText
  } catch {
    return response.statusText
  }
}

export async function listStoredFiles(options?: {
  prefix?: string
  cursor?: string
}): Promise<ListFilesResult> {
  const url = new URL('/api/files', storageBaseUrl())
  if (options?.prefix) url.searchParams.set('prefix', options.prefix)
  if (options?.cursor) url.searchParams.set('cursor', options.cursor)

  const response = await fetch(url, {
    headers: authHeaders(),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`SA Storage list failed: ${await parseError(response)}`)
  }

  const data = await response.json()
  return {
    truncated: Boolean(data.truncated),
    cursor: data.cursor,
    objects: (data.objects || []).map((object: Record<string, unknown>) => ({
      key: String(object.key),
      size: Number(object.size || 0),
      lastModified: object.lastModified ? String(object.lastModified) : null,
      contentType: object.contentType ? String(object.contentType) : null,
      etag: object.etag ? String(object.etag) : null,
      url: publicFileUrl(String(object.key)),
    })),
  }
}

export async function uploadStoredFile(file: Blob, key: string): Promise<StoredObject> {
  const body = new FormData()
  body.set('file', file, key.split('/').pop() || 'upload')
  body.set('key', key)

  const response = await fetch(`${storageBaseUrl()}/api/files`, {
    method: 'POST',
    headers: authHeaders(),
    body,
  })

  if (!response.ok) {
    throw new Error(`SA Storage upload failed: ${await parseError(response)}`)
  }

  const data = await response.json()
  const object = data.object || {}
  const objectKey = String(object.key || key)
  return {
    key: objectKey,
    size: Number(object.size || file.size || 0),
    lastModified: object.lastModified ? String(object.lastModified) : null,
    contentType: object.contentType ? String(object.contentType) : null,
    etag: object.etag ? String(object.etag) : null,
    url: publicFileUrl(objectKey),
  }
}

export async function deleteStoredFile(key: string) {
  const encoded = key.split('/').map(encodeURIComponent).join('/')
  const response = await fetch(`${storageBaseUrl()}/api/files/${encoded}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })

  if (!response.ok) {
    throw new Error(`SA Storage delete failed: ${await parseError(response)}`)
  }
}

export function sanitizeStorageKey(input: string) {
  return input
    .trim()
    .replace(/^\/+/, '')
    .replace(/\.\./g, '')
    .replace(/\/{2,}/g, '/')
}

const CONTENT_TYPES: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  avif: 'image/avif',
  svg: 'image/svg+xml',
  bmp: 'image/bmp',
  ico: 'image/x-icon',
  mp4: 'video/mp4',
  m4v: 'video/mp4',
  webm: 'video/webm',
  ogg: 'video/ogg',
  ogv: 'video/ogg',
  mov: 'video/quicktime',
  avi: 'video/x-msvideo',
  mkv: 'video/x-matroska',
  pdf: 'application/pdf',
}

export function contentTypeFromName(name: string) {
  const ext = name.split('?')[0].split('.').pop()?.toLowerCase() || ''
  return CONTENT_TYPES[ext] || 'application/octet-stream'
}

export function extensionForContentType(contentType: string) {
  const type = contentType.split(';')[0].trim().toLowerCase()
  if (type === 'image/jpeg') return 'jpg'
  if (type === 'video/quicktime') return 'mov'
  const match = Object.entries(CONTENT_TYPES).find(([, value]) => value === type)
  return match ? match[0] : ''
}

/** "Photo Équipe (2).JPG" → "photo-equipe-2.jpg" */
export function safeFileName(name: string, fallbackExt = '') {
  const clean = name.split(/[\/]/).pop() || 'fichier'
  const dot = clean.lastIndexOf('.')
  const base = dot > 0 ? clean.slice(0, dot) : clean
  const ext = (dot > 0 ? clean.slice(dot + 1) : fallbackExt).toLowerCase().replace(/[^a-z0-9]/g, '')
  const slug =
    base
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 80) || 'fichier'
  return ext ? `${slug}.${ext}` : slug
}

/** True when the URL already points at SA Storage. */
export function isStorageUrl(url: string) {
  return url.startsWith(`${storagePublicUrl()}/`) || url.startsWith(`${storageBaseUrl()}/`)
}

/** YouTube / Vimeo links are embedded, never downloaded. */
export function isEmbedVideoUrl(url: string) {
  return /(?:youtube\.com|youtu\.be|vimeo\.com)/i.test(url)
}

const sizeCache = new Map<string, number>()

/** File size in bytes, read from the storage metadata API (the file endpoint streams without Content-Length). */
export async function getStoredFileSize(key: string): Promise<number> {
  const cached = sizeCache.get(key)
  if (cached !== undefined) return cached
  const encoded = key.split('/').map(encodeURIComponent).join('/')
  const response = await fetch(`${storageBaseUrl()}/api/files/${encoded}`, { headers: authHeaders(), cache: 'no-store' })
  if (!response.ok) return 0
  const data = await response.json().catch(() => ({}))
  const size = Number(data.object?.size || 0)
  if (size) sizeCache.set(key, size)
  return size
}
