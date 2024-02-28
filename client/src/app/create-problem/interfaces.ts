import { Option } from '@/app/components/select'
import { Tag, Testcase } from '@/app/interfaces'
import { getTypes } from 'lang-code-configuration'

export type ParamType<T> = { name: string; type: T }

export type ProblemConfig = {
  funcName: string
  returnType: Option<string>
  params: ParamType<Option<string>>[]
}

export type ProblemType = {
  name: string
  tags: Option<number>[]
  description: string
  difficulty: Option<string>
  config: ProblemConfig
  testcases: File
  editorial: string
  solution: {
    languageId: number,
    code: string
  }
}

export interface SubProblem {
  _id: string,
  name: string
  slug: string
  accepted: number
  submissions: number
  status: 'todo' | 'solved' | 'attempted'
  difficulty: 'hard' | 'medium' | 'easy'
}

export interface Problem {
  _id: string,
  name: string
  slug: string
  tags: Tag[]
  description: string
  difficulty: 'hard' | 'medium' | 'easy'
  config: {
    funcName: string
    returnType: ParamType<string>
    params: ParamType<string>[]
  }
  submissions: number
  accepted: number
  acceptanceRate: number
  likes: number,
  sampleTestCases: Testcase[]
}

export const types: Option<string>[] = Object.keys(getTypes('python')).map(
  (type) => ({
    value: type,
    label: type,
  })
)
 