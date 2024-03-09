import React from 'react'
import Highlight from 'react-highlight'

export default function Testcase({
    testcaseInput
}: { testcaseInput: string }) {
    return (
        <div className='flex flex-col gap-y-2'>
            <div className='flex gap-x-3 items-center text-sm font-medium text-dark-gray-6'>Last Executed Testcase</div>
            <Highlight className={`auto rounded-lg`}>
                {testcaseInput}
            </Highlight>
        </div>
    )
}
