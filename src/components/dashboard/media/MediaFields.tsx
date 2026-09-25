'use client'

import { useId, useState } from 'react'
import { useDashboardForm } from '../form/DashboardForm'
import { Field, IconButton, buttonClasses } from '../ui/primitives'
import { IconChevronLeft, IconChevronRight, IconImage, IconLink, IconPlus, IconUpload, IconVideo, IconX } from '../ui/icons'
import { useToast } from '../ui/Toaster'
import { MediaBrowser } from './MediaBrowser'
import { MediaPreview } from './MediaPreview'
import { UrlImport } from './UrlImport'
import { acceptFor, displayName, mediaTypeOf, pickerLabel, uploadToStorage, type PickerKind } from './media-utils'

type PickerVariant = 'cover' | 'logo' | 'icon'

const FRAME: Record<PickerVariant, string> = {
  cover: 'aspect-[16/9] w-full max-w-xl',
  logo: 'h-32 w-full',
  icon: 'h-24 w-24',
}

function ProgressOverlay({ progress }: { progress: number }) {
  const percent = Math.round(progress * 100)
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/85 px-6 text-sm font-medium text-slate-700">
      <span>{percent >= 100 ? 'Finalisation…' : `Envoi en cours… ${percent} %`}</span>
      <span className="h-1.5 w-full max-w-[220px] overflow-hidden rounded-full bg-slate-200">
        <span className="block h-full rounded-full bg-purple-brand transition-[width]" style={{ width: `${percent}%` }} />
      </span>
    </div>
  )
}

/** Single image and/or video field: preview, library, upload (with progress), import from link, remove. */
export function MediaPicker({
  name,
  label,
  hint,
  defaultValue = '',
  kind = 'any',
  variant = 'cover',
  optional,
}: {
  name: string
  label: React.ReactNode
  hint?: React.ReactNode
  defaultValue?: string | null
  kind?: PickerKind
  variant?: PickerVariant
  optional?: boolean
}) {
  const { markDirty } = useDashboardForm()
  const toast = useToast()
  const inputId = useId()
  const [value, setValueState] = useState(defaultValue || '')
  const [open, setOpen] = useState(false)
  const [showUrl, setShowUrl] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)
  const [dragging, setDragging] = useState(false)

  function setValue(next: string) {
    setValueState(next)
    markDirty()
  }

  async function upload(file?: File | null) {
    if (!file) return
    setProgress(0)
    try {
      const object = await uploadToStorage(file, kind, setProgress)
      setValue(object.url)
      toast.success(mediaTypeOf(object.url, object.contentType) === 'video' ? 'Vidéo envoyée' : 'Image envoyée', 'Pensez à enregistrer.')
    } catch (err) {
      toast.error('Envoi impossible', err instanceof Error ? err.message : undefined)
    } finally {
      setProgress(null)
    }
  }

  const contain = variant !== 'cover'
  const isVideo = value ? mediaTypeOf(value) === 'video' : false
  const checker = contain
    ? 'bg-[length:16px_16px] bg-[linear-gradient(45deg,#f1f5f9_25%,transparent_25%),linear-gradient(-45deg,#f1f5f9_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f1f5f9_75%),linear-gradient(-45deg,transparent_75%,#f1f5f9_75%)] bg-[position:0_0,0_8px,8px_-8px,-8px_0]'
    : 'bg-slate-100'
  const EmptyIcon = kind === 'video' ? IconVideo : IconImage

  return (
    <Field label={label} hint={hint} optional={optional} htmlFor={inputId}>
      <input type="hidden" name={name} value={value} />
      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          upload(event.dataTransfer.files?.[0])
        }}
        className={`relative overflow-hidden rounded-xl border ${FRAME[variant]} ${
          dragging ? 'border-2 border-dashed border-purple-brand' : value ? 'border-slate-200' : 'border-dashed border-slate-300'
        } ${value ? checker : 'bg-slate-50/70'}`}
      >
        {value ? (
          <div className={`h-full w-full ${contain && !isVideo ? 'p-3' : ''}`}>
            <MediaPreview url={value} fit={contain ? 'contain' : 'cover'} controls={isVideo} />
          </div>
        ) : (
          <button
            type="button"
            id={inputId}
            onClick={() => setOpen(true)}
            className="flex h-full w-full flex-col items-center justify-center gap-1.5 px-3 text-center text-slate-500 transition hover:bg-slate-100/70 hover:text-slate-700"
          >
            {variant === 'icon' ? (
              <IconPlus size={22} />
            ) : (
              <>
                <EmptyIcon size={24} />
                <span className="text-sm font-medium">Choisir {pickerLabel(kind)}</span>
                <span className="text-xs text-slate-400">ou glissez un fichier ici</span>
              </>
            )}
          </button>
        )}
        {progress !== null ? <ProgressOverlay progress={progress} /> : null}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <button type="button" onClick={() => setOpen(true)} className={buttonClasses('secondary', 'sm')}>
          <IconImage size={14} />
          {value ? 'Remplacer' : 'Médiathèque'}
        </button>
        <label className={buttonClasses('secondary', 'sm', `cursor-pointer ${progress !== null ? 'pointer-events-none opacity-60' : ''}`)}>
          <IconUpload size={14} />
          Envoyer
          <input
            type="file"
            accept={acceptFor(kind)}
            className="sr-only"
            onChange={(event) => {
              upload(event.target.files?.[0])
              event.target.value = ''
            }}
          />
        </label>
        <button
          type="button"
          onClick={() => setShowUrl((current) => !current)}
          aria-expanded={showUrl}
          className={buttonClasses('ghost', 'sm', showUrl ? 'bg-slate-100 text-slate-900' : '')}
        >
          <IconLink size={14} />
          Depuis un lien
        </button>
        {value ? (
          <button type="button" onClick={() => setValue('')} className={buttonClasses('danger-ghost', 'sm')}>
            <IconX size={14} />
            Retirer
          </button>
        ) : null}
      </div>
      {value && !showUrl ? <p className="truncate text-xs text-slate-400">{displayName(value)}</p> : null}
      {showUrl ? (
        <UrlImport
          kind={kind}
          autoFocus
          onImported={(url) => {
            setValue(url)
            setShowUrl(false)
            toast.success('Média ajouté', 'Pensez à enregistrer.')
          }}
        />
      ) : null}

      {open ? (
        <MediaBrowser
          kind={kind}
          onClose={() => setOpen(false)}
          onSelect={([url]) => {
            setValue(url)
            setOpen(false)
          }}
        />
      ) : null}
    </Field>
  )
}

interface PendingUpload {
  id: number
  progress: number
}

let pendingCounter = 0

/** Ordered gallery of images and/or videos. The first item is used as the thumbnail. */
export function GalleryEditor({
  name,
  label,
  hint,
  defaultValue = [],
  kind = 'any',
  firstLabel = 'Vignette',
}: {
  name: string
  label: React.ReactNode
  hint?: React.ReactNode
  defaultValue?: string[]
  kind?: PickerKind
  firstLabel?: string
}) {
  const { markDirty } = useDashboardForm()
  const toast = useToast()
  const [items, setItemsState] = useState(defaultValue)
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState<PendingUpload[]>([])
  const [dragging, setDragging] = useState(false)
  const [showUrl, setShowUrl] = useState(false)

  function setItems(update: (current: string[]) => string[]) {
    setItemsState(update)
    markDirty()
  }

  function move(index: number, delta: number) {
    setItems((current) => {
      const target = index + delta
      if (target < 0 || target >= current.length) return current
      const next = [...current]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  async function upload(files: FileList | null) {
    const list = Array.from(files || [])
    if (!list.length) return
    await Promise.all(
      list.map(async (file) => {
        const id = ++pendingCounter
        setPending((current) => [...current, { id, progress: 0 }])
        try {
          const object = await uploadToStorage(file, kind, (progress) =>
            setPending((current) => current.map((item) => (item.id === id ? { ...item, progress } : item)))
          )
          setItems((current) => [...current, object.url])
        } catch (err) {
          toast.error(`« ${file.name} » n’a pas pu être envoyé`, err instanceof Error ? err.message : undefined)
        } finally {
          setPending((current) => current.filter((item) => item.id !== id))
        }
      })
    )
  }

  return (
    <Field label={label} hint={hint}>
      <input type="hidden" name={name} value={items.join('\n')} />
      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={(event) => {
          if (event.currentTarget === event.target) setDragging(false)
        }}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          upload(event.dataTransfer.files)
        }}
        className={`grid grid-cols-2 gap-3 rounded-xl sm:grid-cols-3 lg:grid-cols-4 ${dragging ? 'outline-dashed outline-2 outline-offset-4 outline-purple-brand' : ''}`}
      >
        {items.map((item, index) => (
          <div key={`${item}-${index}`} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            <MediaPreview url={item} />
            {index === 0 ? (
              <span className="absolute left-2 top-2 rounded-md bg-slate-900/75 px-1.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">{firstLabel}</span>
            ) : (
              <span className="absolute left-2 top-2 flex h-5 min-w-5 items-center justify-center rounded-md bg-white/85 px-1 text-[11px] font-semibold text-slate-600">
                {index + 1}
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-100 transition sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
              <div className="flex">
                <IconButton label="Déplacer vers la gauche" className="text-white hover:bg-white/20 hover:text-white" onClick={() => move(index, -1)} disabled={index === 0}>
                  <IconChevronLeft size={16} />
                </IconButton>
                <IconButton
                  label="Déplacer vers la droite"
                  className="text-white hover:bg-white/20 hover:text-white"
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1}
                >
                  <IconChevronRight size={16} />
                </IconButton>
              </div>
              <IconButton label="Retirer de la galerie" className="text-white hover:bg-red-500 hover:text-white" onClick={() => setItems((current) => current.filter((_, i) => i !== index))}>
                <IconX size={16} />
              </IconButton>
            </div>
          </div>
        ))}

        {pending.map((upload) => (
          <div key={upload.id} className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs text-slate-500">
            <span className="tabular-nums">{upload.progress >= 1 ? 'Finalisation…' : `${Math.round(upload.progress * 100)} %`}</span>
            <span className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <span className="block h-full rounded-full bg-purple-brand transition-[width]" style={{ width: `${Math.round(upload.progress * 100)}%` }} />
            </span>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex aspect-[4/3] flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 text-slate-500 transition hover:border-purple-brand hover:bg-purple-brand/5 hover:text-purple-brand"
        >
          <IconPlus size={22} />
          <span className="text-[13px] font-medium">Ajouter</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <label className={buttonClasses('secondary', 'sm', 'cursor-pointer')}>
          <IconUpload size={14} />
          Envoyer depuis l’ordinateur
          <input
            type="file"
            multiple
            accept={acceptFor(kind)}
            className="sr-only"
            onChange={(event) => {
              upload(event.target.files)
              event.target.value = ''
            }}
          />
        </label>
        <button
          type="button"
          onClick={() => setShowUrl((current) => !current)}
          aria-expanded={showUrl}
          className={buttonClasses('ghost', 'sm', showUrl ? 'bg-slate-100 text-slate-900' : '')}
        >
          <IconLink size={14} />
          {kind === 'image' ? 'Depuis un lien' : 'Depuis un lien (fichier, YouTube, Vimeo)'}
        </button>
      </div>
      {showUrl ? (
        <UrlImport
          kind={kind}
          autoFocus
          onImported={(url) => {
            setItems((current) => [...current, url])
            toast.success('Média ajouté à la galerie', 'Pensez à enregistrer.')
          }}
        />
      ) : null}

      {open ? (
        <MediaBrowser
          kind={kind}
          multiple
          onClose={() => setOpen(false)}
          onSelect={(urls) => {
            setItems((current) => [...current, ...urls])
            setOpen(false)
          }}
        />
      ) : null}
    </Field>
  )
}
