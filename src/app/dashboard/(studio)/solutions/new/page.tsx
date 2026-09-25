import SolutionEditorPage from '../[id]/page'

export default async function NewSolutionPage() {
  return SolutionEditorPage({ params: { id: 'new' } })
}
