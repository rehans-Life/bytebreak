import {
  MutateFunction,
  MutationFunction,
  QueryFunction,
} from '@tanstack/react-query'
import {
  Problem,
  ProblemType,
  SubProblem,
} from '../app/create-problem/interfaces'
import {
  ApiSuccessResponse,
  RunVarType,
  Comment,
  SubmissionDoc,
  TagWithConfig,
  SubmitVarType,
  Like,
  ProblemStatus,
  Tag,
} from '../app/interfaces'
import axios from './axios'
import { Judge0Submission } from '@/atoms/testcaseAtoms'
import { IGoogleUser, IUser, UserInfo } from '@/atoms/userAtom'
import { SignUpFormType } from '@/app/signup/page'
import { LoginFormType } from '@/app/login/page'
import createFormData from './createFormData'
import { SignInFormType } from '@/app/social/signup/signIn'
import { ProblemsCount, UserCalender } from '@/app/[username]/interfaces'

export const getMe = async () => {
  try {
    const { data } = await axios.get<ApiSuccessResponse<IUser>>(
      'api/v1/users/me'
    )
    return data.data
  } catch (err) {
    return false
  }
}

export const uploadFile: MutationFunction<string, File> = async (file) => {
  const { data } = await axios.post<ApiSuccessResponse<{ url: string }>>(
    `api/v1/users/upload`,
    createFormData({
      avatar: file,
    }),
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return data.data.url
}

export const signup: MutationFunction<IUser, SignUpFormType> = async (
  user: SignUpFormType
) => {
  const { data } = await axios.post<ApiSuccessResponse<{ user: IUser }>>(
    `api/v1/users/signup`,
    user
  )
  return data.data.user
}

export const login: MutationFunction<IUser, LoginFormType> = async (
  user: LoginFormType
) => {
  const { data } = await axios.post<ApiSuccessResponse<{ user: IUser }>>(
    `api/v1/users/login`,
    user
  )
  return data.data.user
}

export const getGoogleUser: MutationFunction<IUser, string> = async (
  userId: string
) => {
  const { data } = await axios.get<ApiSuccessResponse<{ user: IUser }>>(
    `api/v1/users/google/${userId}`
  )
  return data.data.user
}

export const createGoogleUser: MutationFunction<IUser, IGoogleUser> = async (
  user
) => {
  const { data } = await axios.post<ApiSuccessResponse<IUser>>(
    `api/v1/users/google`,
    user
  )
  return data.data
}

export const logout: MutationFunction<undefined, undefined> = async () => {
  await axios.post<ApiSuccessResponse<undefined>>(`api/v1/users/logout`)
  return undefined
}

export const getProblem: QueryFunction<Problem> = async function ({
  queryKey: [, slug],
}) {
  const { data } = await axios.get<ApiSuccessResponse<Problem>>(
    `api/v1/problems/${slug}`
  )
  return data.data
}

export const getSubmissions: QueryFunction<SubmissionDoc[]> = async function ({
  queryKey: [, problemId, userId],
}) {
  const { data } = await axios.get<
    ApiSuccessResponse<{ submissions: SubmissionDoc[] }>
  >(
    `api/v1/submissions?problem=${problemId}&user=${userId}&fields=_id,status,createdAt,language,runtime,memory`
  )
  return data.data.submissions
}

export const getSubmission: QueryFunction<SubmissionDoc> = async function ({
  queryKey: [, submissionId],
}) {
  const { data } = await axios.get<ApiSuccessResponse<SubmissionDoc>>(
    `api/v1/submissions/${submissionId}`
  )
  return data.data
}

export const getSubmissionStatus: QueryFunction<ProblemStatus> =
  async function ({ queryKey: [, problemId] }) {
    const { data } = await axios.get<
      ApiSuccessResponse<{ status: ProblemStatus }>
    >(`api/v1/problems/${problemId}/submissions/submission-status`)
    return data.data.status
  }

export const getEditorial: QueryFunction<Comment> = async function ({
  queryKey: [, slug],
}) {
  const { data } = await axios.get<ApiSuccessResponse<{ editorial: Comment }>>(
    `api/v1/problems/${slug}/editorial`
  )
  return data.data.editorial
}

export const getDefaultConfigurations: QueryFunction<TagWithConfig[]> =
  async function ({ queryKey: [, slug] }) {
    const { data } = await axios.get<
      ApiSuccessResponse<{ languageConfigurations: TagWithConfig[] }>
    >(`api/v1/problems/${slug}/defaultConfigurations`)
    return data.data.languageConfigurations
  }

export const runCode: MutationFunction<Judge0Submission[], RunVarType> =
  async function (variables) {
    const { data } = await axios.post<
      ApiSuccessResponse<{ submissions: Judge0Submission[] }>
    >(`api/v1/submissions/run`, {
      ...variables,
    })

    return data.data.submissions
  }

export const submitCode: MutationFunction<SubmissionDoc, SubmitVarType> =
  async function (variables) {
    const { data } = await axios.post<
      ApiSuccessResponse<{ submission: SubmissionDoc }>
    >(`api/v1/submissions/submit`, {
      ...variables,
    })

    return data.data.submission
  }

export const getLike: QueryFunction<Like> = async function ({
  queryKey: [resource, id],
}) {
  const { data } = await axios.get<ApiSuccessResponse<Like>>(
    `api/v1/${resource}/${id}/like`
  )
  return data.data
}

export const getStatuses: QueryFunction<string[]> = async function (_) {
  const { data } = await axios.get<ApiSuccessResponse<{ statuses: string[] }>>(
    `api/v1/general/statuses`
  )
  return data.data.statuses
}

export const likeDoc: MutationFunction<
  boolean,
  { id: string; resource: string }
> = async function ({ id, resource }) {
  await axios.post<ApiSuccessResponse<Like>>(`api/v1/${resource}/${id}/like`)
  return true
}

export const unlikeDoc: MutationFunction<
  boolean,
  { id: string; resource: string }
> = async function ({ id, resource }) {
  await axios.delete<ApiSuccessResponse<Like>>(`api/v1/${resource}/${id}/like`)
  return true
}

export const getTags: QueryFunction<Tag[]> = async ({
  queryKey: [, category],
}) => {
  const { data: res } = await axios.get<ApiSuccessResponse<Tag[]>>(
    `/api/v1/general/tags${category ? `?category=${category}` : ''}`
  )
  return res.data
}

export const createProblem: MutateFunction<
  { problem: Problem; editorial: Comment },
  Error,
  ProblemType
> = async (problem) => {
  const formData = createFormData(problem)
  const {
    data: { data },
  } = await axios.post<
    ApiSuccessResponse<{ problem: Problem; editorial: Comment }>
  >('/api/v1/problems', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

export const getUserCalender: QueryFunction<UserCalender> = async ({
  queryKey: [, username, year],
}) => {
  const { data } = await axios.get<ApiSuccessResponse<UserCalender>>(
    `api/v1/users/user-calender/${username}?year=${year}`
  )
  return data.data
}

export const getProblemsCount: QueryFunction<ProblemsCount> = async ({}) => {
  const { data } = await axios.get<
    ApiSuccessResponse<{ problemsCount: ProblemsCount }>
  >(`api/v1/general/all-questions-count`)
  return data.data.problemsCount
}

export const getUserInfo: QueryFunction<UserInfo> = async ({
  queryKey: [, username],
}) => {
  const { data } = await axios.get<ApiSuccessResponse<{ userInfo: UserInfo }>>(
    `api/v1/users/user-info/${username}`
  )
  return data.data.userInfo
}

export const getSubmissionsCount: QueryFunction<ProblemsCount> = async ({
  queryKey: [, username],
}) => {
  const { data } = await axios.get<
    ApiSuccessResponse<{ submissionCount: ProblemsCount }>
  >(`api/v1/users/user-submissions-count/${username}`)
  return data.data.submissionCount
}

export const getContributions: QueryFunction<{
  maxPage: number
  problems?: Problem[]
  submissions?: SubmissionDoc[]
}> = async ({ queryKey: [resource, page, user] }) => {
  const { data } = await axios.get<
    ApiSuccessResponse<{
      maxPage: number
      problems?: Problem[]
      submissions?: SubmissionDoc[]
    }>
  >(`api/v1/${resource}?page=${page}&limit=5&user=${user}`)
  return data.data
}

export const getProblems: QueryFunction<{
  problems: SubProblem[]
  maxPage: number
}> = async function ({ queryKey, signal }) {
  const [_, page, limit, difficulty, status, name, tags] = queryKey as [
    string,
    string,
    string,
    string | null,
    string | null,
    string | null,
    string[]
  ]

  const params = new URLSearchParams()

  params.set('page', page)
  params.set('limit', limit)
  tags.forEach((tag, index) => params.set(`tags[all][${index}]`, tag))

  if (status) params.set('status', status)
  if (difficulty) params.set('difficulty', difficulty)
  if (name) params.set('name[regex]', `(?i)${name}`)

  params.set(
    'fields',
    '_id,slug,name,accepted,submissions,difficulty,tags,status,likes'
  )

  const { data } = await axios.get<
    ApiSuccessResponse<{ problems: SubProblem[]; maxPage: number }>
  >(`api/v1/problems?${params.toString()}`, {
    signal,
  })
  return data.data
}
