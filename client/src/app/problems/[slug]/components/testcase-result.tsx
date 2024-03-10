import CodeError from '@/app/components/code-error';
import { executionResultAtom, selectedTestcaseAtom, testcaseTabAtom } from '@/atoms/testcaseAtoms';
import TestcaseResultSkeleton from '@/skeletons/testcase-result-skeleton';
import { useAtomValue, useSetAtom } from 'jotai';
import React, { ReactNode, useState } from 'react'
import Cases from './cases';
import { problemAtom } from '@/atoms/problemAtoms';
import { isExecutingAtom } from './header';

function ValueHolder({ children }: { children: ReactNode }) {
    return <div className='py-2.5 px-4 rounded-md bg-dark-layer-3'>
        {children}
    </div>
}

export default function TestcaseResult() {
    const [selectedResult, setSelectedResult] = useState(0);

    const setSelectedTab = useSetAtom(testcaseTabAtom);
    const setSelectedTestcase = useSetAtom(selectedTestcaseAtom);

    const isExecuting = useAtomValue(isExecutingAtom);
    const problem = useAtomValue(problemAtom);
    const executionResult = useAtomValue(executionResultAtom);

    if (isExecuting) {
        return <div className='py-4 px-6 overflow-auto'>
            <TestcaseResultSkeleton />
        </div>
    }

    return (
        <div className='py-4 px-6 flex flex-col gap-y-4 overflow-y-auto'>
            {
                executionResult === null &&
                <div className='font-medium text-sm text-dark-gray-6 flex items-center justify-center'>You must run your code first</div>
            }
            {
                !(executionResult instanceof Array) &&
                executionResult?.code === 417 &&
                <>
                    <div className='text-xl text-dark-red font-semibold'>{executionResult.status}</div>
                    <CodeError errorMsg={executionResult.message} />
                </>
            }
            {
                !(executionResult instanceof Array) &&
                executionResult?.code === 409 &&
                <>
                    <div className='text-xl text-dark-red font-semibold'>Invalid Testcase</div>
                    <div className='flex flex-col gap-y-2'>
                        <div className='flex items-center justify-between'>
                            <div className='text-xs font-medium text-dark-label-1'>Case {executionResult.testcaseNo + 1}</div>
                            <div className='cursor-pointer text-xs font-medium text-dark-label-1' onClick={() => {
                                setSelectedTab(0);
                                setSelectedTestcase(executionResult.testcaseNo)
                            }}>Edit</div>
                        </div>
                        <CodeError errorMsg={executionResult.message} />
                    </div>
                </>
            }
            {
                ((executionResult instanceof Array)
                    && <>
                        <div className='flex flex-wrap gap-x-6 items-center'>
                            <div className={`text-xl ${executionResult[selectedResult].status.description === 'Accepted' ? 'text-dark-green-s' : 'text-dark-red'}  font-medium`}>
                                {
                                    executionResult[selectedResult].status.description
                                }
                            </div>
                            <div className='text-sm text-dark-label-2'>Runtime: {parseFloat(executionResult[selectedResult].time) * 1000} ms</div>
                        </div>
                        <div className='flex flex-wrap gap-x-4'>
                            <Cases
                                length={executionResult.length}
                                selectedCase={selectedResult}
                                prefix={function (index: number) {
                                    return <div
                                        className={`w-1.5 h-1.5 rounded-full ${executionResult[index].status.description === 'Accepted' ? 'bg-dark-green-s' : 'bg-dark-red'}`}
                                    >
                                    </div>
                                }}
                                onClick={function (index: number) {
                                    setSelectedResult(index)
                                }}
                            />
                        </div>
                        <div className='flex flex-col gap-y-2'>
                            <div className='font-medium text-xs text-dark-label-2'>Input</div>
                            {
                                executionResult[selectedResult].testcase.input.split("\n").map((value, index) => {
                                    return <ValueHolder key={index}>
                                        <div className='flex flex-col gap-y-1'>
                                            <div className='text-xs text-dark-label-1'>
                                                {problem?.config.params[index].name} =
                                            </div>
                                            <div className='font-medium text-md text-white'>
                                                {value}
                                            </div>
                                        </div>
                                    </ValueHolder>
                                })
                            }
                        </div>
                        <div className='flex flex-col gap-y-2'>
                            <div className='font-medium text-xs text-dark-label-2'>Output</div>
                            <ValueHolder>
                                {executionResult[selectedResult].stdout}
                            </ValueHolder>
                        </div>
                        <div className='flex flex-col gap-y-2'>
                            <div className='font-medium text-xs text-dark-label-2'>Expected</div>
                            <ValueHolder>
                                {executionResult[selectedResult].testcase.output}
                            </ValueHolder>
                        </div>
                    </>
                )
            }
        </div>
    )
}
