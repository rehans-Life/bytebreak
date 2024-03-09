import NoData from '@/app/components/no-data';
import Paginator from '@/app/components/paginator';
import { userAtom } from '@/atoms/userAtom';
import usePaginate from '@/hooks/usePaginate';
import { getContributions } from '@/utils/api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { atom, useAtom, useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import React from 'react'
import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en'
TimeAgo.addDefaultLocale(en)

import ReactTimeAgo from 'react-time-ago'
import ConstributionSkeleton from '@/skeletons/constribution-skeleton';

export const selectedTabAtom = atom<number>(0);
const tabs = ["submissions", "problems"];

function ContributionRow({
    name, path, date, isFetching
}: { name: string, path?: string, date: string, isFetching: boolean }) {
    const router = useRouter();

    return <div
        onClick={() => {
            if (path) router.push(path)
        }}
        className={`p-4 ${isFetching && "opacity-50"} even:bg-transparent odd:bg-dark-layer-3 cursor-pointer  rounded-md flex xs:items-center items-start justify-between gap-x-3 xs:flex-row flex-col gap-y-2`}>
        <div className='font-medium'>{name}</div>
        <div className='text-dark-label-2 text-sm'>
            <ReactTimeAgo date={new Date(date)} locale="en-US" />
        </div>
    </div>
}

function ContributionSkeleton() {
    return <div className="flex flex-col text-white">
        {
            Array(5).fill(0).map((_, i) => {
                return <ConstributionSkeleton key={i} />
            })
        }
    </div>
}

export default function Constributions() {
    const user = useAtomValue(userAtom);
    const [selectedTab, setSelectedTab] = useAtom(selectedTabAtom);
    const { nextPage, previousPage, setPage, searchParams } = usePaginate();

    const page = parseInt(searchParams.get("page") || "1");

    const { data, isLoading, isFetched } = useQuery({
        meta: {
            onSuccess: ({ maxPage }: { maxPage: number }) => {
                if (page > maxPage) {
                    setPage(maxPage);
                }
            }
        },
        queryKey: [tabs[selectedTab], page, user?._id || ""],
        enabled: typeof user !== 'undefined',
        queryFn: getContributions,
        placeholderData: keepPreviousData
    });

    return (
        <div className='p-5 rounded-lg bg-dark-layer-1 flex flex-col gap-y-5'>
            <div className='flex items-center gap-x-2 text-white'>
                {
                    tabs.map((tab, i) => {
                        return <div
                            key={i}
                            onClick={() => setSelectedTab(i)}
                            className={`flex-1 py-2 px-3 font-medium text-center cursor-pointer hover:bg-dark-layer-3 capitalize ${selectedTab === i && "bg-dark-layer-3"} rounded-md`}>
                            {tab}
                        </div>
                    })
                }
            </div>
            {isLoading
                ? <ContributionSkeleton />
                : <div className="flex flex-col text-white">
                    {
                        (selectedTab === 0 && (data?.submissions ? (
                            data.submissions.length
                                ? data.submissions.map((sub, i) =>
                                    <ContributionRow key={i} isFetching={!isFetched} name={sub.problem?.name || "Problem Deleted"} path={sub.problem ? `/problems/${sub.problem.slug}/submissions/${sub._id}` : undefined} date={sub.createdAt} />
                                )
                                : <NoData />) : <ContributionSkeleton />)
                        )
                    }
                    {
                        (selectedTab === 1 && ((data?.problems) ? (
                            data.problems.length
                                ? data.problems.map((prob, i) => <ContributionRow key={i} isFetching={!isFetched} name={prob.name} path={`/problems/${prob.slug}`} date={prob.createdAt} />)
                                : <NoData />) : <ContributionSkeleton />)
                        )
                    }

                </div>}
            <Paginator activePage={page} maxPage={data?.maxPage || page} setPage={setPage} nextPage={nextPage} previousPage={previousPage} />
        </div>
    )
}
