'use client'

import { problemAtom } from '@/atoms/problemAtoms'
import { userAtom } from '../../../../atoms/userAtom'
import { useAtomValue } from 'jotai'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getSubmissions } from '@/app/utils/api'
import Link from 'next/link'

export default function Page() {
    const user = useAtomValue(userAtom)
    const problem = useAtomValue(problemAtom);

    const { isFetching, data } = useQuery({
        queryKey: ['submissions', problem?._id, user._id],
        queryFn: getSubmissions
    })

    return (
        <div className='text-white flex flex-col gap-y-2'>Submissions
            {data?.map((sub, i) => <Link href={`./submissions/${sub._id}`} key={i}>{sub.status}</Link>)}
        </div>
    )
}
