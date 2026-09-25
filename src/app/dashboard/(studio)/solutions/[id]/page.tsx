import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { saveSolutionAction } from '@/app/dashboard/actions'
import { DashboardForm } from '@/components/dashboard/form/DashboardForm'
import { BilingualList, BilingualText } from '@/components/dashboard/form/BilingualFields'
import { AdvancedBox, DeleteZone, EditorGrid, SlugField } from '@/components/dashboard/form/EditorParts'
import { EmojiPicker } from '@/components/dashboard/form/EmojiPicker'
import { RowsEditor } from '@/components/dashboard/form/RowsEditor'
import { GalleryEditor, MediaPicker } from '@/components/dashboard/media/MediaFields'
import { Switch } from '@/components/dashboard/ui/Switch'
import { Field, Panel, Select, StatusBadge } from '@/components/dashboard/ui/primitives'
import { IconImage, IconLightbulb, IconLink, IconSparkles } from '@/components/dashboard/ui/icons'

export default async function SolutionEditorPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams?: { created?: string }
}) {
  const isNew = params.id === 'new'
  const [solution, categories] = await Promise.all([
    isNew
      ? null
      : prisma.solution.findUnique({
          where: { id: params.id },
          include: {
            translations: true,
            media: { orderBy: { sortOrder: 'asc' } },
            links: { orderBy: { sortOrder: 'asc' } },
          },
        }),
    prisma.solutionCategory.findMany({ where: { isAll: false }, orderBy: { sortOrder: 'asc' } }),
  ])

  if (!isNew && !solution) notFound()
  const fr = solution?.translations.find((item) => item.locale === 'fr')
  const en = solution?.translations.find((item) => item.locale === 'en')
  const title = isNew ? 'Nouvelle solution' : fr?.title || 'Solution sans titre'

  return (
    <DashboardForm
      action={saveSolutionAction}
      title={title}
      subtitle={isNew ? 'Remplissez au moins le titre et la catégorie, puis enregistrez.' : 'Solutions'}
      backHref="/dashboard/solutions"
      backLabel="Retour aux solutions"
      headerExtra={solution ? <StatusBadge published={solution.published} /> : null}
      submitLabel={isNew ? 'Créer la solution' : 'Enregistrer'}
      flash={searchParams?.created ? 'Solution créée' : undefined}
    >
      {solution ? <input type="hidden" name="id" value={solution.id} /> : null}
      <EditorGrid
        main={
          <>
            <Panel title="L’essentiel" icon={<IconLightbulb size={16} />}>
              <div className="space-y-5">
                <BilingualText name="title" label="Titre de la solution" required defaultFr={fr?.title} defaultEn={en?.title} placeholder="Ex. : Gestion de crise médiatique" />
                <BilingualText
                  name="problem"
                  label="La problématique"
                  hint="Le problème rencontré par vos clients. C’est aussi le texte affiché sur les cartes."
                  multiline
                  rows={4}
                  defaultFr={fr?.problem}
                  defaultEn={en?.problem}
                />
                <BilingualText name="approach" label="Notre approche" hint="Comment vous y répondez." multiline rows={4} defaultFr={fr?.approach} defaultEn={en?.approach} />
              </div>
            </Panel>

            <Panel title="Déroulé et résultats" icon={<IconSparkles size={16} />}>
              <div className="space-y-6">
                <BilingualList name="steps" label="Les étapes clés" defaultFr={fr?.steps} defaultEn={en?.steps} addLabel="Ajouter une étape" placeholder="Ex. : Audit de la situation" />
                <BilingualList name="results" label="Les résultats" defaultFr={fr?.results} defaultEn={en?.results} addLabel="Ajouter un résultat" placeholder="Ex. : Retour au calme en 48 h" />
                <BilingualText
                  name="callToAction"
                  label="Phrase d’invitation"
                  hint="Affichée en bas de la page, au-dessus du bouton de contact."
                  defaultFr={fr?.callToAction}
                  defaultEn={en?.callToAction}
                  placeholder="Ex. : Parlons de votre situation"
                />
              </div>
            </Panel>

            <Panel title="Photos & vidéos" description="Images, fichiers vidéo, ou liens YouTube / Vimeo." icon={<IconImage size={16} />}>
              <div className="space-y-6">
                <MediaPicker
                  name="coverUrl"
                  label="Visuel principal"
                  hint="Image ou vidéo utilisée sur les cartes et en haut de la page (les vidéos tournent en boucle sans le son sur les cartes). Si vide, le premier élément de la galerie est utilisé."
                  defaultValue={solution?.coverUrl}
                  optional
                />
                <GalleryEditor name="images" label="Galerie" firstLabel="1re" defaultValue={solution?.media.map((item) => item.url) || []} />
              </div>
            </Panel>

            <Panel title="Liens utiles" description="Facultatif : articles, vidéos ou documents liés à cette solution." icon={<IconLink size={16} />}>
              <RowsEditor
                prefix="link"
                layout="card"
                addLabel="Ajouter un lien"
                itemNoun="ce lien"
                fields={[
                  { key: 'url', label: 'Adresse du lien', type: 'text', placeholder: 'https://…' },
                  { key: 'label', label: 'Texte affiché', type: 'bilingual', placeholder: 'Ex. : Lire l’article' },
                ]}
                rows={(solution?.links || []).map((link) => ({
                  id: link.id,
                  values: { url: link.url, labelFr: link.labelFr, labelEn: link.labelEn },
                }))}
              />
            </Panel>
          </>
        }
        aside={
          <>
            <Panel title="Publication">
              <div className="space-y-5">
                <Switch name="published" label="En ligne" description="Visible par les visiteurs du site." defaultChecked={solution?.published ?? true} />
                <Switch name="featured" label="Afficher sur l’accueil" description="Dans la section Solutions de la page d’accueil." defaultChecked={solution?.featured ?? false} />
              </div>
            </Panel>

            <Panel title="Classement">
              <Field label="Catégorie" htmlFor="categoryId">
                <Select id="categoryId" name="categoryId" defaultValue={solution?.categoryId || ''} required>
                  <option value="" disabled>
                    Choisir…
                  </option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.labelFr}
                    </option>
                  ))}
                </Select>
              </Field>
            </Panel>

            <Panel title="Symbole">
              <EmojiPicker name="icon" defaultValue={solution?.icon || ''} />
            </Panel>

            <AdvancedBox title="Options avancées">
              <SlugField prefix="/solutions/" defaultValue={solution?.slug} isNew={isNew} />
            </AdvancedBox>

            {solution ? (
              <DeleteZone kind="solution" id={solution.id} name={title} noun="cette solution" redirectTo="/dashboard/solutions" />
            ) : null}
          </>
        }
      />
    </DashboardForm>
  )
}
