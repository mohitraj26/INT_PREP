import { db } from "../libs/db.js";

export const getAllSubmissions = async(req , res)=>{
    try {
        const userId = req.user.id;

        const submissions = await db.submission.findMany({
            where:{
                userId: userId
            }
        })

        res.status(200).json({
            sucess: true,
            message: "Submissions Fetched Successfully",
            submissions
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Error While Fetching Submissions"
        });
    }
}

export const getSubmissionForProblem = async(req , res)=>{
    try {
        const userId = req.user.id;
        const problemId = req.params.problemId;
        const submissions = await db.submission.findMany({
            where:{
                userId: userId,
                problemId: problemId
            }
        })

        res.status(200).json({
            sucess: true,
            message: "Submissions Fetched Successfully",
            submissions
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Error While Fetching Submissions"
        });
    }
}

export const getAllTheSubmissionsForProblem = async(req , res)=>{
    try {
        const problemId = req.params.problemId;
        const submission = await db.submission.count({
            where:{
                problemId: problemId
            }
        })

        res.status(200).json({
            sucess: true,
            message: "Submissions Fetched Successfully",
            count: submission
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Error While Fetching Submissions"
        });
    }

}