import { getProblemsCount, getSubmissionsCount } from '@/utils/api'
import { useQueries } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import React from 'react'
import RadialChart from './radial-chart';
import FillerBar from './filler-bar';

export default function SolvedProblems() {
    const params = useParams();
    const [problemsCount, submissionsCount] = useQueries({
        queries: [
            {
                queryKey: ['problemsCount'],
                queryFn: getProblemsCount
            },
            {
                queryKey: ['submissionsCount', params.username],
                queryFn: getSubmissionsCount
            }
        ]
    })

    return (
        <div className='p-5 rounded-lg bg-dark-layer-1 flex flex-col gap-y-2'>
            <div className='text-dark-label-2 font-medium text-xs'>Solved Problems</div>
            <div className='flex xs:flex-row flex-col items-center gap-x-6'>
                <RadialChart total={problemsCount.data?.total || 0} solved={submissionsCount.data?.total || 0} />
                <div className="w-full flex flex-col gap-y-2">
                    <FillerBar tag='Easy' backgroundColor='bg-dark-green-light' fillColor='bg-olive' value={submissionsCount.data?.easy || 0} total={problemsCount.data?.easy || 0} />
                    <FillerBar tag='Medium' backgroundColor='bg-brand-orange-light' fillColor='bg-brand-orange' value={submissionsCount.data?.medium || 0} total={problemsCount.data?.medium || 0} />
                    <FillerBar tag='Hard' backgroundColor='bg-dark-red-light' fillColor='bg-dark-red' value={submissionsCount.data?.hard || 0} total={problemsCount.data?.hard || 0} />
                </div>
            </div>
        </div>
    )
}
