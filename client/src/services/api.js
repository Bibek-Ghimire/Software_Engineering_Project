import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Backend URL
  headers: {
    "Content-Type": "application/json",
  },
  // Optional: timeout to catch network issues early
  timeout: 5000,
});

// Attach JWT token automatically if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: intercept responses for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If network error (backend not running)
    if (!error.response) {
      return Promise.reject({ message: "Cannot connect to the backend. Make sure the server is running." });
    }
    // Return backend error or generic message
    return Promise.reject(error.response.data || { message: "Something went wrong" });
  }
);

export default api;
