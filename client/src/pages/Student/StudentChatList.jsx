import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { MessageSquare, BookOpen, User, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "../../components/Sidebar";

const StudentChatList = () => {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  const token = sessionStorage.getItem("token");

  // Fetch enrolled courses
  const fetchEnrolledCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/chat/student/enrolled-courses",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setEnrolledCourses(response.data.courses || []);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      toast.error("Failed to fetch enrolled courses");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchEnrolledCourses();
    }
  }, [token, fetchEnrolledCourses]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  if (loading) {
    return (
      <div className="flex min-h-screen page-surface">
        <div className="w-64 fixed top-0 left-0 h-full z-30">
          <Sidebar />
        </div>
        <div className="ml-64 w-full flex items-center justify-center p-6">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            <p className="mt-4 text-gray-700 dark:text-gray-300 text-lg font-semibold">
              Loading courses...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen page-surface">
      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full z-30">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="ml-64 w-full relative">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-8 right-8 p-4 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-blue-600 dark:text-blue-400 shadow-xl hover:shadow-2xl hover:scale-110 border-2 border-blue-200/50 dark:border-gray-600/50 transition-all duration-300 z-10 group"
        >
          {darkMode ? (
            <Sun className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
          ) : (
            <Moon className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
          )}
        </button>
        <div className="p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              Course Chat
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Connect with your instructors in course-specific chat rooms
            </p>
          </motion.div>

          {/* Enrolled Courses */}
          {enrolledCourses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <BookOpen className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                You haven't enrolled in any courses yet
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(`/student/chat/${course._id}`)}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-400 transition-all cursor-pointer"
                >
                  {/* Course Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
                        {course.title}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {course.description || "No description provided"}
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </div>

                  {/* Instructor Info */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                      {course.teacher?.name?.[0]?.toUpperCase() || "T"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {course.teacher?.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Instructor
                      </p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Open Chat
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentChatList;

