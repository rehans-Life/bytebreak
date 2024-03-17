import deslugify from '@/utils/deslugify'
import React, { ReactNode } from 'react'

export async function generateMetadata({
    params: { slug }
}: { params: { slug: string } }) {
    return {
        title: `${deslugify(slug)} | Submissions`,
        description: `Your Submissions for ${deslugify(slug)}`
    }
}   


export default function layout({
    children
}: {children: ReactNode}) {
  return (
    <>{children}</>
  )
}
