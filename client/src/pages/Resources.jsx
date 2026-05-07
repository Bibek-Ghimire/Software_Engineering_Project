// src/pages/Resource.jsx
import React, { useState, useEffect } from "react";
import {
  FileText,
  Eye,
  Download,
  Sun,
  Moon,
  Search,
  BookOpen,
  User,
  File,
  Filter,
  Folder,
  Bookmark,
  BookmarkCheck,
  Plus
} from "lucide-react";
import toast from "react-hot-toast";
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
  const [savedResourceIds, setSavedResourceIds] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const isTeacher = user.role === "teacher";

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

    // Fetch saved items
    const fetchSavedItems = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/profile/saved-items", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedResourceIds((res.data.savedResources || []).map(r => r._id));
      } catch (err) {
        console.error("Error fetching saved items:", err);
      }
    };
    if (token && !isTeacher) fetchSavedItems();
  }, [token, isTeacher]);

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

  const handleView = (url) => {
    if (!url) return;
    window.open(`http://localhost:5000${url}`, "_blank", "noopener,noreferrer");
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

  const handleToggleSave = async (resourceId) => {
    try {
      const isSaved = savedResourceIds.includes(resourceId);
      const method = isSaved ? "DELETE" : "POST";
      const response = await fetch(
        `http://localhost:5000/api/profile/save-resource/${resourceId}`,
        {
          method,
          headers: { Authorization: `Bearer ${token}` },
        }, ext - sm">
                  { search? "Found": "Total" } Resources
                </div >
              </div >
              <div className="w-px h-10 bg-stone-200 dark:bg-stone-700" />
              <div className="text-center">
                <div className="text-3xl font-black text-stone-900 dark:text-stone-50">
                  {new Set(filteredResources.map((res) => res.fileType)).size}
                </div>
                <div className="body-copy text-sm">File Types</div>
              </div>
              <div className="w-px h-10 bg-stone-200 dark:bg-stone-700" />
              <div className="text-center">
                <div className="text-3xl font-black text-stone-900 dark:text-stone-50">
                  {
                    new Set(
                      filteredResources
                        .map((res) => res.teacher?.name)
                        .filter(Boolean),
                    ).size
                  }
                </div>
                <div className="body-copy text-sm">Instructors</div>
              </div>
            </div >
          </div >
        )}

{/* Resources Grid */ }
{
  filteredResources.length === 0 && !loading ? (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="surface-card-strong p-16 text-center max-w-lg">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
          <Folder className="w-7 h-7 text-stone-500 dark:text-stone-400" />
        </div>
        <h3 className="text-xl font-bold text-stone-900 dark:text-stone-50 mb-3">
          {search ? "No Matching Resources" : "No Resources Available"}
        </h3>
        <p className="body-copy text-lg">
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
            className="mt-6 primary-action px-6 py-3 rounded-xl"
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
          className="group surface-card-strong overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col"
        >
          <div className="h-1 bg-orange-400" />
          <div className="p-4 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-lg">
                  {fileInfo.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-stone-900 dark:text-stone-50 text-base leading-tight truncate">
                    {res.title}
                  </h3>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block border border-stone-200 dark:border-stone-700 body-copy">
                    {res.fileType}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isTeacher && (
                  <button
                    onClick={() => handleToggleSave(res._id)}
                    className={`p-2 rounded-lg transition-all ${savedResourceIds.includes(res._id)
                      ? "text-orange-500 bg-orange-50 dark:bg-orange-950/20"
                      : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                      }`}
                  >
                    {savedResourceIds.includes(res._id) ? (
                      <BookmarkCheck className="w-4 h-4" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                )}
                <FileText className="w-4 h-4 text-stone-400 dark:text-stone-500 flex-shrink-0" />
              </div>
            </div>
          </div>

          <div className="p-6 flex flex-col flex-grow">
            <p className="body-copy text-sm leading-relaxed mb-6 flex-grow">
              {res.description}
            </p>

            <div className="space-y-3 mb-6">
              {res.teacher?.name && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                    <User className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                  </div>
                  <span className="body-copy">
                    <span className="font-medium text-stone-900 dark:text-stone-100">
                      Instructor:
                    </span>{" "}
                    {res.teacher.name}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 text-sm">
                <div className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <File className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                </div>
                <span className="body-copy">
                  <span className="font-medium text-stone-900 dark:text-stone-100">
                    Type:
                  </span>{" "}
                  {res.fileType}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleView(res.fileUrl)}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl flex items-center justify-center gap-3"
              >
                <Eye className="w-5 h-5" />
                View Resource
              </button>

              <button
                onClick={() => handleDownload(res.fileUrl, res.title)}
                className="w-full primary-action px-6 py-4 rounded-xl flex items-center justify-center gap-3"
              >
                <Download className="w-5 h-5" />
                Download Resource
              </button>
            </div>
          </div>
        </div>
      );
    })}
  </div>
)
}
      </div >
    </div >
  );
};

export default Resource;
