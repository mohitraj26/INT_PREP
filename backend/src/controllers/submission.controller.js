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

// Get a unique submission by its ID
export const getSubmissionById = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you want to ensure the user owns the submission
    const submissionId = req.params.submissionId;

    const submission = await db.submission.findUnique({
      where: {
        id: submissionId,
        userId: userId, // Optional: Ensures only the owner can fetch their submission
      },
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Submission fetched successfully",
      submission,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error while fetching submission",
    });
  }
};

export const getSubmissionCountsByDate = async (req, res) => {
  try {
    const userId = req.user.id; // Optional: filter by user

    const submissions = await db.submission.groupBy({
      by: ['createdAt'],
      _count: {
        id: true,
      },
      where: {
        userId: userId, // Remove if you want counts for all users
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Format the result to { date: 'YYYY-MM-DD', count: N }
    const values = submissions.map((item) => ({
      date: item.createdAt.toISOString().slice(0, 10), // Get 'YYYY-MM-DD'
      count: item._count.id,
    }));

    res.status(200).json({
      success: true,
      message: "Submission counts fetched successfully",
      values,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error while fetching submission counts by date",
    });
  }
};
