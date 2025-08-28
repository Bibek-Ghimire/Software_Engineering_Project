// src/pages/Resource.jsx
import React, { useState, useEffect } from "react";
import { FileText, Download, Sun, Moon } from "lucide-react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const Resource = () => {
  const [resources, setResources] = useState([]);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Fetch resources from backend
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/resources");
        setResources(res.data);
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    fetchResources();
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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-900 transition-colors duration-500">
      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full z-30">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 relative">
        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow hover:scale-110 transition"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-blue-700 dark:text-blue-300 mb-3">
            📚 Explore Learning Resources
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Access notes, guides, slides, and videos shared by educators & mentors.
          </p>
        </div>

        {/* Resource Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.length > 0 ? (
            resources.map((res) => (
              <div
                key={res._id}
                className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                    {res.name}
                  </h3>
                  <FileText className="text-blue-500 w-6 h-6" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm flex-grow">
                  {res.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  📄 Type: {res.type}
                </p>
                <a
                  href={res.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-all text-sm font-medium"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Resource
                </a>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 mt-12 text-lg">
              No resources available yet. 📂
            </div>
          )}
        </div>

        {/* Note */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-14 italic">
          Want to contribute a resource? Please contact your instructor or administrator.
        </div>
      </div>
    </div>
  );
};

export default Resource;
