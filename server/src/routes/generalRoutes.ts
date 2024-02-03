import { Router } from 'express'
import { getTags } from '../controllers/generalController'

const router = Router()

router.get('/tags', getTags)

export default router
