// src/pages/CourseEdit.jsx
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { BookOpen, Sun, Moon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const CourseEdit = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "Beginner",
    duration: "",
    price: "",
  });
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!token) navigate("/login");
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

  // Fetch course details
  const fetchCourse = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({
        title: res.data.title,
        description: res.data.description,
        level: res.data.level,
        duration: res.data.duration,
        price: res.data.price,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to fetch course details!");
      navigate("/teacher/course");
    } finally {
      setLoading(false);
    }
  }, [id, token, navigate]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdateCourse = async () => {
    const { title, description, duration, price } = formData;
    if (!title || !description || !duration || !price)
      return alert("All fields are required!");
    try {
      await axios.put(
        `http://localhost:5000/api/courses/${id}`,
        { ...formData },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("Course updated successfully!");
      navigate("/teacher/course", { state: { updated: true } }); //  trigger refresh in CoursesPage
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error updating course!");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading course...</div>;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50 transition-colors duration-300 p-6">
      {/* Dark Mode Toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow hover:scale-110 transition"
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Edit Course Form */}
      <div className="mb-8 bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6" /> Edit Course
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="input px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-white"
          />
          <input
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="input px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-white"
          />
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="input px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-white"
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
            className="input px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-white"
          />
          <input
            name="price"
            type="number"
            placeholder="Price Rs."
            value={formData.price}
            onChange={handleChange}
            className="input px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-white"
          />
        </div>
        <button
          onClick={handleUpdateCourse}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-2xl shadow-lg hover:bg-blue-600 transform transition"
        >
          Update Course
        </button>
      </div>
    </div>
  );
};

export default CourseEdit;
