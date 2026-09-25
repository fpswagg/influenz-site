'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { buttonClasses, inputClasses } from '@/components/dashboard/ui/primitives'
import { IconEye, IconEyeOff, IconSpinner } from '@/components/dashboard/ui/icons'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/dashboard/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!response.ok) {
        setError(response.status === 401 ? 'Mot de passe incorrect. Réessayez.' : 'Connexion impossible pour le moment.')
        setLoading(false)
        return
      }
      const from = searchParams.get('from')
      router.replace(from && from.startsWith('/dashboard') ? from : '/dashboard')
      router.refresh()
    } catch {
      setError('Connexion impossible. Vérifiez votre connexion internet.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-slate-800">
          Mot de passe
        </label>
        <div className="relative">
          <input
            id="password"
            type={visible ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoFocus
            autoComplete="current-password"
            aria-invalid={Boolean(error)}
            className={`${inputClasses} h-11 pr-11 ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
          />
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {visible ? <IconEyeOff size={16} /> : <IconEye size={16} />}
          </button>
        </div>
        {error ? (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        ) : null}
      </div>
      <button type="submit" disabled={loading} className={buttonClasses('primary', 'md', 'h-11 w-full')}>
        {loading ? <IconSpinner size={16} /> : null}
        {loading ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  )
}
