import { Response, Request, NextFunction } from 'express'
import keys from '../../config/keys'
import AppError from '../utils/appError'
import { MongoServerError } from 'mongodb'
import { CastError, MongooseError } from 'mongoose'
import { ZodError } from 'zod'

class MongooseCastError implements CastError {
  model?: any
  reason?: NativeError | null | undefined
  stack?: string | undefined
  value: any

  constructor(
    public kind: string,
    public message: string,
    public name: 'CastError',
    public path: string,
    public stringValue: string,
  ) {}
}

function handleValidationError(error: MongooseError) {
  const errorMsg = `${Object.values((error as any).errors).reduce((acc: string, curr: any) => (!acc.length ? curr.message : `${acc}, ${curr.message}`), '')}.`

  return new AppError(errorMsg, 400)
}

function handleDuplicateKeyError(error: Error) {
  const field = error.message.match(/(?<=\{\s).*(?=:)/)?.[0]
  const value = error.message
    .match(new RegExp('(?<=' + field + ':)((.|d)*)(?=})'))?.[0]
    .trim()
  return new AppError(
    `There already exists a ${field} with value: ${value}`,
    400,
  )
}

function buildCastError(error: CastError) {
  return new AppError(
    `Field ${error.path} cannot be of type ${error.kind}`,
    400,
  )
}

function handleExipredTokenError() {
  return new AppError(
    `Authorization token is expired, please login again to recieve a new one`,
  )
}

function handleJWTMalformedError() {
  return new AppError(
    `Invaid Authorization token, please login again to recieve a new one`,
    400,
  )
}

function handleZodError(error: ZodError) {
  return new AppError(
    error.errors.reduce((acc, curr) => {
      const message = `${curr.path[curr.path.length - 1]}: ${curr.message};`
      return `${acc} ${message}`
    }, ''),
    400,
  )
}

function handleDevError(
  appError: AppError,
  error: Error,
  _: Request,
  res: Response,
) {
  return res.status(appError.statusCode).json({
    status: appError.status,
    error,
    message: appError.message,
    stack: appError.stack,
  })
}

function handleProdError(error: AppError, _: Request, res: Response) {
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    })
  }

  return res.status(error.statusCode).json({
    status: 'error',
    message: 'Something went wrong please try again later',
  })
}

export default (error: Error, req: Request, res: Response, _: NextFunction) => {
  console.log(error.name)
  console.log(error.message)
  console.log(error.stack)

  let appError =
    error instanceof AppError ? error : new AppError(error.message, 500, false)

  if (keys.NODE_ENV === 'Development') {
    return handleDevError(appError, error, req, res)
  }

  if (error instanceof MongooseCastError && error.name === 'CastError')
    appError = buildCastError(error)
  if (error.name === 'ValidationError') appError = handleValidationError(error)
  if ('code' in error && error.code === 11000)
    appError = handleDuplicateKeyError(error)
  if (error.name === 'JsonWebTokenError') appError = handleJWTMalformedError()
  if (error.name === 'TokenExpiredError') appError = handleExipredTokenError()
  if (error instanceof ZodError) appError = handleZodError(error)

  handleProdError(appError, req, res)
}
