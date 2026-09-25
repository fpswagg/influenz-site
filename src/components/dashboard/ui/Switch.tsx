'use client'

import { useId, useState } from 'react'
import { useDashboardForm } from '../form/DashboardForm'

/**
 * On/off switch that submits `name=true` when on (and nothing when off).
 * Works controlled (`checked` + `onChange`) or uncontrolled (`defaultChecked`).
 */
export function Switch({
  name,
  label,
  description,
  defaultChecked = false,
  checked: controlled,
  onChange,
  size = 'md',
}: {
  name?: string
  label?: React.ReactNode
  description?: React.ReactNode
  defaultChecked?: boolean
  checked?: boolean
  onChange?: (value: boolean) => void
  size?: 'sm' | 'md'
}) {
  const id = useId()
  const { markDirty } = useDashboardForm()
  const [internal, setInternal] = useState(defaultChecked)
  const checked = controlled ?? internal

  function toggle() {
    const next = !checked
    if (controlled === undefined) setInternal(next)
    onChange?.(next)
    markDirty()
  }

  const track = size === 'sm' ? 'h-5 w-9' : 'h-6 w-11'
  const thumb = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
  const shift = size === 'sm' ? 'translate-x-4' : 'translate-x-5'

  const control = (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={toggle}
      className={`relative inline-flex ${track} shrink-0 items-center rounded-full p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-brand/20 ${
        checked ? 'bg-purple-brand' : 'bg-slate-300'
      }`}
    >
      <span className={`${thumb} rounded-full bg-white shadow-sm transition-transform ${checked ? shift : 'translate-x-0'}`} />
    </button>
  )

  return (
    <>
      {name && checked ? <input type="hidden" name={name} value="true" /> : null}
      {label ? (
        <div className="flex items-start justify-between gap-4">
          <label htmlFor={id} className="min-w-0 cursor-pointer">
            <span className="block text-sm font-medium text-slate-800">{label}</span>
            {description ? <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{description}</span> : null}
          </label>
          {control}
        </div>
      ) : (
        control
      )}
    </>
  )
}
