import { Schema, Types, model } from 'mongoose'

interface ISolution {
  title: string
  explanation: string
  tags: Types.ObjectId[]
  user: Types.ObjectId
  question: Types.ObjectId
  likes: number
  comments: number
  views: number
  editorial: boolean
}

const SolutionSchema = new Schema<ISolution>(
  {
    title: { type: String, required: [true, 'Solution must have a titlr'] },
    explanation: {
      type: String,
      required: [true, 'Solution must have an explanation'],
    },
    tags: { type: [Schema.Types.ObjectId] },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Solution must be written by a user'],
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: [true, 'Solution must be written for a question'],
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    editorial: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

export default model<ISolution>('Solution', SolutionSchema)
