import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import Select, { Option } from './select'
import { IoAdd } from '@react-icons/all-files/io5/IoAdd'
import { IoClose } from '@react-icons/all-files/io5/IoClose'
import styles from '../styles'
import { convert } from '../../utils/convert'
import { IoSend } from '@react-icons/all-files/io5/IoSend'
import { ProblemType } from '../create-problem/interfaces'
import { EditorView } from '@codemirror/view'
import { Tag } from '../interfaces'
import dynamic from 'next/dynamic'
import MarkdownSkeleton from '../../skeletons/markdown-skeleton'
import { CgSpinner } from "@react-icons/all-files/cg/CgSpinner";

const MarkdownEditor = dynamic(
  () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
  { ssr: false, loading() { return <MarkdownSkeleton /> } }
);

export default function DefaultForm({
  highlightedTags,
  tags,
  difficulties,
  isPending
}: {
  highlightedTags?: Tag[]
  tags: Tag[]
  difficulties: Option<string>[]
  isPending: boolean
}) {
  const {
    register,
    control,
    formState: { isValid },
  } = useFormContext<ProblemType>()

  return (
    <>
      <div className="px-4 flex flex-col gap-y-4">
        <div className="flex xs:items-center items-start w-full xs:flex-row flex-col-reverse gap-y-3 ">
          <input
            className="bg-transparent outline-none flex-1 text-xl font-normal placeholder:text-dark-label-2 text-white"
            placeholder="Enter your title"
            {...register('name')}
          />
          <div className="flex items-center sm:gap-x-4 gap-x-2 xs:justify-center xs:w-auto w-full">
            <button
              type="button"
              className={`${styles.btn} text-white bg-dark-layer-3 hover:bg-dark-hover`}
            >
              Cancel
            </button>
            <button
              disabled={!isValid || isPending}
              className={`${styles.btn} w-20 bg-dark-green-s flex justify-center disabled:cursor-not-allowed disabled:opacity-50 text-white hover:bg-dark-green-hover`}
            >
              {isPending ? <CgSpinner size={22} className='animate-spin text-white' /> :
                <>
                  <IoSend />
                  <span>Post</span>
                </>
              }
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
                  options={convert<number>(tags, 'name', '_id')}
                  highlightedOptions={
                    highlightedTags
                      ? convert<number>(highlightedTags, 'name', '_id')
                      : []
                  }
                  undefined={true}
                  menuWidth="w-[260px]"
                  menuHeight="max-h-56"
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
                  undefined={true}
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
    </>
  )
}
