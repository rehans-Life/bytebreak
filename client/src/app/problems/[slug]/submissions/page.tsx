'use client'

import { problemAtom } from '@/atoms/problemAtoms'
import { userAtom } from '../../../../atoms/userAtom'
import { atom, useAtom, useAtomValue } from 'jotai'
import React, { useEffect, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { getStatuses, getSubmissions } from '@/utils/api'
import Table, { Header, HeaderOption } from '../../../components/table'
import { languagesAtom } from '@/atoms/languagesAtoms'
import { Tag } from '@/app/interfaces';
import { AiOutlineClockCircle } from "@react-icons/all-files/ai/AiOutlineClockCircle";
import { FiCpu } from "@react-icons/all-files/fi/FiCpu";
import { useRouter } from 'next/navigation'

const headersAtom = atom([
    {
        label: "Status",
        name: "status",
        width: 240,
        options: []
    } as Header<string>,
    {
        label: "Language",
        name: "language",
        width: 80,
        options: [],
        compareFunc(selectedValue, fieldValue) {
            return fieldValue._id === selectedValue;
        },
    } as Header<number, Tag>,
    {
        label: "Runtime",
        name: "runtime",
        width: 120,
    } as Header,
    {
        label: "Memory",
        name: "memory",
        width: 120,
    } as Header
])

export default function Page() {
    const router = useRouter();

    const user = useAtomValue(userAtom)
    const problem = useAtomValue(problemAtom);
    const languageConfigs = useAtomValue(languagesAtom)

    const [headers, setHeaders] = useAtom(headersAtom);

    useEffect(() => {
        if (!languageConfigs.length) return;

        setHeaders((headers) => headers.map((header) => {
            if (header.name === "language") {
                return {
                    ...header,
                    options: languageConfigs.map(({ _id, name }) => ({ value: _id, label: name }))
                }
            }
            return header;
        }));

    }, [languageConfigs])


    const [submissions, statuses] = useQueries({
        queries: [
            {
                queryKey: ['submissions', problem?._id, user._id],
                queryFn: getSubmissions
            },
            {
                meta: {
                    onSuccess: (data: string[]) => {
                        setHeaders((headers) => headers.map((header) => {
                            if (header.name === "status") {
                                return {
                                    ...header,
                                    options: data.map<HeaderOption>((data) => ({
                                        value: data,
                                        label: data
                                    }))
                                }
                            }
                            return header;
                        }))
                    }
                },
                queryKey: ['statueses'],
                queryFn: getStatuses
            },
        ]
    })

    const [options] = useState({
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    } as const)

    return (
        <div className='text-white flex flex-col gap-y-2'>
            <Table className='min-h-96' headers={headers} rows={submissions.data || []} render={(row, index) => {
                const date = new Intl.DateTimeFormat("en", options).format(new Date(row.createdAt));

                return <tr onClick={() => {
                    router.push(`./submissions/${row._id}`);
                }} key={index} className='cursor-pointer'>
                    <td className="">
                        <div className='flex flex-col items-start'>
                            <span className={`text-sm font-medium ${row.status === 'Accepted' ? "text-dark-green-s" : "text-dark-red"}`}>
                                {row.status}
                            </span>
                            <span className="text-xs text-dark-label-2">
                                {date}
                            </span>
                        </div>
                    </td>
                    <td >
                        <div className='rounded-full w-min bg-dark-fill-2 text-dark-label-2 px-2 py-0.5 text-xs'>
                            {row.language.name}
                        </div>
                    </td>
                    <td>
                        <div className="text-dark-label-2 text-sm flex items-center gap-x-1">
                            <AiOutlineClockCircle />
                            {row.runtime}
                        </div>
                    </td>
                    <td>
                        <div className="text-dark-label-2 text-sm flex items-center gap-x-1">
                            <FiCpu />
                            {row.memory}
                        </div>
                    </td>
                    <td className='w-full'></td>
                </tr >
            }} />
        </div>
    )
}
