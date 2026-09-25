'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useDashboardForm, type EditLanguage } from './DashboardForm'
import { Field, IconButton, TextArea, TextInput } from '../ui/primitives'
import { IconChevronDown, IconChevronUp, IconCopy, IconPlus, IconX } from '../ui/icons'

function LangTag({ lang }: { lang: EditLanguage }) {
  return (
    <span className="rounded bg-slate-100 px-1.5 py-px text-[10px] font-bold tracking-wide text-slate-500">
      {lang === 'fr' ? 'FR' : 'EN'}
    </span>
  )
}

function MissingTag() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-px text-[11px] font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
      À traduire
    </span>
  )
}

function useMissingReport(isMissing: boolean) {
  const id = useId()
  const { reportMissing } = useDashboardForm()
  useEffect(() => {
    reportMissing(id, isMissing)
  }, [id, isMissing, reportMissing])
  useEffect(() => () => reportMissing(id, false), [id, reportMissing])
}

function FrenchReference({ text }: { text: string }) {
  if (!text) return null
  return (
    <p className="line-clamp-3 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-500">
      <span className="font-semibold text-slate-400">FR · </span>
      {text}
    </p>
  )
}

function Counter({ value, recommended }: { value: string; recommended: number }) {
  const length = value.length
  const over = length > recommended
  return (
    <span className={`text-xs tabular-nums ${over ? 'text-amber-600' : 'text-slate-400'}`}>
      {length} / {recommended}
    </span>
  )
}

/** A text field stored in French and English. Only the language chosen in the page header is shown. */
export function BilingualText({
  name,
  label,
  hint,
  defaultFr = '',
  defaultEn = '',
  multiline,
  rows = 4,
  required,
  optional,
  placeholder,
  recommendedLength,
  onValueChange,
  hideLabel,
}: {
  name: string
  label: React.ReactNode
  hint?: React.ReactNode
  defaultFr?: string | null
  defaultEn?: string | null
  multiline?: boolean
  rows?: number
  required?: boolean
  optional?: boolean
  hideLabel?: boolean
  placeholder?: string
  /** Shows a character counter (useful for Google titles/descriptions). */
  recommendedLength?: number
  onValueChange?: (values: { fr: string; en: string }) => void
}) {
  const { lang, markDirty } = useDashboardForm()
  const [fr, setFr] = useState(defaultFr || '')
  const [en, setEn] = useState(defaultEn || '')
  const inputId = useId()
  const isMissing = Boolean(fr.trim()) && !en.trim()
  useMissingReport(isMissing)

  const onChangeRef = useRef(onValueChange)
  onChangeRef.current = onValueChange
  useEffect(() => {
    onChangeRef.current?.({ fr, en })
  }, [fr, en])

  const current = lang === 'fr' ? fr : en

  const aside = (
    <div className="flex items-center gap-2">
      {lang === 'en' && isMissing ? <MissingTag /> : null}
      {recommendedLength ? <Counter value={current} recommended={recommendedLength} /> : null}
    </div>
  )

  const common = (value: string, set: (value: string) => void, visible: boolean, language: EditLanguage) => ({
    id: visible ? inputId : undefined,
    name: `${name}${language === 'fr' ? 'Fr' : 'En'}`,
    value,
    hidden: !visible,
    required: visible && required && language === 'fr',
    placeholder: language === 'en' && fr ? (hideLabel ? fr : 'English translation…') : placeholder,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(event.target.value),
  })

  return (
    <Field
      htmlFor={inputId}
      optional={optional}
      hideLabel={hideLabel}
      label={
        <>
          {label}
          <LangTag lang={lang} />
        </>
      }
      aside={aside}
      hint={hint}
    >
      {multiline ? (
        <>
          <TextArea rows={rows} {...common(fr, setFr, lang === 'fr', 'fr')} />
          <TextArea rows={rows} {...common(en, setEn, lang === 'en', 'en')} />
        </>
      ) : (
        <>
          <TextInput {...common(fr, setFr, lang === 'fr', 'fr')} />
          <TextInput {...common(en, setEn, lang === 'en', 'en')} />
        </>
      )}
      {lang === 'en' && fr && !hideLabel ? (
        <div className="space-y-1.5">
          <FrenchReference text={fr} />
          {!en ? (
            <button
              type="button"
              onClick={() => {
                setEn(fr)
                markDirty()
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-brand hover:underline"
            >
              <IconCopy size={12} />
              Reprendre le texte français (noms propres, marques…)
            </button>
          ) : null}
        </div>
      ) : null}
    </Field>
  )
}

/** An ordered list of short sentences (results, steps…) in both languages. */
export function BilingualList({
  name,
  label,
  hint,
  defaultFr = [],
  defaultEn = [],
  addLabel = 'Ajouter un élément',
  placeholder,
}: {
  name: string
  label: React.ReactNode
  hint?: React.ReactNode
  defaultFr?: string[]
  defaultEn?: string[]
  addLabel?: string
  placeholder?: string
}) {
  const { lang, markDirty } = useDashboardForm()
  const [lists, setLists] = useState<Record<EditLanguage, string[]>>({ fr: defaultFr, en: defaultEn })
  const focusIndex = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const frCount = lists.fr.filter((item) => item.trim()).length
  const enCount = lists.en.filter((item) => item.trim()).length
  const isMissing = frCount > 0 && enCount < frCount
  useMissingReport(isMissing)

  const items = lists[lang]

  useEffect(() => {
    if (focusIndex.current === null) return
    const inputs = containerRef.current?.querySelectorAll<HTMLInputElement>('input[data-list-item]')
    inputs?.[focusIndex.current]?.focus()
    focusIndex.current = null
  })

  function update(next: string[]) {
    setLists((current) => ({ ...current, [lang]: next }))
    markDirty()
  }

  function move(index: number, delta: number) {
    const target = index + delta
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    update(next)
  }

  return (
    <Field
      label={
        <>
          {label}
          <LangTag lang={lang} />
        </>
      }
      aside={lang === 'en' && isMissing ? <MissingTag /> : null}
      hint={hint}
    >
      <input type="hidden" name={`${name}Fr`} value={lists.fr.map((item) => item.replace(/\n/g, ' ').trim()).filter(Boolean).join('\n')} />
      <input type="hidden" name={`${name}En`} value={lists.en.map((item) => item.replace(/\n/g, ' ').trim()).filter(Boolean).join('\n')} />
      <div ref={containerRef} className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="group flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-500">
              {index + 1}
            </span>
            <TextInput
              data-list-item
              value={item}
              placeholder={lang === 'en' ? lists.fr[index] || placeholder : placeholder}
              onChange={(event) => {
                const next = [...items]
                next[index] = event.target.value
                update(next)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  const next = [...items]
                  next.splice(index + 1, 0, '')
                  focusIndex.current = index + 1
                  update(next)
                }
              }}
            />
            <div className="flex shrink-0 items-center">
              <IconButton label="Monter" onClick={() => move(index, -1)} disabled={index === 0}>
                <IconChevronUp size={16} />
              </IconButton>
              <IconButton label="Descendre" onClick={() => move(index, 1)} disabled={index === items.length - 1}>
                <IconChevronDown size={16} />
              </IconButton>
              <IconButton label="Supprimer" tone="danger" onClick={() => update(items.filter((_, i) => i !== index))}>
                <IconX size={16} />
              </IconButton>
            </div>
          </div>
        ))}
        {lang === 'en' && lists.fr.length > items.length ? (
          <p className="text-xs text-slate-500">
            La version française contient {lists.fr.length} élément(s).
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => {
            focusIndex.current = items.length
            update([...items, ''])
          }}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-purple-brand hover:bg-purple-brand/5"
        >
          <IconPlus size={16} />
          {addLabel}
        </button>
      </div>
    </Field>
  )
}
