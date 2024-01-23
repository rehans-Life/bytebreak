import { Schema, Types, model } from 'mongoose'
import Question from './Question'

export interface IComment {
  parentId: Types.ObjectId
  user: Types.ObjectId
  title?: string
  text: string
  tags?: Types.ObjectId[]
  likes: number
  comments: number
  views: number
}

const CommentSchema = new Schema<IComment>(
  {
    parentId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Their must be a parent associated with the comment'],
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'The comment must be written by a user'],
    },
    title: {
      type: String,
      validate: {
        validator: async function (value: string): Promise<boolean> {
          const parent = await Question.findById((this as any).parentId)

          // If the is a solution to the question then it must have a title
          if (parent && !value && !value.length) return false
          else return true
        },
        message: 'Title is required for a solution',
      },
    },
    text: {
      type: String,
      required: [true, 'The comment must have some text'],
    },
    tags: {
      type: [Schema.Types.ObjectId],
      ref: 'Tag',
      default: [],
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

export default model<IComment>('Comment', CommentSchema)
