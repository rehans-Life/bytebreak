import deslugify from '@/utils/deslugify'
import React, { ReactNode } from 'react'

export async function generateMetadata({
    params: { slug }
}: { params: { slug: string } }) {
    return {
        title: `${deslugify(slug)} | Submission`,
        description: `Your Submission for ${deslugify(slug)}`
    }
}   

export default function layout({
    children
}: { children: ReactNode }) {
return (
    <>{children}</>
  )
}
