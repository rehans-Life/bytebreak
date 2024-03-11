import { Router } from 'express'
import {
  getSubmission,
  getSubmissionStatus,
  getSubmissions,
  run,
  submit,
} from '../controllers/submissionController'
import { protect } from '../controllers/authController'
import ApiFeatures from '../utils/apiFeatures'

const router = Router({
  mergeParams: true,
})

router.route('/run').post(run)

router.use(protect)

router.route('/submit').post(submit)
router.get('/submission-status', getSubmissionStatus)

router.route('/').get(ApiFeatures.formatQuery, getSubmissions)

router.route('/:id').get(getSubmission)

export default router
