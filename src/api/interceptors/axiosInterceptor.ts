import axios, { AxiosError, AxiosResponse } from "axios";

// Create axios instance with base URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Enables cookies for authentication
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const statusCode = error.response?.status;

    // Handle different error status codes
    if (statusCode === 401) {
      // Unauthorized - handle auth error
      console.error("Authentication error:", error);
      // Could redirect to login or trigger auth refresh
    } else if (statusCode === 403) {
      // Forbidden
      console.error("Permission denied:", error);
    } else if (statusCode === 404) {
      // Not found
      console.error("Resource not found:", error);
    } else if (statusCode && statusCode >= 500) {
      // Server errors
      console.error("Server error:", error);
    } else {
      // Other errors
      console.error("API error:", error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
