import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as HotToaster } from 'react-hot-toast'
import ReactQueryProvider from '../providers/queryClientProvider'
import { Provider as JotaiProvider } from 'jotai'
import { ThemeProvider } from '@/providers/themeProvider'
import Header from './components/header'
import { Suspense } from 'react'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'ByteBreak',
  description: 'Remote Code Execution Platform',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <JotaiProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/icon.png" type='image/png' />
        </head>
        <body className="bg-dark-layer-2 min-h-screen">
          <ThemeProvider
            forcedTheme='dark'
          >
            <Toaster />
            <ReactQueryProvider>
              <Suspense fallback={<div className='h-screen'>
                <div className='md:px-5 px-3 h-12 relative bg-dark-layer-3 border-b border-dark-border flex items-center'>
                  <Image height={1080} width={1080} src="/logo.png" alt="log" className="w-6 h-6 object-contain" />
                </div>
              </div>}>
                <Header />
                {children}
              </Suspense>
            </ReactQueryProvider>
            <HotToaster />
          </ThemeProvider>
        </body>
      </html>
    </JotaiProvider>
  )
}
