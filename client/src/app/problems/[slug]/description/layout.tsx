import deslugify from '@/utils/deslugify'
import React, { ReactNode } from 'react'

export async function generateMetadata({
    params: { slug }
}: { params: { slug: string } }) {
    return {
        title: `${deslugify(slug)} | Description`,
        description: `Problem Description for ${deslugify(slug)}`
    }
}   

export default function layout({
    children
}: {children: ReactNode}) {
  return (
    <>{children}</>
  )
}
