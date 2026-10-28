import ClientEditorPage from '../[id]/page'

export default async function NewClientPage() {
  return ClientEditorPage({ params: Promise.resolve({ id: 'new' }) })
}
