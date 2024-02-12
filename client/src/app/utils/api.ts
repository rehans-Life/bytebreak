import { MutationFunction, QueryFunction } from "@tanstack/react-query";
import { Problem } from "../create-problem/interfaces";
import { ApiSuccessResponse, RunVarType, Comment, Submission, SubmissionDoc, TagWithConfig, SubmitVarType } from "../interfaces";
import axios from './axios'

export const getProblem : QueryFunction<Problem> = async function ({ queryKey: [, slug] }) {
  const { data } = await axios.get<ApiSuccessResponse<Problem>>(`api/v1/problems/${slug}`)
  return data.data;
}

export const getSubmissions : QueryFunction<SubmissionDoc[]> = async function ({ queryKey: [, problemId, userId] }) {
  const { data } = await axios.get<ApiSuccessResponse<SubmissionDoc[]>>(`api/v1/submissions?problem=${problemId}&user=${userId}`)
  return data.data;
}

export const getSubmission : QueryFunction<SubmissionDoc> = async function ({ queryKey: [, submissionId] }) {
  const { data } = await axios.get<ApiSuccessResponse<SubmissionDoc>>(`api/v1/submissions/${submissionId}`)
  return data.data;
}

export const getEditorial : QueryFunction<Comment> = async function({ queryKey: [, slug] }) {
  const { data } = await axios.get<ApiSuccessResponse<{editorial: Comment}>>(`api/v1/problems/${slug}/editorial`)
  return data.data.editorial;
}

export const getDefaultConfigurations: QueryFunction<TagWithConfig[]> = async function ({ queryKey: [, slug] }) {
  const { data } = await axios.get<ApiSuccessResponse<{ languageConfigurations: TagWithConfig[] }>>(`api/v1/problems/${slug}/defaultConfigurations`)
  return data.data.languageConfigurations;
}

export const runCode: MutationFunction<Submission[], RunVarType> = async function(variables) {
  const { data } =  await axios.post<ApiSuccessResponse<{ submissions: Submission[]}>>(`api/v1/submissions/run`, {
    ...variables
  })
  
  return data.data.submissions
}

export const submitCode: MutationFunction<SubmissionDoc, SubmitVarType> = async function(variables) {
  const { data } =  await axios.post<ApiSuccessResponse<{ submission: SubmissionDoc}>>(`api/v1/submissions/submit`, {
    ...variables
  })
  
  return data.data.submission
}