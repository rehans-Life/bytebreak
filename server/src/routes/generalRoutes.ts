import { Router } from 'express'
import { getStatuses, getTags } from '../controllers/generalController'

const router = Router()

router.get('/tags', getTags)
router.get("/statuses", getStatuses)

export default router
