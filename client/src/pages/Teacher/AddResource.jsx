// src/pages/AddResource.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  FileText,
  Trash2,
  Edit2,
  Eye,
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
  const storedUser =
    sessionStorage.getItem("user") || localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
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

  const handleView = (url) => {
    if (!url) return;
    window.open(`http://localhost:5000${url}`, "_blank", "noopener,noreferrer");
  };

  const isResourceOwner = (res) =>
    user?.role === "teacher" &&
    (res.teacher?._id?.toString() || res.teacher?.id?.toString()) ===
      currentUserId?.toString();

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
        return <FileText className="w-5 h-5 text-orange-500" />;
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
            <Sun className="w-6 h-6" />
          ) : (
            <Moon className="w-6 h-6" />
          )}
        </button>
        <ToastContainer
          position="top-right"
          autoClose={3000}
        />

        {/* Header Section */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16  mb-4"></div>
            <h1 className="text-4xl font-semibold text-stone-900 dark:text-stone-50 mb-2">
              Learning Resources
            </h1>
          </div>

          {/* Add / Edit Form */}
          {user?.role === "teacher" && (
            <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-sm mb-10 border border-stone-200 dark:border-stone-700">
              <div className="flex items-center gap-3 mb-6">
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
                      className="w-full px-4 py-3 rounded-2xl border border-dashed border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-950/50 text-stone-900 dark:text-stone-50 hover:border-orange-400 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white dark:file:bg-orange-500 dark:file:text-white"
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
                      className="flex-1 px-6 py-3 rounded-2xl bg-stone-500 text-white font-semibold hover:bg-stone-700 transition-all duration-200 border border-stone-700 flex items-center justify-center gap-2"
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
              <p className="text-stone-600 dark:text-stone-400 text-lg">
                Loading resources...
              </p>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold text-stone-600 dark:text-stone-400 mb-2">
                No Resources Yet
              </h3>
              <p className="text-stone-500 dark:text-stone-400">
                {user?.role === "teacher"
                  ? "Start by adding your first resource above!"
                  : "No resources have been shared yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
              {resources?.map((res) => (
                <div
                  key={res._id}
                  className="group bg-white dark:bg-stone-900 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-stone-200 dark:border-stone-700"
                >
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
                    </div>

                    <p className="text-stone-600 dark:text-stone-300 mb-6 leading-relaxed">
                      {res.description}
                    </p>

                    <div className="flex gap-2 flex-nowrap">
                      {res.fileUrl && (
                        <button
                          onClick={() => handleDownload(res.fileUrl, res.title)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                        >
                          <Download className="w-4 h-4" /> Download
                        </button>
                      )}

                      {/* Show Edit/Delete only if logged-in teacher is the creator */}
                      {isResourceOwner(res) && (
                        <>
                          <button
                            onClick={() => handleEdit(res)}
                            className="bg-stone-500 hover:bg-stone-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                          >
                            <Edit2 className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(res._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddResource;
