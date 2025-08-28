// src/pages/AddResource.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FileText, Trash2, Edit2, Download } from "lucide-react";

const AddResource = () => {
  const [resources, setResources] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "", file: null });
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/resources", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResources(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResources(); }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.file) return alert("All fields required");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("file", formData.file);

    try {
      await axios.post("http://localhost:5000/api/resources", data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setFormData({ title: "", description: "", file: null });
      fetchResources();
      alert("Resource added successfully!");
    } catch (err) {
      console.error(err);
      alert("Error adding resource");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/resources/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchResources();
    } catch (err) {
      console.error(err);
      alert("Error deleting resource");
    }
  };

  const handleDownload = (url, title) => {
    const link = document.createElement("a");
    link.href = `http://localhost:5000${url}`;
    link.download = title;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">Resources</h1>

      {/* Add Resource Form */}
      {user?.role === "teacher" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Resource</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className="input px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="input px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              className="input px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              className="mt-2 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-2xl shadow-lg transition"
            >
              Add Resource
            </button>
          </form>
        </div>
      )}

      {/* Resources List */}
      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-300">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res) => (
            <div key={res._id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-600 dark:text-white">{res.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 my-2">{res.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">By: {res.teacher?.name}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleDownload(res.fileUrl, res.title)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
                {user?.role === "teacher" && res.teacher._id === user.id && (
                  <>
                    <button
                      onClick={() => handleDelete(res._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddResource;
