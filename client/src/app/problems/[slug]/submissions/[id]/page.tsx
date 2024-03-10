'use client';

import { getSubmission } from '@/utils/api'
import { useQuery } from '@tanstack/react-query'
import { BiArrowBack } from '@react-icons/all-files/bi/BiArrowBack'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import VertDivider from '../../../../components/vert-divider'
import CodeError from '@/app/components/code-error';
import CodePreview from '@/app/components/code-preview';
import Testcase from '@/app/components/testcase';
import CodeMetrics from '@/app/components/code-metrics';
import { Skeleton } from '@/components/ui/skeleton';
import defaultPhoto from '@/utils/defaultPhoto';
import Image from 'next/image';
import formatDate from '@/utils/formatDate';

export default function Page({
    params: { id }
}: {
    params: { id: string }
}) {
    const router = useRouter();

    const { data, isLoading, isError } = useQuery({
        meta: {
            onError: () => {
                router.back()
            }
        },
        queryKey: ['submissions', id],
        queryFn: getSubmission,
        throwOnError: false
    })

    const [options] = useState({
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: "numeric",
        minute: "numeric"
    } as const)

    if (isLoading || isError) {
        return <div className='px-4 py-10 min-w-96 sm:h-full h-80 overflow-y-auto'>
            <Skeleton
                className="h-6 w-44 bg-dark-fill-2 rounded-md"
            />
            <div className='p-1'></div>
            <Skeleton
                className="h-2 w-72 bg-dark-fill-2 rounded-md"
            />
            <div className='p-3'></div>
            <Skeleton
                className="h-28 w-full bg-dark-fill-2 rounded-md"
            />
            <div className='p-2'></div>
            <Skeleton
                className="h-72 w-full bg-dark-fill-2 rounded-md"
            />
            <div className='p-2'></div>
            <Skeleton
                className="h-32 w-full bg-dark-fill-2 rounded-md"
            />
        </div>
    }

    return (<div className='overflow-y-auto min-w-96 sm:h-full h-80'>
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
                            <div className='text-xs text-dark-gray-6'>{data?.testCasesPassed} / {data?.problem?.totalTestcases || 0} testcases passed</div>
                        </>
                    }
                </div>
                <div className='flex gap-x-1 items-center'>
                    <Image width={500} height={500} src={`${data?.user.photo || defaultPhoto}`} alt="user" className='w-4 h-4 rounded-full' />
                    <div className='font-medium text-white text-xs'>{data?.user.username}</div>
                    <div className='text-dark-label-2 text-xs'>
                        submitted at {data?.createdAt ? formatDate(data.createdAt || "2014-12-12", options) : ""}
                    </div>
                </div>
            </div>
            {data?.status === 'Accepted' && <CodeMetrics runtime={data?.runtime || ""} memory={data?.memory || ""} />}
            {data?.status === 'Wrong Answer' && <Testcase testcaseInput={data.lastExecutedTestcase?.input || ""} />}
            {(data?.error) && <CodeError errorMsg={data?.error || ""} />}
            <CodePreview language={data?.language} code={data?.code || ""} />
        </div>
    </div>
    )
}
