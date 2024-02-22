import { Router } from "express";
import { getSubmission, getSubmissionStatus, getSubmissions, run, submit } from "../controllers/submissionController";
import { protect } from "../controllers/authController";

const router = Router({
    mergeParams: true,
});

router.use(protect);

router.route("/run").post(run);
router.route("/submit").post(submit);
router.get("/submission-status", getSubmissionStatus);

router.route("/").get(getSubmissions);

router.route("/:id").get(getSubmission);


export default router;