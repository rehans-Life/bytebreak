import { Router } from 'express'
import {
  allQuestionsCount,
  getStatuses,
  getTags,
} from '../controllers/generalController'

const router = Router()

router.get('/tags', getTags)
router.get('/statuses', getStatuses)
router.get('/all-questions-count', allQuestionsCount)

export default router
