import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function TestcaseResultSkeleton() {
    return (
        <div className='flex flex-col gap-y-5'>
            <Skeleton className='h-8 rounded-lg w-44 bg-dark-fill-3' />
            <div className='flex items-center gap-x-3'>
                {Array(3).fill(0).map((_, i: number) => <Skeleton key={i} className='h-8 rounded-lg w-32 bg-dark-fill-3' />)}
            </div>
            {Array(3).fill(0).map((_, i: number) => <div key={i} className='flex flex-col gap-y-2'>
                <Skeleton className='h-6 rounded-lg w-24 bg-dark-fill-3' />
                <Skeleton className='w-full h-9 rounded-lg bg-dark-fill-3' />
            </div>)
            }
        </div>
    )
}
