import { Metadata } from 'next'
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
    title: 'Google Sign In',
    description: 'Sign In With Google on Bytebreak',
}

export default function layout({
    children
}: { children: ReactNode }) {
  return (
    <>{children}</>
  )
}
