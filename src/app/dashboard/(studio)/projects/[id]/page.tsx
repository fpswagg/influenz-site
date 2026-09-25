import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { saveProjectAction } from '@/app/dashboard/actions'
import { DashboardForm } from '@/components/dashboard/form/DashboardForm'
import { BilingualList, BilingualText } from '@/components/dashboard/form/BilingualFields'
import { AdvancedBox, ChipCheckboxes, DeleteZone, EditorGrid, SlugField } from '@/components/dashboard/form/EditorParts'
import { GalleryEditor } from '@/components/dashboard/media/MediaFields'
import { Switch } from '@/components/dashboard/ui/Switch'
import { Field, Panel, Select, StatusBadge, TextInput } from '@/components/dashboard/ui/primitives'
import { IconBriefcase, IconImage, IconLink, IconSparkles } from '@/components/dashboard/ui/icons'

export default async function ProjectEditorPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams?: { created?: string }
}) {
  const isNew = params.id === 'new'
  const [project, categories, services] = await Promise.all([
    isNew
      ? null
      : prisma.project.findUnique({
          where: { id: params.id },
          include: {
            translations: true,
            media: { orderBy: { sortOrder: 'asc' } },
            services: { orderBy: { sortOrder: 'asc' } },
          },
        }),
    prisma.projectCategory.findMany({ where: { isAll: false }, orderBy: { sortOrder: 'asc' } }),
    prisma.projectService.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])

  if (!isNew && !project) notFound()

  const fr = project?.translations.find((item) => item.locale === 'fr')
  const en = project?.translations.find((item) => item.locale === 'en')
  const currentYear = new Date().getFullYear()
  const title = isNew ? 'Nouveau projet' : fr?.title || 'Projet sans titre'

  return (
    <DashboardForm
      action={saveProjectAction}
      title={title}
      subtitle={isNew ? 'Remplissez au moins le titre et la catégorie, puis enregistrez.' : 'Projets'}
      backHref="/dashboard/projects"
      backLabel="Retour aux projets"
      headerExtra={project ? <StatusBadge published={project.published} /> : null}
      submitLabel={isNew ? 'Créer le projet' : 'Enregistrer'}
      flash={searchParams?.created ? 'Projet créé' : undefined}
    >
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      <EditorGrid
        main={
          <>
            <Panel title="L’essentiel" description="Ce que les visiteurs voient en premier." icon={<IconBriefcase size={16} />}>
              <div className="space-y-5">
                <BilingualText name="title" label="Titre du projet" defaultFr={fr?.title} defaultEn={en?.title} required placeholder="Ex. : Lancement de la marque Horizon" />
                <BilingualText name="client" label="Client" defaultFr={fr?.client} defaultEn={en?.client} placeholder="Ex. : Ministère de la Communication" />
                <BilingualText
                  name="description"
                  label="Résumé"
                  hint="Une ou deux phrases affichées sur les cartes de projet."
                  multiline
                  rows={3}
                  defaultFr={fr?.description}
                  defaultEn={en?.description}
                  recommendedLength={180}
                />
              </div>
            </Panel>

            <Panel title="Étude de cas" description="Le détail affiché sur la page du projet." icon={<IconSparkles size={16} />}>
              <div className="space-y-5">
                <BilingualText name="longDescription" label="Présentation" multiline rows={5} defaultFr={fr?.longDescription} defaultEn={en?.longDescription} />
                <BilingualText name="challenge" label="Le défi" hint="Quel problème le client devait-il résoudre ?" multiline rows={4} defaultFr={fr?.challenge} defaultEn={en?.challenge} />
                <BilingualText name="solution" label="Notre solution" hint="Ce que vous avez mis en place." multiline rows={4} defaultFr={fr?.solution} defaultEn={en?.solution} />
                <BilingualList
                  name="results"
                  label="Résultats obtenus"
                  hint="Un résultat par ligne. Appuyez sur Entrée pour en ajouter un."
                  defaultFr={fr?.results}
                  defaultEn={en?.results}
                  addLabel="Ajouter un résultat"
                  placeholder="Ex. : +40 % de visibilité en 3 mois"
                />
              </div>
            </Panel>

            <Panel
              title="Photos & vidéos"
              description="Images, fichiers vidéo ou liens YouTube / Vimeo. Le premier élément sert de vignette sur le site."
              icon={<IconImage size={16} />}
            >
              <GalleryEditor name="media" label="Galerie" kind="any" defaultValue={project?.media.map((item) => item.url) || []} />
            </Panel>

            <Panel title="Lien externe" description="Facultatif : un article, une vidéo ou un site lié au projet." icon={<IconLink size={16} />}>
              <div className="space-y-5">
                <Field label="Adresse du lien" htmlFor="linkUrl" optional>
                  <TextInput id="linkUrl" name="linkUrl" type="text" inputMode="url" defaultValue={project?.linkUrl || ''} placeholder="https://…" />
                </Field>
                <BilingualText name="linkLabel" label="Texte du bouton" optional defaultFr={project?.linkLabelFr} defaultEn={project?.linkLabelEn} placeholder="Ex. : Voir la campagne" />
              </div>
            </Panel>
          </>
        }
        aside={
          <>
            <Panel title="Publication">
              <div className="space-y-5">
                <Switch name="published" label="En ligne" description="Visible par les visiteurs du site." defaultChecked={project?.published ?? true} />
                <Switch name="featured" label="Afficher sur l’accueil" description="Dans la section Projets de la page d’accueil." defaultChecked={project?.featured ?? true} />
              </div>
            </Panel>

            <Panel title="Classement">
              <div className="space-y-5">
                <Field label="Catégorie" htmlFor="categoryId">
                  <Select id="categoryId" name="categoryId" defaultValue={project?.categoryId || ''} required>
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
                <Field label="Année" htmlFor="year">
                  <TextInput id="year" name="year" list="year-options" inputMode="numeric" defaultValue={project?.year || String(currentYear)} />
                  <datalist id="year-options">
                    {Array.from({ length: 12 }).map((_, index) => (
                      <option key={index} value={String(currentYear - index)} />
                    ))}
                  </datalist>
                </Field>
                <Field label="Services fournis">
                  <ChipCheckboxes
                    name="serviceIds"
                    options={services.map((service) => ({ value: service.id, label: service.labelFr }))}
                    defaultValue={project?.services.map((item) => item.serviceId) || []}
                    emptyText="Aucun service. Créez-en dans Paramètres › Catégories."
                  />
                </Field>
              </div>
            </Panel>

            <AdvancedBox title="Options avancées">
              <SlugField prefix="/projets/" defaultValue={project?.slug} isNew={isNew} />
            </AdvancedBox>

            {project ? (
              <DeleteZone kind="project" id={project.id} name={title} noun="ce projet" redirectTo="/dashboard/projects" />
            ) : null}
          </>
        }
      />
    </DashboardForm>
  )
}
