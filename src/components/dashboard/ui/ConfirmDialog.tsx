'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { buttonClasses } from './primitives'
import { IconAlert } from './icons'

interface ConfirmOptions {
  title: string
  description?: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  tone?: 'danger' | 'default'
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>

const ConfirmContext = createContext<ConfirmFn>(async () => window.confirm('Confirmer ?'))

/** Returns an async `confirm()` that opens a styled dialog and resolves with the user's choice. */
export function useConfirm() {
  return useContext(ConfirmContext)
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null)
  const resolver = useRef<((value: boolean) => void) | null>(null)
  const confirmButton = useRef<HTMLButtonElement>(null)

  const confirm = useCallback<ConfirmFn>((next) => {
    setOptions(next)
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve
    })
  }, [])

  const close = useCallback((value: boolean) => {
    resolver.current?.(value)
    resolver.current = null
    setOptions(null)
  }, [])

  useEffect(() => {
    if (!options) return
    confirmButton.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [options, close])

  const danger = options?.tone !== 'default'

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {options ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center">
          <div className="dash-fade absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => close(false)} />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="dash-pop relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex gap-4">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  danger ? 'bg-red-100 text-red-600' : 'bg-purple-brand/10 text-purple-brand'
                }`}
              >
                <IconAlert size={20} />
              </span>
              <div className="min-w-0">
                <h3 id="confirm-title" className="text-base font-semibold text-slate-900">
                  {options.title}
                </h3>
                {options.description ? <div className="mt-1.5 text-sm leading-relaxed text-slate-500">{options.description}</div> : null}
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" className={buttonClasses('secondary')} onClick={() => close(false)}>
                {options.cancelLabel || 'Annuler'}
              </button>
              <button
                ref={confirmButton}
                type="button"
                className={buttonClasses(danger ? 'danger' : 'primary')}
                onClick={() => close(true)}
              >
                {options.confirmLabel || 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </ConfirmContext.Provider>
  )
}
