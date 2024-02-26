import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as HotToaster } from 'react-hot-toast'
import ReactQueryProvider from '../providers/queryClientProvider'
import { Provider as JotaiProvider } from 'jotai'
import { ThemeProvider } from '@/providers/themeProvider'

export const metadata: Metadata = {
  title: 'ByteBreak',
  description: 'Remote Code Execution Platform',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <JotaiProvider>
      <html lang="en">
        <head>
        </head>
        <body className="h-screen bg-dark-layer-2">
          <ThemeProvider
            forcedTheme='dark'
          >
            <Toaster />
            <ReactQueryProvider>
              {children}
            </ReactQueryProvider>
            <HotToaster />
          </ThemeProvider>
        </body>
      </html>
    </JotaiProvider>
  )
}
