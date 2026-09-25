import { NextResponse } from 'next/server'
import { requireDashboardAuth } from '@/lib/auth/guard'
import { ImportError, importRemoteFile } from '@/lib/storage/import-remote'
import { isEmbedVideoUrl, isStorageUrl, type StorageKind } from '@/lib/storage/sastorage'

export const maxDuration = 300

/** Downloads a file from a public link and stores it in SA Storage. */
export async function POST(request: Request) {
  try {
    await requireDashboardAuth()
    const body = await request.json().catch(() => ({}))
    const url = String(body.url || '').trim()
    const kind = (['image', 'video', 'any'].includes(body.kind) ? body.kind : 'any') as StorageKind

    if (!url) return NextResponse.json({ error: 'Collez un lien à importer.' }, { status: 400 })
    if (isStorageUrl(url)) return NextResponse.json({ object: { url, key: url, size: 0, lastModified: null, contentType: null, etag: null } })
    if (isEmbedVideoUrl(url)) {
      return NextResponse.json({ error: 'Les vidéos YouTube et Vimeo sont ajoutées comme lien, sans téléchargement.' }, { status: 400 })
    }

    const object = await importRemoteFile(url, kind)
    return NextResponse.json({ object }, { status: 201 })
  } catch (error) {
    if (error instanceof ImportError) return NextResponse.json({ error: error.message }, { status: 422 })
    const message = error instanceof Error ? error.message : 'Import impossible'
    if (message === 'Unauthorized') return NextResponse.json({ error: 'Session expirée. Reconnectez-vous.' }, { status: 401 })
    console.error('[storage import]', error)
    return NextResponse.json({ error: 'L’import a échoué. Réessayez dans un instant.' }, { status: 500 })
  }
}
