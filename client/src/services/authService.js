import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Create a pre-configured axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // in case you need cookies
});

// REGISTER USER
export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/register", userData);
    return response.data;
  } catch (error) {
    // Handle Axios errors more clearly
    if (error.response) {
      // Server responded with a status other than 2xx
      throw new Error(error.response.data.message || "Registration failed");
    } else if (error.request) {
      // Request was made but no response
      throw new Error("No response from server. Please check backend or CORS.");
    } else {
      // Other errors
      throw new Error(error.message);
    }
  }
};

// LOGIN USER
export const loginUser = async (loginData) => {
  try {
    const response = await axiosInstance.post("/login", loginData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Login failed");
    } else if (error.request) {
      throw new Error("No response from server. Please check backend or CORS.");
    } else {
      throw new Error(error.message);
    }
  }
};

// GET PROTECTED DATA (example usage)
export const getProtectedData = async (token) => {
  try {
    const response = await axiosInstance.get("/protected", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Access denied");
  }
};
