// src/pages/Resource.jsx
import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Sun,
  Moon,
  Search,
  BookOpen,
  User,
  File,
  Filter,
  Folder,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const Resource = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const token = sessionStorage.getItem("token");

  // Fetch resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/resources", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setResources(res.data);
        setFilteredResources(res.data);
      } catch (err) {
        console.error("Error fetching resources:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [token]);

  // Theme toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Download handler
  const handleDownload = (url, fileName) => {
    const a = document.createElement("a");
    a.href = `http://localhost:5000${url}`;
    a.download = fileName;
    a.click();
  };

  // Search / Filter
  const handleSearch = (e) => {
    setSearch(e.target.value);
    const query = e.target.value.toLowerCase();
    setFilteredResources(
      resources.filter(
        (res) =>
          res.title.toLowerCase().includes(query) ||
          res.description.toLowerCase().includes(query) ||
          res.teacher?.name?.toLowerCase().includes(query) ||
          res.fileType.toLowerCase().includes(query),
      ),
    );
  };

  // Get file type icon and color
  const getFileTypeInfo = (fileType) => {
    const type = fileType?.toLowerCase() || "";
    if (type.includes("pdf"))
      return {
        icon: "📄",
        color:
          "from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30",
        textColor: "text-red-700 dark:text-red-400",
      };
    if (type.includes("doc") || type.includes("word"))
      return {
        icon: "📘",
        color:
          "from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30",
        textColor: "text-blue-700 dark:text-blue-400",
      };
    if (type.includes("ppt") || type.includes("presentation"))
      return {
        icon: "📊",
        color:
          "from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30",
        textColor: "text-orange-700 dark:text-orange-400",
      };
    if (type.includes("video") || type.includes("mp4"))
      return {
        icon: "🎥",
        color:
          "from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30",
        textColor: "text-purple-700 dark:text-purple-400",
      };
    if (type.includes("image") || type.includes("jpg") || type.includes("png"))
      return {
        icon: "🖼️",
        color:
          "from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30",
        textColor: "text-green-700 dark:text-green-400",
      };
    return {
      icon: "📁",
      color:
        "from-gray-100 to-gray-200 dark:from-gray-700/30 dark:to-gray-600/30",
      textColor: "text-gray-700 dark:text-gray-400",
    };
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-gray-900 dark:to-gray-950">
        <div className="w-64 fixed top-0 left-0 h-full z-30">
          <Sidebar />
        </div>
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-200/50 dark:border-gray-600/50">
              <ClipLoader
                size={60}
                color={darkMode ? "#60a5fa" : "#2563eb"}
              />
              <p className="text-blue-600 dark:text-blue-400 font-medium mt-4">
                Loading resources...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full z-30">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 relative overflow-auto">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-6 right-6 p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-blue-600 dark:text-blue-400 shadow-lg hover:shadow-xl hover:scale-110 border border-blue-200/50 dark:border-gray-600/50 transition-all duration-300 z-10"
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Header Section */}
        <div className="mb-10 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <Folder className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 dark:from-blue-400 dark:via-blue-300 dark:to-blue-200 bg-clip-text text-transparent">
                Learning Resources
              </h1>
              <p className="text-blue-600/80 dark:text-blue-300/80 text-lg mt-2">
                Explore curated notes, guides, slides, and videos shared by
                instructors
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-8 flex justify-center">
            <div className="relative w-full max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-blue-400 dark:text-blue-500" />
              </div>
              <input
                type="text"
                placeholder="Search by title, description, instructor, or file type..."
                value={search}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-blue-200/50 dark:border-gray-600/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-800 dark:text-white placeholder-blue-400/70 dark:placeholder-blue-500/70 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300/50 dark:focus:ring-blue-600/50 focus:border-blue-400 dark:focus:border-blue-500 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {resources.length > 0 && (
          <div className="mb-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-200/50 dark:border-gray-600/50 p-6">
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {filteredResources.length}
                </div>
                <div className="text-sm text-blue-600/70 dark:text-blue-400/70">
                  {search ? "Found" : "Total"} Resources
                </div>
              </div>
              <div className="w-px h-10 bg-blue-200 dark:bg-gray-600"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {new Set(filteredResources.map((res) => res.fileType)).size}
                </div>
                <div className="text-sm text-blue-600/70 dark:text-blue-400/70">
                  File Types
                </div>
              </div>
              <div className="w-px h-10 bg-blue-200 dark:bg-gray-600"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {
                    new Set(
                      filteredResources
                        .map((res) => res.teacher?.name)
                        .filter(Boolean),
                    ).size
                  }
                </div>
                <div className="text-sm text-blue-600/70 dark:text-blue-400/70">
                  Instructors
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resources Grid */}
        {filteredResources.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl p-16 border border-blue-200/50 dark:border-gray-600/50 text-center max-w-lg">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Folder className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-3">
                {search ? "No Matching Resources" : "No Resources Available"}
              </h3>
              <p className="text-blue-600/70 dark:text-blue-400/70 text-lg">
                {search
                  ? "Try adjusting your search terms or browse all resources"
                  : "Check back soon for new learning materials!"}
              </p>
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setFilteredResources(resources);
                  }}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredResources.map((res) => {
              const fileInfo = getFileTypeInfo(res.fileType);
              return (
                <div
                  key={res._id}
                  className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-blue-200/50 dark:border-gray-600/50 overflow-hidden transition-all duration-300 hover:scale-105 hover:border-blue-300/70 dark:hover:border-blue-500/50 flex flex-col"
                >
                  {/* File Type Header */}
                  <div
                    className={`p-4 bg-gradient-to-r ${fileInfo.color} border-b border-blue-100/50 dark:border-gray-700/50`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{fileInfo.icon}</div>
                        <div>
                          <h3 className="font-bold text-blue-800 dark:text-blue-200 text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                            {res.title}
                          </h3>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${fileInfo.color} ${fileInfo.textColor} mt-1 inline-block`}
                          >
                            {res.fileType}
                          </span>
                        </div>
                      </div>
                      <FileText className="w-6 h-6 text-blue-600/70 dark:text-blue-400/70 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6 flex-grow">
                      {res.description}
                    </p>

                    {/* Resource Details */}
                    <div className="space-y-3 mb-6">
                      {res.teacher?.name && (
                        <div className="flex items-center gap-3 text-sm">
                          <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="text-gray-600 dark:text-gray-300">
                            <span className="font-medium text-blue-700 dark:text-blue-300">
                              Instructor:
                            </span>{" "}
                            {res.teacher.name}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-sm">
                        <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                          <File className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-gray-600 dark:text-gray-300">
                          <span className="font-medium text-blue-700 dark:text-blue-300">
                            Type:
                          </span>{" "}
                          {res.fileType}
                        </span>
                      </div>
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={() => handleDownload(res.fileUrl, res.title)}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 group-hover:from-blue-600 group-hover:to-blue-700"
                    >
                      <Download className="w-5 h-5" />
                      Download Resource
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Decorative Elements */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-32 right-32 w-40 h-40 bg-blue-200/15 dark:bg-blue-800/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 left-32 w-48 h-48 bg-blue-300/15 dark:bg-blue-700/10 rounded-full blur-3xl"></div>
          <div className="absolute top-2/3 right-1/4 w-32 h-32 bg-blue-400/15 dark:bg-blue-600/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/4 left-3/4 w-28 h-28 bg-blue-500/15 dark:bg-blue-500/10 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Resource;
