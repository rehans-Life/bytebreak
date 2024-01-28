import { RequestHandler } from 'express'
import { Model } from 'mongoose'
import catchAsync from '../utils/catchAsync'
import AppError from '../utils/appError'

export const createOne: (model: Model<any>) => RequestHandler = (model) =>
  catchAsync(async (req, res, _) => {
    const doc = await model.create(req.body)
    return res.status(200).json({
      status: 'success',
      data: doc,
    })
  })

export const getOne: (model: Model<any>) => RequestHandler = (model) =>
  catchAsync(async (req, res, _) => {
    const doc = await model.findById(req.params.id)

    if (!doc) throw new AppError('Document not found', 404)

    return res.status(200).json({
      status: 'success',
      data: doc,
    })
  })

export const updateOne: (model: Model<any>) => RequestHandler = (model) =>
  catchAsync(async (req, res, _) => {
    const doc = await model.findByIdAndUpdate(
      {
        id: req.params.id,
      },
      req.body,
    )

    if (!doc) throw new AppError('Document not found', 404)

    return res.status(200).json({
      status: 'success',
      data: doc,
    })
  })

export const deleteOne: (model: Model<any>) => RequestHandler = (model) =>
  catchAsync(async (req, res, _) => {
    const doc = await model.findOneAndDelete({
      id: req.params.id,
    })

    if (!doc) throw new AppError('Document not found', 404)

    return res.status(204).json({
      status: 'success',
    })
  })
