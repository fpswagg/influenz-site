'use client'

import { playableVideoUrl } from '@/components/site/MediaView'
import { IconFile, IconVideo } from '../ui/icons'
import { displayName, mediaTypeOf, vimeoId, youtubeId } from './media-utils'

export function MediaPreview({
  url,
  contentType,
  fit = 'cover',
  className = '',
  controls = false,
}: {
  url: string
  contentType?: string | null
  fit?: 'cover' | 'contain'
  className?: string
  controls?: boolean
}) {
  const type = mediaTypeOf(url, contentType)
  const fitClass = fit === 'contain' ? 'object-contain' : 'object-cover'

  if (type === 'image') {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" loading="lazy" className={`h-full w-full ${fitClass} ${className}`} />
  }

  if (type === 'video') {
    const yt = youtubeId(url)
    if (yt) {
      return (
        <div className={`relative h-full w-full bg-slate-900 ${className}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://img.youtube.com/vi/${yt}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover" />
          <PlayBadge />
          <SourceTag label="YouTube" />
        </div>
      )
    }
    if (vimeoId(url)) {
      return (
        <div className={`relative flex h-full w-full flex-col items-center justify-center gap-1 bg-slate-900 text-slate-300 ${className}`}>
          <IconVideo size={22} />
          <span className="text-[11px]">Vidéo Vimeo</span>
        </div>
      )
    }
    return (
      <div className={`relative h-full w-full bg-slate-900 ${className}`}>
        <video src={playableVideoUrl(url)} className={`h-full w-full ${fitClass}`} muted playsInline preload="metadata" controls={controls} />
        {!controls ? (
          <>
            <PlayBadge />
            <SourceTag label="Vidéo" />
          </>
        ) : null}
      </div>
    )
  }

  return (
    <div className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-50 px-3 text-slate-500 ${className}`}>
      <IconFile size={24} />
      <span className="max-w-full truncate text-xs">{displayName(url)}</span>
    </div>
  )
}

function PlayBadge() {
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </span>
  )
}

function SourceTag({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute bottom-1.5 right-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
      {label}
    </span>
  )
}
