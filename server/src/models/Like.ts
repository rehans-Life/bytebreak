import mongoose, {
  HydratedDocument,
  Model,
  Schema,
  Types,
  model,
} from 'mongoose'
import AppError from '../utils/appError'

export interface ILike {
  parent: Types.ObjectId
  user: Types.ObjectId
  ref: 'problem' | 'comment'
}

export interface ILikeMethods {
  findParent(): Promise<
    HydratedDocument<{
      [key: string]: any
      likes: number
    }>
  >
}

type ILikeModel = Model<ILike, {}, ILikeMethods>

const LikeSchema = new Schema<ILike, ILikeModel, ILikeMethods>(
  {
    parent: {
      type: Schema.Types.ObjectId,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    ref: {
      type: String,
      enum: ['question', 'comment'],
    },
  },
  {
    timestamps: true,
  },
)

LikeSchema.method('findParent', async function () {
  const parentDoc: HydratedDocument<any, any> = await mongoose
    .model(this.ref)
    .findById(this.parent)

  if (!parentDoc) {
    throw new AppError('There is no parent corresponding to the like', 404)
  }
  return parentDoc
})

LikeSchema.post('save', async function (doc, next) {
  try {
    const parent = await doc.findParent()

    parent.likes += 1
    parent.save()

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

LikeSchema.post(
  /delete/i,
  async function (doc: HydratedDocument<ILike, ILikeMethods>, next) {
    try {
      const parent = await doc.findParent()

      parent.likes -= 1
      parent.save()

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
  },
)

export default model<ILike, ILikeModel>('Like', LikeSchema)
