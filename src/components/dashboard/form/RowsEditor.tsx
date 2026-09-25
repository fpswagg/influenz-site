'use client'

import { useRef, useState } from 'react'
import { useDashboardForm } from './DashboardForm'
import { BilingualText } from './BilingualFields'
import { useConfirm } from '../ui/ConfirmDialog'
import { Badge, Field, IconButton, TextInput } from '../ui/primitives'
import { IconChevronDown, IconChevronUp, IconPlus, IconTrash } from '../ui/icons'

export interface RowField {
  key: string
  label: string
  type: 'text' | 'bilingual' | 'bilingual-multiline'
  placeholder?: string
  required?: boolean
}

export interface EditableRow {
  id: string
  /** Values keyed by input name suffix: `url`, `labelFr`, `labelEn`… */
  values: Record<string, string>
  /** Small note displayed on the row, e.g. "3 projets" */
  note?: string
  /** Prevents deletion and explains why */
  lockedReason?: string
  /** Asked before deleting */
  deleteWarning?: string
}

interface ClientRow extends EditableRow {
  uid: string
}

/**
 * Editable, re-orderable list of small records (links, categories, domains…).
 * Posts `${prefix}.id`, one input per field, `${prefix}.deleted` and a `${prefix}.present` marker.
 */
export function RowsEditor({
  prefix,
  fields,
  rows: initialRows,
  layout = 'inline',
  addLabel,
  emptyText,
  itemNoun = 'cet élément',
}: {
  prefix: string
  fields: RowField[]
  rows: EditableRow[]
  layout?: 'inline' | 'card'
  addLabel: string
  emptyText?: string
  itemNoun?: string
}) {
  const { markDirty } = useDashboardForm()
  const confirm = useConfirm()
  const counter = useRef(0)
  const [rows, setRows] = useState<ClientRow[]>(() => initialRows.map((row) => ({ ...row, uid: row.id || `new-${counter.current++}` })))
  const [deleted, setDeleted] = useState<string[]>([])

  function update(next: ClientRow[]) {
    setRows(next)
    markDirty()
  }

  function move(index: number, delta: number) {
    const target = index + delta
    if (target < 0 || target >= rows.length) return
    const next = [...rows]
    ;[next[index], next[target]] = [next[target], next[index]]
    update(next)
  }

  async function remove(row: ClientRow) {
    if (row.id) {
      const label = row.values.labelFr || row.values.titleFr || row.values.url || itemNoun
      const ok = await confirm({
        title: `Supprimer « ${label} » ?`,
        description: (
          <>
            {row.deleteWarning ? <>{row.deleteWarning} </> : null}
            La suppression sera effective lorsque vous cliquerez sur <strong>Enregistrer</strong>.
          </>
        ),
        confirmLabel: 'Supprimer',
      })
      if (!ok) return
      setDeleted((current) => [...current, row.id])
    }
    update(rows.filter((item) => item.uid !== row.uid))
  }

  function add() {
    counter.current += 1
    update([...rows, { uid: `new-${counter.current}`, id: '', values: {} }])
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={`${prefix}.present`} value="1" />
      {deleted.map((id) => (
        <input key={id} type="hidden" name={`${prefix}.deleted`} value={id} />
      ))}

      {rows.length === 0 && emptyText ? (
        <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">{emptyText}</p>
      ) : null}

      <ul className={layout === 'inline' ? 'divide-y divide-slate-100 rounded-xl border border-slate-200' : 'space-y-3'}>
        {rows.map((row, index) => (
          <li
            key={row.uid}
            className={
              layout === 'inline'
                ? 'flex items-start gap-3 px-3 py-3'
                : 'flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4'
            }
          >
            <input type="hidden" name={`${prefix}.id`} value={row.id} />
            <span className="mt-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
              {index + 1}
            </span>

            <div className={`min-w-0 flex-1 ${layout === 'inline' ? 'grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start' : 'space-y-4'}`}>
              <div className={layout === 'inline' ? 'grid gap-3' : 'space-y-4'}>
                {fields.map((field) => (
                  <RowFieldInput key={field.key} prefix={prefix} field={field} row={row} compact={layout === 'inline'} />
                ))}
              </div>
              {row.note ? (
                <div className="flex flex-wrap gap-1.5 sm:mt-2">
                  <Badge>{row.note}</Badge>
                </div>
              ) : null}
            </div>

            <div className="flex shrink-0 items-center pt-1">
              <IconButton label="Monter" onClick={() => move(index, -1)} disabled={index === 0}>
                <IconChevronUp size={16} />
              </IconButton>
              <IconButton label="Descendre" onClick={() => move(index, 1)} disabled={index === rows.length - 1}>
                <IconChevronDown size={16} />
              </IconButton>
              <IconButton
                label={row.lockedReason || 'Supprimer'}
                tone="danger"
                onClick={() => remove(row)}
                disabled={Boolean(row.lockedReason)}
              >
                <IconTrash size={16} />
              </IconButton>
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-purple-brand hover:bg-purple-brand/5"
      >
        <IconPlus size={16} />
        {addLabel}
      </button>
    </div>
  )
}

function RowFieldInput({ prefix, field, row, compact }: { prefix: string; field: RowField; row: ClientRow; compact: boolean }) {
  const name = `${prefix}.${field.key}`
  if (field.type === 'text') {
    return (
      <Field label={field.label} hideLabel={compact}>
        <TextInput name={name} defaultValue={row.values[field.key] || ''} placeholder={field.placeholder || field.label} required={field.required} aria-label={field.label} />
      </Field>
    )
  }
  return (
    <BilingualText
      name={name}
      label={field.label}
      hideLabel={compact}
      multiline={field.type === 'bilingual-multiline'}
      rows={3}
      required={field.required}
      placeholder={field.placeholder || field.label}
      defaultFr={row.values[`${field.key}Fr`]}
      defaultEn={row.values[`${field.key}En`]}
    />
  )
}
