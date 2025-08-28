// src/pages/CoursesPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { BookOpen, Pencil, Trash2, Sun, Moon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

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
    if (!title || !description || !duration || !price) return alert("All fields are required!");
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

  if (loading) return <div className="p-8 text-center">Loading courses...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300 p-6">
      {/* Dark Mode Toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow hover:scale-110 transition"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Teacher Create Course Form */}
      {user?.role === "teacher" && (
        <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6" /> Create a New Course
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className="input px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <input
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="input px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="input px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Expert</option>
            </select>
            <input
              name="duration"
              placeholder="Duration"
              value={formData.duration}
              onChange={handleChange}
              className="input px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <input
              name="price"
              type="number"
              placeholder="Price $"
              value={formData.price}
              onChange={handleChange}
              className="input px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            onClick={handleCreateCourse}
            className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-2xl shadow-lg hover:scale-105 transform transition"
          >
            + Create Course
          </button>
        </div>
      )}

      {/* Courses List */}
      <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">All Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 && (
          <p className="text-gray-500 dark:text-gray-300 col-span-full text-center">
            No courses found.
          </p>
        )}
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:scale-105"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{course.title}</h3>
            <p className="text-gray-500 dark:text-gray-300">
              {course.level} | {course.duration} | ${course.price}
            </p>
            <p className="text-gray-600 dark:text-gray-200 mt-2">{course.description}</p>

            <div className="flex gap-3 mt-4">
              <Link
                to={`/courses/view/${course._id}`}
                className="text-green-600 hover:underline font-medium"
              >
                View
              </Link>

              {/* Only the teacher who created the course sees Edit/Delete */}
              {user?.role === "teacher" && course.teacher?._id === user.id && (
                <>
                  <Link
                    to={`/courses/edit/${course._id}`}
                    className="text-blue-600 hover:underline font-medium flex items-center gap-1"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteCourse(course._id)}
                    className="text-red-500 hover:underline font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
