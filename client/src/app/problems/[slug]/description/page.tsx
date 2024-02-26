'use client';

import { problemAtom } from '@/atoms/problemAtoms';
import { useAtomValue } from 'jotai';
import React from 'react'
import { Badge } from "@/components/ui/badge";
import dynamic from 'next/dynamic';
import FormatNumber from '@/app/components/formatNumber';
import { useQuery } from '@tanstack/react-query';
import { getSubmissionStatus } from '@/utils/api';
import { FiCheckCircle } from "@react-icons/all-files/fi/FiCheckCircle";
import { FaRadiationAlt } from "@react-icons/all-files/fa/FaRadiationAlt"
import capitalize from 'capitalize';
import ContentSkeleton from '@/skeletons/content-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import Discussions from '@/app/components/discussions';


const MarkdownPreview = dynamic(
    () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
    {
        ssr: false, loading() {
            return <ContentSkeleton />
        },
    }
);

export default function Page() {
    const problem = useAtomValue(problemAtom);

    const problemStatus = useQuery({
        queryKey: ['problems', problem?._id, 'status'],
        enabled: problem !== null,
        queryFn: getSubmissionStatus,
    })

    return (
        <div className='text-white p-5 flex flex-col gap-y-3.5 min-w-96 w-full sm:h-full h-80'>
            <div className='flex items-center justify-between gap-x-3'>
                <div className='text-2xl font-semibold'>{capitalize.words(problem?.name || "",)}</div>
                {
                    problemStatus.isLoading
                        ?
                        <div className='flex items-center gap-x-1'>
                            <Skeleton className='w-11 h-4 rounded-md bg-dark-fill-3' />
                            <Skeleton className='rounded-full bg-dark-fill-3 w-4 h-4' />
                        </div>
                        : problemStatus.data !== 'todo' && <div className='text-dark-label-2 tracking-wide text-sm flex items-center gap-x-1 capitalize'>
                            <div>{problemStatus.data}</div>
                            <div className={`flex items-center text-sm`}>
                                {problemStatus.data === 'attempted'
                                    ?
                                    <div className="text-dark-yellow">
                                        <FaRadiationAlt />
                                    </div>
                                    :
                                    <div className="text-dark-green-s">
                                        <FiCheckCircle />
                                    </div>
                                }
                            </div>
                        </div>
                }
            </div>
            <div className='flex items-center  flex-wrap gap-2'>
                <Badge variant="secondary" className='bg-dark-divider-border-2 hover:bg-dark-divider-border-2'>
                    <div className={`font-normal capitalize ${problem?.difficulty === 'hard' ? "text-dark-pink" : problem?.difficulty === 'medium' ? "text-dark-yellow" : "text-dark-green-s"}`}>
                        {problem?.difficulty}
                    </div>
                </Badge>
                {problem?.tags.map(({ name, _id }) => {
                    return <Badge key={_id} variant="secondary" className='bg-dark-divider-border-2 hover:bg-dark-divider-border-2'>
                        <div className="text-white">{name}</div>
                    </Badge>
                })}
            </div>
            <div>

                <MarkdownPreview className='!text-sm' source={problem?.description}></MarkdownPreview></div>
            <div className='flex divide-x divide-dark-border items-center border-b py-3 flex-wrap border-dark-border gap-y-2'>
                <div className='flex items-center gap-x-3 pr-4'>
                    <span className="text-xs text-dark-label-2">Accepted</span>
                    <span className='font-semibold text-normal'><FormatNumber num={problem?.accepted || 0}></FormatNumber></span>
                </div>
                <div className='flex items-center gap-x-3 px-4'>
                    <span className="text-xs text-dark-label-2">Submissions</span>
                    <span className='font-semibold text-normal'><FormatNumber num={problem?.submissions || 0}></FormatNumber></span>
                </div>
                <div className='flex items-center gap-x-3 px-4'>
                    <span className="text-xs text-dark-label-2">Acceptance Rate</span>
                    <span className='font-semibold text-normal'>{problem?.acceptanceRate}%</span>
                </div>
            </div>
        </div>
    )
}
