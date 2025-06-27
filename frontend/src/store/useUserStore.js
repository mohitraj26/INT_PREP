import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useUserStore = create((set) => ({
  isUpdating: false,

  updateName: async (userId, name) => {
    set({ isUpdating: true });
    try {
      const res = await axiosInstance.put("/user/update-name", { userId, name });
      toast.success(res.data.message);
      return res.data.user;
    } catch (error) {
      console.error("Error updating name", error);
      toast.error(error.response?.data?.message || "Failed to update name");
    } finally {
      set({ isUpdating: false });
    }
  },

  updateEmail: async (userId, email) => {
    set({ isUpdating: true });
    try {
      const res = await axiosInstance.put("/user/update-email", { userId, email });
      toast.success(res.data.message);
      return res.data.user;
    } catch (error) {
      console.error("Error updating email", error);
      toast.error(error.response?.data?.message || "Failed to update email");
    } finally {
      set({ isUpdating: false });
    }
  },

  updateProfileImage: async (userId, imageUrl) => {
    set({ isUpdating: true });
    try {
      const res = await axiosInstance.put("/user/profile-image", { userId, imageUrl });
      toast.success(res.data.message);
      return res.data.user;
    } catch (error) {
      console.error("Error updating profile image", error);
      toast.error(error.response?.data?.message || "Failed to update image");
    } finally {
      set({ isUpdating: false });
    }
  },
}));
