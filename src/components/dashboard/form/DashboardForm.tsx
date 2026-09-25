'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ActionResult } from '@/lib/dashboard/action-result'
import { useToast } from '../ui/Toaster'
import { buttonClasses } from '../ui/primitives'
import { IconArrowLeft, IconCheck, IconSpinner } from '../ui/icons'

export type EditLanguage = 'fr' | 'en'

interface DashboardFormContextValue {
  lang: EditLanguage
  setLang: (lang: EditLanguage) => void
  markDirty: () => void
  reportMissing: (id: string, missing: boolean) => void
}

const DashboardFormContext = createContext<DashboardFormContextValue>({
  lang: 'fr',
  setLang: () => undefined,
  markDirty: () => undefined,
  reportMissing: () => undefined,
})

export function useDashboardForm() {
  return useContext(DashboardFormContext)
}

const LEAVE_MESSAGE = 'Vous avez des modifications non enregistrées. Quitter cette page sans enregistrer ?'

export function DashboardForm({
  action,
  title,
  subtitle,
  backHref,
  backLabel = 'Retour',
  headerExtra,
  bilingual = true,
  submitLabel = 'Enregistrer',
  flash,
  children,
}: {
  action: (formData: FormData) => Promise<ActionResult>
  title: React.ReactNode
  subtitle?: React.ReactNode
  backHref?: string
  backLabel?: string
  headerExtra?: React.ReactNode
  bilingual?: boolean
  submitLabel?: string
  /** Message shown once when the page opens (e.g. after creating an item). */
  flash?: string
  children: React.ReactNode
}) {
  const router = useRouter()
  const toast = useToast()
  const formRef = useRef<HTMLFormElement>(null)
  const [lang, setLang] = useState<EditLanguage>('fr')
  const [dirty, setDirty] = useState(false)
  const [justSaved, setJustSaved] = useState(false)
  const [pending, setPending] = useState(false)
  const missing = useRef(new Set<string>())
  const [missingCount, setMissingCount] = useState(0)

  const markDirty = useCallback(() => {
    setDirty(true)
    setJustSaved(false)
  }, [])

  const reportMissing = useCallback((id: string, isMissing: boolean) => {
    const set = missing.current
    const had = set.has(id)
    if (isMissing && !had) set.add(id)
    else if (!isMissing && had) set.delete(id)
    else return
    setMissingCount(set.size)
  }, [])

  // One-time message passed by the page (e.g. "?created=1")
  const flashShown = useRef(false)
  useEffect(() => {
    if (!flash || flashShown.current) return
    flashShown.current = true
    toast.success(flash)
    router.replace(window.location.pathname, { scroll: false })
  }, [flash, toast, router])

  // Warn before leaving with unsaved changes (tab close + in-app links)
  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = LEAVE_MESSAGE
    }
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!anchor || anchor.target === '_blank' || event.metaKey || event.ctrlKey) return
      if (anchor.getAttribute('href')?.startsWith('#')) return
      if (!window.confirm(LEAVE_MESSAGE)) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    document.addEventListener('click', onClick, true)
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      document.removeEventListener('click', onClick, true)
    }
  }, [dirty])

  const submit = useCallback(async () => {
    const form = formRef.current
    if (!form || pending) return
    // Let the browser point at visible invalid fields; hidden ones are checked by the server with a clear message.
    const firstInvalid = form.querySelector<HTMLElement>('input:invalid, textarea:invalid, select:invalid')
    if (firstInvalid && firstInvalid.offsetParent !== null) {
      form.reportValidity()
      return
    }
    setPending(true)
    try {
      const result = await action(new FormData(form))
      if (!result.ok) {
        toast.error('Impossible d’enregistrer', result.error)
        return
      }
      setDirty(false)
      if (result.redirectTo) {
        router.push(result.redirectTo)
        return
      }
      setJustSaved(true)
      toast.success(result.message || 'Modifications enregistrées')
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('Une erreur est survenue', 'Vérifiez votre connexion puis réessayez.')
    } finally {
      setPending(false)
    }
  }, [action, pending, router, toast])

  // Ctrl/Cmd + S saves
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        submit()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [submit])

  const context = useMemo(() => ({ lang, setLang, markDirty, reportMissing }), [lang, markDirty, reportMissing])

  return (
    <DashboardFormContext.Provider value={context}>
      <form
        ref={formRef}
        noValidate={false}
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
        onInput={(event) => {
          if (!(event.target as HTMLElement).closest('[data-ignore-dirty]')) markDirty()
        }}
      >
        <div className="sticky top-14 z-30 -mx-4 mb-8 border-b border-slate-200/80 bg-slate-50/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:top-0 lg:-mx-10 lg:px-10">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              {backHref ? (
                <Link
                  href={backHref}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                  title={backLabel}
                  aria-label={backLabel}
                >
                  <IconArrowLeft size={16} />
                </Link>
              ) : null}
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-2">
                  <h1 className="truncate text-lg font-semibold tracking-tight text-slate-900">{title}</h1>
                  {headerExtra}
                </div>
                {subtitle ? <p className="truncate text-[13px] text-slate-500">{subtitle}</p> : null}
              </div>
            </div>

            <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
              {bilingual ? <LanguageSwitch lang={lang} onChange={setLang} missing={missingCount} /> : <span />}
              <div className="flex items-center gap-3">
                <SaveState dirty={dirty} saved={justSaved} />
                <button type="submit" disabled={pending} className={buttonClasses('primary', 'md', 'min-w-[124px]')}>
                  {pending ? <IconSpinner size={16} /> : null}
                  {pending ? 'Enregistrement…' : submitLabel}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl">{children}</div>
      </form>
    </DashboardFormContext.Provider>
  )
}

function SaveState({ dirty, saved }: { dirty: boolean; saved: boolean }) {
  if (dirty) {
    return (
      <span className="hidden items-center gap-1.5 text-[13px] text-amber-700 md:inline-flex">
        <span className="h-2 w-2 rounded-full bg-amber-500" />
        Non enregistré
      </span>
    )
  }
  if (saved) {
    return (
      <span className="hidden items-center gap-1 text-[13px] text-emerald-700 md:inline-flex">
        <IconCheck size={14} strokeWidth={2.4} />
        Enregistré
      </span>
    )
  }
  return null
}

function LanguageSwitch({
  lang,
  onChange,
  missing,
}: {
  lang: EditLanguage
  onChange: (lang: EditLanguage) => void
  missing: number
}) {
  const options: { id: EditLanguage; label: string; flag: string }[] = [
    { id: 'fr', label: 'Français', flag: 'FR' },
    { id: 'en', label: 'English', flag: 'EN' },
  ]
  return (
    <div role="radiogroup" aria-label="Langue de saisie" className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
      {options.map((option) => {
        const active = option.id === lang
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.id)}
            className={`relative inline-flex h-8 items-center gap-2 rounded-md px-3 text-[13px] font-medium transition ${
              active ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className={`text-[10px] font-bold tracking-wide ${active ? 'text-white/60' : 'text-slate-400'}`}>{option.flag}</span>
            <span className="hidden sm:inline">{option.label}</span>
            {option.id === 'en' && missing > 0 ? (
              <span
                title={`${missing} texte(s) à traduire en anglais`}
                className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-amber-950"
              >
                {missing}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
