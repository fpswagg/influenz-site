import { NextResponse } from 'next/server'
import { requireDashboardAuth } from '@/lib/auth/guard'
import {
  deleteStoredFile,
  listStoredFiles,
  prefixForKind,
  contentTypeFromName,
  extensionForContentType,
  safeFileName,
  sanitizeStorageKey,
  uploadStoredFile,
  type StorageKind,
} from '@/lib/storage/sastorage'

export async function GET(request: Request) {
  try {
    await requireDashboardAuth()
    const { searchParams } = new URL(request.url)
    const kind = (searchParams.get('kind') || 'any') as StorageKind
    const prefix = searchParams.get('prefix') || (await prefixForKind(kind))
    const cursor = searchParams.get('cursor') || undefined
    const result = await listStoredFiles({ prefix, cursor })
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Storage list failed'
    const status = message === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

export const maxDuration = 300

export async function POST(request: Request) {
  try {
    await requireDashboardAuth()
    const formData = await request.formData()
    const file = formData.get('file')
    const kind = (formData.get('kind') || 'any') as StorageKind
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 })
    }

    const type = file.type || contentTypeFromName(file.name)
    if (kind === 'image' && !type.startsWith('image/')) {
      return NextResponse.json({ error: 'Ce fichier n’est pas une image.' }, { status: 400 })
    }
    if (kind === 'video' && !type.startsWith('video/')) {
      return NextResponse.json({ error: 'Ce fichier n’est pas une vidéo.' }, { status: 400 })
    }

    const prefix = await prefixForKind(kind)
    const fileName = safeFileName(file.name, extensionForContentType(type)) || 'fichier'
    const key = sanitizeStorageKey(`${prefix}${Date.now()}-${fileName}`)
    const object = await uploadStoredFile(file, key)
    return NextResponse.json({ object }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Storage upload failed'
    if (message === 'Unauthorized') return NextResponse.json({ error: 'Session expirée. Reconnectez-vous.' }, { status: 401 })
    console.error('[storage upload]', error)
    const tooLarge = /413|too large|payload/i.test(message)
    return NextResponse.json(
      { error: tooLarge ? 'Ce fichier est trop lourd pour être envoyé.' : 'L’envoi a échoué. Réessayez dans un instant.' },
      { status: tooLarge ? 413 : 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    await requireDashboardAuth()
    const { searchParams } = new URL(request.url)
    const key = sanitizeStorageKey(searchParams.get('key') || '')
    if (!key) {
      return NextResponse.json({ error: 'Clé manquante' }, { status: 400 })
    }
    await deleteStoredFile(key)
    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Storage delete failed'
    const status = message === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
