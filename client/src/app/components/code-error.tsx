import React from 'react'
import { ChevronsDown, ChevronsUp } from 'lucide-react';
import useShowMore from '@/hooks/useShowMore';

export default function CodeError({
    errorMsg
}: { errorMsg: string }) {
    const [showMore, setShowMore, containerRef] = useShowMore();

    return (
        <div
            style={{
                backgroundColor: 'rgba(255, 55, 100, 0.05)'
            }}
            ref={containerRef}
            className={`text-dark-red text-sm p-4 rounded-lg`}>
            <div
                className={`${showMore ? 'max-h-auto' : 'max-h-48'} overflow-hidden`}
            >
                {
                    errorMsg.split(/\n/).map((line, i) =>
                        <div key={i}>{line}</div>
                    )
                }
            </div>
            <div
                onClick={() => setShowMore(prev => !prev)}
                id='more'
                className='cursor-pointer text-sm text-dark-label-2 gap-x-1 z-99 flex items-center justify-center w-full'>
                {showMore ? <ChevronsUp className='h-5 w-5' /> : <ChevronsDown className='h-5 w-5' />} View More
            </div>
        </div>
    )
}
