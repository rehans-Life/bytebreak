import type { Metadata } from 'next'
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Log In',
  description: 'Login to Bytebreak',
}

export default function layout({
    children
}: { children: ReactNode }) {
  return (
    <>{children}</>
  )
}
