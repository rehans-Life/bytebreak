import axios from 'axios'
import { atom } from 'jotai'
import { atomWithQuery } from 'jotai-tanstack-query'
import { Option } from '../components/select'
import { UndefinedInitialDataOptions } from '@tanstack/react-query'

export interface ApiErrorResponse {
  status: 'error' | 'fail',
  message: string,
  stack?: string,
  error?: any,
}

export interface ApiSuccessResponse<ST> {
  status: 'success',
  data: ST
}

export interface Tag {
  id: string
  name: string
  slug: string
  category: 'language' | 'topic'
}

export const tagsAtom = atomWithQuery<Tag[]>(
  (get): UndefinedInitialDataOptions<Tag[]> => ({
    queryKey: ['tags'],
    queryFn: async () => {
      const res = await axios.get<ApiSuccessResponse<Tag[]> | ApiErrorResponse>('/api/v1/general/tags')
      return 'data' in res.data ? res.data?.data : []
    },
  })
)

export const languagesAtom = atom<Option<string>[]>((get) => {
  return get(tagsAtom)
})
