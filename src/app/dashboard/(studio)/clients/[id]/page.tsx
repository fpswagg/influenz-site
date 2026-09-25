import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { saveClientAction } from '@/app/dashboard/actions'
import { DashboardForm } from '@/components/dashboard/form/DashboardForm'
import { BilingualText } from '@/components/dashboard/form/BilingualFields'
import { AdvancedBox, DeleteZone, EditorGrid } from '@/components/dashboard/form/EditorParts'
import { MediaPicker } from '@/components/dashboard/media/MediaFields'
import { Switch } from '@/components/dashboard/ui/Switch'
import { Field, Panel, StatusBadge, TextInput } from '@/components/dashboard/ui/primitives'
import { IconHandshake } from '@/components/dashboard/ui/icons'

export default async function ClientEditorPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams?: { created?: string }
}) {
  const isNew = params.id === 'new'
  const client = isNew ? null : await prisma.client.findUnique({ where: { id: params.id } })
  if (!isNew && !client) notFound()
  const title = isNew ? 'Nouveau partenaire' : client?.name || 'Partenaire'

  return (
    <DashboardForm
      action={saveClientAction}
      title={title}
      subtitle={isNew ? 'Ajoutez au moins le nom et le logo.' : 'Partenaires'}
      backHref="/dashboard/clients"
      backLabel="Retour aux partenaires"
      headerExtra={client ? <StatusBadge published={client.published} /> : null}
      submitLabel={isNew ? 'Ajouter le partenaire' : 'Enregistrer'}
      flash={searchParams?.created ? 'Partenaire ajouté' : undefined}
    >
      {client ? <input type="hidden" name="id" value={client.id} /> : null}
      <EditorGrid
        main={
          <Panel title="Fiche du partenaire" icon={<IconHandshake size={16} />}>
            <div className="space-y-5">
              <Field label="Nom de l’organisation" htmlFor="name">
                <TextInput id="name" name="name" defaultValue={client?.name} required placeholder="Ex. : Orange Cameroun" />
              </Field>
              <BilingualText
                name="description"
                label="Présentation courte"
                hint="Affichée quand un visiteur survole ou touche le logo."
                multiline
                rows={4}
                defaultFr={client?.descriptionFr}
                defaultEn={client?.descriptionEn}
                recommendedLength={220}
              />
            </div>
          </Panel>
        }
        aside={
          <>
            <Panel title="Publication">
              <Switch name="published" label="Afficher sur le site" description="Dans la section « Ils nous font confiance »." defaultChecked={client?.published ?? true} />
            </Panel>

            <Panel>
              <MediaPicker
                name="imageUrl"
                label="Logo"
                variant="logo"
                hint="Idéalement un PNG ou SVG à fond transparent. Un logo animé (courte vidéo) est aussi accepté : il tourne en boucle, sans le son."
                defaultValue={client?.imageUrl}
              />
            </Panel>

            <AdvancedBox title="Options avancées">
              <Field
                label="Initiales de secours"
                htmlFor="logoLetters"
                hint="Affichées à la place du logo s’il n’y en a pas. Laissez vide pour les générer à partir du nom."
              >
                <TextInput id="logoLetters" name="logoLetters" maxLength={4} defaultValue={client?.logoLetters} className="w-28 uppercase" />
              </Field>
            </AdvancedBox>

            {client ? <DeleteZone kind="client" id={client.id} name={client.name} noun="ce partenaire" redirectTo="/dashboard/clients" /> : null}
          </>
        }
      />
    </DashboardForm>
  )
}
