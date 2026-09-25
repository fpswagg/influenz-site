import { createHash } from 'node:crypto'
import { createReadStream, createWriteStream } from 'node:fs'
import { mkdir, rename, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { contentTypeFromName, getKeyPrefix, getStoredFileSize, publicFileUrl } from '@/lib/storage/sastorage'

/**
 * Serves SA Storage files (mainly videos) with HTTP Range support.
 *
 * Browsers need ranges to seek in a video, Safari/iOS refuses to play videos without them,
 * and SA Storage does not answer ranges. The first request streams straight from storage while
 * a copy is downloaded once to a local disk cache; every later request (and every seek) is then
 * served from that copy. If the storage ever supports ranges natively, its answer is passed through.
 */

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const CACHE_DIR = process.env.MEDIA_CACHE_DIR || path.join(tmpdir(), 'influenz-media-cache')
const MAX_WAIT_MS = 120_000
const downloads = new Map<string, Promise<string | null>>()

function cachePath(key: string) {
  const hash = createHash('sha1').update(key).digest('hex')
  return path.join(CACHE_DIR, `${hash}${path.extname(key).toLowerCase()}`)
}

async function cachedFile(key: string) {
  const file = cachePath(key)
  const info = await stat(file).catch(() => null)
  return info?.isFile() && info.size > 0 ? { file, size: info.size } : null
}

/** Downloads the file once into the cache (concurrent callers share the same download). */
function ensureDownload(key: string) {
  const existing = downloads.get(key)
  if (existing) return existing
  const task = (async () => {
    const file = cachePath(key)
    const partial = `${file}.${process.pid}.part`
    try {
      await mkdir(CACHE_DIR, { recursive: true })
      const response = await fetch(publicFileUrl(key), { cache: 'no-store' })
      if (!response.ok || !response.body) return null
      await pipeline(Readable.fromWeb(response.body as import('node:stream/web').ReadableStream), createWriteStream(partial))
      await rename(partial, file)
      return file
    } catch (error) {
      console.error('[media cache]', key, error)
      await rm(partial, { force: true }).catch(() => undefined)
      return null
    } finally {
      downloads.delete(key)
    }
  })()
  downloads.set(key, task)
  return task
}

function parseRange(header: string, total: number) {
  const match = header.match(/^bytes=(\d*)-(\d*)$/)
  if (!match) return null
  let start: number
  let end: number
  if (match[1] === '') {
    const suffix = Number(match[2])
    if (!suffix) return null
    start = Math.max(0, total - suffix)
    end = total - 1
  } else {
    start = Number(match[1])
    end = match[2] === '' ? total - 1 : Math.min(Number(match[2]), total - 1)
  }
  if (start > end || start >= total) return null
  return { start, end }
}

function baseHeaders(key: string) {
  return new Headers({
    'Content-Type': contentTypeFromName(key),
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=86400, immutable',
  })
}

function unsatisfiable(total: number) {
  return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${total}` } })
}

/** Serves a byte range (or the whole file) from the local cache. */
function serveFromDisk(key: string, file: string, total: number, range: string | null) {
  const headers = baseHeaders(key)
  if (!range) {
    headers.set('Content-Length', String(total))
    return new Response(Readable.toWeb(createReadStream(file)) as ReadableStream, { status: 200, headers })
  }
  const slice = parseRange(range, total)
  if (!slice) return unsatisfiable(total)
  headers.set('Content-Range', `bytes ${slice.start}-${slice.end}/${total}`)
  headers.set('Content-Length', String(slice.end - slice.start + 1))
  return new Response(Readable.toWeb(createReadStream(file, { start: slice.start, end: slice.end })) as ReadableStream, { status: 206, headers })
}

/** Cuts [start, end] out of a stream that starts at byte 0. */
function sliceStream(body: ReadableStream<Uint8Array>, start: number, end: number) {
  const reader = body.getReader()
  let offset = 0
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          controller.close()
          return
        }
        const chunkStart = offset
        const chunkEnd = offset + value.length - 1
        offset += value.length
        if (chunkEnd < start) continue
        const from = Math.max(0, start - chunkStart)
        const to = Math.min(value.length, end - chunkStart + 1)
        if (to > from) controller.enqueue(value.subarray(from, to))
        if (chunkEnd >= end) {
          controller.close()
          reader.cancel().catch(() => undefined)
        }
        return
      }
    },
    cancel() {
      reader.cancel().catch(() => undefined)
    },
  })
}

/** Streams straight from storage (used while the local copy is not ready yet). */
async function serveFromStorage(key: string, range: string | null) {
  const upstream = await fetch(publicFileUrl(key), { headers: range ? { Range: range } : undefined, cache: 'no-store' })
  if (!upstream.ok || !upstream.body) {
    return new Response(upstream.status === 404 ? 'Not found' : 'Upstream error', { status: upstream.status === 404 ? 404 : 502 })
  }

  const headers = baseHeaders(key)
  const upstreamType = upstream.headers.get('content-type')
  if (upstreamType) headers.set('Content-Type', upstreamType)

  if (upstream.status === 206) {
    for (const name of ['content-range', 'content-length']) {
      const value = upstream.headers.get(name)
      if (value) headers.set(name, value)
    }
    return new Response(upstream.body, { status: 206, headers })
  }

  const total = Number(upstream.headers.get('content-length') || 0) || (await getStoredFileSize(key))
  if (!range || !total) {
    if (total) headers.set('Content-Length', String(total))
    return new Response(upstream.body, { status: 200, headers })
  }

  const slice = parseRange(range, total)
  if (!slice) {
    upstream.body.cancel().catch(() => undefined)
    return unsatisfiable(total)
  }
  headers.set('Content-Range', `bytes ${slice.start}-${slice.end}/${total}`)
  headers.set('Content-Length', String(slice.end - slice.start + 1))
  return new Response(sliceStream(upstream.body, slice.start, slice.end), { status: 206, headers })
}

function rangeStart(range: string | null) {
  const match = range?.match(/^bytes=(\d*)-/)
  if (!match) return 0
  return match[1] === '' ? Number.POSITIVE_INFINITY : Number(match[1])
}

export async function GET(request: Request, { params }: { params: { key: string[] } }) {
  const key = params.key.map((part) => decodeURIComponent(part)).join('/')
  if (!key || key.includes('..')) return new Response('Not found', { status: 404 })
  // Only this site's own files can be relayed
  const prefix = await getKeyPrefix().catch(() => '')
  if (prefix && !key.startsWith(prefix)) return new Response('Not found', { status: 404 })

  const range = request.headers.get('range')

  const cached = await cachedFile(key)
  if (cached) return serveFromDisk(key, cached.file, cached.size, range)

  const download = ensureDownload(key)

  // Beginning of the file: answer immediately from storage so playback starts without waiting
  if (rangeStart(range) === 0) return serveFromStorage(key, range)

  // Seeking / reading the end of the file: wait for the local copy, which makes it instant afterwards
  const file = await Promise.race([download, new Promise<null>((resolve) => setTimeout(() => resolve(null), MAX_WAIT_MS))])
  const ready = file ? await cachedFile(key) : null
  if (ready) return serveFromDisk(key, ready.file, ready.size, range)
  return serveFromStorage(key, range)
}
