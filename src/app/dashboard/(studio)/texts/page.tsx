import { prisma } from '@/lib/db/prisma'
import { saveTextsAction } from '@/app/dashboard/actions'
import { DashboardForm } from '@/components/dashboard/form/DashboardForm'
import { TextsEditor, type TextEntry } from '@/components/dashboard/TextsEditor'
import { HIDDEN_TEXT_KEYS, TEXT_GROUPS, shortTextLabel } from '@/lib/dashboard/text-groups'

export default async function TextsPage({ searchParams }: { searchParams?: { group?: string } }) {
  const rows = await prisma.copyEntry.findMany({ orderBy: [{ group: 'asc' }, { sortOrder: 'asc' }] })

  const known = new Set(TEXT_GROUPS.map((group) => group.id))
  const extraGroups = Array.from(new Set(rows.map((row) => row.group)))
    .filter((group) => !known.has(group))
    .map((group) => ({ id: group, label: group, description: '' }))
  const groups = [...TEXT_GROUPS, ...extraGroups].filter((group) => rows.some((row) => row.group === group.id))
  const order = new Map(groups.map((group, index) => [group.id, index]))

  const entries: TextEntry[] = rows
    .filter((row) => !HIDDEN_TEXT_KEYS.has(row.key))
    .sort((a, b) => (order.get(a.group) ?? 99) - (order.get(b.group) ?? 99) || a.sortOrder - b.sortOrder)
    .map((row) => ({
      key: row.key,
      group: row.group,
      kind: row.kind,
      label: shortTextLabel(row.label),
      hint: row.hint,
      valueFr: row.valueFr,
      valueEn: row.valueEn,
    }))

  return (
    <DashboardForm
      action={saveTextsAction}
      title="Textes & traductions"
      subtitle="Tous les textes fixes du site, en français et en anglais"
      bilingual={false}
    >
      <TextsEditor entries={entries} groups={groups} initialGroup={searchParams?.group} />
    </DashboardForm>
  )
}
