import { CookieOptions, RequestHandler, Response } from 'express'
import User, { IUser, IUserMethods } from '../models/User'
import jwt from 'jsonwebtoken'
import keys from '../../config/keys'
import { HydratedDocument } from 'mongoose'
import catchAsync from '../utils/catchAsync'
import AppError from '../utils/appError'

const verifyToken = (token: string) => jwt.verify(token, keys.JWT_SECRET_KEY)

const signToken = (id: string) => {
  return jwt.sign({ id }, keys.JWT_SECRET_KEY, {
    expiresIn: '1s',
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

export const protect: RequestHandler = catchAsync(async (req, _, next) => {
  if (
    (!req.headers['authorization'] ||
      !req.headers['authorization'].toString().startsWith('Bearer')) &&
    !req.cookies.jwt
  ) {
    throw new AppError("Authorization Token doesn't exist", 404)
  }

  const token =
    req.cookies.jwt || req.headers['authorization']!.toString().split(' ')[1]

  if (token === 'LOGGED OUT') {
    throw new AppError(
      'You have been logged out please log in again to recieve a new token',
      401,
    )
  }

  const { id } = verifyToken(token) as { id: string }

  const user = await User.findById(id)

  if (!user) {
    throw new AppError('No user exists corresponding to the given token')
  }

  req.user = user

  next()
})

export const signup: RequestHandler = catchAsync(async (req, res, next) => {
  delete req.body.role
  // delete req.body.active
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

export const logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'LOGGED OUT', {
    expires: new Date(Date.now() + 1000),
  })

  return res.status(200).json({
    status: 'success',
  })
})
