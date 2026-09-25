import { MetadataRoute } from 'next'
import { getProjectSlugs, getSolutionSlugs } from '@/lib/content/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const [projectSlugs, solutionSlugs] = await Promise.all([
    getProjectSlugs().catch(() => [] as string[]),
    getSolutionSlugs().catch(() => [] as string[]),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/projets`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/solutions`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]

  return [
    ...staticPages,
    ...projectSlugs.map((slug) => ({
      url: `${baseUrl}/projets/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...solutionSlugs.map((slug) => ({
      url: `${baseUrl}/solutions/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
