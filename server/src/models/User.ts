import { Model, Schema, model } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

export interface IUser {
  username: string
  email: string
  password: string
  role: 'admin' | 'user'
  confirmPassword: undefined
}

export interface IUserMethods {
  correctPassword: (a: string, b: string) => Promise<boolean>
}

type UserModel = Model<IUser, {}, IUserMethods>

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Username is required for creating an account'],
      minlength: [2, 'Username should be of atleast two characters'],
      maxlength: [30, 'Username should not be of more than 30 characters'],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, 'Please provide a valid email for creating an account'],
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: 'Please provide a valid email for creating an account',
      },
    },
    role: {
      type: String,
      enum: { values: ['admin', 'user'], message: '{VALUE} role doesnt exist' },
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password should be of atleast 8 characters'],
    },
    confirmPassword: {
      type: String,
      required: [true, 'Please provide the confirm password'],
      validate: {
        validator: function (val: string) {
          return val === (this as any).password
        },
        message: 'Passwords do not match',
      },
    },
  },
  {
    timestamps: true,
  },
)

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return

  this.confirmPassword = undefined
  this.password = await bcrypt.hash(this.password, 12)

  next()
})

UserSchema.methods.correctPassword = async function (
  candidatePassword: string,
  currentPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, currentPassword)
}

export default model<IUser, UserModel>('User', UserSchema)
