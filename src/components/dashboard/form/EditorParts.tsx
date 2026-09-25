'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { deleteItemAction, type ListKind } from '@/app/dashboard/actions'
import { useConfirm } from '../ui/ConfirmDialog'
import { useToast } from '../ui/Toaster'
import { buttonClasses } from '../ui/primitives'
import { IconCheck, IconChevronDown, IconSpinner, IconTrash } from '../ui/icons'

/** Main content on the left, publication settings on the right (stacked on small screens). */
export function EditorGrid({ main, aside }: { main: React.ReactNode; aside: React.ReactNode }) {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0 space-y-6">{main}</div>
      <div className="space-y-6 lg:sticky lg:top-24">{aside}</div>
    </div>
  )
}

/** Toggleable pills backed by real checkboxes (submitted as `name=value`). */
export function ChipCheckboxes({
  name,
  options,
  defaultValue = [],
  emptyText,
}: {
  name: string
  options: { value: string; label: string }[]
  defaultValue?: string[]
  emptyText?: React.ReactNode
}) {
  if (!options.length) return <p className="text-sm text-slate-500">{emptyText}</p>
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <label key={option.value} className="cursor-pointer">
          <input type="checkbox" name={name} value={option.value} defaultChecked={defaultValue.includes(option.value)} className="peer sr-only" />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[13px] text-slate-600 transition hover:border-slate-300 peer-checked:border-purple-brand peer-checked:bg-purple-brand/[0.07] peer-checked:text-purple-brand peer-focus-visible:ring-4 peer-focus-visible:ring-purple-brand/20 [&>svg]:hidden peer-checked:[&>svg]:block">
            <IconCheck size={13} strokeWidth={2.6} />
            {option.label}
          </span>
        </label>
      ))}
    </div>
  )
}

/** Collapsed "advanced" box so that rarely-needed settings don't distract. */
export function AdvancedBox({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        {title}
        <IconChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div hidden={!open} className="space-y-4 border-t border-slate-100 px-5 py-4">
        {children}
      </div>
    </div>
  )
}

/** Web address field (slug) with its prefix shown, e.g. /projets/[mon-projet] */
export function SlugField({ prefix, defaultValue, isNew }: { prefix: string; defaultValue?: string; isNew: boolean }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor="slug" className="text-sm font-medium text-slate-800">
        Adresse de la page
      </label>
      <div className="flex h-10 items-center overflow-hidden rounded-lg border border-slate-200 bg-white text-sm focus-within:border-purple-brand focus-within:ring-4 focus-within:ring-purple-brand/10">
        <span className="flex h-full items-center border-r border-slate-200 bg-slate-50 px-2.5 text-slate-500">{prefix}</span>
        <input
          id="slug"
          name="slug"
          defaultValue={defaultValue}
          placeholder={isNew ? 'créée à partir du titre' : ''}
          className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>
      <p className="text-xs leading-relaxed text-slate-500">
        {isNew
          ? 'Laissez vide : l’adresse sera créée automatiquement à partir du titre.'
          : 'Attention : modifier l’adresse rend les anciens liens partagés inaccessibles.'}
      </p>
    </div>
  )
}

export function DeleteZone({ kind, id, name, noun, redirectTo }: { kind: ListKind; id: string; name: string; noun: string; redirectTo: string }) {
  const router = useRouter()
  const confirm = useConfirm()
  const toast = useToast()
  const [busy, setBusy] = useState(false)

  return (
    <div className="rounded-2xl border border-red-100 bg-white px-5 py-4">
      <p className="text-sm font-medium text-slate-800">Supprimer {noun}</p>
      <p className="mt-0.5 text-xs leading-relaxed text-slate-500">Définitif. Pour masquer temporairement, désactivez plutôt « En ligne ».</p>
      <button
        type="button"
        disabled={busy}
        className={buttonClasses('danger-ghost', 'sm', 'mt-3 -ml-2.5')}
        onClick={async () => {
          const ok = await confirm({
            title: `Supprimer « ${name} » ?`,
            description: 'Cette action est définitive et ne peut pas être annulée.',
            confirmLabel: 'Supprimer définitivement',
          })
          if (!ok) return
          setBusy(true)
          const result = await deleteItemAction(kind, id)
          if (result.ok) {
            toast.success(result.message || 'Supprimé')
            router.push(redirectTo)
          } else {
            setBusy(false)
            toast.error('Suppression impossible', result.error)
          }
        }}
      >
        {busy ? <IconSpinner size={14} /> : <IconTrash size={14} />}
        Supprimer définitivement
      </button>
    </div>
  )
}
