import type { Metadata } from 'next'
import { Inter, Montserrat, Playfair_Display } from 'next/font/google'
import '../styles/tailwind.css'
import { getSiteBundle } from '@/lib/content/queries'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '600', '700', '800'],
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '600', '700'],
})

export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = 'iNFLUENZ'
  const fallbackDescription = 'Agence de conseil & stratégie, relations presse, communication digitale et événementiel'
  try {
    const bundle = await getSiteBundle()
    const title = bundle.settings.seoTitle.fr || fallbackTitle
    const description = bundle.settings.seoDescription.fr || fallbackDescription
    const image = bundle.settings.faviconUrl || '/images/logo.png'
    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://influenz.cm'),
      title,
      description,
      icons: { icon: image, apple: image },
      openGraph: {
        title,
        description,
        images: [{ url: image, width: 1200, height: 630, alt: bundle.settings.siteName }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
    }
  } catch {
    return {
      title: fallbackTitle,
      description: fallbackDescription,
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${montserrat.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
