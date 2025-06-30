import express from "express"
import { getReview } from "../controllers/ai.controller.js"

const aiRoutes = express.Router()

aiRoutes.post("/get-review", getReview)

export default aiRoutes