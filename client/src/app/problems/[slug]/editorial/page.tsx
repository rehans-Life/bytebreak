'use client';

import { getEditorial } from '@/app/utils/api';
import { useQuery } from '@tanstack/react-query';
import React from 'react'

export default function Page({
    params: { slug }
}: { params: { slug: string } }
) {

    const { data } = useQuery({
        queryKey: ['editorial', slug],
        queryFn: getEditorial
    })

    return (
        <div className='text-white'>Editorial
            <div>
                {data?.text}
            </div>
        </div>
    )
}
