import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getAllSubmissions, getAllTheSubmissionsForProblem, getSubmissionById, getSubmissionCountsByDate, getSubmissionForProblem } from "../controllers/submission.controller.js";

const submissionRoutes = express.Router();

submissionRoutes.get("/get-all-submissions" , authMiddleware, getAllSubmissions);
submissionRoutes.get("/get-submission/:problemId" , authMiddleware, getSubmissionForProblem);
submissionRoutes.get("/get-submissions-count/:problemId" , authMiddleware, getAllTheSubmissionsForProblem);
submissionRoutes.get("/get-submission-by-id/:submissionId" , authMiddleware, getSubmissionById);
submissionRoutes.get("/get-submissions-count-by-date" , authMiddleware, getSubmissionCountsByDate);

export default submissionRoutes;