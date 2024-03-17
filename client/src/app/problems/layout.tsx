import { Metadata } from 'next'
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
    title: 'ByteBreak | Problems',
    description: 'Have a look at all the problems at our platform',
}  

export default function layout({
    children
}: { children: ReactNode }) {
  return (
    <>{children}</>
  )
}
