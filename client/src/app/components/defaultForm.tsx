import MarkdownEditor from '@uiw/react-markdown-editor'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import Select, { Option } from './select'
import { IoAdd, IoClose } from 'react-icons/io5'
import styles from '../problems/add/page.styles'
import { convert } from '../utils/convert'
import { TbSend } from 'react-icons/tb'
import { ProblemType } from '../problems/add/interfaces'
import { EditorView } from '@codemirror/view'
import { Tag } from '../atoms/tagAtoms'

export default function DefaultForm({
  highlightedTags,
  tags,
  difficulties,
}: {
  highlightedTags?: Tag[]
  tags: Tag[]
  difficulties: Option<string>[]
}) {
  const {
    register,
    control,
    formState: { isSubmitting, isValid },
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
                  options={convert<number>(tags, 'name', '_id')}
                  highlightedOptions={
                    highlightedTags
                      ? convert<number>(highlightedTags, 'name', '_id')
                      : []
                  }
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
