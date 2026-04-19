import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/recommendations";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const recommendationService = {
  // Get recommended courses
  getRecommendedCourses: async (limit = 6) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/courses?limit=${limit}`,
        {
          headers: getAuthHeaders(),
        },
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching recommended courses:", error);
      return [];
    }
  },

  // Get recommended resources
  getRecommendedResources: async (limit = 6) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/resources?limit=${limit}`,
        {
          headers: getAuthHeaders(),
        },
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching recommended resources:", error);
      return [];
    }
  },

  // Get recommended groups
  getRecommendedGroups: async (limit = 6) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/groups?limit=${limit}`,
        {
          headers: getAuthHeaders(),
        },
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching recommended groups:", error);
      return [];
    }
  },

  // Get recommended teachers
  getRecommendedTeachers: async (limit = 6) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/teachers?limit=${limit}`,
        {
          headers: getAuthHeaders(),
        },
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching recommended teachers:", error);
      return [];
    }
  },

  // Add course to interested list
  addInterestedCourse: async (courseId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/interested-course/${courseId}`,
        {},
        { headers: getAuthHeaders() },
      );
      return response.data;
    } catch (error) {
      console.error("Error adding interested course:", error);
      throw error;
    }
  },

  // Remove course from interested list
  removeInterestedCourse: async (courseId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/interested-course/${courseId}`,
        { headers: getAuthHeaders() },
      );
      return response.data;
    } catch (error) {
      console.error("Error removing interested course:", error);
      throw error;
    }
  },
};

export default recommendationService;
