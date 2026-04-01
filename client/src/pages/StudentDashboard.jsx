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
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import student from "../assets/images/student.jpg";
import { motion } from "framer-motion";

const user = JSON.parse(localStorage.getItem("user")) || { name: "Student" };

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

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data);
        setCompletedCount(res.data.filter((c) => c.completed).length);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchGroups = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/groups", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroupsCount(res.data.length);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchBadges = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/badges", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBadgesCount(res.data.length);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchTeachers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/teachers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeachers(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCourses();
    fetchGroups();
    fetchBadges();
    fetchTeachers();
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
          className="relative w-full h-80 rounded-3xl overflow-hidden shadow-2xl group"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={student}
            alt="Learning background"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 opacity-85" />
          <div
            className="absolute inset-0 opacity-20 bg-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>

          <div className="relative z-10 h-full flex items-center justify-between px-12">
            <div className="text-white space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-300 font-semibold text-sm uppercase tracking-wider">
                    Student Portal
                  </span>
                </div>
                <h1 className="text-5xl font-black leading-tight">
                  Welcome, <span className="text-yellow-300">{user.name}</span>!
                </h1>
                <p className="text-xl text-blue-100 mt-3 font-medium max-w-2xl">
                  Ready to explore new study groups, dive into fresh resources,
                  and connect with peers? Let's supercharge your learning!
                </p>
              </motion.div>

              <motion.div
                className="flex items-center gap-4 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {getProgressPercentage()}% Progress
                  </span>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="hidden lg:block"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            ></motion.div>
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Courses */}
          <motion.div
            className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-blue-100 dark:border-slate-700 shadow-xl"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <BookMarked className="w-6 h-6 text-blue-500" />
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                  Available Courses
                </h3>
              </div>
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <span className="text-sm font-semibold">
                  {courses.length} courses
                </span>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              {courses.length === 0 ? (
                <motion.div
                  className="col-span-2 text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400 text-lg">
                    No courses available yet
                  </p>
                  <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
                    Check back soon for new learning opportunities!
                  </p>
                </motion.div>
              ) : (
                courses.map((course, index) => (
                  <motion.div
                    key={course._id || course.id}
                    className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-700 dark:to-slate-600 p-6 rounded-2xl border border-blue-100 dark:border-slate-600 hover:shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -5 }}
                  >
                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-10 rounded-bl-3xl"></div>

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        {course.completed && (
                          <div className="flex items-center gap-1 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            <CheckCircle className="w-3 h-3" />
                            <span>Completed</span>
                          </div>
                        )}
                      </div>

                      <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {course.title}
                      </h4>

                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-4 h-4 text-slate-500" />
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          <span className="font-medium">
                            {course.instructor}
                          </span>
                        </p>
                      </div>

                      <p className="text-slate-700 dark:text-slate-300 text-sm mb-6 line-clamp-2">
                        {course.description}
                      </p>

                      <motion.button
                        onClick={() =>
                          alert(`Course "${course.title}" reserved!`)
                        }
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 px-4 rounded-xl transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Play className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        Reserve Course
                      </motion.button>
                    </div>
                  </motion.div>
                ))
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
        </div>

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
              onClick={() => navigate("/teacher/leaderboard")}
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

        {/* Learning Insights */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        ></motion.div>
      </div>
    </div>
  );
};

// Enhanced Stat Card Component
const EnhancedStatCard = ({ title, value, color, icon, trend, subtitle }) => (
  <motion.div
    className="group relative overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ y: -5 }}
  >
    <div
      className={`relative p-6 rounded-2xl bg-gradient-to-br ${color} text-white shadow-xl hover:shadow-2xl transition-all duration-300`}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-white bg-opacity-20 backdrop-blur-sm group-hover:bg-white group-hover:bg-opacity-30 transition-all duration-300">
            {icon}
          </div>
          {trend && (
            <div className="flex items-center gap-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-2 py-1">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs font-bold">{trend}</span>
            </div>
          )}
        </div>

        <div>
          <p className="text-3xl font-black mb-1 group-hover:scale-105 transition-transform duration-300">
            {value}
          </p>
          <p className="text-sm font-semibold opacity-90">{title}</p>
          {subtitle && <p className="text-xs opacity-75 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  </motion.div>
);

export default StudentDashboard;
