import { Schema, Types, model } from 'mongoose'
import Problem from './Problem'

export interface IComment {
  parentId: Types.ObjectId
  user: Types.ObjectId
  tags?: Types.ObjectId[]
  title?: string
  text: string
  likes: number
  replies: number
  views: number
}

function isInstanceOfComment(obj: any): obj is IComment {
  return 'parentId' in obj && 'user' in obj && 'text' in obj
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
      ref: 'User',
    },
    title: {
      type: String,
      validate: {
        validator: async function (value: string): Promise<boolean> {
          if (!isInstanceOfComment(this)) return false

          const parent = await Problem.findById(this.parentId)

          if (parent && this.user !== parent.user && !value && !value.length)
            return false
          return true
        },
        message: '{PATH} is required for a solution',
      },
    },
    text: {
      type: String,
      required: [true, 'The comment must have some text'],
    },
    tags: {
      type: [Number],
      ref: 'Tag',
      default: [],
    },
    likes: {
      type: Number,
      default: 0,
    },
    replies: {
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
