import React, { ReactNode, useEffect, useState } from 'react'
import { Section, SectionBody, SectionHeader, SectionFooter, SectionTab } from '@/app/components/section';
import { IoDocumentTextOutline } from "@react-icons/all-files/io5/IoDocumentTextOutline";
import { HiOutlineBookOpen } from "@react-icons/all-files/hi/HiOutlineBookOpen";
import { IoDocumentsOutline } from "@react-icons/all-files/io5/IoDocumentsOutline";
import LeftFooter from './left-footer';
import { useAtomValue } from 'jotai';
import { atomWithLocation } from 'jotai-location';
import { useRouter } from 'next/navigation';

const locationAtom = atomWithLocation()

export default function ProblemInfo({
    children,
    slug,
    _id
}: {
    children: ReactNode,
    slug: string,
    _id: string
}) {
    const router = useRouter();

    const location = useAtomValue(locationAtom)
    const [currTab, setCurrTab] = useState(location.pathname?.split("/")[location.pathname?.split("/").length - 1])

    useEffect(() => {
        setCurrTab(location.pathname?.split("/")[location.pathname?.split("/").length - 1])
    }, [location]);

    return (
        <Section>
            <SectionHeader>
                <div onClick={() => setCurrTab("description")}>
                    <SectionTab onClick={() => router.push(`/problems/${slug}/description`)} active={currTab === 'description'}>
                        <div className='text-dark-blue-s text-lg'>
                            <IoDocumentTextOutline />
                        </div>
                        Description
                    </SectionTab>
                </div>
                <div onClick={() => setCurrTab("editorial")}>
                    <SectionTab onClick={() => router.push(`/problems/${slug}/editorial`)} active={currTab === 'editorial'}>
                        <div className='text-dark-yellow text-lg'>
                            <HiOutlineBookOpen />
                        </div>
                        Editorial
                    </SectionTab>
                </div>
                <div onClick={() => setCurrTab("submissions")}>
                    <SectionTab onClick={() => router.push(`/problems/${slug}/submissions`)} active={currTab === 'submissions'}>
                        <div className="text-dark-green-s text-lg">
                            <IoDocumentsOutline />
                        </div>
                        Submissions
                    </SectionTab>
                </div>
            </SectionHeader>
            <SectionBody className='overflow-auto'>
                    {children}
            </SectionBody>
            <SectionFooter>
                <LeftFooter problemId={_id}></LeftFooter>
            </SectionFooter>
        </Section>
    )
}
