import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useExecutionStore = create((set) => ({
  isExecuting: false,
  submission: null,
  results: null, // for runCode output

  runCode: async (source_code, language_id, stdin, expected_outputs, problemId) => {
    try {
      set({ isExecuting: true, results: null });
      const response = await axiosInstance.post("/execute-code/runCode", {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId
      });
      set({ results: response.data.results });
      toast.success(response.data.message || "Code run successfully");
      return response.data;
    } catch (error) {
      console.log("Error running code", error);
      toast.error("Error running code");
      return { success: false, message: error.message };
    } finally {
      set({ isExecuting: false });
    }
  },

  submitCode: async (source_code, language_id, stdin, expected_outputs, problemId) => {
    try {
      set({ isExecuting: true, submission: null });
      const response = await axiosInstance.post("/execute-code/submitCode", {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId,
      });
      set({ submission: response.data.submission });
      toast.success(response.data.message || "Code submitted successfully");
    } catch (error) {
      console.log("Error submitting code", error);
      toast.error("Error submitting code");
    } finally {
      set({ isExecuting: false });
    }
  }
}));
