import { Router } from 'express'
import {
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
} from '../controllers/userController'
import { getOne } from '../controllers/handlerFactory'
import User from '../models/User'
import multer from 'multer'
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

router.use(protect)

router.route('/me').get(getMe, getOne(User)).patch(updateMe).delete(deleteMe)

router.use(restrictTo('admin'))

router.route('/').get(getUsers).post(createUser)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

export default router
