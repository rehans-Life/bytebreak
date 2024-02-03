import axios from 'axios'
import { atom } from 'jotai'
import { atomWithQuery } from 'jotai-tanstack-query'
import { Option } from '../components/select'
import { UndefinedInitialDataOptions } from '@tanstack/react-query'

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
      const res = await axios.get<Tag[]>('/api/v1/general/tags')
      console.log(res)
      return res.data
    },
  })
)

export const languagesAtom = atom<Option<string>[]>((get) => {
  return get(tagsAtom)
})
