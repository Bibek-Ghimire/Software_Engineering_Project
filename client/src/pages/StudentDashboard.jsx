// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  ArrowUpRight,
  Play,
  CheckCircle,
  Trophy,
  BookMarked,
  GraduationCap,
  Zap,
  Flame,
  Lightbulb,
  FileText,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import student from "../assets/images/student.jpg";
import { motion } from "framer-motion";
import recommendationService from "../services/recommendationService";
import RecommendedTeachers from "../components/RecommendedTeachers";
import RecommendedGroups from "../components/RecommendedGroups";
import RecommendedResources from "../components/RecommendedResources";

const user = JSON.parse(sessionStorage.getItem("user")) || { name: "Student" };

const EnhancedStatCard = ({ title, value, color, icon, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -8 }}
    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer`}
  >
    <div
      className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
      style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
      }}
    ></div>

    <div className="relative z-10 flex justify-between items-start">
      <div className="space-y-2">
        <p className="text-white/80 text-sm font-medium">{title}</p>
        <h3 className="text-4xl font-black">{value}</h3>
        <p className="text-white/70 text-xs font-medium">{subtitle}</p>
      </div>
      <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
    </div>

    <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/10 rounded-tl-full scale-150 group-hover:scale-170 transition-transform duration-500"></div>
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

    fetchCourses();
    fetchGroups();
    fetchBadges();
    fetchTeachers();
    fetchBatchData();
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  };

  const getTier = (teacher) => {
    if (teacher.hours >= 500 && teacher.engagements >= 2000) return "Platinum";
    if (teacher.hours >= 300 && teacher.engagements >= 1000) return "Diamond";
    if (teacher.hours >= 200 && teacher.engagements >= 500) return "Gold";
    if (teacher.hours >= 100 && teacher.engagements >= 200) return "Silver";
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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 transition-all duration-700">
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
            <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 bg-clip-text text-transparent leading-tight">
              Learning Hub
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg font-medium">
              Your journey to knowledge starts here
            </p>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              onClick={toggleDarkMode}
              className="group relative p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-blue-500" />
              )}
            </motion.button>

            <motion.button
              className="relative p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </motion.button>

            <motion.button
              onClick={() => navigate("/profile")}
              className="group flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
            >
              <User className="w-5 h-5" />
              <span className="font-semibold hidden sm:block">Profile</span>
            </motion.button>
          </div>
        </motion.div>

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
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-600 opacity-87" />
          <div className="absolute inset-0 backdrop-blur-sm" />
          <div
            className="absolute inset-0 opacity-30 bg-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>

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
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-200">
                    {user.name}
                  </span>
                  !
                </h1>
                <p className="text-lg text-blue-50 font-medium">
                  Your learning journey awaits. Explore new horizons today! 🚀
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
                  <span className="text-sm font-semibold">On Fire 🔥</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedStatCard
            title="Enrolled Courses"
            value={courses.length}
            color="from-blue-500 to-cyan-500"
            icon={<BookOpen className="w-7 h-7" />}
            subtitle="Active learning"
          />
          <EnhancedStatCard
            title="Study Groups"
            value={groupsCount}
            color="from-emerald-500 to-teal-500"
            icon={<Users className="w-7 h-7" />}
            subtitle="Collaborative"
          />
          <EnhancedStatCard
            title="Completed"
            value={completedCount}
            color="from-violet-500 to-purple-500"
            icon={<CheckCircle className="w-7 h-7" />}
            subtitle="Success rate"
          />
          <EnhancedStatCard
            title="Badges Earned"
            value={badgesCount}
            color="from-amber-500 to-orange-500"
            icon={<Trophy className="w-7 h-7" />}
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
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-blue-100 dark:border-slate-700 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                Learning Progress
              </h3>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-2">
                  {getProgressPercentage()}%
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                  Course Completion
                </p>
              </div>

              <div className="relative">
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgressPercentage()}%` }}
                    transition={{ delay: 0.5, duration: 1.5 }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="text-center p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900 dark:to-teal-900">
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {completedCount}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Completed
                  </p>
                </div>
                <div className="text-center p-3 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900 dark:to-purple-900">
                  <div className="text-lg font-bold text-violet-600 dark:text-violet-400">
                    {courses.length - completedCount}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
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
            <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20 rounded-3xl border border-amber-200 dark:border-amber-700/30 shadow-xl p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                      Batch Allocation Pending
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-lg">
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
            <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-cyan-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-3xl border border-cyan-200 dark:border-cyan-700/30 shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                      Your Study Batch
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Learn together with students who share your interests
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Batch Name */}
                <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-5 rounded-2xl border border-cyan-100 dark:border-slate-700 hover:shadow-lg transition-all">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase mb-2">
                    Batch Name
                  </p>
                  <p className="text-lg font-bold text-slate-800 dark:text-white truncate">
                    {batch.name || "Not Assigned"}
                  </p>
                </div>

                {/* Member Count */}
                <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-5 rounded-2xl border border-cyan-100 dark:border-slate-700 hover:shadow-lg transition-all">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase mb-2">
                    Total Members
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-cyan-600 dark:text-cyan-400">
                      {batchMembers.length}
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      of {batch.maxSize || 10}
                    </span>
                  </div>
                </div>

                {/* Main Interests */}
                <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-5 rounded-2xl border border-cyan-100 dark:border-slate-700 hover:shadow-lg transition-all sm:col-span-2 lg:col-span-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase mb-3">
                    Batch Interests
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {batch.interests && batch.interests.length > 0 ? (
                      batch.interests.slice(0, 3).map((interest, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-xs font-semibold rounded-full shadow-md"
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
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-blue-100 dark:border-slate-700 shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                        Batch Members
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Connect with your learning cohort
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {batchMembers.slice(0, 9).map((member, idx) => (
                    <motion.div
                      key={member._id || idx}
                      className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-700 dark:to-slate-600 rounded-2xl p-6 border border-blue-100 dark:border-slate-600 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.5 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg">
                          {(member.name || "U")[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800 dark:text-white text-sm">
                            {member.name || "Student"}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {member.email}
                          </p>
                        </div>
                      </div>

                      {/* Interests */}
                      {member.interests && member.interests.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mb-2">
                            Interests:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {member.interests.slice(0, 2).map((interest, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Connect Button */}
                      <motion.button
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg"
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
          className="bg-white dark:bg-slate-800 rounded-3xl border border-blue-100 dark:border-slate-700 shadow-xl p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                Teachers Leaderboard
              </h3>
            </div>
            <motion.button
              onClick={() => navigate("/leaderboard")}
              className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg text-sm font-semibold"
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
              <p className="text-slate-500 dark:text-slate-400 text-lg"></p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.slice(0, 6).map((teacher, idx) => (
                <motion.div
                  key={teacher._id || idx}
                  className="group relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-700 dark:to-slate-600 rounded-2xl p-6 border border-blue-100 dark:border-slate-600 shadow-lg hover:shadow-2xl transition-all duration-300">
                    {/* Rank Badge */}
                    <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-lg z-10">
                      {idx + 1}
                    </div>

                    {/* Tier Badge */}
                    <div className="absolute -top-2 -right-2 z-10">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${getTierColor(getTier(teacher))}`}
                      >
                        {getTier(teacher)}
                      </span>
                    </div>

                    {/* Top 3 Special Styling */}
                    {idx < 3 && (
                      <div className="absolute top-4 right-4">
                        <Star className="w-5 h-5 text-amber-400 animate-pulse" />
                      </div>
                    )}

                    <div className="mt-6">
                      <h4 className="font-bold text-lg text-slate-800 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {teacher.name}
                      </h4>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium">Hours</span>
                          </div>
                          <span className="font-bold text-slate-800 dark:text-white">
                            {teacher.hours}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm font-medium">
                              Engagements
                            </span>
                          </div>
                          <span className="font-bold text-slate-800 dark:text-white">
                            {teacher.engagements}
                          </span>
                        </div>
                      </div>

                      {/* Teacher Rating Display */}
                      <div className="mt-4 p-3 rounded-xl bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < 4 ? "text-amber-400 fill-current" : "text-slate-300"}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                            4.8/5
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
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-blue-100 dark:border-slate-700 shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <BookMarked className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                    Recommended Courses
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Personalized picks tailored to your learning style
                  </p>
                </div>
              </div>
              <motion.button
                onClick={() => navigate("/courses")}
                className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg text-sm font-semibold"
                whileHover={{ scale: 1.02 }}
              >
                View All
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </motion.button>
            </div>

            {courses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400 text-lg">
                  No recommended courses yet
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
                  Complete a few courses first to see personalized
                  recommendations!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {courses.slice(0, 6).map((course, index) => {
                  const levelLower = course.level?.toLowerCase();
                  let levelInfo = {
                    bg: "from-gray-400 to-gray-500",
                    text: "text-white",
                    icon: "📚",
                  };

                  if (levelLower === "beginner") {
                    levelInfo = {
                      bg: "from-emerald-400 to-green-500",
                      text: "text-white",
                      icon: "🟢",
                    };
                  } else if (levelLower === "intermediate") {
                    levelInfo = {
                      bg: "from-amber-400 to-orange-500",
                      text: "text-white",
                      icon: "🟠",
                    };
                  } else if (levelLower === "advanced") {
                    levelInfo = {
                      bg: "from-red-400 to-pink-500",
                      text: "text-white",
                      icon: "🔴",
                    };
                  }

                  return (
                    <motion.div
                      key={course._id || course.id}
                      className="group bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl border border-blue-200/50 dark:border-gray-600/50 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:border-blue-300/70 dark:hover:border-blue-500/50 flex flex-col"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      whileHover={{ y: -5 }}
                    >
                      {/* Course Header with Gradient */}
                      <div className="relative p-6 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-600/20 dark:via-indigo-600/20 dark:to-purple-600/20 border-b border-blue-200/30 dark:border-gray-600/30">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors leading-tight mb-3">
                              {course.title}
                            </h2>
                            <div
                              className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${levelInfo.bg} rounded-full shadow-lg`}
                            >
                              <span className="text-lg">{levelInfo.icon}</span>
                              <span
                                className={`font-bold text-sm ${levelInfo.text}`}
                              >
                                {course.level || "Beginner"} Level
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
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
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
                                {course.duration || "Self-paced"}
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
                          <motion.button
                            onClick={() => alert(`Exploring: ${course.title}`)}
                            className="flex-1 group/btn relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                            <BookOpen className="w-5 h-5 relative z-10 group-hover/btn:rotate-12 transition-transform duration-300" />
                            <span className="relative z-10">
                              Explore Course
                            </span>
                          </motion.button>

                          <motion.button
                            onClick={() => alert(`Interested: ${course.title}`)}
                            className="flex-1 group/btn relative overflow-hidden bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                            <CheckCircle className="w-5 h-5 relative z-10 group-hover/btn:scale-110 transition-transform duration-300" />
                            <span className="relative z-10">Add Interest</span>
                          </motion.button>
                        </div>
                      </div>

                      {/* Card Footer Accent */}
                      <div className="h-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>
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
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-indigo-100 dark:border-slate-700 shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-indigo-500" />
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                    Recommended Teachers
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Expert instructors matched to your interests
                  </p>
                </div>
              </div>
              <motion.button
                onClick={() => navigate("/teachers")}
                className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg text-sm font-semibold"
                whileHover={{ scale: 1.02 }}
              >
                View All
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </motion.button>
            </div>
            <RecommendedTeachers limit={6} />
          </div>

          {/* Recommended Groups Section */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-green-100 dark:border-slate-700 shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-green-500" />
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                    Recommended Study Groups
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Connect with peers who share your interests
                  </p>
                </div>
              </div>
              <motion.button
                onClick={() => navigate("/groups")}
                className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg text-sm font-semibold"
                whileHover={{ scale: 1.02 }}
              >
                View All
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </motion.button>
            </div>
            <RecommendedGroups limit={6} />
          </div>

          {/* Recommended Resources Section */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-purple-100 dark:border-slate-700 shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-purple-500" />
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                    Recommended Resources
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Curated study materials tailored to your learning goals
                  </p>
                </div>
              </div>
              <motion.button
                onClick={() => navigate("/resources")}
                className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg text-sm font-semibold"
                whileHover={{ scale: 1.02 }}
              >
                View All
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </motion.button>
            </div>
            <RecommendedResources limit={6} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;
