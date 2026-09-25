'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { StoredObject } from '@/lib/storage/sastorage'
import { useConfirm } from '../ui/ConfirmDialog'
import { useToast } from '../ui/Toaster'
import { IconButton, buttonClasses, inputClasses } from '../ui/primitives'
import { IconCopy, IconExternal, IconFile, IconImage, IconLink, IconSearch, IconTrash, IconUpload, IconVideo } from '../ui/icons'
import { MediaPreview } from './MediaPreview'
import { UrlImport } from './UrlImport'
import {
  acceptFor,
  displayName,
  fetchMediaUsage,
  formatSize,
  listStorage,
  mediaTypeOf,
  uploadToStorage,
  type MediaUsage,
} from './media-utils'

const TABS = [
  { id: 'image', label: 'Images', icon: IconImage },
  { id: 'video', label: 'Vidéos', icon: IconVideo },
  { id: 'file', label: 'Documents', icon: IconFile },
] as const

type Tab = (typeof TABS)[number]['id']
type UsageFilter = 'all' | 'used' | 'unused'

interface Upload {
  id: number
  name: string
  progress: number
}

let uploadCounter = 0

const dateFormat = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })

export function MediaLibrary() {
  const toast = useToast()
  const confirm = useConfirm()
  const [tab, setTab] = useState<Tab>('image')
  const [objects, setObjects] = useState<StoredObject[]>([])
  const [usage, setUsage] = useState<Record<string, MediaUsage[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [usageFilter, setUsageFilter] = useState<UsageFilter>('all')
  const [uploads, setUploads] = useState<Upload[]>([])
  const [dragging, setDragging] = useState(false)
  const [showLink, setShowLink] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [list, used] = await Promise.all([listStorage(tab), fetchMediaUsage()])
      setObjects(list)
      setUsage(used)
    } catch (err) {
      setObjects([])
      setError(err instanceof Error ? err.message : 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }, [tab])

  useEffect(() => {
    refresh()
  }, [refresh])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return objects.filter((object) => {
      if (q && !displayName(object.key).toLowerCase().includes(q)) return false
      const used = Boolean(usage[object.url]?.length)
      if (usageFilter === 'used' && !used) return false
      if (usageFilter === 'unused' && used) return false
      return true
    })
  }, [objects, query, usage, usageFilter])

  function added(object: StoredObject) {
    const type = mediaTypeOf(object.url, object.contentType)
    if (type === tab) setObjects((current) => [object, ...current.filter((item) => item.key !== object.key)])
    return type
  }

  async function handleFiles(files: FileList | null) {
    const list = Array.from(files || [])
    if (!list.length) return
    let success = 0
    let otherTab: Tab | null = null
    await Promise.all(
      list.map(async (file) => {
        const id = ++uploadCounter
        setUploads((current) => [...current, { id, name: file.name, progress: 0 }])
        try {
          // Images and videos are filed automatically; the Documents tab accepts anything
          const object = await uploadToStorage(file, tab === 'file' ? 'file' : 'any', (progress) =>
            setUploads((current) => current.map((item) => (item.id === id ? { ...item, progress } : item)))
          )
          const type = added(object)
          if (type !== tab) otherTab = type
          success += 1
        } catch (err) {
          toast.error(`« ${file.name} » n’a pas pu être envoyé`, err instanceof Error ? err.message : undefined)
        } finally {
          setUploads((current) => current.filter((item) => item.id !== id))
        }
      })
    )
    if (success) {
      const label = success > 1 ? `${success} fichiers envoyés` : 'Fichier envoyé'
      toast.success(label, otherTab ? `Rangé(s) dans l’onglet « ${TABS.find((item) => item.id === otherTab)?.label} ».` : undefined)
    }
  }

  async function remove(object: StoredObject) {
    const uses = usage[object.url] || []
    const ok = await confirm({
      title: `Supprimer « ${displayName(object.key)} » ?`,
      description: uses.length ? (
        <>
          <span className="font-medium text-red-600">Ce fichier est utilisé sur le site :</span>
          <span className="mt-1 block">{uses.map((use) => use.label).join(', ')}.</span>
          <span className="mt-1 block">Il disparaîtra de ces pages. Cette action est définitive.</span>
        </>
      ) : (
        'Ce fichier n’est utilisé nulle part sur le site. Cette action est définitive.'
      ),
      confirmLabel: 'Supprimer le fichier',
    })
    if (!ok) return
    setDeleting(object.key)
    const response = await fetch(`/api/dashboard/storage?key=${encodeURIComponent(object.key)}`, { method: 'DELETE' })
    setDeleting(null)
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      toast.error('Suppression impossible', data.error)
      return
    }
    setObjects((current) => current.filter((item) => item.key !== object.key))
    toast.success('Fichier supprimé')
  }

  async function copyLink(url: string) {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Lien copié', 'Vous pouvez le coller où vous voulez.')
    } catch {
      toast.error('Copie impossible', url)
    }
  }

  const usedCount = objects.filter((object) => usage[object.url]?.length).length

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
            {TABS.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-[13px] font-medium transition ${
                    tab === item.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon size={15} />
                  {item.label}
                </button>
              )
            })}
          </div>
          <div className="w-48">
            <select
              value={usageFilter}
              onChange={(event) => setUsageFilter(event.target.value as UsageFilter)}
              className={`${inputClasses} h-9 py-0 text-[13px]`}
              aria-label="Filtrer par utilisation"
            >
              <option value="all">Tous les fichiers</option>
              <option value="used">Utilisés sur le site</option>
              <option value="unused">Non utilisés</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 lg:w-64">
            <IconSearch size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un fichier…" className={`${inputClasses} h-10 pl-9`} />
          </div>
          <button
            type="button"
            onClick={() => setShowLink((current) => !current)}
            aria-expanded={showLink}
            className={buttonClasses('secondary', 'md', showLink ? 'border-purple-brand text-purple-brand' : '')}
          >
            <IconLink size={16} />
            <span className="hidden sm:inline">Depuis un lien</span>
          </button>
        </div>
      </div>

      {showLink ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="mb-2 text-sm font-medium text-slate-800">Importer depuis un lien</p>
          <UrlImport
            kind={tab === 'video' ? 'video' : tab === 'image' ? 'image' : 'any'}
            autoFocus
            onImported={(url, object) => {
              if (object) {
                const type = added(object)
                toast.success('Fichier importé dans la médiathèque', type !== tab ? `Rangé dans l’onglet « ${TABS.find((item) => item.id === type)?.label} ».` : undefined)
              } else {
                toast.success('Lien vidéo reconnu', 'Les vidéos YouTube / Vimeo s’ajoutent directement dans les fiches (projets, solutions…).')
              }
              setShowLink(false)
            }}
          />
        </div>
      ) : null}

      <label
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          handleFiles(event.dataTransfer.files)
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition ${
          dragging ? 'border-purple-brand bg-purple-brand/5' : 'border-slate-300 bg-white hover:border-slate-400'
        }`}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-brand/10 text-purple-brand">
          <IconUpload size={20} />
        </span>
        <span className="text-sm font-medium text-slate-800">Glissez vos images ou vidéos ici, ou cliquez pour les choisir</span>
        <span className="text-xs text-slate-500">Plusieurs fichiers à la fois. Les images et les vidéos sont rangées automatiquement.</span>
        <input
          type="file"
          multiple
          accept={tab === 'file' ? undefined : acceptFor('any')}
          className="sr-only"
          onChange={(event) => {
            handleFiles(event.target.files)
            event.target.value = ''
          }}
        />
      </label>

      {uploads.length ? (
        <ul className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
          {uploads.map((upload) => (
            <li key={upload.id} className="flex items-center gap-3 text-[13px] text-slate-600">
              <span className="w-40 truncate sm:w-72">{upload.name}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <span className="block h-full rounded-full bg-purple-brand transition-[width]" style={{ width: `${Math.round(upload.progress * 100)}%` }} />
              </span>
              <span className="w-24 text-right tabular-nums">{upload.progress >= 1 ? 'Finalisation…' : `${Math.round(upload.progress * 100)} %`}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}{' '}
          <button type="button" onClick={refresh} className="font-medium underline">
            Réessayer
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-200/70" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-500">
          {query || usageFilter !== 'all' ? 'Aucun fichier ne correspond à ces critères.' : 'Aucun fichier dans cet onglet pour le moment.'}
        </p>
      ) : (
        <>
          <p className="text-xs text-slate-500">
            {filtered.length} fichier(s){usageFilter === 'all' && objects.length ? ` · ${usedCount} utilisé(s) sur le site` : ''}
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {filtered.map((object) => {
              const uses = usage[object.url] || []
              const isVideo = mediaTypeOf(object.url, object.contentType) === 'video'
              return (
                <article
                  key={object.key}
                  className={`group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:shadow-md ${
                    deleting === object.key ? 'opacity-50' : ''
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <MediaPreview url={object.url} contentType={object.contentType} controls={isVideo} className={isVideo ? '' : 'transition duration-300 group-hover:scale-[1.03]'} />
                    <span
                      className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-medium shadow-sm ${
                        uses.length ? 'bg-emerald-600 text-white' : 'bg-white/90 text-slate-500'
                      }`}
                      title={uses.map((use) => use.label).join('\n')}
                    >
                      {uses.length ? `Utilisé${uses.length > 1 ? ` · ${uses.length}` : ''}` : 'Non utilisé'}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5 px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-slate-800" title={displayName(object.key)}>
                          {displayName(object.key)}
                        </p>
                        <p className="truncate text-[11px] text-slate-400">
                          {[formatSize(object.size), object.lastModified ? dateFormat.format(new Date(object.lastModified)) : null].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                      <div className="flex shrink-0">
                        <IconButton label="Copier le lien" onClick={() => copyLink(object.url)}>
                          <IconCopy size={15} />
                        </IconButton>
                        <a
                          href={object.url}
                          target="_blank"
                          rel="noreferrer"
                          title="Ouvrir"
                          aria-label="Ouvrir"
                          className="hidden h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 sm:inline-flex"
                        >
                          <IconExternal size={15} />
                        </a>
                        <IconButton label="Supprimer" tone="danger" onClick={() => remove(object)} disabled={deleting === object.key}>
                          <IconTrash size={15} />
                        </IconButton>
                      </div>
                    </div>
                    {uses.length ? (
                      <p className="truncate text-[11px] text-slate-500">
                        <Link href={uses[0].href} className="hover:text-purple-brand hover:underline">
                          {uses[0].label}
                        </Link>
                        {uses.length > 1 ? ` et ${uses.length - 1} autre(s)` : ''}
                      </p>
                    ) : null}
                  </div>
                </article>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
