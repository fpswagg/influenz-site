import PublicShell from '@/components/site/PublicShell'

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <PublicShell>{children}</PublicShell>
}
