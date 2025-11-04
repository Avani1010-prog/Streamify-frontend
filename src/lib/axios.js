import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://streamify-backend-1-o6bu.onrender.com/api",
  withCredentials: true,
});
