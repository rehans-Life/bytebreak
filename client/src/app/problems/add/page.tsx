'use client'

import Select, { Option } from '../../components/select'
import { IoAdd } from 'react-icons/io5'
import { TbSend } from 'react-icons/tb'
import dynamic from 'next/dynamic'
import '@uiw/react-markdown-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form'
import { IoClose } from 'react-icons/io5'
import { EditorView } from '@codemirror/view'
import FileInput from '@/app/components/file-input'
import { ProblemType } from './interfaces'
import styles from './page.styles'
import ConfigForm from './components/configForm'
import { ProblemSchema } from './schemas'
import { useAtomValue } from 'jotai'
import { tagsAtom } from '@/app/atoms/tagAtoms'
import { atomWithQuery } from 'jotai-tanstack-query'
import { convert } from '@/app/utils/convert'


const types = [
  {
    value: 1,
    label: 'String',
  },
  {
    value: 2,
    label: 'Integer',
  },
  {
    value: 3,
    label: 'Integer[]',
  },
]

const difficulties: Option<number>[] = [
  {
    value: 1,
    label: 'Easy',
    color: 'rgb(0, 184, 163)',
  },
  {
    value: 2,
    label: 'Medium',
    color: 'rgb(255 161 22)',
  },
  {
    value: 3,
    label: 'Difficult',
    color: 'rgb(255 55 95)',
  },
]

const MarkdownEditor = dynamic(
  () => import('@uiw/react-markdown-editor').then((mod) => mod.default),
  { ssr: false }
)

const descDefaultMarkup =
  'Give a brief description of the question and all the ``parameters`` that are going to be *passed* into the ``code`` that *the user submits*.\n\n**Example 1:**\n> **Input: input1=[12, 23, 23], input2= 32**\\\n> **Ouput: [0, 1]**\\\n> **Explanation: Explain how the ouput was acheived with the given input**\n\n**Contraints:**\n- ``some contraints related to the input.``\n- ``some constraints related to the output.``\n\n\n**Follow-up:** Challenge the user to present a solution with a better `space and time complexity`.'

const editroialDefaultMarkup =
  '## Solution Article\n\n<!-- Type of Approach either brute force, optimal or sub-optimal -->\n### Approach 1: Brute force\n\n#### Intuition\n<!-- Describe your first thoughts on how to solve this problem. -->\n\n#### Algorithm\n<!-- Describe your approach to solving the problem. -->\n\n#### Implementation \n```\ncode for solving the problem.\n```\n\n#### Complexity Analysis \n- Time complexity:\n<!-- Add your time complexity here, e.g. *O(n)* -->\n- Space complexity: \n<!-- Add your space complexity here, e.g. *O(n)* -->\n\n#'

export default function Add() {
  const { data } = useAtomValue(tagsAtom)

  const methods = useForm<ProblemType>({
    resolver: zodResolver(ProblemSchema),
    defaultValues: {
      description: descDefaultMarkup,
      editorial: editroialDefaultMarkup,
      tags: [],
      config: {
        returnType: types[0],
        params: [
          {
            name: '',
            type: types[0],
          },
        ],
      },
    },
  })

  const {
    register,
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = methods

  const addProblem: SubmitHandler<ProblemType> = (problem) => {
    console.log(problem)
  }

  return (
    <FormProvider {...methods}>
      <div className="flex w-full pb-16 justify-center">
        <form
          onSubmit={handleSubmit(addProblem)}
          className="py-6 bg-dark-layer-1 flex w-full flex-col gap-y-4 max-w-[1200px]"
        >
          <div className="px-4 flex flex-col gap-y-4">
            <div className="flex xs:items-center items-start w-full xs:flex-row flex-col-reverse gap-y-3 ">
              <input
                className="bg-transparent outline-none flex-1 text-xl font-normal placeholder:text-dark-label-2 text-white"
                placeholder="Enter your title"
                {...register('title')}
              />
              <div className="flex items-center sm:gap-x-4 gap-x-2 xs:justify-center xs:w-auto w-full">
                <button
                  type="button"
                  className={`${styles.btn} text-white bg-dark-layer-3 hover:bg-dark-hover`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className={`${styles.btn} bg-dark-green-s disabled:cursor-not-allowed disabled:opacity-50 text-white hover:bg-dark-green-hover`}
                >
                  <TbSend />
                  <span>Post</span>
                </button>
              </div>
            </div>
            <Controller
              control={control}
              name="tags"
              render={({ field }) => {
                return (
                  <div className="flex gap-2 items-center flex-wrap">
                    <Select
                      enableSearch={true}
                      isMulti={true}
                      options={convert(data, 'name', '_id')}
                      menuWidth="w-[260px]"
                      menuHeight="max-h-64"
                      placeholder="Filter topics"
                      onChange={field.onChange}
                      value={field.value}
                      onBlur={field.onBlur}
                    >
                      <button type="button" className={styles['rounded-btn']}>
                        <IoAdd size={19} />
                        <div className="">Tag</div>
                      </button>
                    </Select>
                    {field.value?.map((tag, i) => (
                      <div
                        key={i}
                        className={`${styles['rounded-btn']} cursor-pointer`}
                      >
                        {tag.label}
                        <IoClose
                          onClick={() => {
                            field.onChange(
                              field.value?.filter(
                                ({ value }) => value !== tag.value
                              )
                            )
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )
              }}
            />
            <Controller
              control={control}
              name="difficulty"
              render={({ field }) => {
                return (
                  <div className="flex gap-x-1 items-center flex-wrap">
                    <Select
                      enableSearch={false}
                      isMulti={false}
                      options={difficulties}
                      menuWidth="w-[175px]"
                      menuHeight="max-h-auto"
                      placeholder="Filter topics"
                      replaceName={true}
                      name={field.name}
                      btnStyle={{
                        minWidth: '110px',
                      }}
                      onChange={field.onChange}
                      value={field.value}
                      onBlur={field.onBlur}
                    />
                  </div>
                )
              }}
            />
          </div>
          <Controller
            control={control}
            name="description"
            render={({ field }) => {
              return (
                <MarkdownEditor
                  onChange={field.onChange}
                  value={field.value}
                  onBlur={field.onBlur}
                  className="text-dark-gray-8 w-full bg-dark-layer-2 text-md"
                  height="400px"
                  enableScroll
                  visible
                  enablePreview
                  previewWidth="50%"
                  extensions={[EditorView.lineWrapping]}
                />
              )
            }}
          />
          <div className="px-4 flex flex-col gap-y-5">
            <ConfigForm />
            <div className="flex flex-col gap-y-5">
              <div className="flex items-center gap-x-3">
                <div className="xs:text-2xl text-white uppercase text-lg font-bold">
                  TestCases
                </div>
                <div className="text-white font-medium text-sm">
                  All params should be seperated by new line (\n) character.
                  <a
                    target="_blank"
                    href="https://firebasestorage.googleapis.com/v0/b/tesla-clone-a0f5d.appspot.com/o/testcases%2Fsample-testcases.json?alt=media&token=a3d2d4d0-2bc9-43ca-a6e0-dbee0a941d21"
                    className="text-blue-500 hover:underline ml-1"
                  >
                    Have a look at a template json file here.
                  </a>
                </div>
              </div>
              <Controller
                control={control}
                name="testCases"
                render={({ field }) => {
                  return <FileInput accept="application/json" {...field} />
                }}
              />
            </div>
            <div className="flex flex-col gap-y-5">
              <div className="xs:text-2xl text-white uppercase text-lg font-bold">
                Editorial
              </div>
              <Controller
                control={control}
                name="editorial"
                render={({ field }) => {
                  return (
                    <MarkdownEditor
                      onChange={field.onChange}
                      value={field.value}
                      onBlur={field.onBlur}
                      className="text-dark-gray-8 w-full bg-dark-layer-2 text-md"
                      height="400px"
                      enableScroll
                      visible
                      enablePreview
                      previewWidth="50%"
                      extensions={[EditorView.lineWrapping]}
                    />
                  )
                }}
              />
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  )
}
