import { Option } from '@/app/components/select'

export type ParamType = { name: string; type: Option<number> }

export type ProblemConfig = {
  funcName: string
  returnType: Option<number>
  params: ParamType[]
}

export type ProblemType = {
  title: string
  tags: Option<number>[]
  description: string
  difficulty: Option<number>
  config: ProblemConfig
  testCases: string
  editorial: string
}
