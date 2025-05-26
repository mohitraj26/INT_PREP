import { pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

export const executeCode = async(req , res)=>{
    try {
        const {source_code , language_id, stdin , expected_outputs , problemId} = req.body;

        const userId = req.user.id;
        
        // 1 . validate testcases

        if(
            !Array.isArray(stdin) ||
            stdin.length === 0 ||
            !Array.isArray(expected_outputs) ||
            expected_outputs.length === 0
        ){
            return res.status(400).json({
                error:"Invalid testcases"
            })
        }

        // 2.  prepare each testcases for judge0 batch submission 
        const submissions = stdin.map((input)=>({
            source_code,
            language_id,
            stdin:input
        }))

        // 3. send this batch submissions to judge0
        const submitResponse = await submitBatch(submissions);

        const tokens = submitResponse.map((res)=>res.token);

        // 4. poll judge0 for results of all submitted testcases
        const results = await pollBatchResults(tokens);

        console.log("Results:----")
        console.log(results);

        res.status(200).json({
            success:true,
            message:"Code Executed Successfully",
        })

    } catch (error) {
        
    }
}