import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function ContentSkeleton() {
    return (
        <div className='py-2'>
            <div>
                <Skeleton
                    className='w-full rounded-full h-2 bg-dark-fill-3'
                ></Skeleton>
                <div className='p-1'></div>
                <Skeleton
                    className='w-[80%] rounded-full h-2 bg-dark-fill-3'
                ></Skeleton>
                <div className='p-1'></div>
                <Skeleton
                    className='w-[20%] rounded-full h-2 bg-dark-fill-3'
                ></Skeleton>
                <div className='p-3'></div>
                <Skeleton
                    className='w-[100%] h-20 rounded-md bg-dark-fill-3'>
                </Skeleton>
                <div className='p-3'></div>
                <div className='flex flex-col gap-y-2'>
                    <div className='flex gap-x-1.5 items-center'>
                        <Skeleton
                            className='w-2 h-2 rounded-full bg-dark-fill-3'>
                        </Skeleton>
                        <Skeleton
                            className='w-[60%] h-4 rounded-md bg-dark-fill-3'>
                        </Skeleton>
                    </div>
                    <div className='flex gap-x-1.5 items-center'>
                        <Skeleton
                            className='w-2 h-2 rounded-full bg-dark-fill-3'>
                        </Skeleton>
                        <Skeleton
                            className='w-[60%] h-4 rounded-md bg-dark-fill-3'>
                        </Skeleton>
                    </div>
                </div>
                <div className='p-3'></div>
                <div className='flex flex-col gap-y-2'>
                    <Skeleton
                        className='w-full h-2 rounded-md bg-dark-fill-3'>
                    </Skeleton>
                    <Skeleton
                        className='w-[40%] h-2 rounded-md bg-dark-fill-3'>
                    </Skeleton>
                </div>
            </div>
        </div>
    )
}
