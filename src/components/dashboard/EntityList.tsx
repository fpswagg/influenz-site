'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { deleteItemAction, reorderItemsAction, setPublishedAction, type ListKind } from '@/app/dashboard/actions'
import { useConfirm } from './ui/ConfirmDialog'
import { useToast } from './ui/Toaster'
import { Badge, EmptyState, IconButton, StatusBadge, buttonClasses, inputClasses } from './ui/primitives'
import { IconChevronDown, IconChevronUp, IconExternal, IconEye, IconEyeOff, IconPencil, IconPlus, IconSearch, IconTrash } from './ui/icons'

export interface EntityListItem {
  id: string
  title: string
  subtitle?: string
  thumb?: string | null
  /** Shown when there is no image (emoji, initials…) */
  fallback?: string
  published: boolean
  badges?: { label: string; tone?: 'brand' | 'warning' | 'neutral' }[]
  editHref: string
  publicHref?: string | null
  searchText?: string
}

type Filter = 'all' | 'published' | 'draft'

export function EntityList({
  kind,
  items: initialItems,
  noun,
  newHref,
  newLabel,
  emptyTitle,
  emptyDescription,
  emptyIcon,
}: {
  kind: ListKind
  items: EntityListItem[]
  /** Singular noun with article, used in messages: « ce projet » */
  noun: string
  newHref: string
  newLabel: string
  emptyTitle: string
  emptyDescription: string
  emptyIcon?: React.ReactNode
}) {
  const confirm = useConfirm()
  const toast = useToast()
  const [items, setItems] = useState(initialItems)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => setItems(initialItems), [initialItems])

  const counts = useMemo(
    () => ({
      all: items.length,
      published: items.filter((item) => item.published).length,
      draft: items.filter((item) => !item.published).length,
    }),
    [items]
  )

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((item) => {
      if (filter === 'published' && !item.published) return false
      if (filter === 'draft' && item.published) return false
      if (!q) return true
      return `${item.title} ${item.subtitle || ''} ${item.searchText || ''}`.toLowerCase().includes(q)
    })
  }, [items, query, filter])

  const canReorder = !query.trim() && filter === 'all'

  function move(index: number, delta: number) {
    const target = index + delta
    if (target < 0 || target >= items.length) return
    const previous = items
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    setItems(next)
    reorderItemsAction(kind, next.map((item) => item.id)).then((result) => {
      if (!result.ok) {
        setItems(previous)
        toast.error('L’ordre n’a pas pu être modifié', result.error)
      }
    })
  }

  async function togglePublished(item: EntityListItem) {
    const nextValue = !item.published
    setBusyId(item.id)
    setItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, published: nextValue } : entry)))
    const result = await setPublishedAction(kind, item.id, nextValue)
    setBusyId(null)
    if (result.ok) toast.success(result.message || 'Statut mis à jour', item.title)
    else {
      setItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, published: item.published } : entry)))
      toast.error('Le statut n’a pas pu être modifié', result.error)
    }
  }

  async function remove(item: EntityListItem) {
    const ok = await confirm({
      title: `Supprimer « ${item.title} » ?`,
      description: (
        <>
          Cette action est définitive : {noun} disparaîtra du site et du tableau de bord.
          {item.published ? (
            <>
              <br />
              Pour le masquer temporairement, passez-le plutôt en <strong>brouillon</strong>.
            </>
          ) : null}
        </>
      ),
      confirmLabel: 'Supprimer définitivement',
    })
    if (!ok) return
    setBusyId(item.id)
    const result = await deleteItemAction(kind, item.id)
    setBusyId(null)
    if (result.ok) {
      setItems((current) => current.filter((entry) => entry.id !== item.id))
      toast.success(result.message || 'Supprimé')
    } else {
      toast.error('Suppression impossible', result.error)
    }
  }

  if (!items.length) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        action={
          <Link href={newHref} className={buttonClasses('primary')}>
            <IconPlus size={16} /> {newLabel}
          </Link>
        }
      />
    )
  }

  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: 'Tous' },
    { id: 'published', label: 'En ligne' },
    { id: 'draft', label: 'Brouillons' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex self-start rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
          {filters.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setFilter(option.id)}
              className={`inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-[13px] font-medium transition ${
                filter === option.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {option.label}
              <span className={`text-xs tabular-nums ${filter === option.id ? 'text-white/60' : 'text-slate-400'}`}>{counts[option.id]}</span>
            </button>
          ))}
        </div>
        <div className="relative sm:w-72">
          <IconSearch size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher…"
            className={`${inputClasses} h-10 pl-9`}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        {visible.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-slate-500">Aucun résultat pour cette recherche.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {visible.map((item) => {
              const index = items.indexOf(item)
              const busy = busyId === item.id
              return (
                <li key={item.id} className={`group relative flex items-center gap-4 px-4 py-3 transition hover:bg-slate-50/80 sm:px-5 ${busy ? 'opacity-60' : ''}`}>
                  {canReorder ? (
                    <div className="hidden shrink-0 flex-col sm:flex">
                      <IconButton label="Monter" className="h-6 w-7" onClick={() => move(index, -1)} disabled={index === 0}>
                        <IconChevronUp size={15} />
                      </IconButton>
                      <IconButton label="Descendre" className="h-6 w-7" onClick={() => move(index, 1)} disabled={index === items.length - 1}>
                        <IconChevronDown size={15} />
                      </IconButton>
                    </div>
                  ) : null}

                  <Link href={item.editHref} className="flex min-w-0 flex-1 items-center gap-4 focus-visible:outline-none">
                    <span className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100 text-xl">
                      {item.thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.thumb} alt="" loading="lazy" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-sm font-semibold text-slate-400">{item.fallback || '—'}</span>
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-slate-900 group-hover:text-purple-brand">{item.title}</span>
                      <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-slate-500">
                        {item.subtitle ? <span className="truncate">{item.subtitle}</span> : null}
                        {item.badges?.map((badge) => (
                          <Badge key={badge.label} tone={badge.tone || 'neutral'}>
                            {badge.label}
                          </Badge>
                        ))}
                      </span>
                    </span>
                  </Link>

                  <div className="hidden shrink-0 md:block">
                    <StatusBadge published={item.published} />
                  </div>

                  <div className="flex shrink-0 items-center gap-0.5">
                    <IconButton
                      label={item.published ? 'Passer en brouillon (masquer du site)' : 'Mettre en ligne'}
                      onClick={() => togglePublished(item)}
                      disabled={busy}
                    >
                      {item.published ? <IconEye size={17} /> : <IconEyeOff size={17} />}
                    </IconButton>
                    {item.publicHref && item.published ? (
                      <a
                        href={item.publicHref}
                        target="_blank"
                        rel="noreferrer"
                        title="Voir sur le site"
                        aria-label="Voir sur le site"
                        className="hidden h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 sm:inline-flex"
                      >
                        <IconExternal size={16} />
                      </a>
                    ) : null}
                    <Link
                      href={item.editHref}
                      title="Modifier"
                      aria-label="Modifier"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <IconPencil size={16} />
                    </Link>
                    <IconButton label="Supprimer" tone="danger" onClick={() => remove(item)} disabled={busy}>
                      <IconTrash size={16} />
                    </IconButton>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
      <p className="text-xs text-slate-400">
        {canReorder
          ? 'Utilisez les flèches pour choisir l’ordre d’affichage sur le site. L’œil permet de mettre en ligne ou de masquer.'
          : 'Effacez la recherche et choisissez « Tous » pour modifier l’ordre d’affichage.'}
      </p>
    </div>
  )
}
