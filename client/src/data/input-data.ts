import { Option } from '@/app/components/select'
import { Header } from '@/app/components/table'

export const difficulties: Option<string>[] = [
  {
    value: 'easy',
    label: 'Easy',
    color: 'rgb(0, 184, 163)',
  },
  {
    value: 'medium',
    label: 'Medium',
    color: 'rgb(255 161 22)',
  },
  {
    value: 'hard',
    label: 'Hard',
    color: 'rgb(255 55 95)',
  },
]

export const headers: Header[] = [
  {
    label: 'Status',
    name: 'status',
    width: 60,
  },
  {
    label: 'Name',
    name: 'name',
    width: 250,
  },
  {
    label: 'Accceptance',
    name: 'accceptanceRate',
    width: 100,
  },
  {
    label: 'Difficulty',
    name: 'name',
    width: 100,
  },
  {
    label: 'Likes',
    name: 'likes',
    width: 100,
  },
]

export const perPages: Option<number>[] = [
  {
    label: '5 / page',
    value: 5,
  },
  {
    label: '10 / page',
    value: 10,
  },
  {
    label: '15 / page',
    value: 15,
  },
]

export const statuses: Option<string>[] = [
  {
    label: 'Solved',
    value: 'solved',
  },
  {
    label: 'Attempted',
    value: 'attempted',
  },
  {
    label: 'Todo',
    value: 'todo',
  },
]
