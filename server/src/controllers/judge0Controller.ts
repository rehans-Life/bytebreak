import { cpp, java, javascript, python } from '../drivers/concat'
import { ProblemConfig } from '../models/Problem'
import Tag from '../models/Tag'
import AppError from '../utils/appError'
import { TestCases } from './problemController'
import axios from '../utils/axios'
import z from 'zod'
import { testcaseSchema } from '../models/TestCase'

export interface Submission {
  token: string
  stdout: string
  time: string
  memory: number
  stderr: string | null
  message: string | null
  compile_output: string
  testcase?: z.infer<typeof testcaseSchema>
  status: Status
}

export interface Status {
  id: number
  description: string
}

export interface Token {
  token: string
}

export const batchSubmission = async (
  source_code: string,
  language_id: string | number,
  config: ProblemConfig,
  testCases: TestCases,
) => {
  const language = await Tag.findOne({
    $and: [
      {
        _id: Number(language_id),
      },
      {
        category: 'language',
      },
    ],
  })

  if (!language) {
    throw new AppError('Language not Available', 404)
  }

  let base64Code: string

  switch (language.slug) {
    case 'javascript':
      base64Code = javascript(source_code)
      break
    case 'python':
      base64Code = python(source_code)
      break
    case 'java':
      base64Code = java(source_code)
      break
    case 'cpp':
      base64Code = cpp(source_code, config.funcName)
      break
    default:
      base64Code = ''
      break
  }

  const submissions = testCases.map(({ input, output }) => {
    const stdin = Buffer.from(
      `${config.funcName}|${JSON.stringify(config.params)}|${input}|${config.returnType}`,
    ).toString('base64')
    const expected_output = Buffer.from(output).toString('base64')

    return {
      source_code: base64Code,
      language_id,
      stdin,
      expected_output,
    }
  })

  const { data: tokens } = await axios.post<Token[]>(
    `/submissions/batch?base64_encoded=true`,
    {
      submissions,
    },
  )

  const executedSubmissions = await new Promise<Submission[]>((resolve) => {
    setTimeout(() => {
      resolve(getExecutedBatchSubmissions(tokens))
    }, 2000)
  })

  return executedSubmissions
}

export const getExecutedBatchSubmissions = async (
  tokens: Token[],
): Promise<Submission[]> => {
  const submissions = await getBatchSubmissions(tokens)

  if (!checkAllExecuteed(submissions)) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getExecutedBatchSubmissions(submissions))
      }, 1000)
    })
  }

  return submissions
}

export const getBatchSubmissions = async (tokens: Token[]) => {
  const { data } = await axios.get<{ submissions: Submission[] }>(
    `/submissions/batch?tokens=${tokens.map(({ token }) => token).join(',')}`,
  )

  return data.submissions
}

export const checkAllExecuteed = (submissions: { status: Status }[]) => {
  return !submissions.some(({ status }) => [1, 2].includes(status.id))
}
