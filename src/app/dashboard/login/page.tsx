import type { Metadata } from 'next'
import { Suspense } from 'react'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Connexion — Administration',
  robots: { index: false, follow: false },
}

export default function DashboardLoginPage() {
  return (
    <main className="dash relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-purple-brand/10 blur-3xl" />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="" className="mb-5 h-14 w-14 rounded-2xl border border-slate-200 bg-white object-contain p-2 shadow-sm" />
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Espace d’administration</h1>
          <p className="mt-1.5 text-sm text-slate-500">Connectez-vous pour modifier le contenu du site.</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">
          <a href="/" className="hover:text-slate-600">
            ← Retour au site
          </a>
        </p>
      </div>
    </main>
  )
}
