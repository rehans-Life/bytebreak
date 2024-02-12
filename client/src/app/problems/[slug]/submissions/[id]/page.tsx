'use client';

import { getSubmission } from '@/app/utils/api'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

export default function Page({
    params: { id }
}: {
    params: { id: string }
}) {

    const { data } = useQuery({
        queryKey: ['submissions', id],
        queryFn: getSubmission
    })

    return (<div>
        <div>{data?.status}</div>
        <div>{data?.code}</div>
        <div>{data?.error}</div>
    </div>
    )
}
