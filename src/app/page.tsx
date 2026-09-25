import { SiteProvider } from '@/lib/content/site-context'
import { getSiteBundle } from '@/lib/content/queries'
import HomeView from './HomeView'

export default async function Home() {
  const bundle = await getSiteBundle()
  return (
    <SiteProvider bundle={bundle}>
      <HomeView />
    </SiteProvider>
  )
}
