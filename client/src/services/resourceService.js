import api from "./api";

// Get all resources
export const getResources = async () => {
  try {
    const res = await api.get("/resources");
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch resources" };
  }
};

// Add resource
export const addResource = async (resourceData) => {
  try {
    const res = await api.post("/resources", resourceData);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add resource" };
  }
};
