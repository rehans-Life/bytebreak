import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function ConstributionSkeleton() {
    return (
        <div className='p-4 h-auto even:bg-transparent odd:bg-dark-layer-3 cursor-pointer rounded-md flex xs:items-center items-start justify-between gap-x-5 xs:flex-row flex-col gap-y-2'>
            <Skeleton className='rounded-lg bg-dark-fill-2 flex-1 xs:h-4 h-3' />
            <Skeleton className='rounded-lg bg-dark-fill-2 flex-1 xs:h-4 h-3' />
        </div>
    )
}
