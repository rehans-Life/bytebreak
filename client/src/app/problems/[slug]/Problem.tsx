'use client';

import { useMutation, useQuery, useSuspenseQueries } from '@tanstack/react-query'
import React, { ReactNode, useState } from 'react'
import CodeEditor from './components/codeEditor';
import { getDefaultConfigurations, getLike, getProblem, likeDoc, unlikeDoc } from '../../../utils/api';
import { Problem } from '@/app/create-problem/interfaces';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { hasLikedAtom, problemAtom } from '@/atoms/problemAtoms';
import Header from './components/header';
import { languagesAtom, selectLanguageAtom } from '@/atoms/languagesAtoms';
import { Like, TagWithConfig } from '../../interfaces';
import { Section, SectionBody, SectionHeader, SectionFooter, SectionTab } from '@/app/components/section';
import { IoDocumentTextOutline } from "@react-icons/all-files/io5/IoDocumentTextOutline";
import { HiOutlineBookOpen } from "@react-icons/all-files/hi/HiOutlineBookOpen";
import { IoDocumentsOutline } from "@react-icons/all-files/io5/IoDocumentsOutline";
import { atomWithLocation } from 'jotai-location'
import LeftFooter from './components/left-footer';

const locationAtom = atomWithLocation()

export default function Problem({
    slug,
    children
}: {
    children: ReactNode,
    slug: string
}) {

    const location = useAtomValue(locationAtom)
    const [currTab, setCurrTab] = useState(location.pathname?.split("/")[location.pathname?.split("/").length - 1])

    const setProblem = useSetAtom(problemAtom);
    const setLanguagesConfigs = useSetAtom(languagesAtom)
    const setLang = useSetAtom(selectLanguageAtom)

    const [{ data: { _id } }] = useSuspenseQueries({
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
                meta: {
                    onSuccess: (data: TagWithConfig[]) => {
                        const firstLang = data[0];
                        setLanguagesConfigs(data)
                        setLang(firstLang)
                    }
                },
                queryKey: ['defaultConfiguration', slug],
                queryFn: getDefaultConfigurations
            }
        ]
    })

    return (
        <div className='p-3 flex flex-col gap-y-3'>
            <Header />
            <div>
                <Section>
                    <SectionHeader>
                        <div onClick={() => setCurrTab("description")}>
                            <SectionTab href={`/problems/${slug}/description`} active={currTab === 'description'}>
                                <div className='text-dark-blue-s text-lg'>
                                    <IoDocumentTextOutline />
                                </div>
                                Description
                            </SectionTab>
                        </div>
                        <div onClick={() => setCurrTab("editorial")}>
                            <SectionTab href={`/problems/${slug}/editorial`} active={currTab === 'editorial'}>
                                <div className='text-dark-yellow text-lg'>
                                    <HiOutlineBookOpen />
                                </div>
                                Editorial
                            </SectionTab>
                        </div>
                        <div onClick={() => setCurrTab("submissions")}>
                            <SectionTab href={`/problems/${slug}/submissions`} active={currTab === 'submissions'}>
                                <div className="text-dark-green-s text-lg">
                                    <IoDocumentsOutline />
                                </div>
                                Submissions
                            </SectionTab>
                        </div>
                    </SectionHeader>
                    <SectionBody>
                        {children}
                    </SectionBody>
                    <SectionFooter>
                        <LeftFooter problemId={_id}></LeftFooter>
                    </SectionFooter>
                </Section>
                <CodeEditor />
            </div>
        </div>
    )
}
