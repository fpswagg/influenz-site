'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  IconBriefcase,
  IconExternal,
  IconHandshake,
  IconHome,
  IconImage,
  IconLanguages,
  IconLayout,
  IconLightbulb,
  IconLogout,
  IconMenu,
  IconSettings,
  IconTag,
  IconX,
} from './ui/icons'

type NavItem = { href: string; label: string; icon: React.ComponentType<{ size?: number }>; exact?: boolean }

const NAV_GROUPS: { title?: string; items: NavItem[] }[] = [
  {
    items: [{ href: '/dashboard', label: 'Vue d’ensemble', icon: IconHome, exact: true }],
  },
  {
    title: 'Contenu du site',
    items: [
      { href: '/dashboard/home', label: 'Page d’accueil', icon: IconLayout },
      { href: '/dashboard/projects', label: 'Projets', icon: IconBriefcase },
      { href: '/dashboard/solutions', label: 'Solutions', icon: IconLightbulb },
      { href: '/dashboard/clients', label: 'Partenaires', icon: IconHandshake },
    ],
  },
  {
    title: 'Fichiers',
    items: [{ href: '/dashboard/media', label: 'Médiathèque', icon: IconImage }],
  },
  {
    title: 'Paramètres',
    items: [
      { href: '/dashboard/settings', label: 'Informations du site', icon: IconSettings },
      { href: '/dashboard/texts', label: 'Textes & traductions', icon: IconLanguages },
      { href: '/dashboard/categories', label: 'Catégories', icon: IconTag },
    ],
  },
]

function isActive(pathname: string, item: NavItem) {
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`)
}

function Brand({ siteName, logoUrl }: { siteName: string; logoUrl?: string | null }) {
  return (
    <Link href="/dashboard" className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt="" className="h-7 w-7 object-contain" />
        ) : (
          <span className="text-sm font-bold text-purple-brand">{siteName.slice(0, 1)}</span>
        )}
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-[15px] font-semibold text-slate-900">{siteName}</span>
        <span className="block text-xs text-slate-500">Espace d’administration</span>
      </span>
    </Link>
  )
}

function NavList({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
      {NAV_GROUPS.map((group, index) => (
        <div key={index} className={group.title === 'Paramètres' ? 'border-t border-slate-100 pt-5' : ''}>
          {group.title ? (
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{group.title}</p>
          ) : null}
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = isActive(pathname, item)
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active ? 'bg-purple-brand/[0.08] text-purple-brand' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span className={active ? 'text-purple-brand' : 'text-slate-400 group-hover:text-slate-600'}>
                      <Icon size={18} />
                    </span>
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function FooterLinks() {
  const router = useRouter()
  const [leaving, setLeaving] = useState(false)
  return (
    <div className="space-y-0.5 border-t border-slate-100 p-3">
      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      >
        <span className="text-slate-400"><IconExternal size={18} /></span>
        Voir le site
      </a>
      <button
        type="button"
        disabled={leaving}
        onClick={async () => {
          setLeaving(true)
          await fetch('/api/dashboard/logout', { method: 'POST' })
          router.replace('/dashboard/login')
          router.refresh()
        }}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      >
        <span className="text-slate-400"><IconLogout size={18} /></span>
        {leaving ? 'Déconnexion…' : 'Se déconnecter'}
      </button>
    </div>
  )
}

export function Sidebar({ siteName, logoUrl }: { siteName: string; logoUrl?: string | null }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [pathname])

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] flex-col border-r border-slate-200/80 bg-white lg:flex">
        <div className="px-5 pb-2 pt-5">
          <Brand siteName={siteName} logoUrl={logoUrl} />
        </div>
        <NavList pathname={pathname} />
        <FooterLinks />
      </aside>

      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur lg:hidden">
        <Brand siteName={siteName} logoUrl={logoUrl} />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Ouvrir le menu"
        >
          <IconMenu size={20} />
        </button>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="dash-fade absolute inset-0 bg-slate-900/40" onClick={() => setOpen(false)} />
          <aside className="dash-slide absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between px-5 pb-2 pt-5">
              <Brand siteName={siteName} logoUrl={logoUrl} />
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Fermer le menu">
                <IconX size={18} />
              </button>
            </div>
            <NavList pathname={pathname} onNavigate={() => setOpen(false)} />
            <FooterLinks />
          </aside>
        </div>
      ) : null}
    </>
  )
}
