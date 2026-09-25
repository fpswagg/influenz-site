import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'
import { isEmbedVideoUrl, isStorageUrl } from '@/lib/storage/sastorage'
import { HIDDEN_TEXT_KEYS } from '@/lib/dashboard/text-groups'
import { Badge, Panel } from '@/components/dashboard/ui/primitives'
import {
  IconAlert,
  IconBriefcase,
  IconCheck,
  IconChevronRight,
  IconClock,
  IconExternal,
  IconHandshake,
  IconLanguages,
  IconLayout,
  IconLightbulb,
  IconPlus,
} from '@/components/dashboard/ui/icons'

const relative = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' })

function timeAgo(date: Date) {
  const seconds = Math.round((date.getTime() - Date.now()) / 1000)
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]
  for (const [unit, size] of steps) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit)
  }
  return 'à l’instant'
}

interface Todo {
  label: string
  detail: string
  href: string
}

export default async function DashboardHomePage() {
  const [projects, solutions, clients, copy, settings] = await Promise.all([
    prisma.project.findMany({
      select: { id: true, published: true, updatedAt: true, translations: true, media: { select: { url: true } } },
    }),
    prisma.solution.findMany({
      select: { id: true, published: true, updatedAt: true, coverUrl: true, translations: true, media: { select: { url: true } } },
    }),
    prisma.client.findMany({ select: { id: true, name: true, published: true, imageUrl: true, descriptionFr: true, descriptionEn: true, updatedAt: true } }),
    prisma.copyEntry.findMany({ select: { key: true, valueFr: true, valueEn: true, updatedAt: true } }),
    prisma.siteConfig.findUnique({ where: { id: 'site' } }),
  ])

  const titleOf = (translations: { locale: string; title: string }[]) =>
    translations.find((item) => item.locale === 'fr')?.title || 'Sans titre'
  const en = <T extends { locale: string }>(translations: T[]) => translations.find((item) => item.locale === 'en')

  const todos: Todo[] = []
  for (const project of projects) {
    const english = en(project.translations)
    if (!english?.title || !english.description) {
      todos.push({ label: titleOf(project.translations), detail: 'Projet : version anglaise incomplète', href: `/dashboard/projects/${project.id}` })
    }
    if (project.published && project.media.length === 0) {
      todos.push({ label: titleOf(project.translations), detail: 'Projet en ligne sans image', href: `/dashboard/projects/${project.id}` })
    }
  }
  for (const solution of solutions) {
    const english = en(solution.translations)
    if (!english?.title || !english.problem) {
      todos.push({ label: titleOf(solution.translations), detail: 'Solution : version anglaise incomplète', href: `/dashboard/solutions/${solution.id}` })
    }
  }
  for (const client of clients) {
    if (client.published && !client.imageUrl) {
      todos.push({ label: client.name, detail: 'Partenaire sans logo', href: `/dashboard/clients/${client.id}` })
    }
    if (client.descriptionFr && !client.descriptionEn) {
      todos.push({ label: client.name, detail: 'Partenaire : description anglaise manquante', href: `/dashboard/clients/${client.id}` })
    }
  }
  // Content media must live in the media library (SA Storage); YouTube/Vimeo links are fine as links
  const outsideLibrary = (url?: string | null) => Boolean(url) && !isStorageUrl(url!) && !isEmbedVideoUrl(url!)
  for (const project of projects) {
    const count = project.media.filter((item) => outsideLibrary(item.url)).length
    if (count) {
      todos.push({ label: titleOf(project.translations), detail: `${count} média(s) hors médiathèque (lien externe à vérifier)`, href: `/dashboard/projects/${project.id}` })
    }
  }
  for (const solution of solutions) {
    const count = solution.media.filter((item) => outsideLibrary(item.url)).length + (outsideLibrary(solution.coverUrl) ? 1 : 0)
    if (count) {
      todos.push({ label: titleOf(solution.translations), detail: `${count} média(s) hors médiathèque (lien externe à vérifier)`, href: `/dashboard/solutions/${solution.id}` })
    }
  }
  for (const client of clients) {
    if (outsideLibrary(client.imageUrl)) {
      todos.push({ label: client.name, detail: 'Logo hors médiathèque (lien externe à vérifier)', href: `/dashboard/clients/${client.id}` })
    }
  }
  if (outsideLibrary(settings?.heroBannerUrl)) {
    todos.push({ label: 'Bannière d’accueil', detail: 'Image hors médiathèque (lien externe à vérifier)', href: '/dashboard/home' })
  }

  const missingTexts = copy.filter((entry) => !HIDDEN_TEXT_KEYS.has(entry.key) && entry.valueFr.trim() && !entry.valueEn.trim()).length
  if (missingTexts) {
    todos.unshift({ label: `${missingTexts} texte(s) du site`, detail: 'Traduction anglaise manquante', href: '/dashboard/texts' })
  }
  if (!settings?.email || !settings?.phone || !settings?.address) {
    todos.unshift({ label: 'Coordonnées', detail: 'E-mail, téléphone ou adresse manquant', href: '/dashboard/settings#entreprise' })
  }

  const lastCopyUpdate = copy.reduce<Date | null>((latest, entry) => (!latest || entry.updatedAt > latest ? entry.updatedAt : latest), null)
  const recent = [
    ...projects.map((item) => ({ label: titleOf(item.translations), type: 'Projet', href: `/dashboard/projects/${item.id}`, date: item.updatedAt })),
    ...solutions.map((item) => ({ label: titleOf(item.translations), type: 'Solution', href: `/dashboard/solutions/${item.id}`, date: item.updatedAt })),
    ...clients.map((item) => ({ label: item.name, type: 'Partenaire', href: `/dashboard/clients/${item.id}`, date: item.updatedAt })),
    ...(settings ? [{ label: 'Informations du site', type: 'Paramètres', href: '/dashboard/settings', date: settings.updatedAt }] : []),
    ...(lastCopyUpdate ? [{ label: 'Textes du site', type: 'Paramètres', href: '/dashboard/texts', date: lastCopyUpdate }] : []),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 6)

  const stats = [
    {
      label: 'Projets',
      href: '/dashboard/projects',
      icon: IconBriefcase,
      total: projects.length,
      online: projects.filter((item) => item.published).length,
    },
    {
      label: 'Solutions',
      href: '/dashboard/solutions',
      icon: IconLightbulb,
      total: solutions.length,
      online: solutions.filter((item) => item.published).length,
    },
    {
      label: 'Partenaires',
      href: '/dashboard/clients',
      icon: IconHandshake,
      total: clients.length,
      online: clients.filter((item) => item.published).length,
    },
  ]

  const actions = [
    { href: '/dashboard/home', label: 'Modifier la page d’accueil', description: 'Textes, images et ordre des sections', icon: IconLayout },
    { href: '/dashboard/projects/new', label: 'Ajouter un projet', description: 'Présenter une nouvelle réalisation', icon: IconPlus },
    { href: '/dashboard/solutions/new', label: 'Ajouter une solution', description: 'Décrire un problème que vous résolvez', icon: IconPlus },
    { href: '/dashboard/clients/new', label: 'Ajouter un partenaire', description: 'Un nouveau logo de confiance', icon: IconPlus },
  ]

  const today = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-slate-500 first-letter:uppercase">{today}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-[28px]">Bonjour 👋</h1>
          <p className="mt-1.5 text-[15px] text-slate-500">Que souhaitez-vous modifier sur le site aujourd’hui ?</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 sm:self-auto"
        >
          <IconExternal size={16} /> Voir le site
        </a>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <Link
              key={action.href}
              href={action.href}
              className={`group flex flex-col gap-3 rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${
                index === 0
                  ? 'border-purple-brand bg-purple-brand text-white shadow-sm shadow-purple-brand/20'
                  : 'border-slate-200/80 bg-white text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)]'
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${index === 0 ? 'bg-white/15 text-white' : 'bg-purple-brand/10 text-purple-brand'}`}
              >
                <Icon size={18} />
              </span>
              <span>
                <span className="block text-sm font-semibold">{action.label}</span>
                <span className={`mt-0.5 block text-[13px] ${index === 0 ? 'text-white/75' : 'text-slate-500'}`}>{action.description}</span>
              </span>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          const drafts = stat.total - stat.online
          return (
            <Link
              key={stat.href}
              href={stat.href}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-slate-300"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                <Icon size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] text-slate-500">{stat.label}</span>
                <span className="block text-2xl font-semibold tabular-nums text-slate-900">{stat.total}</span>
              </span>
              <span className="flex flex-col items-end gap-1 text-xs">
                <Badge tone="success" dot>{stat.online} en ligne</Badge>
                {drafts ? <Badge dot>{drafts} brouillon{drafts > 1 ? 's' : ''}</Badge> : null}
              </span>
            </Link>
          )
        })}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
        <Panel
          title="À compléter"
          description="Ce qui mérite votre attention pour un site complet dans les deux langues."
          icon={<IconAlert size={16} />}
          actions={todos.length ? <Badge tone="warning">{todos.length}</Badge> : null}
        >
          {todos.length === 0 ? (
            <div className="flex items-center gap-3 py-2 text-sm text-slate-600">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <IconCheck size={16} strokeWidth={2.5} />
              </span>
              Tout est complet. Beau travail !
            </div>
          ) : (
            <ul className="-mx-2 -my-1">
              {todos.slice(0, 8).map((todo, index) => (
                <li key={index}>
                  <Link href={todo.href} className="group flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-slate-50">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                      {todo.detail.includes('anglaise') || todo.detail.includes('Traduction') ? <IconLanguages size={16} /> : <IconAlert size={16} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-800">{todo.label}</span>
                      <span className="block truncate text-[13px] text-slate-500">{todo.detail}</span>
                    </span>
                    <IconChevronRight size={16} className="shrink-0 text-slate-300 group-hover:text-slate-500" />
                  </Link>
                </li>
              ))}
              {todos.length > 8 ? <li className="px-2 pt-2 text-xs text-slate-400">… et {todos.length - 8} autre(s)</li> : null}
            </ul>
          )}
        </Panel>

        <Panel title="Modifié récemment" icon={<IconClock size={16} />}>
          {recent.length === 0 ? (
            <p className="text-sm text-slate-500">Aucune modification pour le moment.</p>
          ) : (
            <ul className="-mx-2 -my-1">
              {recent.map((item, index) => (
                <li key={index}>
                  <Link href={item.href} className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-slate-50">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-slate-800">{item.label}</span>
                      <span className="block text-xs text-slate-500">{item.type}</span>
                    </span>
                    <span className="shrink-0 text-xs text-slate-400">{timeAgo(item.date)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  )
}
