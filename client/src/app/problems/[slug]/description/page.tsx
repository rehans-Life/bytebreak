'use client';

import { problemAtom } from '@/atoms/problemAtoms';
import { useAtomValue } from 'jotai';
import React from 'react'

export default function Page() {
    const problem = useAtomValue(problemAtom);

    return (
        <div className='text-white'>
            <div>{problem?.name}</div>
            <div>
                <div>{problem?.difficulty}</div>
                {problem?.tags.map(({ name, _id }) => {
                    return <div key={_id}>{name}</div>
                })}
            </div>
            <div>{problem?.description}</div>
        </div>
    )
}
