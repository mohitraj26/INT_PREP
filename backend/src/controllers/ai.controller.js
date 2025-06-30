import { generateContent } from "../services/ai.services.js";

export const getReview = async (req, res) => {

    const code = req.body.code;
    console.log(code);

    if (!code) {
        return res.status(400).send("Prompt is required");
    }

    const response = await generateContent(code);


    res.send(response);

}