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
    <div className="page-surface flex min-h-screen transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="relative flex flex-1 flex-col p-6 lg:p-10">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="icon-action absolute top-6 right-6"
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Page Title */}
        <h1 className="section-title text-center mb-10">Discussions</h1>

        <div className="w-full max-w-3xl mx-auto space-y-10">
          {/* Add Discussion Form */}
          <form
            onSubmit={handleSubmit}
            className="surface-card space-y-4 p-6"
          >
            <input
              type="text"
              placeholder="Discussion Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input-compact"
              required
            />
            <textarea
              placeholder="Description / Question"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input-compact resize-none"
              rows="4"
            ></textarea>
            <button
              type="submit"
              className="primary-action w-full rounded-full py-3 font-medium"
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
                className="surface-card p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
                  {d.title}
                </h3>
                {d.description && (
                  <p className="body-copy mt-2">{d.description}</p>
                )}
                <p className="mt-3 text-xs body-copy">
                  {d.author} · {new Date(d.createdAt).toLocaleString()}
                </p>
              </div>
            ))}

            {discussions.length === 0 && (
              <p className="text-center body-copy text-sm">
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
