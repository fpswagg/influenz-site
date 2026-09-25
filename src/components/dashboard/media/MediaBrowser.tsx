'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import type { StoredObject } from '@/lib/storage/sastorage'
import { buttonClasses, inputClasses } from '../ui/primitives'
import { IconCheck, IconImage, IconLink, IconSearch, IconUpload, IconVideo, IconX } from '../ui/icons'
import { useToast } from '../ui/Toaster'
import { MediaPreview } from './MediaPreview'
import { UrlImport } from './UrlImport'
import { acceptFor, displayName, listStorage, mediaTypeOf, uploadToStorage, type PickerKind } from './media-utils'

type Tab = 'image' | 'video'

interface Upload {
  id: number
  name: string
  progress: number
}

let uploadCounter = 0

/**
 * Modal to pick files from the media library, upload new ones (images and videos, with progress)
 * or import them from a link.
 */
export function MediaBrowser({
  kind,
  multiple = false,
  onSelect,
  onClose,
}: {
  kind: PickerKind
  multiple?: boolean
  onSelect: (urls: string[]) => void
  onClose: () => void
}) {
  const toast = useToast()
  const [tab, setTab] = useState<Tab>(kind === 'video' ? 'video' : 'image')
  const [objects, setObjects] = useState<StoredObject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [uploads, setUploads] = useState<Upload[]>([])
  const [dragging, setDragging] = useState(false)
  const [showLink, setShowLink] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setObjects(await listStorage(tab))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }, [tab])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [onClose])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? objects.filter((object) => displayName(object.key).toLowerCase().includes(q)) : objects
  }, [objects, query])

  /** Adds a newly available URL: selects it (multi) or returns it immediately (single). */
  function accept(url: string, object?: StoredObject) {
    if (object && mediaTypeOf(object.url, object.contentType) === tab) {
      setObjects((current) => [object, ...current.filter((item) => item.key !== object.key)])
    }
    if (multiple) setSelected((current) => (current.includes(url) ? current : [...current, url]))
    else onSelect([url])
  }

  async function handleFiles(files: FileList | File[]) {
    const list = Array.from(files)
    if (!list.length) return
    const accepted: { url: string; object: StoredObject }[] = []
    await Promise.all(
      list.map(async (file) => {
        const id = ++uploadCounter
        setUploads((current) => [...current, { id, name: file.name, progress: 0 }])
        try {
          const object = await uploadToStorage(file, kind, (progress) =>
            setUploads((current) => current.map((item) => (item.id === id ? { ...item, progress } : item)))
          )
          accepted.push({ url: object.url, object })
          const type = mediaTypeOf(object.url, object.contentType)
          if (kind === 'any' && type !== tab && (type === 'image' || type === 'video')) setTab(type)
        } catch (err) {
          toast.error(`« ${file.name} » n’a pas pu être envoyé`, err instanceof Error ? err.message : undefined)
        } finally {
          setUploads((current) => current.filter((item) => item.id !== id))
        }
      })
    )
    if (!accepted.length) return
    if (multiple) {
      accepted.forEach(({ url, object }) => accept(url, object))
      toast.success(accepted.length > 1 ? `${accepted.length} fichiers envoyés et sélectionnés` : 'Fichier envoyé et sélectionné')
    } else {
      onSelect([accepted[0].url])
    }
  }

  function choose(url: string) {
    if (!multiple) {
      onSelect([url])
      return
    }
    setSelected((current) => (current.includes(url) ? current.filter((item) => item !== url) : [...current, url]))
  }

  const title =
    kind === 'video'
      ? 'Choisir une vidéo'
      : kind === 'image'
        ? multiple
          ? 'Choisir des images'
          : 'Choisir une image'
        : multiple
          ? 'Choisir des images ou vidéos'
          : 'Choisir une image ou une vidéo'

  if (!mounted) return null

  return createPortal(
    <div data-ignore-dirty className="dash fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <div className="dash-fade absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="dash-pop relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
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
          handleFiles(event.dataTransfer.files)
        }}
      >
        <header className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <p className="text-[13px] text-slate-500">Choisissez dans la médiathèque, envoyez depuis votre ordinateur ou importez depuis un lien.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Fermer">
            <IconX size={18} />
          </button>
        </header>

        <div className="space-y-3 border-b border-slate-100 px-5 py-3 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {kind === 'any' ? (
              <div className="inline-flex self-start rounded-lg bg-slate-100 p-0.5">
                {(['image', 'video'] as Tab[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTab(item)}
                    className={`inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-[13px] font-medium transition ${
                      tab === item ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {item === 'image' ? <IconImage size={14} /> : <IconVideo size={14} />}
                    {item === 'image' ? 'Images' : 'Vidéos'}
                  </button>
                ))}
              </div>
            ) : null}
            <div className="relative flex-1">
              <IconSearch size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher par nom de fichier" className={`${inputClasses} h-9 pl-9`} />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowLink((current) => !current)}
                className={buttonClasses(showLink ? 'secondary' : 'ghost', 'md', showLink ? 'border-purple-brand text-purple-brand' : '')}
                aria-expanded={showLink}
              >
                <IconLink size={16} />
                Depuis un lien
              </button>
              <label className={buttonClasses('primary', 'md', 'cursor-pointer')}>
                <IconUpload size={16} />
                Envoyer
                <input
                  type="file"
                  multiple={multiple}
                  accept={acceptFor(kind)}
                  className="sr-only"
                  onChange={(event) => {
                    if (event.target.files) handleFiles(event.target.files)
                    event.target.value = ''
                  }}
                />
              </label>
            </div>
          </div>
          {showLink ? <UrlImport kind={kind} autoFocus onImported={(url, object) => accept(url, object)} /> : null}
          {uploads.length ? (
            <ul className="space-y-1.5">
              {uploads.map((upload) => (
                <li key={upload.id} className="flex items-center gap-3 text-xs text-slate-600">
                  <span className="w-40 truncate sm:w-56">{upload.name}</span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <span className="block h-full rounded-full bg-purple-brand transition-[width]" style={{ width: `${Math.round(upload.progress * 100)}%` }} />
                  </span>
                  <span className="w-10 text-right tabular-nums">{upload.progress >= 1 ? '…' : `${Math.round(upload.progress * 100)} %`}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="relative min-h-[320px] flex-1 overflow-y-auto bg-slate-50/60 p-5 sm:p-6">
          {dragging ? (
            <div className="pointer-events-none absolute inset-3 z-10 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-purple-brand bg-purple-brand/5 text-purple-brand">
              <IconUpload size={28} />
              <p className="text-sm font-medium">Déposez vos fichiers pour les envoyer</p>
            </div>
          ) : null}

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}{' '}
              <button type="button" onClick={refresh} className="font-medium underline">
                Réessayer
              </button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="aspect-[4/3] animate-pulse rounded-xl bg-slate-200/70" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex h-full min-h-[260px] flex-col items-center justify-center text-center">
              <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
                {tab === 'video' ? <IconVideo size={22} /> : <IconImage size={22} />}
              </span>
              <p className="font-medium text-slate-800">
                {query ? 'Aucun fichier ne correspond' : tab === 'video' ? 'Aucune vidéo pour le moment' : 'Aucune image pour le moment'}
              </p>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Glissez un fichier ici, utilisez « Envoyer »{tab === 'video' ? ', ou collez un lien YouTube / Vimeo via « Depuis un lien »' : ' ou « Depuis un lien »'}.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {filtered.map((object) => {
                const index = selected.indexOf(object.url)
                const isSelected = index >= 0
                return (
                  <button
                    key={object.key}
                    type="button"
                    onClick={() => choose(object.url)}
                    className={`group relative overflow-hidden rounded-xl border bg-white text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-brand/25 ${
                      isSelected ? 'border-purple-brand ring-2 ring-purple-brand' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                      <MediaPreview url={object.url} contentType={object.contentType} className="transition duration-300 group-hover:scale-[1.03]" />
                    </div>
                    <p className="truncate px-2.5 py-2 text-xs text-slate-600">{displayName(object.key)}</p>
                    {isSelected ? (
                      <span className="absolute right-2 top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-purple-brand px-1.5 text-[11px] font-bold text-white shadow">
                        {multiple ? index + 1 : <IconCheck size={14} strokeWidth={3} />}
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {multiple ? (
          <footer className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-3 sm:px-6">
            <p className="text-[13px] text-slate-500">
              {selected.length ? `${selected.length} élément(s) sélectionné(s)` : 'Sélectionnez un ou plusieurs fichiers'}
            </p>
            <div className="flex gap-2">
              <button type="button" className={buttonClasses('secondary')} onClick={onClose}>
                Annuler
              </button>
              <button type="button" className={buttonClasses('primary')} disabled={!selected.length || uploads.length > 0} onClick={() => onSelect(selected)}>
                Ajouter{selected.length ? ` (${selected.length})` : ''}
              </button>
            </div>
          </footer>
        ) : null}
      </div>
    </div>,
    document.body
  )
}
