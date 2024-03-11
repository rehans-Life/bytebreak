import { CookieOptions, Request, RequestHandler, Response } from 'express'
import User, { IUser, IUserMethods } from '../models/User'
import jwt from 'jsonwebtoken'
import keys from '../../config/keys'
import { HydratedDocument } from 'mongoose'
import catchAsync from '../utils/catchAsync'
import AppError from '../utils/appError'

const verifyToken = (token: string) => jwt.verify(token, keys.JWT_SECRET_KEY)

const signToken = (id: string) => {
  return jwt.sign({ id }, keys.JWT_SECRET_KEY, {
    expiresIn: keys.JWT_EXPIRES_IN,
  })
}

const createSendToken = (
  user: HydratedDocument<IUser, IUserMethods>,
  statusCode: number,
  res: Response,
) => {
  const token = signToken(user.id)

  const cookieOptions: CookieOptions = {
    maxAge:
      Date.now() + parseInt(keys.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }

  res.cookie('jwt', token, cookieOptions)

  const userObj = user.toJSON()

  delete userObj.password

  return res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: userObj,
    },
  })
}

export const restrictTo =
  (...roles: string[]): RequestHandler =>
  (req, _, next) => {
    if (roles.some((role) => req.user.role === role)) return next()
    next(new AppError('Unauthorized User', 401))
  }

const extractToken: (req: Request) => string | undefined = (req: Request) =>
  req.cookies.jwt || req.headers['authorization']?.toString().split(' ')[1]

export const setUser: RequestHandler = catchAsync(async (req, _, next) => {
  const token = extractToken(req)

  if (!token) return next()

  try {
    const { id } = verifyToken(token) as { id: string }
    const user = await User.findById(id)
    if (!user) return next()

    req.user = user

    next()
  } catch (err) {
    return next()
  }
})

export const protect: RequestHandler = catchAsync(async (req, _, next) => {
  if (
    (!req.headers['authorization'] ||
      !req.headers['authorization'].toString().startsWith('Bearer')) &&
    !req.cookies.jwt
  ) {
    throw new AppError("Authorization Token doesn't exist", 404)
  }

  const token = extractToken(req)!

  if (token === 'LOGGED OUT') {
    throw new AppError(
      'You have been logged out please log in again to recieve a new token',
      401,
    )
  }

  const { id } = verifyToken(token) as { id: string }

  const user = await User.findById(id)

  if (!user) {
    throw new AppError('No user exists corresponding to the given token', 404)
  }

  req.user = user

  next()
})

export const signup: RequestHandler = catchAsync(async (req, res, next) => {
  delete req.body.role
  delete req.body.active

  const reg = new RegExp(/[^_a-z1-9-]/gi)

  if (req.body.username?.match(reg)) {
    throw new AppError(
      'The username must contain only letters, numbers, hyphens and underscores',
      401,
    )
  }

  const user = await User.create(req.body)
  createSendToken(user, 201, res)
})

export const login: RequestHandler = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new AppError(
      'Please provide a valid email and password to log in',
      400,
    )
  }

  const user = await User.findOne({
    email,
  })

  const correctPassword = user?.correctPassword(password, user.password!)

  if (!user || !correctPassword) {
    throw new AppError('Invalid Credentials', 400)
  }

  createSendToken(user, 202, res)
})

export const getGoogleUser: RequestHandler = catchAsync(
  async (req, res, next) => {
    const userId = req.params.id

    if (!userId) throw new AppError('Please provide a user id', 404)

    const user = await User.findOne({ userId: { $exists: true, $eq: userId } })

    if (!user) throw new AppError('No User found', 404)

    createSendToken(user, 202, res)
  },
)

export const createGoogleUser: RequestHandler = catchAsync(
  async (req, res, next) => {
    const { userId, email, username, photo } = req.body
    const user = await User.create({
      userId,
      username,
      email,
      photo,
      password: userId,
      confirmPassword: userId,
    })
    createSendToken(user, 201, res)
  },
)

export const logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'LOGGED OUT', {
    expires: new Date(Date.now() + 1000),
  })

  return res.status(200).json({
    status: 'success',
  })
})
