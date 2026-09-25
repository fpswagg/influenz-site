import { SiteProvider } from '@/lib/content/site-context'
import { getSiteBundle } from '@/lib/content/queries'

export default async function PublicShell({ children }: { children: React.ReactNode }) {
  const bundle = await getSiteBundle()
  return <SiteProvider bundle={bundle}>{children}</SiteProvider>
}
