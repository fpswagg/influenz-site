import Image from 'next/image'
import VideoPlayer from '@/app/components/VideoPlayer'

/**
 * Displays any media stored for the site: image, uploaded video, YouTube or Vimeo link.
 *
 * - `background`: fills its (relative) parent, videos loop silently without controls (home banner)
 * - `cover`: card thumbnail, videos loop silently, YouTube shows its thumbnail
 * - `contain`: logos, the whole media stays visible
 * - `player`: gallery item, videos get full controls
 */
export type MediaViewMode = 'background' | 'cover' | 'contain' | 'player'

const STORAGE_URL = (process.env.NEXT_PUBLIC_STORAGE_URL || '').replace(/\/$/, '')
const VIDEO_EXT = /\.(mp4|webm|ogg|ogv|mov|avi|mkv|m4v)$/i

export function youtubeIdOf(url: string) {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([\w-]{6,})/)
  return match ? match[1] : null
}

export function vimeoIdOf(url: string) {
  const match = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(?:channels\/[^/]+\/)?(\d+)/)
  return match ? match[1] : null
}

export function isVideoSource(url: string) {
  return VIDEO_EXT.test(url.split('?')[0]) || Boolean(youtubeIdOf(url)) || Boolean(vimeoIdOf(url))
}

/** Storage videos go through the site's /media relay, which adds seeking (Range) support. */
export function playableVideoUrl(url: string) {
  if (STORAGE_URL && url.startsWith(`${STORAGE_URL}/files/`)) {
    return `/media/${url.slice(STORAGE_URL.length + '/files/'.length)}`
  }
  return url
}

function canOptimize(url: string) {
  if (url.split('?')[0].toLowerCase().endsWith('.svg')) return false
  if (url.startsWith('/')) return true
  return Boolean(STORAGE_URL && url.startsWith(`${STORAGE_URL}/`)) || url.startsWith('https://img.youtube.com/')
}

export default function MediaView({
  src,
  alt,
  mode = 'cover',
  sizes = '100vw',
  priority,
  className = '',
}: {
  src: string
  alt: string
  mode?: MediaViewMode
  sizes?: string
  priority?: boolean
  className?: string
}) {
  const youtube = youtubeIdOf(src)
  const vimeo = vimeoIdOf(src)
  const fit = mode === 'contain' ? 'object-contain' : 'object-cover'

  if (mode === 'player' && (youtube || vimeo || VIDEO_EXT.test(src.split('?')[0]))) {
    return <VideoPlayer src={youtube || vimeo ? src : playableVideoUrl(src)} className={className} />
  }

  if (youtube) {
    if (mode === 'background') {
      const params = new URLSearchParams({ autoplay: '1', mute: '1', loop: '1', playlist: youtube, controls: '0', rel: '0', playsinline: '1', modestbranding: '1' })
      return <EmbedBackground src={`https://www.youtube-nocookie.com/embed/${youtube}?${params}`} title={alt} />
    }
    return (
      <>
        <Image src={`https://img.youtube.com/vi/${youtube}/hqdefault.jpg`} alt={alt} fill sizes={sizes} priority={priority} className={`${fit} ${className}`} />
        <PlayBadge />
      </>
    )
  }

  if (vimeo) {
    const params = new URLSearchParams({ background: '1', autoplay: '1', muted: '1', loop: '1' })
    return <EmbedBackground src={`https://player.vimeo.com/video/${vimeo}?${params}`} title={alt} />
  }

  if (VIDEO_EXT.test(src.split('?')[0])) {
    return (
      <video
        src={playableVideoUrl(src)}
        className={`absolute inset-0 h-full w-full ${fit} ${className}`}
        autoPlay
        muted
        loop
        playsInline
        preload={mode === 'background' || priority ? 'auto' : 'metadata'}
        aria-label={alt}
        disablePictureInPicture
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={!canOptimize(src)}
      className={`${fit} ${className}`}
    />
  )
}

/** Full-bleed, muted, looping embed that always covers its container (16:9 video cropped like object-cover). */
function EmbedBackground({ src, title }: { src: string; title: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ containerType: 'size' }} aria-hidden>
      <iframe
        src={src}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture"
        loading="lazy"
        tabIndex={-1}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-0"
        style={{ width: 'max(100cqw, 177.78cqh)', height: 'max(100cqh, 56.25cqw)' }}
      />
    </div>
  )
}

function PlayBadge() {
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </span>
  )
}
