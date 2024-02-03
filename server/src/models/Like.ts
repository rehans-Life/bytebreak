import { HydratedDocument, Schema, Types, model } from 'mongoose'
import Comment from './Comment'
import AppError from '../utils/appError'

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

LikeSchema.post('save', async function (doc, next) {
  try {
    const comment = await Comment.findById(doc.comment)

    if (!comment) {
      throw new AppError(
        'There is no comment corresponding to the submission',
        404,
      )
    }

    comment.likes += 1
    comment.save()

    next()
  } catch (err) {
    next(
      new AppError(
        err instanceof Error && err?.message
          ? err.message
          : 'An error occured while liking the comment please try again',
        500,
      ),
    )
  }
})

LikeSchema.post(/delete/i, async function (doc: HydratedDocument<ILike>, next) {
  try {
    const comment = await Comment.findById(doc)

    if (!comment) {
      throw new AppError(
        'There is question corresponding to the submission',
        404,
      )
    }

    comment.likes -= 1
    comment.save()

    next()
  } catch (err) {
    next(
      new AppError(
        err instanceof Error && err?.message
          ? err.message
          : 'An error occured while unliking the comment please try again',
        500,
      ),
    )
  }
})

export default model<ILike>('Like', LikeSchema)
