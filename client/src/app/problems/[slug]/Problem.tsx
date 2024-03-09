'use client';

import { useSuspenseQueries } from '@tanstack/react-query'
import React, { ReactNode } from 'react'
import CodeEditor from './components/code-editor';
import { getDefaultConfigurations, getProblem } from '@/utils/api';
import { Problem } from '@/app/create-problem/interfaces';
import { useSetAtom } from 'jotai';
import { problemAtom } from '@/atoms/problemAtoms';
import Header from './components/header';
import { languagesAtom, selectLanguageAtom } from '@/atoms/languagesAtoms';
import { TagWithConfig } from '../../interfaces';
import { FormProvider, useForm } from 'react-hook-form';
import { TestCasesType } from './interfaces';
import TestcasesSection from './components/testcases-section';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import ProblemInfo from './components/problem-info';
import { codesAtom } from '@/app/create-problem/components/editor';

const handleStyle = "before:content-[''] before:absolute before:left-0 before:right-0 before:ml-auto before:mr-auto before:bg-dark-gray-6 before:rounded-md";

export default function Problem({
    slug,
    children
}: {
    children: ReactNode,
    slug: string
}) {

    const setProblem = useSetAtom(problemAtom);
    const setCodes = useSetAtom(codesAtom);
    const setLanguagesConfigs = useSetAtom(languagesAtom)
    const setLang = useSetAtom(selectLanguageAtom)

    const [{ data: { _id, sampleTestCases } }] = useSuspenseQueries({
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
                        setLang(firstLang, true)
                    }
                },
                queryKey: ['defaultConfiguration', slug],
                queryFn: getDefaultConfigurations
            }
        ]
    })

    const methods = useForm<TestCasesType>({
        defaultValues: {
            testcases: sampleTestCases.map((testcase) => {
                const input = testcase.input
                    .split("\n")
                    .reduce<{ [key: number]: string }>(
                        (acc, value, index) => {
                            acc[index] = value;
                            return acc;
                        }, {});
                return {
                    input, output: testcase.output
                }
            })
        }
    })

    return (
        <FormProvider {...methods}>
            <div className='flex sm:hidden h-auto flex-col gap-y-2 px-3 py-2'>
                <Header />
                <div className='flex flex-col gap-y-4 sm:hidden'>
                    <ProblemInfo _id={_id} slug={slug}>
                        {children}
                    </ProblemInfo>
                    <CodeEditor />
                    <TestcasesSection />
                </div>
            </div>
            <div className='sm:flex hidden h-screen flex-col gap-y-2 px-3 py-2'>
                <Header />
                <ResizablePanelGroup direction='horizontal' className=''>
                    <ResizablePanel defaultSize={40}>
                        <ProblemInfo _id={_id} slug={slug}>
                            {children}
                        </ProblemInfo>
                    </ResizablePanel>
                    <ResizableHandle className={`w-1.5 relative bg-dark-layer-2 ${handleStyle} before:w-[50%] before:h-6`} />
                    <ResizablePanel defaultSize={60}>
                        <ResizablePanelGroup direction="vertical">
                            <ResizablePanel defaultSize={60} minSize={7.5} collapsedSize={7.5} collapsible={true}>
                                <CodeEditor />
                            </ResizablePanel>
                            <ResizableHandle className={`${handleStyle} pt-1.5 bg-dark-layer-2 before:w-6 before:h-[50%] before:top-0 before:bottom-0 before:mt-auto before:mb-auto`} />
                            <ResizablePanel defaultSize={40} minSize={7.5} collapsedSize={7.5} collapsible={true}>
                                <TestcasesSection />
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </FormProvider>
    )
}
