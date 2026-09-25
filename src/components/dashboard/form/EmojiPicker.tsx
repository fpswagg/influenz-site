'use client'

import { useState } from 'react'
import { useDashboardForm } from './DashboardForm'

const SUGGESTIONS = ['🌍', '🛡️', '📰', '📱', '🎪', '✨', '🚀', '🎯', '📣', '💡', '🤝', '📊', '🎤', '🎬', '📸', '🧭', '🏛️', '⚖️', '💬', '🌱', '🔍', '🏆', '📈', '🗞️']

export function EmojiPicker({ name, defaultValue = '' }: { name: string; defaultValue?: string }) {
  const { markDirty } = useDashboardForm()
  const [value, setValue] = useState(defaultValue)

  function choose(next: string) {
    setValue(next)
    markDirty()
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-3xl">
          {value || <span className="text-sm text-slate-300">—</span>}
        </span>
        <div className="min-w-0 text-xs leading-relaxed text-slate-500">
          Choisissez un symbole ci-dessous. Il s’affiche sur la carte de la solution quand il n’y a pas d’image.
        </div>
      </div>
      <input type="hidden" name={name} value={value} />
      <div className="grid grid-cols-8 gap-1">
        {SUGGESTIONS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => choose(emoji)}
            aria-label={`Choisir ${emoji}`}
            aria-pressed={value === emoji}
            className={`flex aspect-square items-center justify-center rounded-lg text-lg transition hover:bg-slate-100 ${
              value === emoji ? 'bg-purple-brand/10 ring-2 ring-purple-brand' : ''
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span>Autre :</span>
        <input
          value={value}
          onChange={(event) => choose(event.target.value.slice(0, 8))}
          className="h-8 w-16 rounded-md border border-slate-200 px-2 text-center text-base outline-none focus:border-purple-brand"
          aria-label="Symbole personnalisé"
        />
        {value ? (
          <button type="button" onClick={() => choose('')} className="text-slate-500 underline-offset-2 hover:underline">
            Aucun
          </button>
        ) : null}
      </div>
    </div>
  )
}
