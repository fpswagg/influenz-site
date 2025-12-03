import type { Metadata } from 'next'
import { Inter, Montserrat, Playfair_Display } from 'next/font/google'
import '../styles/tailwind.css'

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

export const metadata: Metadata = {
  title: 'iNFLUENZ',
  description: 'Agence de conseil & stratégie, relations presse, communication digitale et événementiel',
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
  openGraph: {
    title: 'iNFLUENZ',
    description: 'Agence de conseil & stratégie, relations presse, communication digitale et événementiel',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'iNFLUENZ',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iNFLUENZ',
    description: 'Agence de conseil & stratégie, relations presse, communication digitale et événementiel',
    images: ['/images/logo.png'],
  },
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

