import { prisma } from '@/lib/db/prisma'
import { saveCategoriesAction } from '@/app/dashboard/actions'
import { DashboardForm } from '@/components/dashboard/form/DashboardForm'
import { RowsEditor, type EditableRow } from '@/components/dashboard/form/RowsEditor'
import { Panel } from '@/components/dashboard/ui/primitives'
import { IconBriefcase, IconLightbulb, IconTag } from '@/components/dashboard/ui/icons'

function plural(count: number, singular: string, pluralForm: string) {
  return `${count} ${count > 1 ? pluralForm : singular}`
}

export default async function CategoriesPage() {
  const [projectCategories, solutionCategories, services] = await Promise.all([
    prisma.projectCategory.findMany({ orderBy: { sortOrder: 'asc' }, include: { _count: { select: { projects: true } } } }),
    prisma.solutionCategory.findMany({ orderBy: { sortOrder: 'asc' }, include: { _count: { select: { solutions: true } } } }),
    prisma.projectService.findMany({ orderBy: { sortOrder: 'asc' }, include: { _count: { select: { projects: true } } } }),
  ])

  const labelField = [{ key: 'label', label: 'Nom', type: 'bilingual' as const, placeholder: 'Nom de la catégorie' }]

  const projectRows: EditableRow[] = projectCategories.map((item) => ({
    id: item.id,
    values: { labelFr: item.labelFr, labelEn: item.labelEn },
    note: item.isAll ? 'Filtre « tout afficher »' : plural(item._count.projects, 'projet', 'projets'),
    lockedReason: item.isAll
      ? 'Ce filtre général ne peut pas être supprimé'
      : item._count.projects
        ? 'Utilisée par des projets : changez d’abord leur catégorie'
        : undefined,
  }))

  const solutionRows: EditableRow[] = solutionCategories.map((item) => ({
    id: item.id,
    values: { labelFr: item.labelFr, labelEn: item.labelEn },
    note: item.isAll ? 'Filtre « tout afficher »' : plural(item._count.solutions, 'solution', 'solutions'),
    lockedReason: item.isAll
      ? 'Ce filtre général ne peut pas être supprimé'
      : item._count.solutions
        ? 'Utilisée par des solutions : changez d’abord leur catégorie'
        : undefined,
  }))

  const serviceRows: EditableRow[] = services.map((item) => ({
    id: item.id,
    values: { labelFr: item.labelFr, labelEn: item.labelEn },
    note: plural(item._count.projects, 'projet', 'projets'),
    deleteWarning: item._count.projects ? `Ce service sera retiré des ${plural(item._count.projects, 'projet', 'projets')} qui l’utilisent.` : undefined,
  }))

  return (
    <DashboardForm action={saveCategoriesAction} title="Catégories" subtitle="Paramètres">
      <div className="space-y-6">
        <Panel
          title="Catégories de projets"
          description="Servent de filtres sur la page Projets. Chaque projet appartient à une catégorie."
          icon={<IconBriefcase size={16} />}
        >
          <RowsEditor prefix="projectCategory" fields={labelField} rows={projectRows} addLabel="Ajouter une catégorie" itemNoun="cette catégorie" />
        </Panel>

        <Panel
          title="Catégories de solutions"
          description="Servent de filtres sur la page Solutions. Chaque solution appartient à une catégorie."
          icon={<IconLightbulb size={16} />}
        >
          <RowsEditor prefix="solutionCategory" fields={labelField} rows={solutionRows} addLabel="Ajouter une catégorie" itemNoun="cette catégorie" />
        </Panel>

        <Panel
          title="Services"
          description="Les prestations que vous pouvez cocher sur chaque projet (« Services fournis »)."
          icon={<IconTag size={16} />}
        >
          <RowsEditor
            prefix="projectService"
            fields={[{ key: 'label', label: 'Nom', type: 'bilingual', placeholder: 'Nom du service' }]}
            rows={serviceRows}
            addLabel="Ajouter un service"
            itemNoun="ce service"
          />
        </Panel>
      </div>
    </DashboardForm>
  )
}
