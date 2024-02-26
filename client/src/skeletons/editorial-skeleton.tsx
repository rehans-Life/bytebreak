import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function EditorialSkeleton() {
    return (
        <div className='w-full'>
            <div className='flex items-center justify-between gap-x-1'>
                <Skeleton className="w-[50%] max-w-full xs:h-6 h-4 bg-dark-fill-3" />
                <div className='flex items-center gap-x-2'>
                    <Skeleton className='xs:w-16 xs:h-6 w-10 h-4 bg-dark-fill-3 rounded-full' />
                    <Skeleton className='xs:w-6 xs:h-6 w-4 h-4 bg-dark-fill-3 rounded-full' />
                </div>
            </div>
            <div className="p-3"></div>
            <div className='flex flex-col gap-y-8'>
                {Array(5).fill(0).map((_, i) => <div key={i} className='flex flex-col gap-y-2'>
                    <Skeleton className='w-full xs:h-4 h-2 bg-dark-fill-3 rounded-sm' />
                    <Skeleton className='w-full xs:h-4 h-2 bg-dark-fill-3 rounded-sm' />
                    <Skeleton className='w-[30%] xs:h-4 h-2 bg-dark-fill-3 rounded-sm' />
                </div>)}
            </div>
        </div>
    )
}
