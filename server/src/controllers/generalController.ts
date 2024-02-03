import { RequestHandler } from 'express'
import Tour from '../models/Tag'
import { getAll } from './handlerFactory'

export const getTags: RequestHandler = getAll(Tour)
