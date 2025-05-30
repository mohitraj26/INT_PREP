import {create} from "zustand";
import {axiosInstance} from "../lib/axios";
import toast from "react-hot-toast";

export const useProblemStore = create((set)=>({
    problems: [],
    problem: null,
    solvedProblems: [],
    isProblemsLoading: false,
    isProblemLoading: false,

    getAllProblems : async()=>{
        try {
            set({isProblemsLoading: true});

            const res = await axiosInstance.get("/problem/get-all-problems");

            set({problems: res.data.problems});

        } catch (error) {
            console.log("Error While Fetching Problems", error);
            toast.error("Error While Fetching Problems");
        }
        finally{
            set({isProblemsLoading: false});
        }
    },

    getProblemById : async(id)=>{
        try {
            set({isProblemLoading: true});

            const res = await axiosInstance.get(`/problem/get-problem/${id}`);

            set({problem: res.data.problem});
            toast.success(res.data.message);

        } catch (error) {
            console.log("Error While Fetching Problem", error);
            toast.error("Error While Fetching Problem");
        }
        finally{
            set({isProblemLoading: false});
        }
    },

    getProblemSolvedByUser: async()=>{
        try {
            const res = await axiosInstance.get("/problem/get-solved-problems");
            set({solvedProblems: res.data.problems});
        } catch (error) {
            console.log("Error While Fetching Solved Problems", error);
            toast.error("Error While Fetching Solved Problems");
        }
    }

}))