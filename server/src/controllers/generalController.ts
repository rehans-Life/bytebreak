import { RequestHandler } from 'express'
import Tour from '../models/Tag'
import { getAll } from './handlerFactory'
import catchAsync from '../utils/catchAsync'
import Like from '../models/Like'
import mongoose, { HydratedDocument } from 'mongoose'
import capitalize from 'capitalize'
import AppError from '../utils/appError'
import { statuses } from '../models/Submission'
import Problem from '../models/Problem'

export const getTags: RequestHandler = getAll(Tour)

export const getStatuses: RequestHandler = catchAsync(async (_, res) => {
  return res.status(200).json({
    status: 'success',
    data: {
      statuses,
    },
  })
})

export const setRef: (name: string) => RequestHandler =
  (name) => (req, res, next) => {
    req.ref = name
    next()
  }

export const allQuestionsCount: RequestHandler = catchAsync(
  async (req, res, next) => {
    const [problemsCount] = await Problem.aggregate([
      {
        $group: {
          _id: '',
          total: { $count: {} },
          easy: {
            $sum: {
              $cond: {
                if: { $eq: ['$difficulty', 'easy'] },
                then: 1,
                else: 0,
              },
            },
          },
          medium: {
            $sum: {
              $cond: {
                if: { $eq: ['$difficulty', 'medium'] },
                then: 1,
                else: 0,
              },
            },
          },
          hard: {
            $sum: {
              $cond: {
                if: { $eq: ['$difficulty', 'hard'] },
                then: 1,
                else: 0,
              },
            },
          },
        },
      },
      {
        $project: { _id: 0 },
      },
    ])

    return res.status(200).json({
      status: 'success',
      data: {
        problemsCount,
      },
    })
  },
)

export const getParent = async function (
  ref: string,
  id: string,
): Promise<HydratedDocument<any, any>> {
  const parentDoc: HydratedDocument<any, any> = await mongoose
    .model(capitalize(ref))
    .findById(id)

  if (!parentDoc) {
    throw new AppError('There is no parent corresponding to the like', 404)
  }
  return parentDoc
}

export const getLike: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id

  const like = await Like.findOne({
    parent: id,
    user: req.user._id,
  })

  if (!like) throw new AppError("User hasn't liked the document yet", 404)

  return res.status(200).json({
    status: 'success',
    data: like,
  })
})

export const createLike: RequestHandler = catchAsync(async (req, res) => {
  console.log(req.url)
  const id = req.params.id

  const parent = await getParent(req.ref, id)

  const like = await Like.create({
    parent: id,
    user: req.user._id,
    ref: req.ref,
  })

  const oldLikes = parent.likes || 0

  try {
    parent.likes += 1
    await parent.save()
  } catch (err) {
    await Like.deleteOne({
      _id: like._id,
    })

    parent.likes = oldLikes
    await parent.save({
      validateModifiedOnly: true,
    })

    throw err
  }

  return res.status(201).json({
    status: 'success',
    data: like,
  })
})

export const deleteLike: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id

  const like = await Like.findOne({
    parent: id,
    user: req.user._id,
  })

  if (!like) {
    throw new AppError('Invalid like info', 404)
  }

  const parent = await getParent(like.ref, id)

  parent.likes -= 1
  await parent.save({
    validateModifiedOnly: true,
  })

  try {
    await Like.deleteOne({
      _id: like._id,
    })
  } catch (err) {
    parent.likes += 1
    await parent.save({
      validateModifiedOnly: true,
    })
    throw err
  }

  res.status(204).json({
    status: 'success',
    data: null,
  })
})
