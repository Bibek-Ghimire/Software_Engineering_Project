// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Bell,
  User,
  Sun,
  Moon,
  Users,
  Award,
  TrendingUp,
  Sparkles,
  Target,
  Clock,
  Star,
  CheckCircle,
  Trophy,
  BookMarked,
  GraduationCap,
  Zap,
  Flame,
  Lightbulb,
  FileText,
  ArrowUpRight,
  Bookmark,
  BookmarkCheck,
  Package,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import student from "../assets/images/student.jpg";
import recommendationService from "../services/recommendationService";
import RecommendedTeachers from "../components/RecommendedTeachers";
import RecommendedResources from "../components/RecommendedResources";
import { useNotification } from "../hooks/useNotification";
import HumanoidAvatar from "../components/HumanoidAvatar";
import Sidebar from "../components/Sidebar";

const user = JSON.parse(sessionStorage.getItem("user"));

const EnhancedStatCard = ({ title, value, iconColor, icon, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    className="surface-card p-6 cursor-pointer hover:shadow-md transition-all duration-300 group"
  >
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <p className="text-stone-500 dark:text-stone-400 text-xs font-black uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-3xl font-bold text-stone-900 dark:text-stone-50">
          {value}
        </h3>
        <p className="text-stone-400 dark:text-stone-500 text-xs font-medium">
          {subtitle}
        </p>
      </div>
      <div
        className={`p-3 rounded-xl bg-stone-100 dark:bg-stone-800 transition-colors group-hover:bg-orange-50 dark:group-hover:bg-orange-950/20`}
      >
        {React.cloneElement(icon, {
          className: "w-5 h-5 text-orange-600 dark:text-orange-400",
        })}
      </div>
    </div>
  </motion.div>
);

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [badgesCount, setBadgesCount] = useState(0);
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark"),
  );
  const [teachers, setTeachers] = useState([]);
  const [batch, setBatch] = useState(null);
  const [batchMembers, setBatchMembers] = useState([]);
  const [similarUsers, setSimilarUsers] = useState([]);
  const [batchLoading, setBatchLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [savedItems, setSavedItems] = useState({
    savedCourses: [],
    savedResources: [],
    completedCourses: [],
  });
  const [savedLoading, setSavedLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    const fetchCourses = async () => {
      try {
        // Fetch recommended courses instead of all courses
        const recommendedCourses =
          await recommendationService.getRecommendedCourses(12);
        setCourses(recommendedCourses);
      } catch (err) {
        console.error("Error fetching recommended courses:", err);
        setCourses([]);
      }
    };

    const fetchBadges = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/badges", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Handle both array and nested data formats
        const badgesData = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];
        setBadgesCount(badgesData.length);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchTeachers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/teachers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Handle both array and nested data formats
        const teachersData = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];
        setTeachers(teachersData);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchBatchData = async () => {
      try {
        setBatchLoading(true);
        const batchRes = await axios.get(
          "http://localhost:5000/api/batches/protected/my-batch",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        // Extract the batch data from the response
        const batchData = batchRes.data.data || batchRes.data;
        setBatch(batchData);

        if (batchData?._id) {
          const membersRes = await axios.get(
            "http://localhost:5000/api/batches/protected/my-batch/members",
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          // Extract members array from response
          const membersData = membersRes.data.data || membersRes.data || [];
          setBatchMembers(membersData);

          const similarRes = await axios.get(
            "http://localhost:5000/api/batches/protected/my-batch/similar-users",
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          // Extract similar users from response
          const similarData = similarRes.data.data || similarRes.data || [];
          setSimilarUsers(similarData);
        }
      } catch (err) {
        console.error("Error fetching batch data:", err);
      } finally {
        setBatchLoading(false);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/notifications",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setNotifications(response.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    const fetchSavedItems = async () => {
      try {
        setSavedLoading(true);
        const res = await axios.get(
          "http://localhost:5000/api/profile/saved-items",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setSavedItems(res.data);
      } catch (err) {
        console.error("Error fetching saved items:", err);
      } finally {
        setSavedLoading(false);
      }
    };

    const fetchEnrolledCourses = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/profile/enrolled-courses",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        console.log(
          "📚 Enrolled Courses Response:",
          res.data,
          "Count:",
          res.data?.length || 0,
        );
        setEnrolledCourses(res.data);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
        setEnrolledCourses([]);
      }
    };

    fetchCourses();
    fetchBadges();
    fetchTeachers();
    fetchBatchData();
    fetchNotifications();
    fetchSavedItems();
    fetchEnrolledCourses();

    // Refresh notifications every 30 seconds
    const notificationInterval = setInterval(fetchNotifications, 30000);

    // Refresh enrolled courses every 30 seconds for dynamic updates
    const enrolledCoursesInterval = setInterval(fetchEnrolledCourses, 30000);

    return () => {
      clearInterval(notificationInterval);
      clearInterval(enrolledCoursesInterval);
    };
  }, []);

  const handleToggleSaveCourse = async (courseId) => {
    try {
      const token = sessionStorage.getItem("token");
      const isSaved = savedItems.savedCourses.some((c) => c._id === courseId);
      const method = isSaved ? "DELETE" : "POST";

      const response = await fetch(
        `http://localhost:5000/api/profile/save-course/${courseId}`,
        {
          method,
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        // Fetch saved items again to ensure full data (like teacher name) is populated
        const res = await axios.get(
          "http://localhost:5000/api/profile/saved-items",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setSavedItems(res.data);

        toast.success(
          isSaved ? "Removed from saved" : "Course saved to your dashboard!",
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

  const handleToggleSaveResource = async (resourceId) => {
    try {
      const token = sessionStorage.getItem("token");
      const isSaved = savedItems.savedResources.some(
        (r) => r._id === resourceId,
      );
      const method = isSaved ? "DELETE" : "POST";

      const response = await fetch(
        `http://localhost:5000/api/profile/save-resource/${resourceId}`,
        {
          method,
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        const res = await axios.get(
          "http://localhost:5000/api/profile/saved-items",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setSavedItems(res.data);

        toast.success(isSaved ? "Removed from saved" : "Resource bookmarked!", {
          style: {
            borderRadius: "15px",
            background: darkMode ? "#1c1917" : "#fff",
            color: darkMode ? "#fff" : "#1c1917",
            border: "1px solid #e76f51",
          },
        });
      }
    } catch (err) {
      console.error("Error toggling save:", err);
      toast.error("Failed to update saved status");
    }
  };

  // Listen for socket notifications and refresh
  const {
    fetchNotifications: fetchNotificationsFromContext,
    markNotificationAsRead,
  } = useNotification();
  useEffect(() => {
    if (fetchNotificationsFromContext) {
      const refreshNotifications = async () => {
        await fetchNotificationsFromContext();
        const token = sessionStorage.getItem("token");
        try {
          const response = await axios.get(
            "http://localhost:5000/api/notifications",
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          setNotifications(response.data);
        } catch (err) {
          console.error("Error refreshing notifications:", err);
        }
      };

      // Listen for enrollment approved events
      const handleEnrollmentApproved = () => {
        console.log(
          " Enrollment approved - refreshing student notifications...",
        );
        refreshNotifications();
      };

      // Subscribe to enrollment approved events
      window.addEventListener("enrollmentApproved", handleEnrollmentApproved);
      return () => {
        window.removeEventListener(
          "enrollmentApproved",
          handleEnrollmentApproved,
        );
      };
    }
  }, [fetchNotificationsFromContext]);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  };

  const getTeacherHours = (teacher) =>
    teacher?.hours ?? teacher?.teachingHours ?? teacher?.totalHours ?? 0;

  const getTeacherEngagements = (teacher) =>
    teacher?.engagements ??
    teacher?.engagementScore ??
    teacher?.totalEngagements ??
    0;

  const getTeacherScore = (teacher) =>
    teacher?.totalScore ?? teacher?.score ?? teacher?.engagementScore ?? 0;

  const getTeacherName = (teacher) =>
    teacher?.name ?? teacher?.fullName ?? "Unknown Teacher";

  const getTier = (teacher) => {
    const hours = getTeacherHours(teacher);
    const engagements = getTeacherEngagements(teacher);

    if (hours >= 500 && engagements >= 2000) return "Platinum";
    if (hours >= 300 && engagements >= 1000) return "Diamond";
    if (hours >= 200 && engagements >= 500) return "Gold";
    if (hours >= 100 && engagements >= 200) return "Silver";
    return "Basic";
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case "Platinum":
        return "bg-stone-800 text-stone-100 dark:bg-stone-100 dark:text-stone-900";
      case "Diamond":
        return "bg-orange-600 text-white";
      case "Gold":
        return "bg-orange-400 text-white";
      case "Silver":
        return "bg-stone-400 text-white";
      default:
        return "bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300";
    }
  };

  const getProgressPercentage = () => {
    if (enrolledCourses.length === 0) return 0;
    const completed = savedItems.completedCourses?.length || 0;
    return Math.round((completed / enrolledCourses.length) * 100);
  };

  const handleToggleCompleteCourse = async (courseId) => {
    try {
      const token = sessionStorage.getItem("token");
      const isCompleted = savedItems.completedCourses?.some(
        (c) => c._id === courseId || c === courseId,
      );
      const method = isCompleted ? "DELETE" : "POST";

      const response = await fetch(
        `http://localhost:5000/api/profile/complete-course/${courseId}`,
        {
          method,
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        // Refresh both sets of data for dynamic dashboard updates
        const fetchItems = async () => {
          const [savedRes, enrolledRes] = await Promise.all([
            axios.get("http://localhost:5000/api/profile/saved-items", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("http://localhost:5000/api/profile/enrolled-courses", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);
          setSavedItems(savedRes.data);
          setEnrolledCourses(enrolledRes.data);
        };

        await fetchItems();

        toast.success(
          isCompleted ? "Course marked as in-progress" : "Course Completed!",
          {
            style: {
              borderRadius: "15px",
              background: darkMode ? "#1c1917" : "#fff",
              color: darkMode ? "#fff" : "#1c1917",
              border: "1px solid #10b981",
            },
          },
        );
      }
    } catch (err) {
      console.error("Error toggling complete:", err);
      toast.error("Failed to update completion status");
    }
  };

  return (
    <div className="flex min-h-screen page-surface transition-all duration-700">
      <Sidebar />

      <div className="flex-1 p-8 space-y-8 overflow-y-auto">
        {/* Enhanced Top Navigation */}
        <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="brand-title text-4xl font-bold text-stone-900 dark:text-stone-50 leading-tight">
              Learning Hub
            </h1>
            <p className="text-stone-500 dark:text-stone-400 mt-1.5 text-base">
              Your journey to knowledge starts here
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="icon-action"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-stone-500" />
              )}
            </button>

            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="icon-action relative"
            >
              <Bell className="w-5 h-5" />
              {notifications.filter((n) => !n.isRead).length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {notifications.filter((n) => !n.isRead).length}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="secondary-action gap-2"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </button>
          </div>
        </motion.div>

        {/* Notifications Panel */}
        {showNotifications && (
          <motion.div
            className="fixed top-24 right-8 w-96 surface-card-strong z-50 max-h-96 overflow-y-auto"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
          >
            <div className="sticky top-0 bg-white dark:bg-stone-900 p-4 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center">
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-50">
                Notifications
              </h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
              >
                ✕
              </button>
            </div>

            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="w-7 h-7 mx-auto mb-2 text-stone-300 dark:text-stone-600" />
                <p className="body-copy text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-stone-100 dark:divide-stone-800">
                {notifications.slice(0, 10).map((notification) => (
                  <motion.div
                    key={notification._id}
                    className={`p-4 hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors cursor-pointer ${!notification.isRead
                      ? "bg-orange-50 dark:bg-orange-950/10 border-l-4 border-l-orange-500"
                      : ""
                      }`}
                    onClick={() =>
                      !notification.isRead &&
                      markNotificationAsRead(notification._id)
                    }
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-stone-900 dark:text-stone-50 text-sm mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-xs body-copy line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-stone-400 dark:text-stone-500 mt-1.5">
                          {new Date(notification.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Enhanced Hero Section */}
        <motion.div
          className="relative w-full h-96 rounded-3xl overflow-hidden shadow-2xl group"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={student}
            alt="Learning background"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-stone-900/80" />

          <div className="relative z-10 h-full flex items-center justify-between px-12 py-8">
            <div className="text-white space-y-6 max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-orange-400 font-bold text-xs uppercase tracking-widest">
                    Welcome
                  </span>
                </div>
                <h1 className="text-6xl font-black leading-tight mb-2 brand-title">
                  Hey, <span className="text-orange-300">{user.name}</span>!
                </h1>
                <p className="text-lg text-stone-100 font-medium">
                  Your learning journey awaits. Explore new horizons today!
                </p>
              </motion.div>

              <motion.div
                className="flex items-center gap-3 flex-wrap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-xl rounded-full px-5 py-3 border border-white/30 hover:bg-white/30 transition-all">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-semibold">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-xl rounded-full px-5 py-3 border border-white/30 hover:bg-white/30 transition-all">
                  <span className="text-sm font-semibold">
                    {getProgressPercentage()}% Done
                  </span>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="hidden xl:block"
              initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
            >
              <div className="relative w-56 h-56 flex items-center justify-center">
                <motion.div
                  className="absolute w-40 h-40 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <GraduationCap className="w-20 h-20 text-yellow-200" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <EnhancedStatCard
            title="Enrolled Courses"
            value={enrolledCourses.length}
            iconColor="bg-stone-100 dark:bg-stone-800/60 text-orange-600 dark:text-orange-400"
            icon={<BookOpen className="w-5 h-5" />}
            subtitle="Active learning"
          />
          <EnhancedStatCard
            title="Completed"
            value={savedItems.completedCourses?.length || 0}
            iconColor="bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400"
            icon={<CheckCircle className="w-5 h-5" />}
            subtitle="Success rate"
          />
          <EnhancedStatCard
            title="Saved Items"
            value={savedItems.savedCourses?.length + savedItems.savedResources?.length || 0}
            iconColor="bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400"
            icon={<Bookmark className="w-5 h-5" />}
            subtitle="Saves"
          />
        </div>

        {/* Saved Content Section - Relocated & Redesigned */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="surface-card-strong p-8 relative overflow-hidden border-none shadow-xl">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-500/20 rounded-2xl blur-lg animate-pulse" />
                  <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20">
                    <Bookmark className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-stone-900 dark:text-stone-50 tracking-tight">
                    Saved Library
                  </h3>
                  <p className="text-sm body-copy mt-1 font-medium">
                    Your curated collection of learning materials
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-widest">
                  {savedItems.savedCourses.length +
                    savedItems.savedResources.length}{" "}
                  Items
                </div>
              </div>
            </div>

            {savedItems.savedCourses.length === 0 &&
              savedItems.savedResources.length === 0 ? (
              <div className="py-12 px-6 text-center surface-card border-dashed border-2 border-stone-200 dark:border-stone-800 rounded-3xl">
                <div className="w-16 h-16 rounded-full bg-stone-50 dark:bg-stone-900 flex items-center justify-center mx-auto mb-4 border border-stone-100 dark:border-stone-800">
                  <Package className="w-8 h-8 text-stone-300 dark:text-stone-600" />
                </div>
                <h4 className="text-lg font-bold text-stone-800 dark:text-stone-200 mb-1">
                  Your library is waiting
                </h4>
                <p className="body-copy text-sm max-w-xs mx-auto">
                  Save courses and resources as you explore to see them here for
                  quick access.
                </p>
                <button
                  onClick={() => navigate("/courses")}
                  className="mt-6 text-sm font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center justify-center gap-1.5 mx-auto"
                >
                  Start Exploring <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                {/* Saved Courses Column */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1 h-4 bg-orange-500 rounded-full" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-stone-400 dark:text-stone-500">
                      Saved Courses
                    </h4>
                  </div>

                  {savedItems.savedCourses.length === 0 ? (
                    <div className="p-4 rounded-2xl border border-stone-100 dark:border-stone-800 text-xs body-copy text-center italic">
                      No courses saved yet
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {savedItems.savedCourses.slice(0, 4).map((course) => (
                        <motion.div
                          key={course._id}
                          whileHover={{
                            x: 6,
                            backgroundColor: darkMode
                              ? "rgba(41, 37, 36, 0.6)"
                              : "rgba(250, 250, 249, 1)",
                          }}
                          onClick={() => navigate(`/course/${course._id}`)}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-stone-900/40 border border-stone-100 dark:border-stone-800 cursor-pointer group transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                          <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center border border-orange-100 dark:border-orange-900/30">
                            <BookOpen className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-stone-900 dark:text-stone-50 text-sm truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                              {course.title}
                            </h5>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-500 font-bold uppercase">
                                {course.level}
                              </span>
                              <span className="text-xs text-stone-400 dark:text-stone-500 truncate font-medium">
                                {course.teacher?.name || "Expert Instructor"}
                              </span>
                            </div>
                          </div>
                          <div className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-stone-100 dark:bg-stone-800">
                            <ArrowUpRight className="w-4 h-4 text-orange-500" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Saved Resources Column */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1 h-4 bg-blue-500 rounded-full" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-stone-400 dark:text-stone-500">
                      Saved Resources
                    </h4>
                  </div>

                  {savedItems.savedResources.length === 0 ? (
                    <div className="p-4 rounded-2xl border border-stone-100 dark:border-stone-800 text-xs body-copy text-center italic">
                      No resources saved yet
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {savedItems.savedResources.slice(0, 4).map((resource) => (
                        <motion.div
                          key={resource._id}
                          whileHover={{
                            x: 6,
                            backgroundColor: darkMode
                              ? "rgba(41, 37, 36, 0.6)"
                              : "rgba(250, 250, 249, 1)",
                          }}
                          onClick={() => navigate("/resources")}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-stone-900/40 border border-stone-100 dark:border-stone-800 cursor-pointer group transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                          <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center border border-blue-100 dark:border-blue-900/30">
                            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-stone-900 dark:text-stone-50 text-sm truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {resource.title}
                            </h5>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-500 font-bold uppercase">
                                {resource.fileType}
                              </span>
                              <span className="text-xs text-stone-400 dark:text-stone-500 truncate font-medium">
                                {resource.teacher?.name || "Instructor"}
                              </span>
                            </div>
                          </div>
                          <div className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-stone-100 dark:bg-stone-800">
                            <ArrowUpRight className="w-4 h-4 text-blue-500" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Learning Progress & Quick Stats */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Progress Card */}
          <div className="surface-card p-6">
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-50 mb-4">
              Learning Progress
            </h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                  {getProgressPercentage()}%
                </div>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Course Completion
                </p>
              </div>
              <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-orange-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage()}%` }}
                  transition={{ delay: 0.5, duration: 1.5 }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                  <div className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                    {savedItems.completedCourses?.length || 0}
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Completed
                  </p>
                </div>
                <div className="text-center p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                  <div className="text-lg font-bold text-stone-700 dark:text-stone-300">
                    {enrolledCourses.length -
                      (savedItems.completedCourses?.length || 0)}
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    In Progress
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* My Enrolled Courses Section */}
        {enrolledCourses.length > 0 && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="surface-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-semibold text-stone-900 dark:text-stone-50 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-500" />
                    My Enrolled Courses
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    Continue learning and track your progress
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 col-span-full">
                  {enrolledCourses.map((course) => {
                    const isCompleted = savedItems.completedCourses?.some(
                      (c) => c._id === course._id || c === course._id,
                    );
                    return (
                      <motion.div
                        key={course._id}
                        whileHover={{ x: 4 }}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 group transition-all"
                      >
                        <div
                          className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer"
                          onClick={() => navigate(`/course/${course._id}`)}
                        >
                          <div
                            className={`p-2.5 rounded-xl border ${isCompleted ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800" : "bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800"}`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <BookOpen className="w-5 h-5 text-orange-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-stone-900 dark:text-stone-50 text-sm truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                              {course.title}
                            </h5>
                            <p className="text-xs body-copy truncate mt-0.5">
                              {course.teacher?.name || "Instructor"} •{" "}
                              {course.level}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleCompleteCourse(course._id);
                          }}
                          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 ${isCompleted
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-900/50"
                            : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50 dark:bg-stone-900 dark:text-stone-400 dark:border-stone-700 dark:hover:bg-stone-800"
                            }`}
                        >
                          <CheckCircle
                            className={`w-3.5 h-3.5 ${isCompleted ? "opacity-100" : "opacity-50"}`}
                          />
                          {isCompleted ? "Completed" : "Mark Complete"}
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Batch Information Section */}
        {!batchLoading && !batch && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="surface-card-strong p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                    <Users className="w-6 h-6 text-stone-500 dark:text-stone-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-stone-900 dark:text-white">
                      Batch Allocation Pending
                    </h3>
                    <p className="text-sm body-copy mt-2 max-w-lg">
                      You haven't been assigned to a study batch yet. Once an
                      admin allocates you to a batch, you'll be able to see your
                      cohort members and collaborate with students who share
                      your learning interests.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {!batchLoading && batch && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Batch Details Card */}
            <div className="surface-card-strong p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                    <Users className="w-5 h-5 text-stone-500 dark:text-stone-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-stone-900 dark:text-stone-50">
                      Your Study Batch
                    </h3>
                    <p className="text-xs body-copy mt-1">
                      Learn together with students who share your interests
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Batch Name */}
                <div className="surface-panel p-5 hover:shadow-lg transition-all">
                  <p className="text-xs body-copy font-semibold uppercase mb-2">
                    Batch Name
                  </p>
                  <p className="text-lg font-bold text-stone-900 dark:text-white truncate">
                    {batch.name || "Not Assigned"}
                  </p>
                </div>

                {/* Member Count */}
                <div className="surface-panel p-5 hover:shadow-lg transition-all">
                  <p className="text-xs body-copy font-semibold uppercase mb-2">
                    Total Members
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-stone-900 dark:text-white">
                      {batchMembers.length}
                    </span>
                    <span className="text-sm body-copy">
                      of {batch.maxSize || 10}
                    </span>
                  </div>
                </div>

                {/* Main Interests */}
                <div className="surface-panel p-5 hover:shadow-lg transition-all sm:col-span-2 lg:col-span-2">
                  <p className="text-xs body-copy font-semibold uppercase mb-3">
                    Batch Interests
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {batch.interests && batch.interests.length > 0 ? (
                      batch.interests.slice(0, 3).map((interest, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold border border-stone-200 bg-stone-100 text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
                        >
                          {interest}
                        </span>
                      ))
                    ) : (
                      <span className="text-stone-500 dark:text-stone-400 text-sm">
                        No interests yet
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Batch Members Section */}
            {batchMembers.length > 0 && (
              <div className="surface-card-strong p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                      <Users className="w-5 h-5 text-stone-500 dark:text-stone-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-stone-900 dark:text-stone-50">
                        Batch Members
                      </h3>
                      <p className="text-xs body-copy mt-1">
                        Connect with your learning cohort
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {batchMembers.slice(0, 9).map((member, idx) => (
                    <motion.div
                      key={member._id || idx}
                      className="surface-panel rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.5 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div>
                          <HumanoidAvatar
                            src={member.profilePicture}
                            name={member.name}
                            size={48}
                            className="shadow-sm"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-stone-900 dark:text-white text-sm">
                            {member.name || "Student"}
                          </h4>
                          <p className="text-xs body-copy">{member.email}</p>
                        </div>
                      </div>

                      {/* Interests */}
                      {member.interests && member.interests.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs body-copy font-semibold mb-2">
                            Interests:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {member.interests.slice(0, 2).map((interest, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 rounded-full text-xs font-medium border border-stone-200 bg-stone-100 text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Connect Button */}
                      <motion.button
                        className="w-full primary-action px-4 py-2 rounded-xl font-semibold text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Connect
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Enhanced Teachers Leaderboard */}
        <motion.div
          className="surface-card-strong p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-stone-900 dark:text-stone-50">
                Teachers Leaderboard
              </h3>
            </div>
            <motion.button
              onClick={() => navigate("/leaderboard")}
              className="group flex items-center gap-2 secondary-action px-4 py-2 rounded-xl text-sm font-semibold"
              whileHover={{ scale: 1.02 }}
            >
              View Full Rankings
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.button>
          </div>

          {teachers.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Trophy className="w-16 h-16 text-stone-400 mx-auto mb-4" />
              <p className="body-copy text-lg"></p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.slice(0, 3).map((teacher, idx) => (
                <motion.div
                  key={teacher._id || idx}
                  className="group relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  whileHover={{ y: -3 }}
                >
                  <div className="surface-card p-5 hover:shadow-md transition-all duration-200 relative">
                    <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs z-10">
                      {idx + 1}
                    </div>
                    <span
                      className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getTierColor(getTier(teacher))}`}
                    >
                      {getTier(teacher)}
                    </span>
                    <div className="mt-3">
                      <h4 className="font-semibold text-stone-900 dark:text-stone-50 mb-3">
                        {getTeacherName(teacher)}
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
                            <Clock className="w-3.5 h-3.5" />
                            Hours
                          </span>
                          <span className="font-semibold text-stone-900 dark:text-white">
                            {getTeacherHours(teacher)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
                            <TrendingUp className="w-3.5 h-3.5" />
                            Engagements
                          </span>
                          <span className="font-semibold text-stone-900 dark:text-white">
                            {getTeacherEngagements(teacher)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
                            <Trophy className="w-3.5 h-3.5" />
                            Score
                          </span>
                          <span className="font-semibold text-stone-900 dark:text-white">
                            {getTeacherScore(teacher)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recommended Courses Section */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="surface-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-stone-900 dark:text-stone-50">
                  Recommended Courses
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Personalized picks for you
                </p>
              </div>
              <button
                onClick={() => navigate("/courses")}
                className="secondary-action text-sm gap-1.5"
              >
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {courses.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-5 h-5 text-stone-400" />
                </div>
                <p className="body-copy text-sm">No recommended courses yet</p>
                <p className="body-copy text-xs mt-1">
                  Complete a few courses first to see personalized
                  recommendations!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {courses.slice(0, 6).map((course, index) => {
                  const levelLower = course.level?.toLowerCase();
                  let levelInfo = {
                    badge:
                      "bg-stone-50 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:border-stone-700",
                  };

                  if (levelLower === "beginner") {
                    levelInfo = {
                      badge:
                        "bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700",
                    };
                  } else if (levelLower === "intermediate") {
                    levelInfo = {
                      badge:
                        "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-300 dark:border-orange-900/40",
                    };
                  } else if (levelLower === "advanced") {
                    levelInfo = {
                      badge:
                        "bg-stone-900 text-stone-50 border-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:border-white",
                    };
                  }

                  return (
                    <motion.div
                      key={course._id || course.id}
                      className="surface-card overflow-hidden flex flex-col hover:shadow-md transition-all duration-200 cursor-pointer"
                      onClick={() =>
                        navigate(`/course/${course._id || course.id}`)
                      }
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08, duration: 0.4 }}
                      whileHover={{ y: -3 }}
                    >
                      <div className="p-5 border-b border-stone-100 dark:border-stone-800">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h2 className="text-base font-semibold text-stone-900 dark:text-stone-50 leading-snug">
                            {course.title}
                          </h2>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleSaveCourse(course._id || course.id);
                              }}
                              className={`p-1.5 rounded-lg transition-all ${savedItems.savedCourses.some(
                                (c) => c._id === (course._id || course.id),
                              )
                                ? "text-orange-500 bg-orange-50 dark:bg-orange-950/20"
                                : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                                }`}
                            >
                              {savedItems.savedCourses.some(
                                (c) => c._id === (course._id || course.id),
                              ) ? (
                                <BookmarkCheck className="w-4 h-4" />
                              ) : (
                                <Bookmark className="w-4 h-4" />
                              )}
                            </button>
                            <BookOpen className="w-4 h-4 text-stone-400 flex-shrink-0" />
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${levelInfo.badge}`}
                        >
                          {course.level || "Beginner"}
                        </span>
                      </div>

                      <div className="p-5 flex-grow flex flex-col">
                        <p className="body-copy text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
                          {course.description}
                        </p>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm body-copy">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{course.duration || "Self-paced"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm body-copy">
                            <User className="w-3.5 h-3.5" />
                            <span>
                              {course.teacher?.name || "Expert Instructor"}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              navigate(`/course/${course._id || course.id}`)
                            }
                            className="flex-1 primary-action text-sm py-3"
                          >
                            <BookOpen className="w-4 h-4" /> Explore Course
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* Learning Insights */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {/* Recommended Teachers Section */}
          <div className="surface-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-stone-900 dark:text-stone-50">
                  Recommended Teachers
                </h3>
                <p className="text-xs body-copy mt-0.5">
                  Matched to your interests
                </p>
              </div>
              <button
                onClick={() => navigate("/teachers")}
                className="secondary-action text-sm gap-1.5"
              >
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <RecommendedTeachers limit={6} />
          </div>

          {/* Recommended Resources Section */}
          <div className="surface-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-stone-900 dark:text-stone-50">
                  Recommended Resources
                </h3>
                <p className="text-xs body-copy mt-0.5">
                  Curated study materials for you
                </p>
              </div>
              <button
                onClick={() => navigate("/resources")}
                className="secondary-action text-sm gap-1.5"
              >
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <RecommendedResources limit={6} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;
