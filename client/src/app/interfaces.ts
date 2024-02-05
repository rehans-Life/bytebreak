import z from 'zod'

const ApiErrorSchema = z.object({
  status: z.enum(['error', 'fail']),
  message: z.string(),
  stack: z.string().nullish(),
  error: z.any().nullish(),
})

export interface Tag {
  _id: string
  name: string
  slug: string
  category: 'language' | 'topic'
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
