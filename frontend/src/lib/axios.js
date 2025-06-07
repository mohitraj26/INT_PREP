import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:8080/api/v1" : "https://int-prep.onrender.com/api/v1",
    withCredentials: true
})