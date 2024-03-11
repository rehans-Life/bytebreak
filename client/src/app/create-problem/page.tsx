'use client'

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
import { languagesAtom, tagsAtom, topicsAtom } from '../../atoms/tagAtoms'
import { useMutation, useSuspenseQuery, useQueryClient, } from '@tanstack/react-query'
import axios from '../../utils/axios'
import { ApiSuccessResponse, Comment, LanguageTag, TopicTag } from '../interfaces'
import createFormData from '@/utils/createFormData'
import DefaultForm from '@/app/components/defaultForm'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import '@uiw/react-markdown-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic'
import MarkdownSkeleton from '../../skeletons/markdown-skeleton'
import { LangConfig, codesAtom, setRestrictedLines } from '@/atoms/codeEditorAtoms'
import { userAtom } from '@/atoms/userAtom'
import { showSignInToast } from '@/toasts/signInReminder'
import generateCodeConfig from '@/utils/generateCodeConfig'
import { difficulties } from '@/data/input-data'

const MarkdownEditor = dynamic(
  () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
  {
    ssr: false,
    loading() {
      return <MarkdownSkeleton />
    },
  }
);

const descDefaultMarkup =
  'Give a brief description of the question and all the ``parameters`` that are going to be *passed* into the ``code`` that *the user submits*.\n\n**Example 1:**\n> **Input: input1=[12, 23, 23], input2= 32**\\\n> **Ouput: [0, 1]**\\\n> **Explanation: Explain how the ouput was acheived with the given input**\n\n**Contraints:**\n- ``some contraints related to the input.``\n- ``some constraints related to the output.``\n\n\n**Follow-up:** Challenge the user to present a solution with a better `space and time complexity`.'

const editroialDefaultMarkup =
  '## Solution\n\n<!-- Type of Approach either brute force, optimal or sub-optimal -->\n### Approach 1: Brute force\n\n#### Intuition\n<!-- Describe your first thoughts on how to solve this problem. -->\n\n#### Algorithm\n<!-- Describe your approach to solving the problem. -->\n\n#### Implementation \n```\ncode for solving the problem.\n```\n\n#### Complexity Analysis \n- Time complexity:\n<!-- Add your time complexity here, e.g. *O(n)* -->\n- Space complexity: \n<!-- Add your space complexity here, e.g. *O(n)* -->\n\n#'

const defaultConifg = {
  funcName: "func_name",
  returnType: types[0],
  params: [
    {
      name: 'param1',
      type: types[0],
    },
  ],
};

export default function Create() {
  const user = useAtomValue(userAtom);

  const setTags = useSetAtom(tagsAtom)
  const setCodes = useSetAtom(codesAtom)

  const topics = useAtomValue(topicsAtom)
  const languages = useAtomValue(languagesAtom)

  const router = useRouter()
  const queryClient = useQueryClient()

  const _ = useSuspenseQuery({
    queryKey: ['tags'],
    meta: {
      onSuccess: (data: (LanguageTag | TopicTag)[]) => {
        setTags(data)
      }
    },
    queryFn: async function () {
      const { data: res } = await axios.get<ApiSuccessResponse<(LanguageTag | TopicTag)[]>>(
        '/api/v1/general/tags'
      )
      return res.data
    },
  })

  const { mutate, isPending } = useMutation<{ problem: Problem, editorial: Comment }, AxiosError, ProblemType>({
    onMutate() {
      return {
        errorMsg: 'An Error occured while creating the problem please try again later'
      }
    },
    mutationFn: async function (problem) {
      const formData = createFormData(problem)
      const { data: { data } } = await axios.post<ApiSuccessResponse<{ problem: Problem, editorial: Comment }>>(
        '/api/v1/problems',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return data
    },
    onSuccess(data) {
      queryClient.setQueryData(['problems', data.problem.slug], data.problem)
      queryClient.setQueryData(['editorial', data.problem.slug], data.editorial)
      router.push(`/problems/${data.problem.slug}`)
      reset();
      setCodes(languages.reduce<{ [key: string]: LangConfig }>((acc, lang) => {
        const code = generateCodeConfig(lang.slug, defaultConifg)
        acc[lang.slug] = {
          code,
          restrictedLines: setRestrictedLines(code)
        }
        return acc;
      }, {} as { [key: string]: LangConfig }));
    },
    throwOnError: false,
  })

  const methods = useForm<ProblemType>({
    resolver: zodResolver(ProblemSchema),
    defaultValues: {
      description: descDefaultMarkup,
      editorial: editroialDefaultMarkup,
      tags: [],
      config: {
        funcName: "func_name",
        returnType: types[0],
        params: [
          {
            name: 'param1',
            type: types[0],
          },
        ],
      },
    },
  })

  const { control, handleSubmit, reset } = methods

  const addProblem: SubmitHandler<ProblemType> = async (problem) => {
    if (!user) {
      showSignInToast("You must log in first");
      return;
    }
    mutate(problem)
  }

  return (
    <FormProvider {...methods}>
      <div className="flex w-full pb-16 justify-center">
        <form
          onSubmit={handleSubmit(addProblem)}
          className="py-6 bg-dark-layer-1 flex w-full flex-col gap-y-4 max-w-[1200px]"
        >
          <DefaultForm tags={topics} difficulties={difficulties} isPending={isPending} />
          <div className="px-4 flex flex-col gap-y-5">
            <ConfigForm />
            <div className="flex flex-col gap-y-5">
              <div className="flex sm:flex-row flex-col sm:items-center gap-x-3 gap-y-2">
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
