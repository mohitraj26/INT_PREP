import { db } from "../libs/db.js";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";

export const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    companyTag,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  // going to check the user role once again

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      // console.log("languageId", languageId);

      if (!languageId) {
        return res
          .status(400)
          .json({ error: `Language ${language} is not supported` });
      }

      //
      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);


      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        // console.log("Result-----", result);
        // console.log(
        //   `Testcase ${i + 1} and Language ${language} ----- result ${JSON.stringify(result.status.description)}`
        // );
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }

    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        companyTag,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
        userId: req.user.id,
      },
    });

    return res.status(201).json({
      sucess: true,
      message: "Problem Created Successfully",
      problem: newProblem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Creating Problem",
    });
  }
};

export const getAllProblems = async(req , res)=>{
    try {
      const problem = await db.problem.findMany({
        include: {
          solvedBy:{
            where: {
              userId: req.user.id
            }
          }
        },
      });

      if(!problem){
        return res.status(404).json({
            error:"No problems found"
        })
      }

      res.status(200).json({
        sucess: true,
        message: "Message Fetched Successfully",
        problems: problem
      })
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Error While Fetching Problems",
      });
    }
}

export const getProblemById = async(req , res)=>{
    const {id} = req.params;

    try {
      const problem = await db.problem.findUnique({
        where:{
          id
        }
      })

      if(!problem){
        return res.status(404).json({
            error:"Problem not found"
        })
      }

      res.status(200).json({
        sucess: true,
        message: "Problems Fetched Successfully",
        problem
      })
    } catch (error) {
      res.status(500).json({
        error: "Error While Fetching Problem by id",
      })
    }
}

export const updateProblem = async(req , res)=>{
  const {
    title,
    description,
    difficulty,
    companyTag,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  const {id} = req.params

  // going to check the user role once again

  try {
    const exisitingProblem = await db.problem.findUnique({
      where:{
        id
      }
    })

    if(!exisitingProblem){
      return res.status(404).json({
          error:"Problem not found"
      })
    }

    if(exisitingProblem.userId !== req.user.id && req.user.role !== "ADMIN"){
      return res.status(403).json({
        error:"You are not authorized to update this problem"
      })
    }

    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      // console.log("languageId", languageId);

      if (!languageId) {
        return res
          .status(400)
          .json({ error: `Language ${language} is not supported` });
      }

      
      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        // console.log("Result-----", result);
        // console.log(
        //   `Testcase ${i + 1} and Language ${language} ----- result ${JSON.stringify(result.status.description)}`
        // );
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }

    const updatedProblem = await db.problem.update({
      where: {
        id
      },
      data: {
        title,
        description,
        difficulty,
        companyTag,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
        userId: req.user.id,
      },
    });

    return res.status(200).json({
      sucess: true,
      message: "Problem Updated Successfully",
      problem: updatedProblem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Updating Problem",
    });
  }
}

export const deleteProblem = async(req , res)=>{
    const {id} = req.params
    try {
      const problem = await db.problem.findUnique({
        where:{
          id
        }
      })

      if(!problem){
        return res.status(404).json({
            error:"Problem not found"
        })
      }

      if(problem.userId !== req.user.id && req.user.role !== "ADMIN"){
        return res.status(403).json({
          error:"You are not authorized to delete this problem"
        })
      }

      await db.problem.delete({
        where:{
          id
        }
      })

      return res.status(200).json({
        sucess: true,
        message: "Problem Deleted Successfully",
      })
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "Error While Deleting Problem",
      })
    }

}

export const getSolvedProblemsByUsers = async(req , res)=>{
    try {
      const problems = await db.problem.findMany({
        where:{
          solvedBy:{
            some:{
              userId: req.user.id
            }
          }
        },
        include:{
          solvedBy:{
            where:{
              userId : req.user.id
            }
          }
        }
      })

      res.status(200).json({
        success:true,
        message:"Solved Problems Fetched Successfully",
        problems
      })
    } catch (error) {
      console.log("Error While Fetching Solved Problems", error);
      res.status(500).json({
        error:"Error While Fetching Solved Problems"  
      })
    }
}

