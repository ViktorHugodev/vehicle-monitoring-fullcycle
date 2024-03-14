import { Navbar } from './components/Navbar'
import ThemeRegistry from './components/ThemeRegistry/ThemeRegistry'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
  title = 'Next.js',
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <html lang='en'>
      <body>
        <ThemeRegistry>
          <Navbar />
          {children}
        </ThemeRegistry>
      </body>
    </html>
  )
}
