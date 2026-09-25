import type { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'danger-ghost'
type ButtonSize = 'sm' | 'md'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-purple-brand text-white shadow-sm hover:bg-purple-dark disabled:bg-purple-brand/50',
  secondary: 'border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700 disabled:bg-red-600/50',
  'danger-ghost': 'text-red-600 hover:bg-red-50',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 gap-1.5 rounded-lg px-2.5 text-[13px]',
  md: 'h-10 gap-2 rounded-lg px-4 text-sm',
}

export function buttonClasses(variant: ButtonVariant = 'secondary', size: ButtonSize = 'md', extra = '') {
  return `inline-flex shrink-0 items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-brand/40 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${extra}`
}

export function IconButton({
  label,
  children,
  className = '',
  tone = 'default',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string; tone?: 'default' | 'danger' }) {
  const toneClass =
    tone === 'danger' ? 'text-slate-400 hover:bg-red-50 hover:text-red-600' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      {...props}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors disabled:pointer-events-none disabled:opacity-30 ${toneClass} ${className}`}
    >
      {children}
    </button>
  )
}

export function Panel({
  title,
  description,
  icon,
  actions,
  children,
  className = '',
  id,
}: {
  title?: ReactNode
  description?: ReactNode
  icon?: ReactNode
  actions?: ReactNode
  children: ReactNode
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={`scroll-mt-44 rounded-2xl lg:scroll-mt-24 border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className}`}>
      {title ? (
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            {icon ? (
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-brand/10 text-purple-brand">{icon}</span>
            ) : null}
            <div className="min-w-0">
              <h2 className="text-[15px] font-semibold text-slate-900">{title}</h2>
              {description ? <p className="mt-0.5 text-sm text-slate-500">{description}</p> : null}
            </div>
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}
      <div className="px-5 py-5 sm:px-6">{children}</div>
    </section>
  )
}

export function Field({
  label,
  hint,
  htmlFor,
  aside,
  optional,
  hideLabel,
  children,
  className = '',
}: {
  label: ReactNode
  hint?: ReactNode
  htmlFor?: string
  aside?: ReactNode
  optional?: boolean
  /** Keeps the label for screen readers only (compact rows). */
  hideLabel?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className={hideLabel && !aside ? 'sr-only' : 'flex items-center justify-between gap-3'}>
        <label htmlFor={htmlFor} className={`flex items-center gap-2 text-sm font-medium text-slate-800 ${hideLabel ? 'sr-only' : ''}`}>
          {label}
          {optional ? <span className="text-xs font-normal text-slate-400">facultatif</span> : null}
        </label>
        {aside}
      </div>
      {children}
      {hint ? <p className="text-xs leading-relaxed text-slate-500">{hint}</p> : null}
    </div>
  )
}

export const inputClasses =
  'block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-[0_1px_1px_rgba(15,23,42,0.03)] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-purple-brand focus:ring-4 focus:ring-purple-brand/10 disabled:bg-slate-50 disabled:text-slate-500'

export function TextInput({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClasses} h-10 ${className}`} />
}

export function TextArea({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClasses} min-h-[88px] resize-y leading-relaxed ${className}`} />
}

export function Select({ className = '', ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputClasses} h-10 pr-8 ${className}`} />
}

type BadgeTone = 'neutral' | 'success' | 'warning' | 'brand' | 'danger'

const BADGE_TONES: Record<BadgeTone, string> = {
  neutral: 'bg-slate-100 text-slate-600',
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/15',
  warning: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
  brand: 'bg-purple-brand/10 text-purple-brand',
  danger: 'bg-red-50 text-red-700',
}

export function Badge({ tone = 'neutral', children, dot }: { tone?: BadgeTone; children: ReactNode; dot?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${BADGE_TONES[tone]}`}>
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  )
}

export function StatusBadge({ published }: { published: boolean }) {
  return published ? (
    <Badge tone="success" dot>En ligne</Badge>
  ) : (
    <Badge tone="neutral" dot>Brouillon</Badge>
  )
}

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  eyebrow?: ReactNode
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-purple-brand">{eyebrow}</p> : null}
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[28px]">{title}</h1>
        {description ? <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-slate-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center">
      {icon ? <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">{icon}</div> : null}
      <p className="font-medium text-slate-900">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

export function Callout({
  tone = 'info',
  children,
  icon,
}: {
  tone?: 'info' | 'warning'
  children: ReactNode
  icon?: ReactNode
}) {
  const toneClass = tone === 'warning' ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-slate-200 bg-slate-50 text-slate-600'
  return (
    <div className={`flex gap-3 rounded-xl border px-4 py-3 text-sm leading-relaxed ${toneClass}`}>
      {icon ? <span className="mt-0.5 shrink-0">{icon}</span> : null}
      <div className="min-w-0">{children}</div>
    </div>
  )
}
