import { Router } from 'express'
import {
  createProblem,
  getProblem,
  getProblems,
  getDefaultConfigurations,
  getEditorial,
  parseTagsField
} from '../controllers/problemController'
import multer from 'multer'
import AppError from '../utils/appError'
import { protect, setUser } from '../controllers/authController'
import { setRef } from '../controllers/generalController'
import likeRoutes from './likeRoutes'
import submissionRoutes from './submissionRoutes';
import ApiFeatures from '../utils/apiFeatures'

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
.get(setUser, ApiFeatures.formatQuery, parseTagsField, getProblems)
.post(protect, upload.single('testcases'), createProblem)

router.route('/:identifier').get(getProblem);

router.route('/:identifier/defaultConfigurations').get(getDefaultConfigurations);

router.route('/:identifier/editorial').get(getEditorial);

router.use("/:id/submissions", submissionRoutes);

router.use(setRef("problem"));

router.use("/:id", likeRoutes);

export default router
