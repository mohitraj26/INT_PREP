import { axiosInstance } from "./axios";

export const getAIReview = async (code) => {
  const response = await axiosInstance.post('/ai/get-review', {
    code
  });
  console.log(response.data);
  return response.data;
};
