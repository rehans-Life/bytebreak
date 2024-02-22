'use client';

import { getEditorial } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import React from 'react'

const MarkdownPreview = dynamic(
    () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
    { ssr: false }
);


export default function Page({
    params: { slug }
}: { params: { slug: string } }
) {

    const { data } = useQuery({
        queryKey: ['editorial', slug],
        queryFn: getEditorial
    })

    return (
        <div className='text-white p-5'>
            <MarkdownPreview className='!text-sm' source={data?.text}></MarkdownPreview>
        </div>
    )
}
