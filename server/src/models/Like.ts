import { HydratedDocument, Schema, Types, model } from 'mongoose'
import Comment from './Comment'

export interface ILike {
  comment: Types.ObjectId
  user: Types.ObjectId
}

const LikeSchema = new Schema<ILike>(
  {
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
)

LikeSchema.pre('save', async function (next) {
  try {
    const comment = await Comment.findById(this.comment)

    if (!comment) {
      throw new Error('There is question corresponding to the submission')
    }

    comment.likes += 1
    comment.save()

    next()
  } catch (err) {
    next(
      new Error(
        err instanceof Error && err?.message
          ? err.message
          : 'An error occured while liking the comment please try again',
      ),
    )
  }
})

LikeSchema.post(/delete/i, async function (doc: HydratedDocument<ILike>, next) {
  try {
    const comment = await Comment.findById(doc)

    if (!comment) {
      throw new Error('There is question corresponding to the submission')
    }

    comment.likes -= 1
    comment.save()

    next()
  } catch (err) {
    next(
      new Error(
        err instanceof Error && err?.message
          ? err.message
          : 'An error occured while unliking the comment please try again',
      ),
    )
  }
})

export default model<ILike>('Like', LikeSchema)
