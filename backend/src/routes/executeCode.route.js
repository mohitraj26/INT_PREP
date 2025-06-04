import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js"
import {  runCode, submitCode } from "../controllers/executeCode.controller.js";

const executionRoute = express.Router()

// executionRoute.post("/", authMiddleware, executeCode);
executionRoute.post("/runCode", authMiddleware, runCode);
executionRoute.post("/submitCode", authMiddleware, submitCode);


export default executionRoute