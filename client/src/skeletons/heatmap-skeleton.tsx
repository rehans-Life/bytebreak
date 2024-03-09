import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function HeatMapSkeleton() {
    return (
        <div className='flex flex-col gap-y-4 w-full'>
            {Array(3).fill(0).map((_, i) => {
                return <Skeleton key={i} className="w-full xs:h-4 h-3 bg-dark-fill-3" />
            })}
            <div className='flex justify-between gap-x-2'>
                {Array(12).fill(0).map((_, i) => {
                    return <Skeleton key={i} className="w-12 xs:h-3 h-2 rounded-sm bg-dark-fill-3" />
                })}
            </div>
        </div>
    )
}
