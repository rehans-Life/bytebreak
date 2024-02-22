import { HydratedDocument } from 'mongoose'
import { IUser } from '../../src/models/User'

declare module 'express-serve-static-core' {
  interface Request {
    user: HydratedDocument<IUser, IUserMethods>
    ref: string
  }
}
