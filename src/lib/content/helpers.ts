import type { Language } from '@/lib/i18n'
import type { ProjectData, SolutionData } from '@/lib/content/types'

export function getProjectTranslation(project: ProjectData, language: Language) {
  return project.translations[language]
}

export function getSolutionTranslation(solution: SolutionData, language: Language) {
  return solution.translations[language]
}

export function getProjectBySlug(projects: ProjectData[], slug: string) {
  return projects.find((project) => project.slug === slug)
}

export function getSolutionBySlug(solutions: SolutionData[], slug: string) {
  return solutions.find((solution) => solution.slug === slug)
}

export function getFeaturedSolutions(solutions: SolutionData[]) {
  return solutions.filter((solution) => solution.featured)
}

export function getProjectCategory(project: ProjectData) {
  return project.categoryId || 'all'
}
