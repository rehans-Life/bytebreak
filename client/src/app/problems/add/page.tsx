'use client'

import { Option } from '../../components/select'
import '@uiw/react-markdown-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form'
import { EditorView } from '@codemirror/view'
import FileInput from '@/app/components/file-input'
import { Problem, ProblemType, types } from './interfaces'
import ConfigForm from './components/configForm'
import { ProblemSchema } from './schemas'
import { useAtomValue, useSetAtom } from 'jotai'
import { Tag, tagsAtom, topicsAtom } from '@/app/atoms/tagAtoms'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from '../../utils/axios'
import { ApiErrorResponse, ApiSuccessResponse } from '../../interfaces'
import createFormData from '@/app/utils/createFormData'
import MarkdownEditor from '@uiw/react-markdown-editor'
import DefaultForm from '@/app/components/defaultForm'
import { useToast } from '@/components/ui/use-toast'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'

const difficulties: Option<string>[] = [
  {
    value: 'easy',
    label: 'Easy',
    color: 'rgb(0, 184, 163)',
  },
  {
    value: 'medium',
    label: 'Medium',
    color: 'rgb(255 161 22)',
  },
  {
    value: 'hard',
    label: 'Hard',
    color: 'rgb(255 55 95)',
  },
]

const descDefaultMarkup =
  'Give a brief description of the question and all the ``parameters`` that are going to be *passed* into the ``code`` that *the user submits*.\n\n**Example 1:**\n> **Input: input1=[12, 23, 23], input2= 32**\\\n> **Ouput: [0, 1]**\\\n> **Explanation: Explain how the ouput was acheived with the given input**\n\n**Contraints:**\n- ``some contraints related to the input.``\n- ``some constraints related to the output.``\n\n\n**Follow-up:** Challenge the user to present a solution with a better `space and time complexity`.'

const editroialDefaultMarkup =
  '## Solution\n\n<!-- Type of Approach either brute force, optimal or sub-optimal -->\n### Approach 1: Brute force\n\n#### Intuition\n<!-- Describe your first thoughts on how to solve this problem. -->\n\n#### Algorithm\n<!-- Describe your approach to solving the problem. -->\n\n#### Implementation \n```\ncode for solving the problem.\n```\n\n#### Complexity Analysis \n- Time complexity:\n<!-- Add your time complexity here, e.g. *O(n)* -->\n- Space complexity: \n<!-- Add your space complexity here, e.g. *O(n)* -->\n\n#'

export default function Add() {
  const setTags = useSetAtom(tagsAtom)
  const topics = useAtomValue(topicsAtom)

  const router = useRouter()
  const queryClient = useQueryClient()

  const { toast } = useToast()

  const _ = useQuery({
    queryKey: ['tags'],
    queryFn: async function () {
      const { data: res } = await axios.get<ApiSuccessResponse<Tag[]>>(
        '/api/v1/general/tags'
      )
      setTags(res.data)
      return res.data
    },
    throwOnError(err) {
      console.log(err)
      return false
    },
  })

  const { mutate } = useMutation<any, any, ProblemType>({
    mutationFn: async function (problem) {
      const formData = createFormData(problem)
      const res = await axios.post<ApiSuccessResponse<{ problem: Problem }>>(
        '/api/v1/problems',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return res.data.data.problem
    },
    onSuccess(data: Problem) {
      queryClient.setQueryData(['problem', data.slug], data)
      router.push(`/problems/${data.slug}`)
    },
    onError(error: AxiosError) {
      if (error.response) {
        console.log(error.response)
        toast({
          title: (error.response.data as ApiErrorResponse).message,
          variant: 'destructive',
        })
      } else if (error.request) {
        console.log(error.request)
        toast({
          title:
            'An Error Occurred while creating the problem please try again',
          variant: 'destructive',
        })
      } else {
        console.log(error.message)
        toast({
          title: error.message,
          variant: 'destructive',
        })
      }
    },
  })

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

  const { control, handleSubmit } = methods

  const addProblem: SubmitHandler<ProblemType> = (problem) => {
    mutate(problem)
  }

  return (
    <FormProvider {...methods}>
      <div className="flex w-full pb-16 justify-center">
        <form
          onSubmit={handleSubmit(addProblem)}
          className="py-6 bg-dark-layer-1 flex w-full flex-col gap-y-4 max-w-[1200px]"
        >
          <DefaultForm tags={topics} difficulties={difficulties} />
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
                name="testcases"
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
