import api from "./api";

// Get all groups
export const getGroups = async () => {
  try {
    const res = await api.get("/groups");
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch groups" };
  }
};

// Create group
export const createGroup = async (groupData) => {
  try {
    const res = await api.post("/groups", groupData);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create group" };
  }
};

// Join group
export const joinGroup = async (groupId) => {
  try {
    const res = await api.post(`/groups/join/${groupId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to join group" };
  }
};
