'use client'

import { useState } from 'react'
import type { StoredObject } from '@/lib/storage/sastorage'
import { buttonClasses, inputClasses } from '../ui/primitives'
import { IconAlert, IconLink, IconSpinner } from '../ui/icons'
import { importFromUrl, isEmbedVideo, type PickerKind } from './media-utils'

/**
 * "Import from a link" field.
 * - YouTube / Vimeo → kept as a link (played by their player)
 * - Any other image/video link → downloaded into the media library, so the site never depends on another website
 */
export function UrlImport({
  kind,
  onImported,
  autoFocus,
  className = '',
}: {
  kind: PickerKind
  onImported: (url: string, object?: StoredObject) => void
  autoFocus?: boolean
  className?: string
}) {
  const [value, setValue] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const trimmed = value.trim()
  const valid = /^https?:\/\/\S+$/i.test(trimmed)
  const embed = valid && isEmbedVideo(trimmed)

  async function run() {
    if (!valid || busy) return
    setBusy(true)
    setError('')
    try {
      const result = await importFromUrl(trimmed, kind)
      onImported(result.url, result.object)
      setValue('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import impossible')
    } finally {
      setBusy(false)
    }
  }

  const hint =
    kind === 'image'
      ? 'Collez l’adresse d’une image. Elle sera copiée dans votre médiathèque.'
      : 'Collez l’adresse d’une image ou d’une vidéo (MP4…), ou un lien YouTube / Vimeo. Les fichiers sont copiés dans votre médiathèque.'

  return (
    <div data-ignore-dirty className={`space-y-1.5 ${className}`}>
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <IconLink size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            inputMode="url"
            autoFocus={autoFocus}
            value={value}
            disabled={busy}
            onChange={(event) => {
              setValue(event.target.value)
              setError('')
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                run()
              }
            }}
            placeholder={kind === 'image' ? 'https://exemple.com/photo.jpg' : 'https://… (image, vidéo, YouTube, Vimeo)'}
            className={`${inputClasses} h-9 pl-9 ${error ? 'border-red-300' : ''}`}
            aria-label="Adresse du fichier à importer"
          />
        </div>
        <button type="button" onClick={run} disabled={!valid || busy} className={buttonClasses('primary', 'sm', 'h-9')}>
          {busy ? <IconSpinner size={14} /> : null}
          {busy ? 'Import…' : embed ? 'Ajouter' : 'Importer'}
        </button>
      </div>
      {error ? (
        <p className="flex items-start gap-1.5 text-xs leading-relaxed text-red-600">
          <IconAlert size={13} className="mt-0.5 shrink-0" />
          {error}
        </p>
      ) : busy && !embed ? (
        <p className="text-xs text-slate-500">Téléchargement du fichier… Les vidéos peuvent prendre un moment.</p>
      ) : (
        <p className="text-xs leading-relaxed text-slate-500">{embed ? 'Lien vidéo reconnu : il sera lu avec le lecteur de la plateforme.' : hint}</p>
      )}
    </div>
  )
}
