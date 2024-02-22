import mongoose, {
  HydratedDocument,
  Model,
  Schema,
  Types,
  model,
} from 'mongoose'
import AppError from '../utils/appError'
import capitalize from "capitalize";

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
      enum: ['problem', 'comment'],
    },
  },
  {
    timestamps: true,
  },
)

LikeSchema.index({ parent: 1, user: 1 }, { unique: true });

export default model<ILike, ILikeModel>('Like', LikeSchema)
