import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useSubmissionStore = create((set, get) => ({
  isLoading: false,
  submissions: [],
  submission: null,
  submissionCount: null,
  uniqueSubmission: null,
  submissionCounts: [],

  getAllSubmissions: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/submission/get-all-submissions");

      set({ submissions: res.data.submissions });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error getting all submissions", error);
      toast.error("Error getting all submissions");
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionForProblem: async (problemId) => {
    try {
      const res = await axiosInstance.get(
        `/submission/get-submission/${problemId}`
      );

      set({ submission: res.data.submissions });

      

    } catch (error) {
      console.log("Error getting submissions for problem", error);

      toast.error("Error getting submissions for problem");
      
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionCountForProblem: async (problemId) => {
    try {
      const res = await axiosInstance.get(
        `/submission/get-submissions-count/${problemId}`
      );                

      set({ submissionCount: res.data.count });
    } catch (error) {
      console.log("Error getting submission count for problem", error);
      toast.error("Error getting submission count for problem");
    }
  },


  getSubmissionById: async (submissionId) => {
    try {
      const res = await axiosInstance.get(
        `/submission/get-submission-by-id/${submissionId}`
      );
      // Assuming the API returns the submission object directly
      set({ uniqueSubmission: res.data.submission });
      return res.data.submission;
    } catch (error) {
      console.log("Error getting submission by id", error);
      toast.error("Error getting submission by id");
       return null;
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionCountsByDate: async () => {
    try {
      const res = await axiosInstance.get(
        '/submission/get-submissions-count-by-date'
      );
      set({ submissionCounts: res.data.values }); // assuming backend returns { values: [...] }
      return res.data.values;
    } catch (error) {
      console.log("Error getting submission counts by date", error);
      toast.error("Error getting submission counts by date");
    }
  },



}));