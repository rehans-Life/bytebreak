import { Metadata } from 'next'
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Sign Up / Registetr',
  description: 'Register into Bytebreak',
}

export default function layout({
    children
}: { children: ReactNode }) {
  return (
    <>{children}</>
  )
}
