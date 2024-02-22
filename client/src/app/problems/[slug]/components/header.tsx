'use client'

import React from 'react'
import Tooltip from "@/app/components/tooltip";
import { FiSettings } from '@react-icons/all-files/fi/FiSettings';
import { IoCloudUpload } from '@react-icons/all-files/io5/IoCloudUpload';
import { FaPlay } from '@react-icons/all-files/fa/FaPlay';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import { problemAtom } from '@/atoms/problemAtoms';
import { codeAtom, languageAtom, languagesAtom } from '@/atoms/languagesAtoms';
import { useMutation } from '@tanstack/react-query';
import { runCode, submitCode } from '@/utils/api';

export default function Header() {
    const user = useAtomValue(userAtom);
    const problem = useAtomValue(problemAtom)
    const codes = useAtomValue(codeAtom)
    const language = useAtomValue(languageAtom)
    const languages = useAtomValue(languagesAtom);

    const run = useMutation({
        mutationFn: runCode,
        throwOnError: false
    })

    const submit = useMutation({
        mutationFn: submitCode,
        throwOnError: false
    })

    const onRun = async () => {
        const languageId = languages.find(({ slug }) => slug === language?.value)?._id!;
        run.mutate({
            code: codes[language?.value || ""] || "",
            languageId,
            problemId: problem!._id,
            testcases: problem!.sampleTestCases.map(({ input, output }) => ({ input, output })),

        })
    }

    const onSubmit = async () => {
        const languageId = languages.find(({ slug }) => slug === language?.value)?._id!;
        submit.mutate({
            code: codes[language?.value || ""] || "",
            languageId,
            problemId: problem!._id
        })
    }

    return (
        <div className='flex items-center flex-col xs:flex-row justify-between px-2 gap-y-3'>
            <img src="/logo.png" className='h-5 w-5 object-contain' alt="logo" />
            <div className='flex items-center gap-x-[2px]'>
                <Tooltip message={'Run'} onClick={() => { onRun() }}>
                    <div className={`flex items-center gap-x-3 hover:bg-dark-divider-border-2 bg-gray-8 px-2.5 py-1.5 font-medium rounded-bl-md rounded-tl-md ease-out duration-100 transition-all`}>
                        <div className='text-dark-gray-8'>
                            <FaPlay />
                        </div>
                        Run
                    </div>
                </Tooltip>
                <Tooltip message={'Submit'} onClick={() => { onSubmit() }}>
                    <div className={`flex items-center gap-x-2 rounded-br-md rounded-tr-md px-3 py-1.5 font-medium text-dark-green-hover bg-gray-8 hover:bg-dark-divider-border-2 ease-out duration-100 transition-all`}>
                        <IoCloudUpload />
                        Submit
                    </div>
                </Tooltip>
            </div>
            <div className='flex items-center gap-x-3'>
                <Tooltip message={'Settings'} onClick={function (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
                }}>
                    <div >
                        <FiSettings />
                    </div>
                </Tooltip>
                <div>
                    <img className='h-5 w-5 rounded-full cursor-pointer' src={user.photo || "/default.png"} alt="Profile Photo" />
                </div>
            </div>
        </div>
    )
}
