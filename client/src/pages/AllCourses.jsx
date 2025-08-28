// src/pages/AllCourses.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, CalendarCheck, Sun, Moon } from "lucide-react";
import Sidebar from "../components/Sidebar";

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const response = await fetch("http://localhost:5000/api/courses", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) throw new Error("Unauthorized. Please login.");
          else throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        // Ensure teacher info exists
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

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

  if (loading) return <div className="p-8 text-center">Loading courses...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 p-6 relative">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow hover:scale-110 transition"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <h1 className="text-3xl font-bold text-blue-700 dark:text-white mb-6 text-center lg:text-left">
          All Available Courses
        </h1>

        {courses.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">No courses available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition"
              >
                <div>
                  <h2 className="text-xl font-semibold text-blue-600 dark:text-white">
                    {course.title}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 my-2">{course.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Duration: {course.duration}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Level: {course.level}
                  </p>
                  {/* Teacher name */}
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Teacher: {course.teacher?.name || "Unknown"}
                  </p>
                </div>

                <div className="mt-4 flex justify-between">
                  <Link
                    to={`/course/${course._id}`}
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-1 transition"
                  >
                    <BookOpen className="w-4 h-4" /> View Course
                  </Link>
                  <button
                    onClick={() => alert(`Booked: ${course.title}`)}
                    className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-1 transition"
                  >
                    <CalendarCheck className="w-4 h-4" /> Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCourses;
