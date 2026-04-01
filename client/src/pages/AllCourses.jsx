// src/pages/AllCourses.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CalendarCheck,
  Sun,
  Moon,
  GraduationCap,
  Clock,
  BarChart3,
  User,
  Star,
  TrendingUp,
  Award,
  Filter,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

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
          if (response.status === 401)
            throw new Error("Unauthorized. Please login.");
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

  // Get level styling
  const getLevelStyling = (level) => {
    const levelLower = level?.toLowerCase();
    if (levelLower === "beginner")
      return {
        bg: "from-emerald-400 to-green-500",
        text: "text-white",
        shadow: "shadow-emerald-300/50",
      };
    if (levelLower === "intermediate")
      return {
        bg: "from-amber-400 to-orange-500",
        text: "text-white",
        shadow: "shadow-amber-300/50",
      };
    if (levelLower === "advanced")
      return {
        bg: "from-red-400 to-pink-500",
        text: "text-white",
        shadow: "shadow-red-300/50",
      };
    return {
      bg: "from-gray-400 to-gray-500",
      text: "text-white",
      shadow: "shadow-gray-300/50",
    };
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-blue-800 mx-auto mb-6"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 dark:border-blue-400 absolute top-0 left-1/2 transform -translate-x-1/2"></div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-blue-200/50 dark:border-gray-600/50">
              <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
                Loading amazing courses...
              </p>
              <p className="text-blue-500/70 dark:text-blue-400/70 text-sm mt-2">
                Preparing your learning journey
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-red-200/50 dark:border-red-800/50 max-w-md">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-red-600 dark:text-red-400 text-2xl"></span>
              </div>
              <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-3">
                Oops! Something went wrong
              </h3>
              <p className="text-red-600/80 dark:text-red-400/80 font-medium">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 transition-all duration-500">
      <Sidebar />

      <div className="flex-1 p-8 relative overflow-auto">
        {/* Dark Mode Toggle */}
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

        {/* Hero Header Section */}
        <div className="mb-12 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-6 mb-8">
            <div>
              <h1 className="text-6xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent leading-tight">
                Discover Courses
              </h1>
              <p className="text-blue-600/80 dark:text-blue-300/80 text-xl mt-3 font-medium">
                Transform your skills with our premium learning programs
              </p>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto lg:mx-0">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/40 dark:border-gray-600/40 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-blue-800 dark:text-blue-300">
                  Expert-Led
                </h3>
              </div>
              <p className="text-blue-600/70 dark:text-blue-400/70 text-sm">
                Learn from industry professionals
              </p>
            </div>
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/40 dark:border-gray-600/40 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-xl">
                  <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-blue-800 dark:text-blue-300">
                  Certified
                </h3>
              </div>
              <p className="text-blue-600/70 dark:text-blue-400/70 text-sm">
                Earn recognized certificates
              </p>
            </div>
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/40 dark:border-gray-600/40 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-xl">
                  <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-blue-800 dark:text-blue-300">
                  Flexible
                </h3>
              </div>
              <p className="text-blue-600/70 dark:text-blue-400/70 text-sm">
                Learn at your own pace
              </p>
            </div>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-16 border border-blue-200/50 dark:border-gray-600/50 text-center max-w-2xl">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-200 dark:from-blue-900/50 dark:via-blue-800/50 dark:to-indigo-800/50 rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <BookOpen className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✨</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-blue-800 dark:text-blue-300 mb-4">
                Amazing Courses Coming Soon!
              </h3>
              <p className="text-blue-600/70 dark:text-blue-400/70 text-lg leading-relaxed">
                We're curating exceptional learning experiences just for you.
                Check back soon for exciting new courses!
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Enhanced Stats Section */}
            <div className="mb-12">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-blue-200/50 dark:border-gray-600/50 p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2">
                    Course Overview
                  </h2>
                  <p className="text-blue-600/70 dark:text-blue-400/70">
                    Your learning journey at a glance
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center group">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                        <span className="text-3xl font-black text-white">
                          {courses.length}
                        </span>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                      Total Courses
                    </div>
                    <div className="text-blue-600/70 dark:text-blue-400/70 text-sm">
                      Available to explore
                    </div>
                  </div>

                  <div className="text-center group">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-2xl shadow-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                        <span className="text-3xl font-black text-white">
                          {new Set(courses.map((course) => course.level)).size}
                        </span>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                      Skill Levels
                    </div>
                    <div className="text-blue-600/70 dark:text-blue-400/70 text-sm">
                      From beginner to expert
                    </div>
                  </div>

                  <div className="text-center group">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl shadow-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                        <span className="text-3xl font-black text-white">
                          {
                            new Set(
                              courses
                                .map((course) => course.teacher?.name)
                                .filter(Boolean),
                            ).size
                          }
                        </span>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                      Expert Instructors
                    </div>
                    <div className="text-blue-600/70 dark:text-blue-400/70 text-sm">
                      Ready to guide you
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {courses.map((course, index) => {
                const levelInfo = getLevelStyling(course.level);
                return (
                  <div
                    key={course._id}
                    className="group bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl border border-blue-200/50 dark:border-gray-600/50 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:border-blue-300/70 dark:hover:border-blue-500/50 flex flex-col"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Course Header with Gradient */}
                    <div className="relative p-6 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-600/20 dark:via-indigo-600/20 dark:to-purple-600/20 border-b border-blue-200/30 dark:border-gray-600/30">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors leading-tight mb-3">
                            {course.title}
                          </h2>
                          <div
                            className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${levelInfo.bg} rounded-full ${levelInfo.shadow} shadow-lg`}
                          >
                            <span className="text-lg">{levelInfo.icon}</span>
                            <span
                              className={`font-bold text-sm ${levelInfo.text}`}
                            >
                              {course.level} Level
                            </span>
                          </div>
                        </div>
                        <div className="p-3 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                          <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    </div>

                    {/* Course Content */}
                    <div className="p-6 flex-grow flex flex-col">
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6 flex-grow">
                        {course.description}
                      </p>

                      {/* Course Details */}
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-4 p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-100/50 dark:border-blue-800/30">
                          <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <span className="font-semibold text-blue-800 dark:text-blue-300 text-sm">
                              Duration
                            </span>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {course.duration}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-100/50 dark:border-blue-800/30">
                          <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <span className="font-semibold text-blue-800 dark:text-blue-300 text-sm">
                              Instructor
                            </span>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {course.teacher?.name || "Expert Instructor"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          to={`/course/${course._id}`}
                          className="flex-1 group/btn relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                          <BookOpen className="w-5 h-5 relative z-10 group-hover/btn:rotate-12 transition-transform duration-300" />
                          <span className="relative z-10">Explore Course</span>
                        </Link>

                        <button
                          onClick={() => alert(`Booked: ${course.title}`)}
                          className="flex-1 group/btn relative overflow-hidden bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                          <CalendarCheck className="w-5 h-5 relative z-10 group-hover/btn:rotate-12 transition-transform duration-300" />
                          <span className="relative z-10">Book Now</span>
                        </button>
                      </div>
                    </div>

                    {/* Card Footer Accent */}
                    <div className="h-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Enhanced Decorative Elements */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          {/* Floating orbs */}
          <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-r from-blue-200/20 to-indigo-300/20 dark:from-blue-800/10 dark:to-indigo-700/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 left-20 w-52 h-52 bg-gradient-to-r from-purple-200/20 to-pink-300/20 dark:from-purple-700/10 dark:to-pink-600/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/3 w-32 h-32 bg-gradient-to-r from-indigo-200/20 to-blue-300/20 dark:from-indigo-600/10 dark:to-blue-500/10 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/4 left-3/4 w-36 h-36 bg-gradient-to-r from-cyan-200/20 to-blue-300/20 dark:from-cyan-600/10 dark:to-blue-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "3s" }}
          ></div>

          {/* Floating particles */}
          <div
            className="absolute top-1/3 left-1/4 w-2 h-2 bg-blue-400/40 dark:bg-blue-300/30 rounded-full animate-bounce"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute top-2/3 right-1/4 w-3 h-3 bg-indigo-400/40 dark:bg-indigo-300/30 rounded-full animate-bounce"
            style={{ animationDelay: "1.5s" }}
          ></div>
          <div
            className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-purple-400/40 dark:bg-purple-300/30 rounded-full animate-bounce"
            style={{ animationDelay: "2.5s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AllCourses;
