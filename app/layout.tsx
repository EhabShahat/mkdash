import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kids Volunteer Hub',
  description: 'A fun place for kids to volunteer and help their community!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}