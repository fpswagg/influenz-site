'use client'

import { useMemo, useState } from 'react'
import { useDashboardForm } from './form/DashboardForm'
import { inputClasses } from './ui/primitives'
import { IconCopy, IconSearch } from './ui/icons'

export interface TextEntry {
  key: string
  group: string
  kind: 'TEXT' | 'TEXTAREA' | 'LIST'
  label: string
  hint?: string | null
  valueFr: string
  valueEn: string
}

export interface TextGroup {
  id: string
  label: string
  description: string
}

type Values = Record<string, { fr: string; en: string }>

function isMissing(value: { fr: string; en: string }) {
  return Boolean(value.fr.trim()) && !value.en.trim()
}

export function TextsEditor({ entries, groups, initialGroup }: { entries: TextEntry[]; groups: TextGroup[]; initialGroup?: string }) {
  const { markDirty } = useDashboardForm()
  const [values, setValues] = useState<Values>(() =>
    Object.fromEntries(entries.map((entry) => [entry.key, { fr: entry.valueFr, en: entry.valueEn }]))
  )
  const [activeGroup, setActiveGroup] = useState(
    initialGroup && groups.some((group) => group.id === initialGroup) ? initialGroup : groups[0]?.id
  )
  const [query, setQuery] = useState('')
  const [onlyMissing, setOnlyMissing] = useState(false)

  const missingByGroup = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const entry of entries) {
      if (isMissing(values[entry.key])) counts[entry.group] = (counts[entry.group] || 0) + 1
    }
    return counts
  }, [entries, values])
  const totalMissing = Object.values(missingByGroup).reduce((sum, count) => sum + count, 0)

  const q = query.trim().toLowerCase()
  const searching = q.length > 0 || onlyMissing

  function isVisible(entry: TextEntry) {
    if (onlyMissing && !isMissing(values[entry.key])) return false
    if (q) {
      const value = values[entry.key]
      return `${entry.label} ${value.fr} ${value.en}`.toLowerCase().includes(q)
    }
    return searching || entry.group === activeGroup
  }

  const visibleCount = entries.filter(isVisible).length

  function set(key: string, language: 'fr' | 'en', value: string) {
    setValues((current) => ({ ...current, [key]: { ...current[key], [language]: value } }))
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="space-y-4 lg:sticky lg:top-24">
        <div className="relative" data-ignore-dirty>
          <IconSearch size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un texte…" className={`${inputClasses} h-10 pl-9`} />
        </div>

        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-700" data-ignore-dirty>
          <span>
            À traduire uniquement
            {totalMissing ? <span className="ml-1.5 rounded-full bg-amber-400 px-1.5 text-[11px] font-bold text-amber-950">{totalMissing}</span> : null}
          </span>
          <input type="checkbox" checked={onlyMissing} onChange={(event) => setOnlyMissing(event.target.checked)} className="h-4 w-4 accent-purple-brand" />
        </label>

        <select
          data-ignore-dirty
          value={activeGroup}
          onChange={(event) => {
            setActiveGroup(event.target.value)
            setQuery('')
            setOnlyMissing(false)
          }}
          className={`${inputClasses} h-10 lg:hidden`}
          aria-label="Partie du site"
        >
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.label}
              {missingByGroup[group.id] ? ` (${missingByGroup[group.id]} à traduire)` : ''}
            </option>
          ))}
        </select>

        <nav className="hidden rounded-xl border border-slate-200 bg-white p-1.5 lg:block" aria-label="Parties du site">
          {groups.map((group) => {
            const active = !searching && group.id === activeGroup
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => {
                  setActiveGroup(group.id)
                  setQuery('')
                  setOnlyMissing(false)
                }}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-[13px] font-medium transition ${
                  active ? 'bg-purple-brand/[0.08] text-purple-brand' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="truncate">{group.label}</span>
                {missingByGroup[group.id] ? (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400" title={`${missingByGroup[group.id]} à traduire`} />
                ) : null}
              </button>
            )
          })}
        </nav>
      </aside>

      <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <header className="border-b border-slate-100 px-5 py-4 sm:px-6">
          {searching ? (
            <>
              <h2 className="text-[15px] font-semibold text-slate-900">Résultats</h2>
              <p className="mt-0.5 text-sm text-slate-500">{visibleCount} texte(s) trouvé(s)</p>
            </>
          ) : (
            <>
              <h2 className="text-[15px] font-semibold text-slate-900">{groups.find((group) => group.id === activeGroup)?.label}</h2>
              <p className="mt-0.5 text-sm text-slate-500">{groups.find((group) => group.id === activeGroup)?.description}</p>
            </>
          )}
          <div className="mt-4 hidden grid-cols-2 gap-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400 md:grid">
            <span>Français</span>
            <span>English</span>
          </div>
        </header>

        {visibleCount === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-slate-500">
            {onlyMissing && !q ? 'Tout est traduit. Bravo !' : 'Aucun texte ne correspond à votre recherche.'}
          </p>
        ) : null}

        <ul className="divide-y divide-slate-100">
          {entries.map((entry) => {
            const value = values[entry.key]
            const missing = isMissing(value)
            const multiline = entry.kind !== 'TEXT'
            const rows = entry.kind === 'LIST' ? 5 : Math.min(6, Math.max(2, Math.ceil(value.fr.length / 70)))
            return (
              <li key={entry.key} hidden={!isVisible(entry)} className="px-5 py-4 sm:px-6">
                <input type="hidden" name="copy.key" value={entry.key} />
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-slate-800">{entry.label}</span>
                  {searching ? <span className="text-xs text-slate-400">· {groups.find((group) => group.id === entry.group)?.label}</span> : null}
                  {missing ? (
                    <span className="rounded-full bg-amber-50 px-2 py-px text-[11px] font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">À traduire</span>
                  ) : null}
                </div>
                {entry.hint || entry.kind === 'LIST' ? (
                  <p className="mb-2 text-xs text-slate-500">{entry.hint || 'Un point par ligne.'}</p>
                ) : null}
                <div className="grid gap-3 md:grid-cols-2">
                  {(['fr', 'en'] as const).map((language) => {
                    const common = {
                      name: `copy__${entry.key}__${language === 'fr' ? 'Fr' : 'En'}`,
                      value: value[language],
                      'aria-label': `${entry.label} (${language === 'fr' ? 'français' : 'anglais'})`,
                      placeholder: language === 'en' ? value.fr : '',
                    }
                    return (
                      <div key={language} className="relative">
                        <span className="pointer-events-none absolute right-2 top-2 z-[1] rounded bg-slate-100 px-1 text-[10px] font-bold text-slate-400 md:hidden">
                          {language.toUpperCase()}
                        </span>
                        {multiline ? (
                          <textarea
                            {...common}
                            rows={rows}
                            onChange={(event) => set(entry.key, language, event.target.value)}
                            className={`${inputClasses} resize-y leading-relaxed ${missing && language === 'en' ? 'border-amber-300 bg-amber-50/30' : ''}`}
                          />
                        ) : (
                          <input
                            {...common}
                            onChange={(event) => set(entry.key, language, event.target.value)}
                            className={`${inputClasses} h-10 ${missing && language === 'en' ? 'border-amber-300 bg-amber-50/30' : ''}`}
                          />
                        )}
                        {language === 'en' && missing ? (
                          <button
                            type="button"
                            onClick={() => {
                              set(entry.key, 'en', value.fr)
                              markDirty()
                            }}
                            className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-purple-brand hover:underline"
                          >
                            <IconCopy size={12} /> Reprendre le texte français
                          </button>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
