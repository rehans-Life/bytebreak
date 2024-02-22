'use client';

import { getSubmission } from '@/utils/api'
import { useQuery } from '@tanstack/react-query'
import { BiArrowBack } from '@react-icons/all-files/bi/BiArrowBack'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import VertDivider from '../../../../components/vert-divider'
import { useAtomValue } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import CodeError from '@/app/components/code-error';
import CodePreview from '@/app/components/code-preview';
import Testcase from '@/app/components/testcase';
import CodeMetrics from '@/app/components/code-metrics';

export default function Page({
    params: { id }
}: {
    params: { id: string }
}) {
    const router = useRouter();

    const user = useAtomValue(userAtom);

    const { data } = useQuery({
        queryKey: ['submissions', id],
        queryFn: getSubmission
    })

    const [options] = useState({
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: "numeric",
        minute: "numeric"
    } as const)

    return (<div>
        <div
            onClick={() => {
                router.back()
            }}
            className='flex items-center text-sm cursor-pointer hover:text-white gap-x-2 py-1.5 px-2 text-dark-label-2 border-b border-dark-border'>
            <BiArrowBack className="text-medium" />
            All Submissions
        </div>
        <div className='p-4 flex flex-col gap-y-5'>
            <div className='flex flex-col gap-y-1'>
                <div className='flex items-center gap-x-2'>
                    <div className={`text-xl ${data?.status === 'Accepted' ? "text-dark-green-s" : 'text-dark-pink'} font-medium`}>{data?.status}</div>
                    {
                        data?.status !== 'Accepted' &&
                        <>
                            <VertDivider />
                            <div className='text-xs text-dark-gray-6'>{data?.testCasesPassed} / 0 testcases passed</div>
                        </>
                    }
                </div>
                <div className='flex gap-x-1 items-center'>
                    <img src={`${user.photo}`} alt="user" className='w-4 h-4 rounded-full' />
                    <div className='font-medium text-white text-xs'>{user.username}</div>
                    <div className='text-dark-label-2 text-xs'>
                        submitted at {new Intl.DateTimeFormat("en", options).format(new Date(data?.createdAt || "12-12-12"))}
                    </div>
                </div>
            </div>
            {data?.status === 'Accepted' && <CodeMetrics runtime={data?.runtime || ""} memory={data?.memory || ""} />}
            {data?.status === 'Wrong Answer' && <Testcase testcaseInput={data.lastExecutedTestcase?.input || ""} />}
            {data?.error && <CodeError errorMsg={data?.error || ""} />}
            <CodePreview language={data?.language} code={data?.code || ""} />
        </div>
    </div>
    )
}
