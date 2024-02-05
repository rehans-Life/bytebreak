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
}

export interface Problem {
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
  sampleTestcases: Testcase[]
}

export const types: Option<string>[] = Object.keys(getTypes('python')).map(
  (type) => ({
    value: type,
    label: type,
  })
)
