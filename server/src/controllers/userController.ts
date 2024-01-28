import { RequestHandler } from 'express'
import catchAsync from '../utils/catchAsync'
import User, { IUser, IUserMethods } from '../models/User'
import { HydratedDocument } from 'mongoose'
import { createOne, deleteOne, getOne, updateOne } from './handlerFactory'

export const getMe: RequestHandler = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id
  next()
})

export const updateMe: RequestHandler = catchAsync(async (req, res, _) => {
  const user = (await User.findById(req.user.id)) as HydratedDocument<
    IUser,
    IUserMethods
  >

  user.username = req.body.username
  user.email = req.body.email

  user.save()

  return res.status(200).json({
    status: 'success',
    data: { user },
  })
})

export const deleteMe: RequestHandler = catchAsync(async (req, res, _) => {
  await User.findByIdAndUpdate(
    {
      id: req.user.id,
    },
    {
      active: false,
    },
  )

  return res.status(204).json({
    status: 'success',
    data: null,
  })
})

export const getUsers: RequestHandler = catchAsync(async (req, res, next) => {
  const users = await User.find()

  return res.status(200).json({
    status: 'success',
    data: { users },
  })
})

export const createUser: RequestHandler = createOne(User)

export const getUser: RequestHandler = getOne(User)

export const updateUser: RequestHandler = updateOne(User)

export const deleteUser: RequestHandler = deleteOne(User)
