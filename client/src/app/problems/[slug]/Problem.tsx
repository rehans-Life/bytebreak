'use client';

import { useSuspenseQueries } from '@tanstack/react-query'
import React, { ReactNode } from 'react'
import CodeEditor from './components/codeEditor';
import { getDefaultConfigurations, getProblem } from '../../utils/api';
import { Problem } from '@/app/create-problem/interfaces';
import { useSetAtom } from 'jotai';
import { problemAtom } from '@/atoms/problemAtoms';

export default function Problem({
    slug,
    children
}: {
    children: ReactNode,
    slug: string
}) {

    const setProblem = useSetAtom(problemAtom);

    const [{ data: problem }, { data: languages }] = useSuspenseQueries({
        queries: [
            {
                meta: {
                    onSuccess: (data: Problem) => {
                        setProblem(data)
                    }
                },
                queryKey: ['problems', slug],
                queryFn: getProblem,
            },
            {
                queryKey: ['defaultConfiguration', slug],
                queryFn: getDefaultConfigurations
            }
        ]
    })

    return (
        <div className='p-4'>
            <div>{children}</div>
            <CodeEditor languages={languages} problem={problem} />
        </div>
    )
}
