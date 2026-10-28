import ProjectEditorPage from '../[id]/page'

export default async function NewProjectPage() {
  return ProjectEditorPage({ params: Promise.resolve({ id: 'new' }) })
}
