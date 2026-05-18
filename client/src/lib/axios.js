import axios from "axios";
import { API_URL } from "@/constants";
import { getToken } from "@/lib/storage";
import { ApiError } from "@/lib/api-error";

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { data, status } = error.response;
      throw new ApiError(
        data?.message || "Request failed",
        status,
        data?.errors || null
      );
    }

    if (error.request) {
      throw new ApiError(
        "Cannot reach server. Check that the API is running.",
        0,
        null
      );
    }

    throw new ApiError(error.message || "Request failed", 0, null);
  }
);

export default api;
