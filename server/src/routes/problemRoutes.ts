import { Router } from 'express'
import {
  createProblem,
  getProblem,
  getProblems,
} from '../controllers/problemController'
import { protect } from '../controllers/authController'
import multer from 'multer'
import AppError from '../utils/appError'

const storage = multer.memoryStorage()
const upload = multer({
  storage,
  fileFilter(_, file, callback) {
    if (file.mimetype !== 'application/json') {
      callback(new AppError('Only JSON files are accepted', 400))
      return
    }
    callback(null, true)
  },
})

const router = Router()

router
  .route('/')
  .get(getProblems)
  .post(upload.single('testcases'), createProblem)

router.route('/:slug').get(protect, getProblem)

export default router
