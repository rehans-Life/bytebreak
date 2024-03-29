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

export interface ProblemInfo {
  _id: string,
  name: string
  slug: string
  accepted: number
  submissions: number
  difficulty: 'hard' | 'medium' | 'easy'
  likes: number
}

export interface SubProblem extends ProblemInfo {
  status: 'todo' | 'solved' | 'attempted'
}

export interface Problem extends ProblemInfo {
  tags: Tag[]
  description: string
  config: {
    funcName: string
    returnType: ParamType<string>
    params: ParamType<string>[]
  }
  acceptanceRate: number
  sampleTestCases: Testcase[]
  totalTestcases: number
  createdAt: string
}

export const types: Option<string>[] = Object.keys(getTypes('python')).map(
  (type) => ({
    value: type,
    label: type,
  })
)
 