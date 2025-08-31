import axios from "axios";

const API_URL = "http://localhost:5000/api/teachers"; // adjust if needed

// ✅ Get profile
export const getTeacherProfile = async (token) => {
  const res = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Update profile
export const updateTeacherProfile = async (token, data) => {
  const res = await axios.put(`${API_URL}/profile`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
