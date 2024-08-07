import z from 'zod'
import { RequestHandler, Response, Request, NextFunction } from 'express'

export const applyType = <T>(
  schema: z.Schema<T>,
  handler: (
    req: Request<any, any, T, any>,
    res: Response,
    next: NextFunction,
  ) => Promise<any>,
): RequestHandler<any, any, T, any> => {
  return async (req, res, next) => {
    try {
      schema.parse(req.body)
      await handler(req, res, next)
    } catch (error) {
      return next(error)
    }
  }
}
