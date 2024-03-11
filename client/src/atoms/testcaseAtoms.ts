import { StatusTypes } from '@/app/interfaces'
import { atom } from 'jotai'

export interface MinifiedTestCase {
  input: string
  output: string
}

export interface InvalidTestcase {
  code: 409
  status: StatusTypes
  testcaseNo: number
  testcase: MinifiedTestCase
  message: string
}

export interface CodeError {
  code: 417
  status: StatusTypes
  message: string
}

export interface Judge0Submission {
  code: 200
  stdout: string
  time: string
  memory: number
  stderr: string | null
  token: string
  compile_output: string | null
  message: string | null
  testcase: MinifiedTestCase
  status: {
    id: number
    description: StatusTypes
  }
}

export const testcaseTabAtom = atom<0 | 1>(0)
export const selectedTestcaseAtom = atom<number>(0)
export const executionResultAtom = atom<
  InvalidTestcase | CodeError | Judge0Submission[] | null
>(null)
