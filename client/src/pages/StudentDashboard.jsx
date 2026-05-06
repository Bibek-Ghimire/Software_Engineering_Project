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
} from "lucide-react";
import axios from "axios";
import student from "../assets/images/student.jpg";
import recommendationService from "../services/recommendationService";
import RecommendedTeachers from "../components/RecommendedTeachers";
import RecommendedGroups from "../components/RecommendedGroups";
import RecommendedResources from "../components/RecommendedResources";
import { useNotification } from "../hooks/useNotification";
import HumanoidAvatar from "../components/HumanoidAvatar";
import Sidebar from "../components/Sidebar";

const user = JSON.parse(sessionStorage.getItem("user")) || { name: "Student" };

const EnhancedStatCard = ({ title, value, iconColor, icon, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
  >
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <p className="text-stone-500 dark:text-stone-400 text-sm font-medium">
          {title}
        </p>
        <h3 className="text-3xl font-bold text-stone-900 dark:text-stone-50">
          {value}
        </h3>
        <p className="text-stone-400 dark:text-stone-500 text-xs">{subtitle}</p>
      </div>
      <div
        className={`p-3 rounded-xl ${iconColor} transition-transform duration-200`}
      >
        {icon}
      </div>
    </div>
  </motion.div>
);

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [groupsCount, setGroupsCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
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

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    const fetchCourses = async () => {
      try {
        // Fetch recommended courses instead of all courses
        const recommendedCourses =
          await recommendationService.getRecommendedCourses(12);
        setCourses(recommendedCourses);
        setCompletedCount(recommendedCourses.filter((c) => c.completed).length);
      } catch (err) {
        console.error("Error fetching recommended courses:", err);
        setCourses([]);
      }
    };

    const fetchGroups = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/groups", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Handle both array and nested data formats
        const groupsData = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];
        setGroupsCount(groupsData.length);
      } catch (err) {
        console.error(err);
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
        console.log(" Student notifications:", response.data);
        setNotifications(response.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchCourses();
    fetchGroups();
    fetchBadges();
    fetchTeachers();
    fetchBatchData();
    fetchNotifications();

    // Refresh notifications every 30 seconds
    const notificationInterval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(notificationInterval);
  }, []);

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
        return "bg-slate-500 text-white";
      case "Diamond":
        return "bg-cyan-500 text-white";
      case "Gold":
        return "bg-yellow-500 text-white";
      case "Silver":
        return "bg-gray-400 text-white";
      default:
        return "bg-blue-200 text-blue-800";
    }
  };

  const getProgressPercentage = () => {
    if (courses.length === 0) return 0;
    return Math.round((completedCount / courses.length) * 100);
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
              >✕</button>
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
                    className={`p-4 hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors cursor-pointer ${
                      !notification.isRead
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
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span className="text-yellow-300 font-bold text-xs uppercase tracking-widest">
                    Welcome Back
                  </span>
                </div>
                <h1 className="text-6xl font-black leading-tight mb-2">
                  Hey,{" "}
                  <span className="text-yellow-200">
                    {user.name}
                  </span>
                  !
                </h1>
                <p className="text-lg text-blue-50 font-medium">
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
                  <Flame className="w-4 h-4 text-orange-300" />
                  <span className="text-sm font-semibold">
                    {getProgressPercentage()}% Done
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-xl rounded-full px-5 py-3 border border-white/30 hover:bg-white/30 transition-all">
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-semibold">On Fire</span>
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
            value={courses.length}
            iconColor="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
            icon={<BookOpen className="w-5 h-5" />}
            subtitle="Active learning"
          />
          <EnhancedStatCard
            title="Study Groups"
            value={groupsCount}
            iconColor="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
            icon={<Users className="w-5 h-5" />}
            subtitle="Collaborative"
          />
          <EnhancedStatCard
            title="Completed"
            value={completedCount}
            iconColor="bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400"
            icon={<CheckCircle className="w-5 h-5" />}
            subtitle="Success rate"
          />
          <EnhancedStatCard
            title="Badges Earned"
            value={badgesCount}
            iconColor="bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400"
            icon={<Trophy className="w-5 h-5" />}
            subtitle="Achievements"
          />
        </div>

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
                    {completedCount}
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Completed
                  </p>
                </div>
                <div className="text-center p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                  <div className="text-lg font-bold text-stone-700 dark:text-stone-300">
                    {courses.length - completedCount}
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    In Progress
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

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
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
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
                  <p className="text-lg font-bold text-slate-900 dark:text-white truncate">
                    {batch.name || "Not Assigned"}
                  </p>
                </div>

                {/* Member Count */}
                <div className="surface-panel p-5 hover:shadow-lg transition-all">
                  <p className="text-xs body-copy font-semibold uppercase mb-2">
                    Total Members
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
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
                          className="px-3 py-1.5 rounded-full text-xs font-semibold border border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {interest}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400 text-sm">
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
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
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
                                className="px-2 py-1 rounded-full text-xs font-medium border border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
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
              <Trophy className="w-16 h-16 text-slate-400 mx-auto mb-4" />
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
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {getTeacherHours(teacher)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
                            <TrendingUp className="w-3.5 h-3.5" />
                            Engagements
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {getTeacherEngagements(teacher)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
                            <Trophy className="w-3.5 h-3.5" />
                            Score
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white">
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
                <p className="body-copy text-sm">
                  No recommended courses yet
                </p>
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
                      "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
                  };

                  if (levelLower === "beginner") {
                    levelInfo = {
                      badge:
                        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/40",
                    };
                  } else if (levelLower === "intermediate") {
                    levelInfo = {
                      badge:
                        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/40",
                    };
                  } else if (levelLower === "advanced") {
                    levelInfo = {
                      badge:
                        "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-300 dark:border-rose-900/40",
                    };
                  }

                  return (
                    <motion.div
                      key={course._id || course.id}
                      className="surface-card overflow-hidden flex flex-col hover:shadow-md transition-all duration-200"
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
                          <BookOpen className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
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
                            onClick={() => alert(`Exploring: ${course.title}`)}
                            className="flex-1 primary-action text-sm py-2"
                          >
                            <BookOpen className="w-4 h-4" /> Explore
                          </button>
                          <button
                            onClick={() => alert(`Interested: ${course.title}`)}
                            className="flex-1 secondary-action text-sm py-2"
                          >
                            <CheckCircle className="w-4 h-4" /> Interest
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

          {/* Recommended Groups Section */}
          <div className="surface-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-stone-900 dark:text-stone-50">
                  Recommended Study Groups
                </h3>
                <p className="text-xs body-copy mt-0.5">
                  Connect with like-minded peers
                </p>
              </div>
              <button
                onClick={() => navigate("/groups")}
                className="secondary-action text-sm gap-1.5"
              >
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <RecommendedGroups limit={6} />
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
