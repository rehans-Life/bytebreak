import { Router } from 'express'
import {
  createProblem,
  getProblem,
  getProblems,
  getDefaultConfigurations,
  getEditorial
} from '../controllers/problemController'
import multer from 'multer'
import AppError from '../utils/appError'
import { protect } from '../controllers/authController'

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
  .post(protect, upload.single('testcases'), createProblem)

router.route('/:identifier').get(getProblem);

router.route('/:identifier/defaultConfigurations').get(getDefaultConfigurations);

router.route('/:identifier/editorial').get(getEditorial);

export default router