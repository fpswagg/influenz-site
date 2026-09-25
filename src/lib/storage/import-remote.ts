import {
  extensionForContentType,
  contentTypeFromName,
  prefixForKind,
  safeFileName,
  uploadStoredFile,
  type StorageKind,
  type StoredObject,
} from './sastorage'

/** Largest file accepted when importing from a link (videos included). */
export const MAX_IMPORT_BYTES = 500 * 1024 * 1024

export class ImportError extends Error {}

function assertPublicHttpUrl(raw: string) {
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    throw new ImportError('Ce lien n’est pas valide. Il doit commencer par https://')
  }
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new ImportError('Seuls les liens http:// ou https:// peuvent être importés.')
  }
  const host = url.hostname.toLowerCase()
  const privateHost =
    host === 'localhost' ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    host === '0.0.0.0' ||
    host === '[::1]' ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host)
  if (privateHost) throw new ImportError('Ce lien pointe vers une adresse interne et ne peut pas être importé.')
  return url
}

function fileNameFromResponse(url: URL, response: Response) {
  const disposition = response.headers.get('content-disposition') || ''
  const match = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i)
  if (match) return decodeURIComponent(match[1])
  const last = decodeURIComponent(url.pathname.split('/').filter(Boolean).pop() || '')
  return last || url.hostname
}

function kindOfContentType(contentType: string): 'image' | 'video' | 'other' {
  if (contentType.startsWith('image/')) return 'image'
  if (contentType.startsWith('video/')) return 'video'
  return 'other'
}

/**
 * Downloads a file from the internet and stores it in SA Storage.
 * `kind` restricts what is accepted: 'image', 'video' or 'any' (image or video).
 */
export async function importRemoteFile(rawUrl: string, kind: StorageKind = 'any'): Promise<StoredObject> {
  const url = assertPublicHttpUrl(rawUrl.trim())

  let response: Response
  try {
    response = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(120_000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; iNFLUENZ-media-import/1.0)', Accept: 'image/*,video/*;q=0.9,*/*;q=0.5' },
    })
  } catch (error) {
    const timeout = error instanceof Error && error.name === 'TimeoutError'
    throw new ImportError(timeout ? 'Le site distant met trop de temps à répondre.' : 'Impossible de joindre ce lien. Vérifiez qu’il est public.')
  }

  if (!response.ok) {
    throw new ImportError(
      response.status === 403 || response.status === 401
        ? 'Le site distant refuse le téléchargement de ce fichier (accès protégé).'
        : `Le site distant a répondu par une erreur (${response.status}).`
    )
  }

  const declaredLength = Number(response.headers.get('content-length') || 0)
  if (declaredLength > MAX_IMPORT_BYTES) {
    throw new ImportError(`Ce fichier est trop lourd (plus de ${Math.round(MAX_IMPORT_BYTES / 1024 / 1024)} Mo).`)
  }

  const originalName = fileNameFromResponse(url, response)
  let contentType = (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase()
  if (!contentType || contentType === 'application/octet-stream' || contentType === 'binary/octet-stream') {
    contentType = contentTypeFromName(originalName)
  }

  const detected = kindOfContentType(contentType)
  if (contentType === 'text/html' || contentType === 'application/xhtml+xml') {
    throw new ImportError(
      'Ce lien mène à une page web, pas directement à un fichier. Ouvrez l’image ou la vidéo, faites un clic droit puis « Copier l’adresse de l’image / de la vidéo ».'
    )
  }
  if (detected === 'other') throw new ImportError('Ce lien ne contient ni une image ni une vidéo.')
  if (kind === 'image' && detected !== 'image') throw new ImportError('Ce lien contient une vidéo, alors qu’une image est attendue ici.')
  if (kind === 'video' && detected !== 'video') throw new ImportError('Ce lien contient une image, alors qu’une vidéo est attendue ici.')

  const buffer = await response.arrayBuffer()
  if (buffer.byteLength > MAX_IMPORT_BYTES) {
    throw new ImportError(`Ce fichier est trop lourd (plus de ${Math.round(MAX_IMPORT_BYTES / 1024 / 1024)} Mo).`)
  }
  if (buffer.byteLength === 0) throw new ImportError('Le fichier téléchargé est vide.')

  const fileName = safeFileName(originalName, extensionForContentType(contentType))
  const withExt = /\.[a-z0-9]{2,5}$/.test(fileName) ? fileName : `${fileName}.${extensionForContentType(contentType) || 'bin'}`
  const prefix = await prefixForKind(detected)
  const key = `${prefix}${Date.now()}-${withExt}`
  return uploadStoredFile(new Blob([buffer], { type: contentType }), key)
}
