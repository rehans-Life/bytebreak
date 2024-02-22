import { MutationFunction, QueryFunction } from "@tanstack/react-query";
import { Problem } from "../app/create-problem/interfaces";
import { ApiSuccessResponse, RunVarType, Comment, Submission, SubmissionDoc, TagWithConfig, SubmitVarType, Like, ProblemStatus } from "../app/interfaces";
import axios from './axios'

export const getProblem : QueryFunction<Problem> = async function ({ queryKey: [, slug] }) {
  const { data } = await axios.get<ApiSuccessResponse<Problem>>(`api/v1/problems/${slug}`)
  return data.data;
}

export const getSubmissions : QueryFunction<SubmissionDoc[]> = async function ({ queryKey: [, problemId, userId] }) {
  const { data } = await axios.get<ApiSuccessResponse<SubmissionDoc[]>>(`api/v1/submissions?problem=${problemId}&user=${userId}&fields=_id,status,createdAt,language,runtime,memory`)
  return data.data;
}

export const getSubmission : QueryFunction<SubmissionDoc> = async function ({ queryKey: [, submissionId] }) {
  const { data } = await axios.get<ApiSuccessResponse<SubmissionDoc>>(`api/v1/submissions/${submissionId}`)
  return data.data;
}

export const getSubmissionStatus : QueryFunction<ProblemStatus> = async function ({ queryKey: [, problemId] }) {
  const { data } = await axios.get<ApiSuccessResponse<{ status: ProblemStatus }>>(`api/v1/problems/${problemId}/submissions/submission-status`)
  return data.data.status;
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

export const getLike: QueryFunction<Like> = async function({ queryKey: [resource, id] }) {
  const { data } = await axios.get<ApiSuccessResponse<Like>>(`api/v1/${resource}/${id}/like`)
  return data.data;
}


export const getStatuses: QueryFunction<string[]> = async function(_) {
  const { data } = await axios.get<ApiSuccessResponse<{ statuses: string[] }>>(`api/v1/general/statuses`)
  return data.data.statuses;
}

export const likeDoc: MutationFunction<boolean, { id: string, resource: string }> = async function({id, resource}) {
  await axios.post<ApiSuccessResponse<Like>>(`api/v1/${resource}/${id}/like`)
  return true;
}

export const unlikeDoc: MutationFunction<boolean, { id: string, resource: string }> = async function({id, resource}) {
  await axios.delete<ApiSuccessResponse<Like>>(`api/v1/${resource}/${id}/like`)
  return true;
}