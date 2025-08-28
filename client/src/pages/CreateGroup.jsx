// src/pages/CreateGroup.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Sun, Moon } from "lucide-react";
import axios from "axios";

function CreateGroup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    memberCount: "",
    members: "",
    courseDetail: "",
  });

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Handle theme toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newGroup = {
        name: formData.name,
        description: formData.description,
        memberCount: parseInt(formData.memberCount),
        members: formData.members
          ? formData.members.split(",").map((m) => m.trim())
          : [],
        courseDetail: formData.courseDetail,
      };

      await axios.post("http://localhost:5000/api/groups", newGroup);

      navigate("/groups"); // redirect to groups list
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-y-auto">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow hover:scale-110 transition"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-lg space-y-6 border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-300 text-center">
            🚀 Create Study Group
          </h2>

          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Group Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description *
            </label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            ></textarea>
          </div>

          {/* Member Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              No. of Members *
            </label>
            <input
              type="number"
              name="memberCount"
              required
              value={formData.memberCount}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              min={1}
            />
          </div>

          {/* Member Names */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Member Names (comma-separated)
            </label>
            <input
              type="text"
              name="members"
              placeholder="Enter team members' names"
              value={formData.members}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Course Detail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Course Detail
            </label>
            <input
              type="text"
              name="courseDetail"
              placeholder="e.g., DSA, React, Python for AI"
              value={formData.courseDetail}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateGroup;
