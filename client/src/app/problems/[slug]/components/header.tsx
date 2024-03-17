'use client'

import React, { useEffect, useTransition } from 'react'
import Tooltip from "@/app/components/tooltip";
import { FiSettings } from '@react-icons/all-files/fi/FiSettings';
import { IoCloudUpload } from '@react-icons/all-files/io5/IoCloudUpload';
import { FaPlay } from '@react-icons/all-files/fa/FaPlay';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import { fontSizeAtom, problemAtom, tabSpaceAtom } from '@/atoms/problemAtoms';
import { codeAtom, languageAtom, languagesAtom } from '@/atoms/languagesAtoms';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { runCode, submitCode } from '@/utils/api';
import { useFormContext } from 'react-hook-form';
import { TestCasesType } from '../interfaces';
import { CodeError, InvalidTestcase, executionResultAtom, testcaseTabAtom } from '@/atoms/testcaseAtoms';
import { useRouter } from 'next/navigation';
import { ApiErrorResponse, SubmissionDoc } from '@/app/interfaces';
import { AxiosError } from 'axios';
import { CgSpinner } from '@react-icons/all-files/cg/CgSpinner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Select, { Option } from '@/app/components/select';
import Image from 'next/image';
import Link from 'next/link';
import { showSignInToast } from '@/toasts/signInReminder';
import { errorToast } from '@/toasts/errorToast';

export const fontSizes: Option<number>[] = Array(10).fill(0).map((_, i) => {
    const size = 12 + i;
    return {
        label: `${size}px`,
        value: size
    }
})

export const tabSpaces: Option<number>[] = [
    {
        label: '4 spaces',
        value: 4
    },
    {
        label: '2 spaces',
        value: 2
    }
]

export const isExecutingAtom = atom<boolean>(false);

export default function Header() {
    const router = useRouter();
    const [isRouting, startTransition] = useTransition();

    const queryClient = useQueryClient()

    const user = useAtomValue(userAtom);
    const problem = useAtomValue(problemAtom)
    const codes = useAtomValue(codeAtom)
    const language = useAtomValue(languageAtom)
    const languages = useAtomValue(languagesAtom);

    const setTestcaseTab = useSetAtom(testcaseTabAtom);
    const setExecutionResult = useSetAtom(executionResultAtom);
    const setExecxutingState = useSetAtom(isExecutingAtom);

    const [fontSize, setFontSize] = useAtom(fontSizeAtom);
    const [tabSpace, setTabSpace] = useAtom(tabSpaceAtom);

    const { getValues } = useFormContext<TestCasesType>();

    const run = useMutation({
        onMutate() {
            return { skipErrorHandling: true }
        },
        mutationFn: runCode,
        throwOnError: false
    })

    const submit = useMutation({
        meta: {
            onSuccess: (submission: SubmissionDoc) => {
                queryClient.setQueryData(['submissions', submission._id], submission);
                startTransition(() => {
                    router.push(`/problems/${problem?.slug}/submissions/${submission._id}`);
                })
            }
        },
        mutationFn: submitCode,
        throwOnError: false
    })

    useEffect(() => {
        setExecxutingState(run.isPending);
    }, [run.isPending]);

    const onRun = async () => {
        if (run.isPending || submit.isPending) return;

        const languageId = languages.find(({ slug }) => slug === language?.value)?._id!;
        const testcases = getValues("testcases").map(({ input, output }) => {
            return {
                input: Object.values(input).reduce((acc, input, i) => !i ? input : `${acc}\n${input}`, ''),
                output,
            }
        })
        setTestcaseTab(1);
        setExecutionResult(null);
        try {
            const res = await run.mutateAsync({
                code: codes[language?.value || ""] || "",
                languageId,
                problemId: problem!._id,
                testcases: testcases,
            })
            setExecutionResult(res)
        } catch (err) {
            const error = err as AxiosError

            console.log(error)

            if (error.response && [409, 417].some((code) => error.response?.status === code)) {
                (error.response?.data as any).code = error.response.status;
                const data = error!.response!.data as (InvalidTestcase | CodeError)
                setExecutionResult(data);
            } else if (error.response && (404 === error.response.status)) {
                errorToast((error.response.data as ApiErrorResponse).message);
                setTestcaseTab(0);
            } else {
                errorToast(error.message)
                setTestcaseTab(0);
            }
        }
    }

    const onSubmit = async () => {
        if (run.isPending || submit.isPending) return;

        const languageId = languages.find(({ slug }) => slug === language?.value)?._id!;
        submit.mutate({
            code: codes[language?.value || ""] || "",
            languageId,
            problemId: problem!._id
        })
    }

    return (
        <div className='flex items-center flex-col xs:flex-row justify-between px-4 gap-y-3'>
            <Link href="/">
                <Image width={1080} height={1080} src="/logo.png" className='h-5 w-5 object-contain' alt="logo" />
            </Link>
            <div className='flex items-center relative overflow-hidden gap-x-[2px]'>

                <div className={`absolute ml-auto mr-auto left-0 right-0 h-full rounded-md ${submit.isPending || run.isPending || isRouting ? 'w-full' : 'w-0'} overflow-hidden bg-gray-8 flex items-center justify-center gap-x-1.5 text-dark-gray-6 text-sm transition-all ease-out duration-100`}>
                    <CgSpinner className='text-lg animate-spin dark-gray-6' />
                    Pending...
                </div>
                <Tooltip
                    message={'Run'}
                    onClick={() => {
                        if (run.isPending || submit.isPending) return;
                        onRun()
                    }}
                    side='left'
                >
                    <div className={`flex items-center gap-x-3 hover:bg-dark-divider-border-2 bg-gray-8 px-2.5 py-1.5 font-medium rounded-bl-md rounded-tl-md ease-out duration-100 transition-all`}>
                        <div className='text-dark-gray-8'>
                            <FaPlay />
                        </div>
                        Run
                    </div>
                </Tooltip>
                <Tooltip
                    message={'Submit'}
                    side='right'
                    onClick={() => {
                        if (!user) {
                            showSignInToast('Sign in to submit this problem')
                            return;
                        }
                        onSubmit()
                    }}
                >
                    <div className={`flex items-center gap-x-2 rounded-br-md rounded-tr-md px-3 py-1.5 font-medium text-dark-green-hover bg-gray-8 hover:bg-dark-divider-border-2 ease-out duration-100 transition-all`}>
                        <IoCloudUpload />
                        Submit
                    </div>
                </Tooltip>
            </div>
            <div className='flex items-center gap-x-4'>
                <Dialog>
                    <DialogTrigger asChild>
                        <Tooltip side='left' message={'Settings'} onClick={function (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
                        }}>
                            <div>
                                <FiSettings className="text-dark-label-2" />
                            </div>
                        </Tooltip>
                    </DialogTrigger>
                    <DialogContent className='bg-dark-layer-2 border-0 text-white'>
                        <DialogTitle>Editor Settings</DialogTitle>
                        <DialogDescription>
                            <div className='gap-y-5 flex flex-col py-3'>
                                <div className='flex items-center justify-between'>
                                    <div className='text-dark-label-2 text-sm font-medium'>Font Size</div>
                                    <Select options={fontSizes} enableSearch={false} isMulti={false} replaceName={true} undefined={false} value={fontSize} onChange={(option) => setFontSize(option)} menuHeight='h-[150px]' menuWidth='w-full' />
                                </div>
                                <div className='flex items-center justify-between'>
                                    <div className='text-dark-label-2 text-sm font-medium'>Tab Spaces</div>
                                    <Select options={tabSpaces} enableSearch={false} isMulti={false} replaceName={true} undefined={false} value={tabSpace} onChange={(option) => setTabSpace(option)} />
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogContent>
                </Dialog>
                <div>
                    {typeof user !== 'undefined'
                        ? <Link href={`/${user.username}`}>
                            <Image width={500} height={500} className='h-5 w-5 rounded-full cursor-pointer' src={user.photo || "/default.png"} alt="Profile Photo" />
                        </Link>
                        : <div className="text-dark-label-2 text-sm flex items-center gap-x-1">
                            <Link href={'/signup'} className='rounded-md py-2 px-3 text-dark-label-2 hover:text-white'>
                                Register
                            </Link>
                            or
                            <Link href={'/login'} className='rounded-md py-2 px-3 text-dark-label-2 hover:text-white'>
                                Login
                            </Link>

                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
