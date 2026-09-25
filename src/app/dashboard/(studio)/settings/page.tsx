import { prisma } from '@/lib/db/prisma'
import { saveSettingsAction } from '@/app/dashboard/actions'
import { DashboardForm } from '@/components/dashboard/form/DashboardForm'
import { MediaPicker } from '@/components/dashboard/media/MediaFields'
import { MapField, SeoFields } from '@/components/dashboard/SettingsFields'
import { Field, Panel, TextInput } from '@/components/dashboard/ui/primitives'
import { IconBuilding, IconGlobe, IconImage, IconMapPin, IconScale, IconShare } from '@/components/dashboard/ui/icons'

const SECTIONS = [
  { id: 'entreprise', label: 'Coordonnées' },
  { id: 'reseaux', label: 'Réseaux sociaux' },
  { id: 'logos', label: 'Logos' },
  { id: 'google', label: 'Google' },
  { id: 'carte', label: 'Carte' },
  { id: 'legal', label: 'Mentions légales' },
]

export default async function SettingsPage() {
  const settings = await prisma.siteConfig.findUnique({ where: { id: 'site' } })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://influenz.cm'

  return (
    <DashboardForm action={saveSettingsAction} title="Informations du site" subtitle="Paramètres">
      <nav aria-label="Sections de la page" className="-mt-2 mb-6 flex gap-2 overflow-x-auto pb-1">
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            {section.label}
          </a>
        ))}
      </nav>

      <div className="space-y-6">
        <Panel id="entreprise" title="Coordonnées" description="Affichées dans le pied de page et la section À propos." icon={<IconBuilding size={16} />}>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Nom du site" htmlFor="siteName" className="md:col-span-2">
              <TextInput id="siteName" name="siteName" defaultValue={settings?.siteName} required />
            </Field>
            <Field label="Adresse e-mail" htmlFor="email" hint="Affichée sur le site pour vous contacter.">
              <TextInput id="email" name="email" type="email" defaultValue={settings?.email} placeholder="contact@exemple.com" />
            </Field>
            <Field label="Téléphone principal" htmlFor="phone">
              <TextInput id="phone" name="phone" type="tel" defaultValue={settings?.phone} placeholder="+237 6XX XX XX XX" />
            </Field>
            <Field label="Second téléphone" htmlFor="phoneSecondary" optional>
              <TextInput id="phoneSecondary" name="phoneSecondary" type="tel" defaultValue={settings?.phoneSecondary || ''} />
            </Field>
            <Field label="Boîte postale" htmlFor="postalBox" optional>
              <TextInput id="postalBox" name="postalBox" defaultValue={settings?.postalBox || ''} placeholder="BP 10107" />
            </Field>
            <Field label="Adresse" htmlFor="address" className="md:col-span-2">
              <TextInput id="address" name="address" defaultValue={settings?.address} placeholder="Quartier, ville, pays" />
            </Field>
          </div>
        </Panel>

        <Panel id="reseaux" title="Réseaux sociaux" description="Laissez vide pour masquer un réseau." icon={<IconShare size={16} />}>
          <div className="grid gap-5 md:grid-cols-3">
            <Field label="LinkedIn" htmlFor="linkedinUrl" optional>
              <TextInput id="linkedinUrl" name="linkedinUrl" inputMode="url" defaultValue={settings?.linkedinUrl || ''} placeholder="linkedin.com/company/…" />
            </Field>
            <Field label="X (Twitter)" htmlFor="twitterUrl" optional>
              <TextInput id="twitterUrl" name="twitterUrl" inputMode="url" defaultValue={settings?.twitterUrl || ''} placeholder="x.com/…" />
            </Field>
            <Field label="Instagram" htmlFor="instagramUrl" optional>
              <TextInput id="instagramUrl" name="instagramUrl" inputMode="url" defaultValue={settings?.instagramUrl || ''} placeholder="instagram.com/…" />
            </Field>
          </div>
        </Panel>

        <Panel id="logos" title="Logos" description="Utilisés dans l’en-tête, le pied de page et l’onglet du navigateur." icon={<IconImage size={16} />}>
          <div className="grid gap-6 md:grid-cols-3">
            <MediaPicker kind="image" name="textLogoUrl" label="Logo complet" variant="logo" hint="Version horizontale avec le nom, affichée en haut du site." defaultValue={settings?.textLogoUrl || '/images/text-logo.png'} />
            <MediaPicker kind="image" name="logoUrl" label="Symbole" variant="logo" hint="Version compacte (carrée) du logo." defaultValue={settings?.logoUrl || '/images/logo.png'} />
            <MediaPicker
              kind="image"
              name="faviconUrl"
              label="Icône de partage"
              variant="logo"
              hint="Affichée dans l’onglet du navigateur et lors d’un partage sur les réseaux. Image carrée."
              defaultValue={settings?.faviconUrl || '/images/logo.png'}
            />
          </div>
        </Panel>

        <Panel id="google" title="Référencement Google" description="Comment votre site apparaît dans les moteurs de recherche." icon={<IconGlobe size={16} />}>
          <SeoFields
            siteUrl={siteUrl}
            defaults={{
              titleFr: settings?.seoTitleFr || '',
              titleEn: settings?.seoTitleEn || '',
              descriptionFr: settings?.seoDescriptionFr || '',
              descriptionEn: settings?.seoDescriptionEn || '',
            }}
          />
        </Panel>

        <Panel id="carte" title="Carte" description="Affichée dans la section À propos." icon={<IconMapPin size={16} />}>
          <MapField defaultValue={settings?.mapsEmbedUrl || ''} />
        </Panel>

        <Panel id="legal" title="Mentions légales" description="Affichées dans le pied de page." icon={<IconScale size={16} />}>
          <div className="grid gap-5 md:grid-cols-3">
            <Field label="Forme juridique" htmlFor="legalForm" optional>
              <TextInput id="legalForm" name="legalForm" defaultValue={settings?.legalForm || ''} placeholder="SARL, SA…" />
            </Field>
            <Field label="NIU" htmlFor="niu" hint="Numéro d’identifiant unique" optional>
              <TextInput id="niu" name="niu" defaultValue={settings?.niu || ''} />
            </Field>
            <Field label="RCCM" htmlFor="rccm" hint="Registre du commerce" optional>
              <TextInput id="rccm" name="rccm" defaultValue={settings?.rccm || ''} />
            </Field>
          </div>
        </Panel>
      </div>
    </DashboardForm>
  )
}
