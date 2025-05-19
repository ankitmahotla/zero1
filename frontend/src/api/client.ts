import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
