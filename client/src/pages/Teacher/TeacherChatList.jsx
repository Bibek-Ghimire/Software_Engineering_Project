import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { MessageSquare, BookOpen, Users, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import TeacherSidebar from "../../components/TeacherSidebar";

const TeacherChatList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentCounts, setStudentCounts] = useState({});
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  const token = sessionStorage.getItem("token");

  // Fetch teacher's courses
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/teachers/courses",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Handle both response formats for backward compatibility
      const teacherCourses = response.data.courses || response.data || [];
      console.log("Fetched courses:", teacherCourses);
      setCourses(teacherCourses);

      // Get student count for each course
      const counts = {};
      for (const course of teacherCourses) {
        try {
          const studentsResponse = await axios.get(
            `http://localhost:5000/api/chat/course/${course._id}/approved-students`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          counts[course._id] = studentsResponse.data.students.length;
        } catch (error) {
          counts[course._id] = 0;
        }
      }
      setStudentCounts(counts);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchCourses();
    }
  }, [token, fetchCourses]);

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
          <TeacherSidebar />
        </div>
        <div className="ml-64 w-full flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-stone-200 dark:border-stone-700 border-t-orange-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-stone-700 dark:text-stone-300 text-lg font-semibold">
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
        <TeacherSidebar />
      </div>

      {/* Main Content */}
      <div className="ml-64 w-full relative">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-8 right-8 icon-action absolute top-8 right-8 z-10"
        >
          {darkMode ? (
            <Sun className="w-6 h-6" />
          ) : (
            <Moon className="w-6 h-6" />
          )}
        </button>
        <div className="p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-stone-900 dark:text-stone-50 mb-2">
              Course Chat
            </h1>
            <p className="text-stone-500 dark:text-stone-500">
              Connect with your approved students in course-specific chat rooms
            </p>
          </motion.div>

          {/* Courses Grid */}
          {courses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <BookOpen className="w-14 h-14 mx-auto text-stone-300 dark:text-stone-600 mb-4" />
              <p className="text-stone-500 dark:text-stone-500 text-lg">
                No courses found. Create a course to start chatting!
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(`/teacher/chat/${course._id}`)}
                  className="bg-white dark:bg-stone-900 rounded-xl shadow-lg p-6 border border-stone-200 dark:border-stone-700 hover:shadow-xl hover:border-orange-500 dark:hover:border-orange-400 transition-all cursor-pointer"
                >
                  {/* Course Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50 mb-2 line-clamp-2">
                        {course.title}
                      </h2>
                      <p className="text-sm text-stone-500 dark:text-stone-500 line-clamp-2">
                        {course.description || "No description provided"}
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-100 dark:border-orange-900/40">
                        <MessageSquare className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 pt-4 border-t border-stone-100 dark:border-stone-800">
                    <div className="flex items-center gap-2 text-stone-500 dark:text-stone-500">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        {studentCounts[course._id] || 0} students
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className="w-full mt-4 px-4 py-2 bg-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2">
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

export default TeacherChatList;

