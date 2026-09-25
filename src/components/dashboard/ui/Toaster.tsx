'use client'

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { IconAlert, IconCheck, IconX } from './icons'

type ToastKind = 'success' | 'error'

interface Toast {
  id: number
  kind: ToastKind
  title: string
  description?: string
}

interface ToastApi {
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastApi>({
  success: () => undefined,
  error: () => undefined,
})

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const push = useCallback(
    (kind: ToastKind, title: string, description?: string) => {
      counter.current += 1
      const id = counter.current
      setToasts((current) => [...current.slice(-2), { id, kind, title, description }])
      window.setTimeout(() => dismiss(id), kind === 'error' ? 7000 : 3500)
    },
    [dismiss]
  )

  const api = useMemo<ToastApi>(
    () => ({
      success: (title, description) => push('success', title, description),
      error: (title, description) => push('error', title, description),
    }),
    [push]
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.kind === 'error' ? 'alert' : 'status'}
            className="dash-toast pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-900/10"
          >
            <span
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                toast.kind === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {toast.kind === 'success' ? <IconCheck size={14} strokeWidth={2.5} /> : <IconAlert size={14} strokeWidth={2.2} />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900">{toast.title}</p>
              {toast.description ? <p className="mt-0.5 text-sm text-slate-500">{toast.description}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Fermer"
            >
              <IconX size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
