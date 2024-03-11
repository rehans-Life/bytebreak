import React from 'react'

export default function NoData({
    emptyMsg
}: {
    emptyMsg?: string
}) {
    return (
        <div className='w-full flex flex-col items-center gap-y-4'>
            <img src="/null.png" alt="null" className='w-44 h-44' />
            <span className='font-medium text-dark-gray-6'>{emptyMsg || "No Data"}</span>
        </div>)
}
