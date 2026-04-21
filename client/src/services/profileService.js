import axios from "axios";

const API_URL = "http://localhost:5000/api/profile";

const getToken = () => sessionStorage.getItem("token");

export const getProfile = async () => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data;
};

export const updateProfile = async (profileData) => {
  const res = await axios.put(API_URL, profileData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data;
};

// Upload file (photo/resume)
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.filePath;
};
