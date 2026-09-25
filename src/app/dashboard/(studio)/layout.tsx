import type { Metadata } from 'next'
import { prisma } from '@/lib/db/prisma'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { ToastProvider } from '@/components/dashboard/ui/Toaster'
import { ConfirmProvider } from '@/components/dashboard/ui/ConfirmDialog'

export const metadata: Metadata = {
  title: 'Administration',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const settings = await prisma.siteConfig
    .findUnique({ where: { id: 'site' }, select: { siteName: true, logoUrl: true } })
    .catch(() => null)

  return (
    <div className="dash min-h-screen bg-slate-50 text-slate-900">
      <ToastProvider>
        <ConfirmProvider>
          <Sidebar siteName={settings?.siteName || 'iNFLUENZ'} logoUrl={settings?.logoUrl || '/images/logo.png'} />
          <div className="lg:pl-[264px]">
            <main className="px-4 pb-24 pt-6 sm:px-6 lg:px-10 lg:pt-8">{children}</main>
          </div>
        </ConfirmProvider>
      </ToastProvider>
    </div>
  )
}
