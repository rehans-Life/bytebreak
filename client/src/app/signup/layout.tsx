import { Metadata } from 'next'
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Sign Up / Register',
  description: 'Register into ByteBreak',
}

export default function layout({
    children
}: { children: ReactNode }) {
  return (
    <>{children}</>
  )
}
