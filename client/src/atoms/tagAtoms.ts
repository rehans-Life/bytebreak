import { atom } from 'jotai'
import { LanguageTag, Tag, TopicTag } from '../app/interfaces'

export const tagsAtom = atom(
  (get) => [...get(languagesAtom), ...get(topicsAtom)],
  (_, set, tags: (LanguageTag | TopicTag)[]) => {
    const languageTags: LanguageTag[] = []
    const topicTags: TopicTag[] = []

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

export const topicsAtom = atom<TopicTag[]>([])

export const languagesAtom = atom<LanguageTag[]>([])
