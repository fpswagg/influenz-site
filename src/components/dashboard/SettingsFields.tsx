'use client'

import { useState } from 'react'
import { useDashboardForm } from './form/DashboardForm'
import { BilingualText } from './form/BilingualFields'
import { Field, TextArea } from './ui/primitives'
import { IconMapPin } from './ui/icons'

/** Google title/description fields with a live preview of the search result. */
export function SeoFields({
  siteUrl,
  defaults,
}: {
  siteUrl: string
  defaults: { titleFr: string; titleEn: string; descriptionFr: string; descriptionEn: string }
}) {
  const { lang } = useDashboardForm()
  const [title, setTitle] = useState({ fr: defaults.titleFr, en: defaults.titleEn })
  const [description, setDescription] = useState({ fr: defaults.descriptionFr, en: defaults.descriptionEn })
  const shownTitle = title[lang] || title.fr
  const shownDescription = description[lang] || description.fr

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <div className="space-y-5">
        <BilingualText
          name="seoTitle"
          label="Titre dans Google"
          hint="Le titre bleu affiché dans les résultats de recherche et dans l’onglet du navigateur."
          defaultFr={defaults.titleFr}
          defaultEn={defaults.titleEn}
          recommendedLength={60}
          onValueChange={setTitle}
        />
        <BilingualText
          name="seoDescription"
          label="Description dans Google"
          hint="Le court texte sous le titre. Décrivez votre activité en une ou deux phrases."
          multiline
          rows={3}
          defaultFr={defaults.descriptionFr}
          defaultEn={defaults.descriptionEn}
          recommendedLength={160}
          onValueChange={setDescription}
        />
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Aperçu dans Google</p>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm [font-family:arial,sans-serif]">
          <p className="truncate text-xs text-slate-600">{siteUrl.replace(/^https?:\/\//, '')}</p>
          <p className="mt-1 line-clamp-1 text-lg leading-snug text-[#1a0dab]">{shownTitle || 'Titre de votre site'}</p>
          <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[#4d5156]">
            {shownDescription || 'La description de votre site apparaîtra ici.'}
          </p>
        </div>
      </div>
    </div>
  )
}

function extractSrc(value: string) {
  const match = value.match(/src=["']([^"']+)["']/i)
  return (match ? match[1] : value).trim()
}

/** Accepts the full Google Maps "embed" snippet or its URL, and previews the map. */
export function MapField({ defaultValue }: { defaultValue: string }) {
  const { markDirty } = useDashboardForm()
  const [value, setValue] = useState(defaultValue)
  const src = extractSrc(value)
  const valid = /^https:\/\/(www\.)?google\.[a-z.]+\/maps\/embed/i.test(src)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Field
          label="Code de la carte Google Maps"
          htmlFor="mapsEmbedUrl"
          hint={
            <>
              Sur <strong>Google Maps</strong>, cherchez votre adresse, cliquez sur <strong>Partager</strong> puis{' '}
              <strong>Intégrer une carte</strong>, et copiez le code. Collez-le ici tel quel.
            </>
          }
        >
          <TextArea
            id="mapsEmbedUrl"
            name="mapsEmbedUrl"
            rows={4}
            value={value}
            onChange={(event) => {
              setValue(event.target.value)
              markDirty()
            }}
            placeholder='<iframe src="https://www.google.com/maps/embed?..." …></iframe>'
            className="font-mono text-xs"
          />
        </Field>
        {value && !valid ? (
          <p className="text-xs text-amber-700">Ce code ne ressemble pas à une carte Google Maps intégrable. Vérifiez que vous avez copié le code « Intégrer une carte ».</p>
        ) : null}
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        {valid ? (
          <iframe src={src} title="Aperçu de la carte" className="h-64 w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        ) : (
          <div className="flex h-64 flex-col items-center justify-center gap-2 text-slate-400">
            <IconMapPin size={26} />
            <span className="text-sm">L’aperçu de la carte apparaîtra ici</span>
          </div>
        )}
      </div>
    </div>
  )
}
