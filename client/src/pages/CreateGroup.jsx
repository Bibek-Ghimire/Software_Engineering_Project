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
    localStorage.getItem("theme") === "dark",
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
    <div className="flex min-h-screen page-surface text-gray-800 dark:text-white transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-y-auto">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4 p-3 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 border border-slate-200 dark:border-slate-700"
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        <form
          onSubmit={handleSubmit}
          className="surface-card p-8 w-full max-w-lg space-y-6"
        >
          <h2 className="section-title text-center">Create Study Group</h2>

          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Group Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="form-input mt-1"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Description *
            </label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              className="form-input mt-1 resize-none"
            ></textarea>
          </div>

          {/* Member Count */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              No. of Members *
            </label>
            <input
              type="number"
              name="memberCount"
              required
              value={formData.memberCount}
              onChange={handleChange}
              className="form-input mt-1"
              min={1}
            />
          </div>

          {/* Member Names */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Member Names (comma-separated)
            </label>
            <input
              type="text"
              name="members"
              placeholder="Enter team members' names"
              value={formData.members}
              onChange={handleChange}
              className="form-input mt-1"
            />
          </div>

          {/* Course Detail */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Course Detail
            </label>
            <input
              type="text"
              name="courseDetail"
              placeholder="e.g., DSA, React, Python for AI"
              value={formData.courseDetail}
              onChange={handleChange}
              className="form-input mt-1"
            />
          </div>

          <button
            type="submit"
            className="primary-action w-full py-3.5 rounded-2xl"
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateGroup;
