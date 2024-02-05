import React from 'react'
import { ProblemType, types } from '../interfaces'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import Select from '@/app/components/select'
import Editor from './editor'
import Input from '@/app/components/input'
import { FiPlus } from 'react-icons/fi'
import { useToast } from '@/components/ui/use-toast'
import styles from '../page.styles'

export default function ConfigForm() {
  const { register, control } = useFormContext<ProblemType>()
  const paramsField = useFieldArray({
    control,
    name: 'config.params',
  })

  const { toast } = useToast()

  return (
    <div className="flex md:flex-row flex-col gap-x-3 gap-y-4 py-2">
      <div className="flex flex-col gap-y-5">
        <div className="xs:text-2xl text-white uppercase text-lg font-bold">
          Code Configuration
        </div>
        <div className="grid grid-cols-2 items-end gap-x-3">
          <Input
            label="Function Name"
            inputRef={register('config.funcName').ref}
            {...register('config.funcName')}
          />
          <Controller
            control={control}
            name="config.returnType"
            render={({ field }) => {
              return (
                <Select
                  isMulti={false}
                  enableSearch={false}
                  options={types}
                  replaceName={true}
                  name={'Return Type'}
                  onChange={field.onChange}
                  value={field.value}
                  onBlur={field.onBlur}
                  menuWidth="w-full"
                  inlineBtnStyle="w-full"
                  menuHeight="h-[150px]"
                  btnStyle={{
                    padding: '8.5px',
                    fontWeight: '600',
                  }}
                />
              )
            }}
          />
        </div>
        <div className="flex flex-col gap-y-2 items-start w-auto">
          <div className="flex justify-between w-full items-center">
            <div className="text-xl font-semibold text-white">Parameters</div>
            <button
              type="button"
              onClick={() =>
                paramsField.append({
                  name: '',
                  type: types[0],
                })
              }
              className={`${styles.btn} gap-x-[3px] bg-dark-blue-s hover:bg-dark-blue-h text-white`}
            >
              <FiPlus size={19} className="font-semibold" />
              Add
            </button>
          </div>
          <div className="flex flex-col gap-y-3">
            {paramsField.fields.map((field, i) => {
              return (
                <div
                  key={field.id}
                  className="grid grid-cols-3 gap-x-2 items-end"
                >
                  <Input
                    label="Name"
                    inputStyles="w-full"
                    inputRef={register(`config.params.${i}.name`).ref}
                    {...register(`config.params.${i}.name`)}
                  />
                  <Controller
                    control={control}
                    name={`config.params.${i}.type`}
                    render={({ field }) => {
                      return (
                        <Select
                          isMulti={false}
                          enableSearch={false}
                          options={types}
                          replaceName={true}
                          name={'Type'}
                          onChange={field.onChange}
                          value={field.value}
                          onBlur={field.onBlur}
                          menuWidth="xs:w-[200px] w-[125px]"
                          menuHeight="h-[150px]"
                          inlineBtnStyle="w-full"
                          btnStyle={{
                            padding: '8.5px',
                            fontWeight: '600',
                          }}
                        ></Select>
                      )
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (paramsField.fields.length === 1) {
                        toast({
                          title: 'You need to have atleast one parameter.',
                          variant: 'destructive',
                        })
                        return
                      }
                      paramsField.remove(i)
                    }}
                    className={`bg-dark-pink !py-[8px] justify-center !rounded-md text-white ${styles.btn}`}
                  >
                    Remove
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="w-full overflow-x-clip md:mb-10 mb-0">
        <Editor control={control} />
      </div>
    </div>
  )
}
