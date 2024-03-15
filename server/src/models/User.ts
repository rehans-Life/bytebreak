import { Model, Schema, model } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

export interface IUser {
  username: string
  email: string
  userId?: string
  password?: string
  active: boolean
  role: 'admin' | 'user'
  photo: string
  confirmPassword: undefined
  createdAt: string
  updatedAt: string
}

export interface IUserMethods {
  correctPassword: (
    candidatePassword: string,
    currentPassword: string,
  ) => Promise<boolean>
}

type UserModel = Model<IUser, object, IUserMethods>

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Username is required for creating an account'],
      minlength: [2, 'Username should be of atleast two characters'],
      maxlength: [30, 'Username should not be of more than 30 characters'],
      validate: {
        validator: (value: string) => {
          return !value.match(/[^_a-z1-9-]/gi)
        },
        message: 'The username must contain only letters, numbers, hyphens and underscores'
      },
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
    userId: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'user'],
        message: "{VALUE} role doesn't exist",
      },
      default: 'user',
    },
    photo: {
      type: String,
      default:
        'https://firebasestorage.googleapis.com/v0/b/tesla-clone-a0f5d.appspot.com/o/avatars%2Fdefault.jpg?alt=media&token=0aa62cc6-2260-4ce6-a595-4ae5f809dad3',
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

UserSchema.index({ userId: 1 }, { unique: true })

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  this.confirmPassword = undefined
  this.password = await bcrypt.hash(this.password ?? '', 12)

  next()
})

UserSchema.methods.correctPassword = async function (
  candidatePassword: string,
  currentPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, currentPassword)
}

export default model<IUser, UserModel>('User', UserSchema)
