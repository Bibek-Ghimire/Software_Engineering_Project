// src/pages/CoursesPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { BookOpen, Pencil, Trash2, Sun, Moon, Plus, Eye, Clock, DollarSign, GraduationCap, Save, X, Users, Star, Calendar, Award } from "lucide-react";
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
  });
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    level: "Beginner",
    duration: "",
    price: "",
  });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);

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
  const fetchCourses = async () => {
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
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreateCourse = async () => {
    const { title, description, level, duration, price } = formData;
    if (!title || !description || !duration || !price)
      return alert("All fields are required!");
    try {
      await axios.post(
        "http://localhost:5000/api/courses",
        { ...formData, teacher: user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Course created successfully!");
      setFormData({ title: "", description: "", level: "Beginner", duration: "", price: "" });
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
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleUpdateCourse = async () => {
    const { title, description, level, duration, price } = editFormData;
    if (!title || !description || !duration || !price)
      return alert("All fields are required!");
    try {
      await axios.put(
        `http://localhost:5000/api/courses/${editingCourseId}`,
        editFormData,
        { headers: { Authorization: `Bearer ${token}` } }
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
      case "Beginner": return "from-green-100 to-emerald-100 text-green-800 border-green-200/50";
      case "Intermediate": return "from-yellow-100 to-amber-100 text-amber-800 border-amber-200/50";
      case "Expert": return "from-red-100 to-rose-100 text-red-800 border-red-200/50";
      default: return "from-gray-100 to-slate-100 text-gray-800 border-gray-200/50";
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case "Beginner": return <Star className="w-4 h-4" />;
      case "Intermediate": return <Award className="w-4 h-4" />;
      case "Expert": return <GraduationCap className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
        <div className="w-64 fixed top-0 left-0 h-full z-30">
          <TeacherSidebar />
        </div>
        <div className="ml-64 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl font-semibold text-sky-700 animate-pulse">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-all duration-700 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-sky-200/15 to-blue-300/10 rounded-full blur-3xl -translate-y-48 translate-x-48 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-200/10 to-sky-300/15 rounded-full blur-3xl translate-y-32 -translate-x-32 animate-pulse"></div>

      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full z-30">
        <TeacherSidebar />
      </div>
      
      <div className="ml-64 flex-1 p-8 relative z-10">
        {/* Header with Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 dark:from-sky-400 dark:to-blue-500 bg-clip-text text-transparent mb-2">
              Course Management
            </h1>
            <p className="text-sky-600 dark:text-sky-400 font-medium flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Create and manage your educational content
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-sky-600 dark:text-sky-400 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 border border-sky-200/50 dark:border-gray-700"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Teacher Create Course Form */}
        {user?.role === "teacher" && (
          <div className="mb-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-sky-100/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-sky-700 dark:text-sky-300">Create a New Course</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-sky-600 dark:text-sky-400 mb-2 uppercase tracking-wide">Title</label>
                <input
                  name="title"
                  placeholder="Course title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-sky-200/50 dark:border-sky-700/50 rounded-xl dark:bg-gray-700/50 dark:text-white focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-sky-600 dark:text-sky-400 mb-2 uppercase tracking-wide">Description</label>
                <input
                  name="description"
                  placeholder="Brief description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-sky-200/50 dark:border-sky-700/50 rounded-xl dark:bg-gray-700/50 dark:text-white focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-sky-600 dark:text-sky-400 mb-2 uppercase tracking-wide">Level</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-sky-200/50 dark:border-sky-700/50 rounded-xl dark:bg-gray-700/50 dark:text-white focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20 transition-all duration-300 backdrop-blur-sm"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-sky-600 dark:text-sky-400 mb-2 uppercase tracking-wide">Duration</label>
                <input
                  name="duration"
                  placeholder="e.g. 8 weeks"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-sky-200/50 dark:border-sky-700/50 rounded-xl dark:bg-gray-700/50 dark:text-white focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-sky-600 dark:text-sky-400 mb-2 uppercase tracking-wide">Price</label>
                <input
                  name="price"
                  type="number"
                  placeholder="0"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-sky-200/50 dark:border-sky-700/50 rounded-xl dark:bg-gray-700/50 dark:text-white focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>
            
            <button
              onClick={handleCreateCourse}
              className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-8 py-4 rounded-xl shadow-lg hover:from-sky-600 hover:to-blue-700 hover:scale-105 transition-all duration-300 font-bold flex items-center gap-3 hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Create Course
            </button>
          </div>
        )}

        {/* Courses List Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-sky-700 dark:text-sky-300">All Courses</h2>
          </div>
          <div className="flex items-center gap-4 text-sky-600 dark:text-sky-400">
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-sky-200/50 dark:border-gray-700/50 shadow-md">
              <Users className="w-4 h-4" />
              <span className="font-medium">{courses.length} courses</span>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.length === 0 && !loading && (
            <div className="col-span-full text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-sky-200 to-blue-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-sky-600" />
              </div>
              <p className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">No courses found</p>
              <p className="text-gray-400 dark:text-gray-500">Create your first course to get started!</p>
            </div>
          )}
          
          {courses.map((course, index) => (
            <div
              key={course._id}
              className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-sky-100/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              {editingCourseId === course._id ? (
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-sky-600 dark:text-sky-400 mb-2 uppercase tracking-wide">Title</label>
                      <input
                        name="title"
                        value={editFormData.title}
                        onChange={handleEditChange}
                        className="w-full p-3 border-2 border-sky-200/50 dark:border-sky-700/50 rounded-xl dark:bg-gray-700/50 dark:text-white focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-sky-600 dark:text-sky-400 mb-2 uppercase tracking-wide">Description</label>
                      <textarea
                        name="description"
                        value={editFormData.description}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full p-3 border-2 border-sky-200/50 dark:border-sky-700/50 rounded-xl dark:bg-gray-700/50 dark:text-white focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20 transition-all duration-300 resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-sky-600 dark:text-sky-400 mb-2">Level</label>
                        <select
                          name="level"
                          value={editFormData.level}
                          onChange={handleEditChange}
                          className="w-full p-3 border-2 border-sky-200/50 dark:border-sky-700/50 rounded-xl dark:bg-gray-700/50 dark:text-white focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20 transition-all duration-300"
                        >
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Expert</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-sky-600 dark:text-sky-400 mb-2">Duration</label>
                        <input
                          name="duration"
                          value={editFormData.duration}
                          onChange={handleEditChange}
                          className="w-full p-3 border-2 border-sky-200/50 dark:border-sky-700/50 rounded-xl dark:bg-gray-700/50 dark:text-white focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20 transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-sky-600 dark:text-sky-400 mb-2">Price</label>
                        <input
                          name="price"
                          type="number"
                          value={editFormData.price}
                          onChange={handleEditChange}
                          className="w-full p-3 border-2 border-sky-200/50 dark:border-sky-700/50 rounded-xl dark:bg-gray-700/50 dark:text-white focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20 transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleUpdateCourse}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" /> Save
                    </button>
                    <button
                      onClick={() => setEditingCourseId(null)}
                      className="flex-1 bg-gradient-to-r from-gray-500 to-slate-600 text-white py-3 rounded-xl font-semibold hover:from-gray-600 hover:to-slate-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Course Header */}
                  <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl translate-x-16 -translate-y-16"></div>
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{course.title}</h3>
                      <div className="flex items-center gap-4 text-sky-100">
                        <span className={`px-3 py-1 bg-gradient-to-r ${getLevelColor(course.level)} rounded-full text-xs font-bold flex items-center gap-1 text-gray-800`}>
                          {getLevelIcon(course.level)}
                          {course.level}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Course Meta Info */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-xl border border-sky-200/50 dark:border-sky-700/50">
                        <Clock className="w-4 h-4 text-sky-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50">
                        <DollarSign className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">${course.price}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/courses/view/${course._id}`}
                        className="flex-1 min-w-0 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" /> View
                      </Link>

                      {user?.role === "teacher" && course.teacher?._id === user.id && (
                        <>
                          <button
                            onClick={() => handleEditClick(course)}
                            className="flex-1 min-w-0 bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-sky-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
                          >
                            <Pencil className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course._id)}
                            className="bg-gradient-to-r from-red-500 to-rose-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
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