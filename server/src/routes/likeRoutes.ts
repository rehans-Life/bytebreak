import { Router } from 'express'
import { protect } from '../controllers/authController'
import {
  createLike,
  deleteLike,
  getLike,
} from '../controllers/generalController'

const router = Router({
  mergeParams: true,
})

router.use(protect)

router.route('/like').get(getLike).post(createLike).delete(deleteLike)

export default router
