import React from 'react'

export default function CodeError({
    errorMsg
}: { errorMsg: string }) {
    return (
        <div
            style={{
                backgroundColor: 'rgba(255, 55, 100, 0.05)'
            }}
            className='text-dark-pink py-2 px-4 rounded-lg'>
            {errorMsg.split(/\n/).map((line) => <div key={line}>{line}</div>)}
        </div>
    )
}
