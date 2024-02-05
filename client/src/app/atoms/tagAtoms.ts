import { atom } from 'jotai'
import z, { set } from 'zod'

export interface Tag {
  _id: string
  name: string
  slug: string
  category: 'language' | 'topic'
}

export const tagsAtom = atom(
  (get) => [...get(languagesAtom), ...get(topicsAtom)],
  (_, set, tags: Tag[]) => {
    const languageTags: Tag[] = []
    const topicTags: Tag[] = []

    tags.forEach((tag) => {
      if (tag.category === 'language') {
        languageTags.push(tag)
      }
      if (tag.category === 'topic') {
        topicTags.push(tag)
      }
    })

    set(topicsAtom, topicTags)
    set(languagesAtom, languageTags)
  }
)

export const topicsAtom = atom<Tag[]>([])

export const languagesAtom = atom<Tag[]>([])
