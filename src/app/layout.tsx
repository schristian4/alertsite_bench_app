import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './styles/globals.css'
import './styles/main.css'
import './styles/minichart.css'
import './styles/iconstatus.css'
import Head from 'next/head'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Alertsite Technical Benchmark - Third Party Monitoring',
  description: 'Compare your website to your competitors',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning={true}>
      <Head>
        <link rel='shortcut icon' href='/favicon.ico' />
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
