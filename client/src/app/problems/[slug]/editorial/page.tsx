'use client';

import { getEditorial } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import React from 'react'
import EditorialSkeleton from '../../../../skeletons/editorial-skeleton';

const MarkdownPreview = dynamic(
    () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
    {
        ssr: false, loading() {
            return <EditorialSkeleton />
        },
    }
);


export default function Page({
    params: { slug }
}: { params: { slug: string } }
) {

    const { data, isLoading } = useQuery({
        queryKey: ['editorial', slug],
        queryFn: getEditorial
    })

    return (
        <div className='w-full flex justify-start overflow-y-auto min-w-96 sm:h-full h-80'>
            <div className='text-white p-5 w-full sm:w-[80%] flex items-center'>
                {isLoading
                    ? <EditorialSkeleton />
                    : <MarkdownPreview className='!text-sm w-full' source={data?.text}></MarkdownPreview>
                }
            </div>
        </div>
    )
}
