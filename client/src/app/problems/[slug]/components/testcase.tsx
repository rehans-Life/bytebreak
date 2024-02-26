import React from 'react'
import { useFormContext, useWatch } from 'react-hook-form';
import { TestCasesType } from '../interfaces';
import { useAtomValue } from 'jotai';
import { selectedTestcaseAtom } from '@/atoms/testcaseAtoms';
import { problemAtom } from '@/atoms/problemAtoms';
import Input from '../../../components/input'

export default function Testcase() {
    const problem = useAtomValue(problemAtom);
    const selectedTestcase = useAtomValue(selectedTestcaseAtom);

    const { control, register } = useFormContext<TestCasesType>();
    const testcasesField = useWatch({
        name: "testcases",
        control,
    })

    return (
        <div className='flex flex-col gap-y-4'>
            <div className='flex flex-col gap-y-3'>
                <div className='font-medium'>Inputs</div>
                <div className='flex flex-col gap-y-2'>
                    {Object.entries(testcasesField[selectedTestcase].input).map(([key]) => {
                        const field = register(`testcases.${selectedTestcase}.input.${key}` as any);
                        return <Input
                            label={`${problem?.config.params[key as unknown as number].name} =` || ""}
                            key={`testcases.${selectedTestcase}.input.${key}`}
                            {...field}
                            inputStyles='!bg-dark-layer-3 !rounded-md !border-1 !py-2 !px-3 !border-transparent hover:!border-dark-blue-s'
                            labelStyles='!text-dark-label-2 !text-xs'
                            inputRef={field.ref}
                        />
                    })}
                </div>
            </div>
            <Input key={`testcases.${selectedTestcase}.output`} label={'Output'} inputRef={register(`testcases.${selectedTestcase}.output`).ref}  {...register(`testcases.${selectedTestcase}.output`)} inputStyles='!bg-dark-layer-3 !rounded-md !border-1 !py-2 !px-3 !border-transparent hover:!border-dark-blue-s'
            />
        </div>)
}
