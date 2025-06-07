import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import executionRoute from "./routes/executeCode.route.js";
import submissionRoutes from "./routes/submission.route.js";
import playlistRoutes from "./routes/playlist.route.js";

dotenv.config();
const app = express();

app.use(cors({
    origin: "https://int-prep.onrender.com",
    credentials: true
}))

app. use(express.json());
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send("Hello guys welcome to leetlab 🔥");
})

app.use("/api/v1/auth" , authRoutes);
app.use("/api/v1/problem", problemRoutes);
app.use("/api/v1/execute-code", executionRoute);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist" , playlistRoutes);

app.listen(process.env.PORT,()=>{
    console.log("Server is running on port 8080");
})