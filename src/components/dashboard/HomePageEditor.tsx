'use client'

import Link from 'next/link'
import { useState } from 'react'
import { HOME_SECTIONS, type HomeItem } from '@/lib/dashboard/home-config'
import { useDashboardForm } from './form/DashboardForm'
import { BilingualList, BilingualText } from './form/BilingualFields'
import { RowsEditor, type EditableRow } from './form/RowsEditor'
import { MediaPicker } from './media/MediaFields'
import { Switch } from './ui/Switch'
import { Badge, IconButton } from './ui/primitives'
import { IconChevronDown, IconChevronUp, IconExternal, IconInfo, IconLanguages } from './ui/icons'

export interface HomeSectionRow {
  id: string
  key: string
  enabled: boolean
  showInNav: boolean
  labelFr: string
  labelEn: string
  eyebrowFr: string | null
  eyebrowEn: string | null
}

export interface HomeCopyEntry {
  kind: 'TEXT' | 'TEXTAREA' | 'LIST'
  valueFr: string
  valueEn: string
}

export interface HomeSettings {
  heroBannerUrl: string
  contactIntroFr: string
  contactIntroEn: string
  locationBlurbFr: string
  locationBlurbEn: string
}

export function HomePageEditor({
  sections: initialSections,
  copy,
  settings,
  aboutServices,
}: {
  sections: HomeSectionRow[]
  copy: Record<string, HomeCopyEntry>
  settings: HomeSettings
  aboutServices: EditableRow[]
}) {
  const { markDirty } = useDashboardForm()
  const [sections, setSections] = useState(initialSections)
  const [visibility, setVisibility] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(initialSections.map((section) => [section.id, section.enabled]))
  )
  const [open, setOpen] = useState<string | null>(initialSections[0]?.id ?? null)

  function move(index: number, delta: number) {
    const target = index + delta
    if (target < 0 || target >= sections.length) return
    const next = [...sections]
    ;[next[index], next[target]] = [next[target], next[index]]
    setSections(next)
    markDirty()
  }

  return (
    <div className="space-y-3">
      {sections.map((section, index) => {
        const config = HOME_SECTIONS[section.key]
        const isOpen = open === section.id
        const visible = visibility[section.id]
        return (
          <article
            key={section.id}
            className={`overflow-hidden rounded-2xl border bg-white transition-shadow ${
              isOpen ? 'border-slate-300 shadow-md shadow-slate-900/5' : 'border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.04)]'
            }`}
          >
            <input type="hidden" name="section.id" value={section.id} />

            <header className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-semibold tabular-nums ${
                  visible ? 'bg-purple-brand/10 text-purple-brand' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : section.id)}
                aria-expanded={isOpen}
                className="min-w-0 flex-1 text-left"
              >
                <span className="flex flex-wrap items-center gap-2">
                  <span className={`font-semibold ${visible ? 'text-slate-900' : 'text-slate-400'}`}>{config?.title || section.labelFr}</span>
                  {!visible ? <Badge>Masquée</Badge> : null}
                </span>
                <span className="mt-0.5 block truncate text-[13px] text-slate-500">{config?.description || section.key}</span>
              </button>

              <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                <div className="hidden items-center sm:flex">
                  <IconButton label="Monter la section" onClick={() => move(index, -1)} disabled={index === 0}>
                    <IconChevronUp size={16} />
                  </IconButton>
                  <IconButton label="Descendre la section" onClick={() => move(index, 1)} disabled={index === sections.length - 1}>
                    <IconChevronDown size={16} />
                  </IconButton>
                </div>
                <div className="flex items-center gap-2 border-l border-slate-100 pl-3" title={visible ? 'Section visible' : 'Section masquée'}>
                  <span className="hidden text-xs text-slate-500 md:inline">{visible ? 'Visible' : 'Masquée'}</span>
                  <Switch
                    name={`section.${section.id}.enabled`}
                    size="sm"
                    checked={visible}
                    onChange={(value) => setVisibility((current) => ({ ...current, [section.id]: value }))}
                  />
                </div>
                <IconButton label={isOpen ? 'Replier' : 'Modifier le contenu'} onClick={() => setOpen(isOpen ? null : section.id)}>
                  <IconChevronDown size={18} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </IconButton>
              </div>
            </header>

            <div hidden={!isOpen} className="border-t border-slate-100">
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/60 px-5 py-2 sm:hidden">
                <span className="text-xs text-slate-500">Position sur la page</span>
                <div className="flex">
                  <IconButton label="Monter la section" onClick={() => move(index, -1)} disabled={index === 0}>
                    <IconChevronUp size={16} />
                  </IconButton>
                  <IconButton label="Descendre la section" onClick={() => move(index, 1)} disabled={index === sections.length - 1}>
                    <IconChevronDown size={16} />
                  </IconButton>
                </div>
              </div>

              <div className="space-y-8 px-5 py-6 sm:px-6">
                {config?.manage ? (
                  <div className="flex flex-col gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                    <span className="flex items-start gap-2">
                      <IconInfo size={16} className="mt-0.5 shrink-0 text-slate-400" />
                      {config.manage.note}
                    </span>
                    <Link href={config.manage.href} className="inline-flex shrink-0 items-center gap-1 font-medium text-purple-brand hover:underline">
                      {config.manage.label} →
                    </Link>
                  </div>
                ) : null}

                {config?.blocks.map((block, blockIndex) => (
                  <fieldset key={blockIndex} className="space-y-5">
                    {block.title ? (
                      <legend className="w-full border-b border-slate-100 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {block.title}
                      </legend>
                    ) : null}
                    {block.items.map((item, itemIndex) => (
                      <HomeItemField key={itemIndex} item={item} copy={copy} settings={settings} aboutServices={aboutServices} />
                    ))}
                  </fieldset>
                ))}

                <fieldset className="space-y-5">
                  <legend className="w-full border-b border-slate-100 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Menu de navigation
                  </legend>
                  <Switch
                    name={`section.${section.id}.showInNav`}
                    label="Afficher un lien vers cette section dans le menu"
                    description="Le menu en haut du site permet d’y accéder directement."
                    defaultChecked={section.showInNav}
                  />
                  <div className="grid gap-5 md:grid-cols-2">
                    <BilingualText
                      name={`section.${section.id}.label`}
                      label="Nom dans le menu"
                      defaultFr={section.labelFr}
                      defaultEn={section.labelEn}
                    />
                    {config?.hasEyebrow ? (
                      <BilingualText
                        name={`section.${section.id}.eyebrow`}
                        label="Petit titre de la section"
                        hint="Le mot affiché en petit au-dessus du titre."
                        defaultFr={section.eyebrowFr}
                        defaultEn={section.eyebrowEn}
                        optional
                      />
                    ) : null}
                  </div>
                </fieldset>

                {config?.textsGroup ? (
                  <Link
                    href={`/dashboard/texts?group=${config.textsGroup}`}
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-purple-brand"
                  >
                    <IconLanguages size={15} />
                    Voir tous les petits textes de cette section
                    <IconExternal size={13} />
                  </Link>
                ) : null}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

function HomeItemField({
  item,
  copy,
  settings,
  aboutServices,
}: {
  item: HomeItem
  copy: Record<string, HomeCopyEntry>
  settings: HomeSettings
  aboutServices: EditableRow[]
}) {
  if (item.type === 'heroBanner') {
    return (
      <MediaPicker
        name="heroBannerUrl"
        label="Image ou vidéo de fond"
        hint="Grande image horizontale (au moins 1920 px de large) ou vidéo : elle tourne en boucle, sans le son. Le texte s’affiche par-dessus."
        defaultValue={settings.heroBannerUrl}
      />
    )
  }

  if (item.type === 'aboutServices') {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-800">Liste des domaines</p>
        <RowsEditor
          prefix="about"
          layout="card"
          addLabel="Ajouter un domaine"
          itemNoun="ce domaine"
          emptyText="Aucun domaine d’intervention pour le moment."
          fields={[
            { key: 'title', label: 'Titre', type: 'bilingual', placeholder: 'Ex. : Relations presse' },
            { key: 'description', label: 'Description', type: 'bilingual-multiline' },
          ]}
          rows={aboutServices}
        />
      </div>
    )
  }

  if (item.type === 'contactIntro') {
    return (
      <BilingualText
        name="contactIntro"
        label="Phrase d’introduction"
        hint="Affichée sous le titre, au-dessus du formulaire."
        multiline
        rows={3}
        defaultFr={settings.contactIntroFr}
        defaultEn={settings.contactIntroEn}
      />
    )
  }

  if (item.type === 'locationBlurb') {
    return (
      <BilingualText
        name="locationBlurb"
        label="Texte sur votre localisation"
        hint="L’adresse et la carte se modifient dans Paramètres › Informations du site."
        multiline
        rows={3}
        defaultFr={settings.locationBlurbFr}
        defaultEn={settings.locationBlurbEn}
      />
    )
  }

  const entry = copy[item.key]
  if (!entry) return null

  return (
    <>
      <input type="hidden" name="copy.key" value={item.key} />
      {entry.kind === 'LIST' ? (
        <BilingualList
          name={`copy__${item.key}__`}
          label={item.label}
          hint={item.hint}
          defaultFr={splitLines(entry.valueFr)}
          defaultEn={splitLines(entry.valueEn)}
          addLabel="Ajouter un point"
        />
      ) : (
        <BilingualText
          name={`copy__${item.key}__`}
          label={item.label}
          hint={item.hint}
          multiline={entry.kind === 'TEXTAREA'}
          rows={entry.kind === 'TEXTAREA' ? 3 : undefined}
          defaultFr={entry.valueFr}
          defaultEn={entry.valueEn}
        />
      )}
    </>
  )
}

function splitLines(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}
