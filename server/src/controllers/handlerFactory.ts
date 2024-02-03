import { RequestHandler } from 'express'
import { Model } from 'mongoose'
import catchAsync from '../utils/catchAsync'
import AppError from '../utils/appError'
import ApiFeatures from '../utils/apiFeatures'

type FactoryHandler = (model: Model<any>) => RequestHandler

export const createOne: FactoryHandler = (model) =>
  catchAsync(async (req, res, _) => {
    const doc = await model.create(req.body)
    return res.status(200).json({
      status: 'success',
      data: doc,
    })
  })

export const getAll: FactoryHandler = (model) =>
  catchAsync(async (req, res, next) => {
    const feautres = new ApiFeatures(model.find(), req.query)
      .paginate()
      .sort()
      .select()
      .filter()

    const docs = await feautres.query

    return res.status(200).json({
      status: 'success',
      data: docs,
    })
  })

export const getOne: FactoryHandler = (model) =>
  catchAsync(async (req, res, _) => {
    const doc = await model.findById(req.params.id)

    if (!doc) throw new AppError('Document not found', 404)

    return res.status(200).json({
      status: 'success',
      data: doc,
    })
  })

export const updateOne: FactoryHandler = (model) =>
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

export const deleteOne: FactoryHandler = (model) =>
  catchAsync(async (req, res, _) => {
    const doc = await model.findOneAndDelete({
      id: req.params.id,
    })

    if (!doc) throw new AppError('Document not found', 404)

    return res.status(204).json({
      status: 'success',
    })
  })
