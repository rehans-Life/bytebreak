import z, { string } from 'zod'

export const OptionSchema = z.object({
  value: z.any(),
  label: z.string(),
  color: z.string().nullish(),
})

export const ParamSchema = z.object({
  name: z.string().min(1),
  type: OptionSchema,
})

export const ProblemConfigSchema = z.object({
  funcName: z.string().min(1),
  returnType: OptionSchema,
  params: z.array(ParamSchema).min(1),
})

export const ProblemSchema = z.object({
  name: z.string().min(1),
  tags: z.array(OptionSchema),
  difficulty: OptionSchema,
  description: z.string().min(1),
  config: ProblemConfigSchema,
  testcases: z
    .instanceof(File)
    .refine((file) => file.type === 'application/json'),
  editorial: z.string().min(1),
  solution: z.object({
    languageId: z.number(),
    code: z.string().min(1)
  })
})
