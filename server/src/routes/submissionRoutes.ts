import { Router } from "express";
import { getSubmission, getSubmissions, run, submit } from "../controllers/submissionController";
import { protect } from "../controllers/authController";

const router = Router();

router.use(protect);

router.route("/run").post(run);
router.route("/submit").post(submit);

router.route("/").get(getSubmissions)

router.route("/:id").get(getSubmission)

export default router;