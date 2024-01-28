import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import keys from '../config/keys'
import AppError from './utils/appError'

import userRoutes from './routes/userRoutes'
import errorController from './controllers/errorController'

const app = express()

app.use(cors())
app.use(express.json())
app.use(helmet())
app.use(cookieParser())

if (keys.NODE_ENV === 'Development') {
  app.use(morgan('dev'))
}

app.use('/api/v1/users', userRoutes)

app.use('*', (req, res, next) => {
  return next(new AppError(`Route ${req.path} not found on the server`, 404))
})

app.use(errorController)

export default app
