// src/pages/AddResource.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  FileText,
  Trash2,
  Edit2,
  Download,
  PlusCircle,
  XCircle,
  Upload,
  BookOpen,
  User,
  Sun,
  Moon,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TeacherSidebar from "../../components/TeacherSidebar";

const AddResource = () => {
  const [resources, setResources] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
  });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  const token = sessionStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const currentUserId = user?._id || user?.id;

  if (!token) toast.error("User not logged in");

  // Fetch resources
  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/resources", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResources(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch Resources Error:", err);
      toast.error("Failed to fetch resources");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Input change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // File change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "application/msword",
    ];
    if (!allowedTypes.includes(file.type))
      return toast.error("Only PDF, PNG, JPG, DOC allowed");
    if (file.size > 5 * 1024 * 1024)
      return toast.error("File size must be <5MB");
    setFormData({ ...formData, file });
  };

  // Add or update resource
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("User not logged in");
    if (
      !formData.title ||
      !formData.description ||
      (!formData.file && !editingId)
    )
      return toast.error("All fields are required");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (formData.file) data.append("file", formData.file);

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/resources/${editingId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        toast.success("Resource updated successfully");
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/resources", data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Resource added successfully");
      }
      setFormData({ title: "", description: "", file: null });
      fetchResources();
    } catch (err) {
      console.error("Save Resource Error:", err);
      toast.error("Error saving resource");
    }
  };

  // Delete resource
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/resources/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Resource deleted");
      fetchResources();
    } catch (err) {
      console.error("Delete Resource Error:", err);
      toast.error("Error deleting resource");
    }
  };

  // Download resource
  const handleDownload = (url, title) => {
    const link = document.createElement("a");
    link.href = `http://localhost:5000${url}`;
    link.download = title;
    link.click();
  };

  // Edit resource
  const handleEdit = (res) => {
    if (!res) return;
    setEditingId(res._id);
    setFormData({
      title: res.title || "",
      description: res.description || "",
      file: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get file type icon
  const getFileTypeIcon = (fileUrl) => {
    if (!fileUrl) return <FileText className="w-5 h-5" />;
    const extension = fileUrl.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />;
      case "png":
      case "jpg":
      case "jpeg":
        return <FileText className="w-5 h-5 text-green-500" />;
      case "doc":
      case "docx":
        return <FileText className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex min-h-screen page-surface transition-all duration-700">
      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full z-30">
        <TeacherSidebar />
      </div>
      <div className="ml-72 min-h-screen page-surface w-full relative">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-8 right-8 p-4 rounded-2xl icon-action shadow-sm hover:shadow-md hover:scale-105 border border-stone-200 dark:border-stone-700 transition-all duration-200 z-10 group"
        >
          {darkMode ? (
            <Sun className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
          ) : (
            <Moon className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
          )}
        </button>
        <ToastContainer
          position="top-right"
          autoClose={3000}
        />

        {/* Header Section */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-semibold text-stone-900 dark:text-stone-50 mb-2">
              Learning Resources
            </h1>
            <p className="text-stone-600 dark:text-stone-300 text-lg">
              {user?.role === "teacher"
                ? "Manage and share educational resources"
                : "Explore available learning materials"}
            </p>
          </div>

          {/* Add / Edit Form */}
          {user?.role === "teacher" && (
            <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-sm mb-10 border border-stone-200 dark:border-stone-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-300">
                  {editingId ? (
                    <Edit2 className="w-5 h-5" />
                  ) : (
                    <PlusCircle className="w-5 h-5" />
                  )}
                </div>
                <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">
                  {editingId ? "Edit Resource" : "Add New Resource"}
                </h2>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                      Resource Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Enter resource title..."
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950/50 text-stone-900 dark:text-stone-50 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 transition-all duration-200 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      placeholder="Brief description of the resource..."
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950/50 text-stone-900 dark:text-stone-50 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 transition-all duration-200 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                    Upload File
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="file"
                      onChange={handleFileChange}
                      className="w-full px-4 py-3 rounded-2xl border border-dashed border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-950/50 text-stone-900 dark:text-stone-50 hover:border-sky-400 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white dark:file:bg-orange-500 dark:file:text-white"
                    />
                    <Upload className="absolute right-3 top-3 w-5 h-5 text-stone-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Supported formats: PDF, PNG, JPG, DOC (Max: 5MB)
                  </p>
                </div>

                {/* Show current file name when editing */}
                {editingId && !formData.file && (
                  <div className="bg-stone-50 dark:bg-stone-950/50 p-4 rounded-2xl border border-stone-200 dark:border-stone-700">
                    <p className="text-sm text-stone-700 dark:text-stone-300 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Current file:{" "}
                      {resources
                        .find((r) => r._id === editingId)
                        ?.fileUrl.split("/")
                        .pop()}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setFormData({ title: "", description: "", file: null });
                      }}
                      className="flex-1 px-6 py-3 rounded-2xl bg-rose-500 text-white font-semibold hover:bg-rose-600 transition-all duration-200 border border-rose-500 flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" /> Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    className="primary-action flex-1 px-6 py-3 rounded-2xl"
                  >
                    <PlusCircle className="w-5 h-5" />
                    {editingId ? "Update Resource" : "Add Resource"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Resources List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Loading resources...
              </p>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                No Resources Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {user?.role === "teacher"
                  ? "Start by adding your first resource above!"
                  : "No resources have been shared yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resources?.map((res) => (
                <div
                  key={res._id}
                  className="group bg-white dark:bg-stone-900 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-stone-200 dark:border-stone-700"
                >
                  <div className="h-1.5 bg-blue-500"></div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2 leading-tight text-stone-900 dark:text-stone-50">
                          {res.title}
                        </h3>
                        <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                          <User className="w-4 h-4" />
                          <span className="text-sm">
                            {res.teacher?.name || "Unknown"}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 p-3 rounded-2xl bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300">
                        {getFileTypeIcon(res.fileUrl)}
                      </div>
                    </div>

                    <p className="text-stone-600 dark:text-stone-300 mb-6 leading-relaxed">
                      {res.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {res.fileUrl && (
                        <button
                          onClick={() => handleDownload(res.fileUrl, res.title)}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                        >
                          <Download className="w-4 h-4" /> Download
                        </button>
                      )}

                      {/* Show Edit/Delete only if logged-in teacher is the creator */}
                      {user?.role === "teacher" &&
                        (res.teacher?._id?.toString() ||
                          res.teacher?.id?.toString()) ===
                          currentUserId?.toString() && (
                          <>
                            <button
                              onClick={() => handleEdit(res)}
                              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                            >
                              <Edit2 className="w-4 h-4" /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(res._id)}
                              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </>
                        )}
                    </div>
                  </div>

                  {/* Subtle bottom accent */}
                  <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                </div>
              ))}
            </div>
          )}

          {/* Floating Stats Card */}
          {resources.length > 0 && (
            <div className="fixed bottom-6 right-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 border border-blue-100 dark:border-blue-800">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {resources.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {resources.length === 1 ? "Resource" : "Resources"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddResource;


