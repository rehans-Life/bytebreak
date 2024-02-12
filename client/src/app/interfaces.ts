import { langs } from 'lang-code-configuration/data'
import z from 'zod'

const ApiErrorSchema = z.object({
  status: z.enum(['error', 'fail']),
  message: z.string(),
  stack: z.string().nullish(),
  error: z.any().nullish(),
})

const SubmitBodySchema = z.object({
  code: z.string(),
  languageId: z.number(),
  problemId: z.string(),    
})

const RunBodySchema = SubmitBodySchema.extend({
  testcases: z.object({
    input: z.string(),
    output: z.string()
  }).array()
})

export type SubmitVarType = z.infer<typeof SubmitBodySchema>
export type RunVarType = z.infer<typeof RunBodySchema>

const statuses = [
  "Accepted",
  "Wrong Answer",
  "Time Limit Exceeded",
  "Compilation Error",
  "Runtime Error (SIGSEGV)",
  "Runtime Error (SIGXFSZ)",
  "Runtime Error (SIGFPE)",
  "Runtime Error (SIGABRT)",
  "Runtime Error (NZEC)",
  "Runtime Error (Other)",
  "Internal Error",
  "Exec Format Error"
] as const;

export type StatusTypes = typeof statuses[number]

export interface Comment {
  parentId: string
  user: string
  tags?: Tag[]
  title?: string
  text: string
  likes: number
  replies: number
  views: number
}

export interface Submission {
  token: string,
  stdout: string,
  time: string,
  memory: number,
  stderr: string | null,
  message: string | null,
  status: Status
}

export interface SubmissionDoc {
  _id: string,
  problem: string
  user: string
  language: string
  code: string
  runtime: String
  memory: String
  status: StatusTypes
  testCasesPassed: number
  lastExecutedTestcase?: Testcase
  error?: string
}

export interface Status {
  id: number,
  description: StatusTypes
}

export interface Tag {
  _id: number
  name: string
  slug: string
  category: string,
}

export interface LanguageTag extends Tag {
  slug: langs
  category: 'language'
}

export interface TopicTag extends Tag {
  slug: string
  category: 'topic'
}

export interface TagWithConfig extends Tag {
  defaultConfiguration: string  
}

export interface Testcase {
  _id: string
  input: string
  output: string
}

export type ApiErrorResponse = z.infer<typeof ApiErrorSchema>

export interface ApiSuccessResponse<ST> {
  status: 'success'
  data: ST
}