import React from 'react'

export default function MarkdownSkeleton() {
    return (
        <div className='w-full h-[400px] flex flex-col items-center border-dark-border border-t border-b'>
            <div className='h-[33px] w-full border-b border-dark-border'></div>
            <div className='border-l border-r border-dark-border w-[10px] flex-1'></div>
        </div>
    )
}
