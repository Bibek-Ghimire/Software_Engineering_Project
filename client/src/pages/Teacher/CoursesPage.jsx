// src/pages/CoursesPage.jsx
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  BookOpen,
  Pencil,
  Trash2,
  Sun,
  Moon,
  Plus,
  Eye,
  Clock,
  GraduationCap,
  Save,
  X,
  Users,
  Star,
  Calendar,
  Award,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import TeacherSidebar from "../../components/TeacherSidebar";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "Beginner",
    duration: "",
    price: "",
    keywords: "",
  });
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    level: "Beginner",
    duration: "",
    price: "",
    keywords: "",
  });

  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const navigate = useNavigate();

  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Fetch courses
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/courses", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setCourses([]);
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreateCourse = async () => {
    const { title, description, duration, price } = formData;
    if (!title || !description || !duration || !price)
      return alert("All fields are required!");
    try {
      const keywordsArray = formData.keywords
        ? formData.keywords.split(",").map((k) => k.trim())
        : [];
      await axios.post(
        "http://localhost:5000/api/courses",
        { ...formData, teacher: user.id, keywords: keywordsArray },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("Course created successfully!");
      setFormData({
        title: "",
        description: "",
        level: "Beginner",
        duration: "",
        price: "",
        keywords: "",
      });
      fetchCourses();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating course!");
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCourses();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error deleting course!");
    }
  };

  // Edit course functions
  const handleEditClick = (course) => {
    setEditingCourseId(course._id);
    setEditFormData({
      title: course.title,
      description: course.description,
      level: course.level,
      duration: course.duration,
      price: course.price,
      keywords: course.keywords ? course.keywords.join(", ") : "",
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleUpdateCourse = async () => {
    const { title, description, duration, price } = editFormData;
    if (!title || !description || !duration || !price)
      return alert("All fields are required!");
    try {
      const keywordsArray = editFormData.keywords
        ? editFormData.keywords.split(",").map((k) => k.trim())
        : [];
      await axios.put(
        `http://localhost:5000/api/courses/${editingCourseId}`,
        { ...editFormData, keywords: keywordsArray },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("Course updated successfully!");
      setEditingCourseId(null);
      fetchCourses();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error updating course!");
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Beginner":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/40";
      case "Intermediate":
        return "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/40";
      case "Expert":
        return "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/20 dark:text-rose-300 dark:border-rose-900/40";
      default:
        return "bg-stone-100 text-stone-700 border-stone-200";
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case "Beginner":
        return <Star className="w-4 h-4" />;
      case "Intermediate":
        return <Award className="w-4 h-4" />;
      case "Expert":
        return <GraduationCap className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen page-surface transition-all">
        <div className="w-64 fixed top-0 left-0 h-full z-30">
          <TeacherSidebar />
        </div>
        <div className="ml-64 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-base font-semibold text-stone-700 dark:text-stone-300 ">
              Loading courses...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen page-surface transition-all duration-700 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="hidden"></div>
      <div className="hidden"></div>

      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full z-30">
        <TeacherSidebar />
      </div>

      <div className="ml-64 flex-1 p-8 relative z-10">
        {/* Header with Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold brand-title text-4xl font-bold text-stone-900 dark:text-stone-50 mb-2">
              Course Management
            </h1>
            <p className="text-stone-600 dark:text-stone-400 font-medium flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Create and manage your educational content
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="icon-action"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Teacher Create Course Form */}
        {user?.role === "teacher" && (
          <div className="mb-10 surface-card-strong p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center border border-orange-100 dark:border-orange-900/40 text-stone-600 dark:text-stone-400">
                <Plus className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">
                Create a New Course
              </h2>
            </div>

            <div className="space-y-6 mb-6">
              <div>
                <label className="block text-sm font-medium body-copy mb-2">
                  Course Title *
                </label>
                <input
                  name="title"
                  placeholder="e.g., Advanced React Development"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50 text-stone-900 dark:text-stone-50 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 transition-all duration-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium body-copy mb-2">
                  Full Course Description *
                </label>
                <textarea
                  name="description"
                  placeholder="Write a detailed description of your course. Include what students will learn, prerequisites, and key takeaways..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50 text-stone-900 dark:text-stone-50 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 transition-all duration-200 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium body-copy mb-2">
                    Level *
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50 text-stone-900 dark:text-stone-50 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 transition-all duration-200 outline-none"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium body-copy mb-2">
                    Duration *
                  </label>
                  <input
                    name="duration"
                    placeholder="e.g. 8 weeks"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50 text-stone-900 dark:text-stone-50 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 transition-all duration-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium body-copy mb-2">
                    Price (Rs.) *
                  </label>
                  <input
                    name="price"
                    type="number"
                    placeholder="0"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50 text-stone-900 dark:text-stone-50 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 transition-all duration-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium body-copy mb-2">
                    Keywords/Topics
                  </label>
                  <input
                    name="keywords"
                    placeholder="React, JavaScript, Web Dev"
                    value={formData.keywords}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50 text-stone-900 dark:text-stone-50 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 transition-all duration-200 outline-none"
                  />
                  <p className="text-xs body-copy mt-2">
                    Separate with commas (e.g., React, JavaScript, Web Dev)
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleCreateCourse}
              className="primary-action px-6 py-3.5 rounded-2xl"
            >
              <Plus className="w-5 h-5" />
              Create Course
            </button>
          </div>
        )}

        {/* Courses List Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">

            <h2 className="text-3xl font-bold text-stone-700 dark:text-stone-300">
              All Courses
            </h2>
          </div>
          <div className="flex items-center gap-4 text-stone-600 dark:text-stone-400">
            <div className="flex items-center gap-2 surface-panel px-4 py-2">
              <span className="font-medium">{courses.length} courses</span>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.length === 0 && !loading && (
            <div className="col-span-full text-center py-16">
              <div className="w-20 h-20 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-stone-500 dark:text-stone-400" />
              </div>
              <p className="text-xl font-semibold text-stone-500 dark:text-stone-400 mb-2">
                No courses found
              </p>
              <p className="text-stone-400 dark:text-stone-500">
                Create your first course to get started!
              </p>
            </div>
          )}

          {courses.map((course) => (
            <div
              key={course._id}
              className="surface-card overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              {editingCourseId === course._id ? (
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-2 uppercase tracking-wide">
                        Title
                      </label>
                      <input
                        name="title"
                        value={editFormData.title}
                        onChange={handleEditChange}
                        className="w-full p-3 border-2 border-stone-200 dark:border-stone-700 rounded-xl dark:bg-stone-800/50 dark:text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-2 uppercase tracking-wide">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={editFormData.description}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full p-3 border-2 border-stone-200 dark:border-stone-700 rounded-xl dark:bg-stone-800/50 dark:text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 transition-all duration-300 resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-2">
                          Level
                        </label>
                        <select
                          name="level"
                          value={editFormData.level}
                          onChange={handleEditChange}
                          className="w-full p-3 border-2 border-stone-200 dark:border-stone-700 rounded-xl dark:bg-stone-800/50 dark:text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 transition-all duration-300"
                        >
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Expert</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-2">
                          Duration
                        </label>
                        <input
                          name="duration"
                          value={editFormData.duration}
                          onChange={handleEditChange}
                          className="w-full p-3 border-2 border-stone-200 dark:border-stone-700 rounded-xl dark:bg-stone-800/50 dark:text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-2">
                          Price
                        </label>
                        <input
                          name="price"
                          type="number"
                          value={editFormData.price}
                          onChange={handleEditChange}
                          className="w-full p-3 border-2 border-stone-200 dark:border-stone-700 rounded-xl dark:bg-stone-800/50 dark:text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 transition-all duration-300"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-2 uppercase tracking-wide">
                        Keywords/Topics
                      </label>
                      <input
                        name="keywords"
                        value={editFormData.keywords}
                        onChange={handleEditChange}
                        placeholder="React, JavaScript, Web Dev"
                        className="w-full p-3 border-2 border-stone-200 dark:border-stone-700 rounded-xl dark:bg-stone-800/50 dark:text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 transition-all duration-300"
                      />
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
                        Separate with commas (e.g., React, JavaScript, Web Dev)
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleUpdateCourse}
                      className="flex-1 primary-action py-3"
                    >
                      <Save className="w-4 h-4" /> Save
                    </button>
                    <button
                      onClick={() => setEditingCourseId(null)}
                      className="secondary-action flex-1 py-3 rounded-xl"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Course Header */}
                  <div className="bg-stone-500 p-6 text-white relative overflow-hidden">
                    <div className="hidden"></div>
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2 text-stone-900 dark:text-stone-50">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300`}
                        >
                          {course.level}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    <p className="text-stone-600 dark:text-stone-400 mb-4 line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Course Meta Info */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-orange-50 to-blue-50 dark:from-stone-900/20 dark:to-blue-900/20 rounded-xl border border-stone-200 dark:border-stone-700">
                        <Clock className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                        <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                          {course.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 p-3 surface-panel rounded-xl">
                        <span className="text-xs font-bold text-stone-500 dark:text-stone-400">Rs.</span>
                        <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                          {course.price}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/course/${course._id}`}
                        className="flex-1 min-w-0 primary-action py-3 px-4"
                      >
                        <Eye className="w-4 h-4" /> View
                      </Link>

                      {user?.role === "teacher" &&
                        course.teacher?._id === user.id && (
                          <>
                            <button
                              onClick={() => handleEditClick(course)}
                              className="flex-1 min-w-0 bg-gradient-to-r from-stone-700 to-stone-900 text-white py-3 px-4 rounded-xl font-semibold hover:from-stone-800 hover:to-stone-900 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
                            >
                              <Pencil className="w-4 h-4" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course._id)}
                              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-100 dark:hover:bg-rose-950/30 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;

