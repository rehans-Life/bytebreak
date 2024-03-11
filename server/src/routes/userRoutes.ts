import multer from 'multer'
import { Router } from 'express'

import {
  getGoogleUser,
  createGoogleUser,
  login,
  logout,
  protect,
  restrictTo,
  signup,
} from '../controllers/authController'
import {
  createUser,
  deleteMe,
  deleteUser,
  getMe,
  getUser,
  getUsers,
  updateMe,
  updateUser,
  userCalender,
  userInfo,
  userSubmissionsCount,
} from '../controllers/userController'
import { getOne } from '../controllers/handlerFactory'
import User from '../models/User'
import {
  filterImage,
  resizeUserImage,
  uploadPhoto,
} from '../controllers/uploadController'

const storage = multer.memoryStorage()
const upload = multer({
  storage,
  fileFilter: filterImage,
})

const router = Router()

router.post('/login', login)
router.post('/signup', signup)
router.post('/upload', upload.single('avatar'), resizeUserImage, uploadPhoto)
router.post('/logout', logout)

router.route('/google/:id').get(getGoogleUser)
router.route('/google').post(createGoogleUser)

router.route('/user-calender/:username').get(userCalender)
router.route('/user-submissions-count/:username').get(userSubmissionsCount)
router.route('/user-info/:username').get(userInfo)

router.use(protect)

router.route('/me').get(getMe, getOne(User)).patch(updateMe).delete(deleteMe)

router.use(restrictTo('admin'))

router.route('/').get(getUsers).post(createUser)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

export default router
