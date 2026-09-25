import type { StorageKind, StoredObject } from '@/lib/storage/sastorage'

export type MediaType = 'image' | 'video' | 'file'
/** What a picker accepts: images, videos, or both. */
export type PickerKind = 'image' | 'video' | 'any'

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg|bmp|ico)$/i
const VIDEO_EXT = /\.(mp4|webm|ogg|ogv|mov|avi|mkv|m4v)$/i

export function youtubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([\w-]{6,})/)
  return match ? match[1] : null
}

export function vimeoId(url: string) {
  const match = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(?:channels\/[^/]+\/)?(\d+)/)
  return match ? match[1] : null
}

/** YouTube / Vimeo links are kept as links (they cannot be downloaded). */
export function isEmbedVideo(url: string) {
  return Boolean(youtubeId(url) || vimeoId(url))
}

export function mediaTypeOf(url: string, contentType?: string | null): MediaType {
  const clean = url.split('?')[0]
  if (contentType?.startsWith('image/') || IMAGE_EXT.test(clean)) return 'image'
  if (contentType?.startsWith('video/') || VIDEO_EXT.test(clean) || isEmbedVideo(url)) return 'video'
  return 'file'
}

/** Human-friendly file name: strips folders and the upload timestamp prefix. */
export function displayName(keyOrUrl: string) {
  const yt = youtubeId(keyOrUrl)
  if (yt) return `Vidéo YouTube (${yt})`
  const vm = vimeoId(keyOrUrl)
  if (vm) return `Vidéo Vimeo (${vm})`
  const last = decodeURIComponent(keyOrUrl.split('?')[0].split('/').pop() || keyOrUrl)
  return last.replace(/^\d{10,}-/, '')
}

export function formatSize(bytes: number) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} Mo`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2).replace('.', ',')} Go`
}

export function acceptFor(kind: StorageKind) {
  if (kind === 'image') return 'image/*'
  if (kind === 'video') return 'video/*'
  if (kind === 'any') return 'image/*,video/*'
  return undefined
}

export function pickerLabel(kind: PickerKind) {
  if (kind === 'image') return 'une image'
  if (kind === 'video') return 'une vidéo'
  return 'une image ou une vidéo'
}

function fileMatches(file: File, kind: StorageKind) {
  if (kind === 'image') return file.type.startsWith('image/')
  if (kind === 'video') return file.type.startsWith('video/')
  if (kind === 'any') return file.type.startsWith('image/') || file.type.startsWith('video/')
  return true
}

function uploadKindFor(file: File, kind: StorageKind): StorageKind {
  if (kind !== 'any') return kind
  if (file.type.startsWith('image/')) return 'image'
  if (file.type.startsWith('video/')) return 'video'
  return 'file'
}

/** Uploads a file through the dashboard API, reporting progress (0 → 1) for large videos. */
export function uploadToStorage(file: File, kind: StorageKind, onProgress?: (ratio: number) => void): Promise<StoredObject> {
  if (!fileMatches(file, kind)) {
    const expected = kind === 'image' ? 'une image' : kind === 'video' ? 'une vidéo' : 'une image ou une vidéo'
    return Promise.reject(new Error(`« ${file.name} » n’est pas ${expected}.`))
  }

  return new Promise((resolve, reject) => {
    const body = new FormData()
    body.set('file', file)
    body.set('kind', uploadKindFor(file, kind))

    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/dashboard/storage')
    xhr.responseType = 'json'
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(event.loaded / event.total)
    }
    xhr.onload = () => {
      const data = xhr.response || {}
      if (xhr.status >= 200 && xhr.status < 300 && data.object) {
        onProgress?.(1)
        resolve(data.object as StoredObject)
      } else if (xhr.status === 413) {
        reject(new Error('Ce fichier est trop lourd pour être envoyé. Compressez la vidéo ou utilisez un lien YouTube.'))
      } else {
        reject(new Error(data.error || 'Le fichier n’a pas pu être envoyé.'))
      }
    }
    xhr.onerror = () => reject(new Error('Connexion interrompue pendant l’envoi.'))
    xhr.send(body)
  })
}

/**
 * Adds media from a link. YouTube/Vimeo links are kept as links;
 * any other file is downloaded into the media library. Returns the URL to use.
 */
export async function importFromUrl(rawUrl: string, kind: PickerKind): Promise<{ url: string; object?: StoredObject }> {
  const url = rawUrl.trim()
  if (!/^https?:\/\//i.test(url)) throw new Error('Le lien doit commencer par https://')
  if (isEmbedVideo(url)) {
    if (kind === 'image') throw new Error('Un lien vidéo ne peut pas être utilisé ici : une image est attendue.')
    return { url }
  }
  const response = await fetch('/api/dashboard/storage/import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, kind }),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'L’import depuis ce lien a échoué.')
  return { url: data.object.url, object: data.object as StoredObject }
}

export async function listStorage(kind: StorageKind): Promise<StoredObject[]> {
  const response = await fetch(`/api/dashboard/storage?kind=${kind}`)
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'La médiathèque est inaccessible pour le moment.')
  const objects = (data.objects || []) as StoredObject[]
  return objects
    .filter((object) => !object.key.endsWith('/'))
    .sort((a, b) => (b.lastModified || '').localeCompare(a.lastModified || ''))
}

export interface MediaUsage {
  label: string
  href: string
}

export async function fetchMediaUsage(): Promise<Record<string, MediaUsage[]>> {
  const response = await fetch('/api/dashboard/storage/usage')
  const data = await response.json().catch(() => ({}))
  return response.ok ? data.usage || {} : {}
}
