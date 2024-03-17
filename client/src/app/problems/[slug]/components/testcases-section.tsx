import { Section, SectionBody, SectionHeader, SectionTab } from '@/app/components/section'
import { useAtom, useAtomValue } from 'jotai'
import React, { useEffect } from 'react'
import { RiCheckboxLine } from '@react-icons/all-files/ri/RiCheckboxLine'
import { IoAdd } from '@react-icons/all-files/io5/IoAdd'
import { FiTerminal } from '@react-icons/all-files/fi/FiTerminal'
import { selectedTestcaseAtom, testcaseTabAtom } from '@/atoms/testcaseAtoms'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { TestCasesType } from '../interfaces'
import TooltipContainer from '@/app/components/tooltip'
import Cases from './cases'
import Testcase from './testcase'
import usePrevious from '@/hooks/usePrevious'
import TestcaseResult from './testcase-result'
import { isExecutingAtom } from './header'
import { CgSpinner } from '@react-icons/all-files/cg/CgSpinner'

export default function TestcasesSection() {
    const [selectedTestcase, setSelectedTestcase] = useAtom(selectedTestcaseAtom);
    const [selectedTab, setSelectedTab] = useAtom(testcaseTabAtom);

    const { control, getValues } = useFormContext<TestCasesType>();
    const testcasesField = useFieldArray<TestCasesType>({
        name: "testcases",
        control,
    })

    const prevTestcasesLength = usePrevious(testcasesField.fields.length);

    useEffect(() => {
        const newTestcasesLength = testcasesField.fields.length;

        if (prevTestcasesLength && newTestcasesLength > prevTestcasesLength) {
            setSelectedTestcase(prevTestcasesLength)
        }

    }, [testcasesField.fields.length]);

    const isExecuting = useAtomValue(isExecutingAtom);

    return (
        <Section>
            <SectionHeader>
                <SectionTab active={selectedTab === 0} onClick={() => setSelectedTab(0)}>
                    <RiCheckboxLine className='text-dark-green-hover text-lg' />
                    Testcase
                </SectionTab>
                <SectionTab active={selectedTab === 1} onClick={() => setSelectedTab(1)}>
                    {isExecuting ? <CgSpinner className='animate-spin text-white text-lg' /> : <FiTerminal className='text-dark-green-hover text-lg' />}
                    Test Result
                </SectionTab>
            </SectionHeader>
            <SectionBody className='overflow-auto'>
                <div className='min-w-96 h-72'>
                    {selectedTab === 0 && <div className='py-4 px-6 flex flex-col gap-y-4 overflow-y-auto'>
                        <div className='flex items-center gap-x-3 gap-y-2 flex-wrap'>
                            <Cases
                                length={testcasesField.fields.length}
                                selectedCase={selectedTestcase}
                                onClick={(i) => setSelectedTestcase(i)}
                                onClose={(i) => {

                                    if (i <= selectedTestcase && selectedTestcase) {
                                        setSelectedTestcase(selectedTestcase - 1);
                                    }

                                    testcasesField.remove(i)
                                }}
                            />
                            <TooltipContainer message={'Clone current testcase'} onClick={() => {
                                if (testcasesField.fields.length == 8) return;

                                const currSelectedTestcase = getValues(`testcases.${selectedTestcase}`);
                                testcasesField.append(currSelectedTestcase);
                            }}>
                                <IoAdd className="text-dark-gray-6 text-xl hover:text-dark-gray-7" />
                            </TooltipContainer>
                        </div>
                        <Testcase />
                    </div>}
                    {selectedTab === 1 && <TestcaseResult />}
                </div>
            </SectionBody>
        </Section>
    )
}
