import React, { useState, useEffect } from "react";
import axios from "axios";
import { Moon, Sun } from "lucide-react";
import Sidebar from "../components/Sidebar";

const Discussion = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  const author = "Student Name"; // Replace with actual logged-in user

  // Fetch discussions from backend
  const fetchDiscussions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/discussions");
      setDiscussions(res.data);
    } catch (error) {
      console.error("Error fetching discussions:", error);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

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

  // Add a new discussion
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return alert("Title is required");

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/discussions", {
        title,
        description,
        author,
      });
      setTitle("");
      setDescription("");
      fetchDiscussions();
    } catch (error) {
      console.error("Error adding discussion:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 lg:p-10 relative">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-6 right-6 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow hover:scale-110 transition"
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Page Title */}
        <h1 className="text-4xl font-bold text-center text-blue-700 dark:text-blue-300 mb-10">
          💬 Discussions
        </h1>

        <div className="w-full max-w-3xl mx-auto space-y-10">
          {/* Add Discussion Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 space-y-4"
          >
            <input
              type="text"
              placeholder="Discussion Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            <textarea
              placeholder="Description / Question"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows="4"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post Discussion"}
            </button>
          </form>

          {/* Display Discussions */}
          <div className="space-y-5">
            {discussions.map((d) => (
              <div
                key={d._id}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl transition"
              >
                <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300">
                  {d.title}
                </h3>
                {d.description && (
                  <p className="text-gray-700 dark:text-gray-300 mt-2">
                    {d.description}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  👤 {d.author} | 🕒 {new Date(d.createdAt).toLocaleString()}
                </p>
              </div>
            ))}

            {discussions.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No discussions yet. Be the first to start one!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discussion;
