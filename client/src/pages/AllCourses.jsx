// src/pages/AllCourses.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CalendarCheck,
  Sun,
  Moon,
  Clock,
  User,
  TrendingUp,
  Award,
  Filter,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );
  const [savedCourseIds, setSavedCourseIds] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const isStudent = user.role === "student";

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = sessionStorage.getItem("token");
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
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();

    const fetchSavedItems = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token || !isStudent) return;

        const res = await fetch("http://localhost:5000/api/profile/saved-items", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setSavedCourseIds((data.savedCourses || []).map((c) => c._id));
      } catch (err) {
        console.error("Error fetching saved items:", err);
      }
    };
    fetchSavedItems();
  }, [isStudent]);

  const handleToggleSaveCourse = async (courseId) => {
    try {
      const token = sessionStorage.getItem("token");
      const isSaved = savedCourseIds.includes(courseId);
      const method = isSaved ? "DELETE" : "POST";

      const response = await fetch(
        `http://localhost:5000/api/profile/save-course/${courseId}`,
        {
          method,
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        setSavedCourseIds((prev) =>
          isSaved ? prev.filter((id) => id !== courseId) : [...prev, courseId],
        );
        toast.success(
          isSaved ? "Removed from saved" : "Course saved for later!",
          {
            style: {
              borderRadius: "15px",
              background: darkMode ? "#1c1917" : "#fff",
              color: darkMode ? "#fff" : "#1c1917",
              border: "1px solid #e76f51",
            },
          },
        );
      }
    } catch (err) {
      console.error("Error toggling save:", err);
      toast.error("Failed to update saved status");
    }
  };

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
        badge:
          "bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700",
        bar: "bg-stone-400",
      };
    if (levelLower === "intermediate")
      return {
        badge:
          "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-900/40",
        bar: "bg-orange-400",
      };
    if (levelLower === "advanced")
      return {
        badge:
          "bg-stone-900 text-stone-50 border-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:border-white",
        bar: "bg-stone-900 dark:bg-stone-100",
      };
    return {
      badge:
        "bg-stone-100 text-stone-700 border-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-600",
      bar: "bg-stone-400",
    };
  };

  if (loading) {
    return (
      <div className="flex min-h-screen page-surface">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full border-2 border-stone-200 dark:border-stone-700 border-t-orange-600 animate-spin mx-auto mb-5" />
            <p className="text-stone-700 dark:text-stone-300 font-semibold">
              Loading courses...
            </p>
            <p className="body-copy text-sm mt-1">
              Preparing your learning journey
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen page-surface">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="surface-card-strong p-10 max-w-sm text-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5 bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-900/40">
              <span className="text-rose-600 dark:text-rose-400 text-lg font-bold">!</span>
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50 mb-2">
              Something went wrong
            </h3>
            <p className="body-copy text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen page-surface transition-all duration-500">
      <Sidebar />

      <div className="flex-1 p-8 overflow-auto">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="icon-action absolute top-8 right-8 z-10"
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Page Header */}
        <div className="mb-10">
          <span className="section-kicker" />
          <h1 className="section-title">Discover Courses</h1>
          <p className="body-copy mt-2 text-base">
            Transform your skills with our premium learning programs
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {[
            {
              icon: <TrendingUp className="w-4 h-4 text-stone-500 dark:text-stone-400" />,
              title: "Expert-Led",
              desc: "Learn from industry professionals",
            },
            {
              icon: <Award className="w-4 h-4 text-stone-500 dark:text-stone-400" />,
              title: "Certified",
              desc: "Earn recognized certificates",
            },
            {
              icon: <Filter className="w-4 h-4 text-stone-500 dark:text-stone-400" />,
              title: "Flexible",
              desc: "Learn at your own pace",
            },
          ].map((item) => (
            <div key={item.title} className="surface-card p-5">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-stone-900 dark:text-stone-50 text-sm">
                  {item.title}
                </h3>
              </div>
              <p className="body-copy text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="surface-card-strong p-14 text-center max-w-md">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                <BookOpen className="w-8 h-8 text-stone-500 dark:text-stone-400" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-50 mb-3">
                Courses Coming Soon
              </h3>
              <p className="body-copy text-sm leading-relaxed">
                We're curating exceptional learning experiences just for you.
                Check back soon!
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Section */}
            <div className="mb-10 surface-card-strong p-7">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50">
                  Course Overview
                </h2>
                <p className="body-copy text-sm mt-1">
                  Your learning journey at a glance
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    label: "Total Courses",
                    sub: "Available to explore",
                    value: courses.length,
                  },
                  {
                    label: "Skill Levels",
                    sub: "From beginner to expert",
                    value: new Set(courses.map((course) => course.level)).size,
                  },
                  {
                    label: "Instructors",
                    sub: "Ready to guide you",
                    value: new Set(
                      courses
                        .map((course) => course.teacher?.name)
                        .filter(Boolean),
                    ).size,
                  },
                ].map((stat) => (
                  <div key={stat.label} className="surface-panel p-5">
                    <p className="text-3xl font-black text-stone-900 dark:text-stone-50">
                      {stat.value}
                    </p>
                    <p className="font-semibold text-stone-800 dark:text-stone-200 mt-1">
                      {stat.label}
                    </p>
                    <p className="body-copy text-xs mt-0.5">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course, index) => {
                const levelInfo = getLevelStyling(course.level);
                return (
                  <div
                    key={course._id}
                    className="surface-card overflow-hidden transition-all duration-200 hover:shadow-md flex flex-col"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Level accent bar */}
                    <div className={`h-1 ${levelInfo.bar}`} />

                    <div className="p-6 border-b border-stone-100 dark:border-stone-800">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50 leading-snug">
                          {course.title}
                        </h2>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${levelInfo.badge}`}
                      >
                        {course.level} Level
                      </span>
                      {isStudent && (
                        <button
                          onClick={() => handleToggleSaveCourse(course._id)}
                          className={`p-2 rounded-lg transition-all ${savedCourseIds.includes(course._id)
                            ? "text-orange-500 bg-orange-50 dark:bg-orange-950/20"
                            : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                            }`}
                          title={savedCourseIds.includes(course._id) ? "Unsave" : "Save for Later"}
                        >
                          {savedCourseIds.includes(course._id) ? (
                            <BookmarkCheck className="w-5 h-5" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Course Content */}
                    <div className="p-6 flex-grow flex flex-col">
                      {/* Course Details */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50">
                          <div className="p-1.5 rounded-lg bg-white dark:bg-stone-800 shadow-sm">
                            <Clock className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                          </div>
                          <div>
                            <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm block">
                              Duration
                            </span>
                            <p className="body-copy text-xs">
                              {course.duration}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50">
                          <div className="p-1.5 rounded-lg bg-white dark:bg-stone-800 shadow-sm">
                            <User className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                          </div>
                          <div>
                            <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm block">
                              Instructor
                            </span>
                            <p className="body-copy text-xs">
                              {course.teacher?.name || "Expert Instructor"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                        <Link
                          to={`/course/${course._id}`}
                          className="flex-1 primary-action py-3 gap-2"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>Explore Course</span>
                        </Link>


                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllCourses;
