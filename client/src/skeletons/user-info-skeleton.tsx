import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function UserInfoSkeleton() {
    return (
        <>
            <div className='flex items-start gap-x-3'>
                <Skeleton className='rounded-lg w-20 h-20 bg-dark-fill-2' />
                <div className='flex-1 flex flex-col gap-y-2'>
                    <Skeleton className='w-[35%] xs:h-3.5 h-2 bg-dark-fill-3 rounded-lg' />
                    <Skeleton className='w-[50%] xs:h-3 h-2 bg-dark-fill-3 rounded-lg' />
                </div>
            </div>
            <div className='w-full my-2 h-[1px] bg-dark-border'></div>
            <div className='flex flex-col gap-y-3 text-white'>
                <Skeleton className='w-[30%] xs:h-4 h-2 bg-dark-fill-3 rounded-lg' />
                <Skeleton className='w-full xs:h-3 h-2 bg-dark-fill-3 rounded-lg' />
                <Skeleton className='w-full xs:h-3 h-2 bg-dark-fill-3 rounded-lg' />
                <Skeleton className='w-full xs:h-3 h-2 bg-dark-fill-3 rounded-lg' />            </div>
        </>
    )
}
