// src/pages/TeacherDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  PlusCircle,
  BarChart2,
  Sun,
  Moon,
  Bell,
  User,
  TrendingUp,
  Award,
  Calendar,
  Clock,
  Star,
  ArrowUpRight,
  Sparkles,
  Target,
  BookMarked,
  Flame,
  Zap,
  Heart,
  GraduationCap,
  Shield,
  Gift,
} from "lucide-react";
import TeacherSidebar from "../../components/TeacherSidebar";
import axios from "axios";
import { motion } from "framer-motion";
import { useNotification } from "../../hooks/useNotification";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const user = JSON.parse(localStorage.getItem("user")) || { name: "Teacher" };

const StatCard = ({ title, value, color, icon, trend, subtitle }) => (
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
      <div className="space-y-3">
        <p className="text-white/80 text-sm font-medium">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-4xl font-black">{value}</h3>
          {trend && (
            <span className="text-emerald-300 text-sm font-bold">{trend}</span>
          )}
        </div>
        <p className="text-white/70 text-xs font-medium">{subtitle}</p>
      </div>
      <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
    </div>

    <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/10 rounded-tl-full scale-150 group-hover:scale-170 transition-transform duration-500"></div>
  </motion.div>
);

const ActionCard = ({ title, description, icon, onClick, color }) => (
  <motion.div
    whileHover={{ y: -8 }}
    onClick={onClick}
    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer`}
  >
    <div
      className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
      style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
      }}
    ></div>

    <div className="relative z-10 flex items-start gap-4">
      <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-white/70 text-sm font-medium mt-1">{description}</p>
      </div>
    </div>

    <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/10 rounded-tl-full scale-150 group-hover:scale-170 transition-transform duration-500"></div>
  </motion.div>
);

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { markNotificationAsRead } = useNotification();
  const [courses, setCourses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [studentsCount, setStudentsCount] = useState(120);
  const [engagements, setEngagements] = useState(540);
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark"),
  );
  const [leaderboard, setLeaderboard] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Function to fetch dashboard data
  const fetchDashboardData = async (token) => {
    try {
      const [
        coursesRes,
        groupsRes,
        studentsRes,
        engagementsRes,
        leaderboardRes,
      ] = await Promise.all([
        axios.get("http://localhost:5000/api/teacher/courses", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/teacher/groups", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/teacher/students", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/teacher/engagements", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/teachers"),
      ]);

      setCourses(coursesRes.data);
      setGroups(groupsRes.data);
      setStudentsCount(studentsRes.data.count);
      setEngagements(engagementsRes.data.count);
      setLeaderboard(leaderboardRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      fetchDashboardData(token);
    }
  }, []);

  // Listen for enrollment approval event and refresh data
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const handleEnrollmentApproved = async () => {
      console.log("📊 Enrollment approved - refreshing dashboard data...");
      if (token) {
        await fetchDashboardData(token);
      }
    };

    window.addEventListener("enrollmentApproved", handleEnrollmentApproved);
    return () => {
      window.removeEventListener(
        "enrollmentApproved",
        handleEnrollmentApproved,
      );
    };
  }, []);

  // Fetch notifications
  useEffect(() => {
    const token = sessionStorage.getItem("token");
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

    fetchNotifications();
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
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

  // Chart data
  const salesData = [
    { day: "Sun", sales: 280, students: 45 },
    { day: "Mon", sales: 120, students: 32 },
    { day: "Tue", sales: 200, students: 38 },
    { day: "Wed", sales: 150, students: 41 },
    { day: "Thu", sales: 300, students: 52 },
    { day: "Fri", sales: 250, students: 47 },
    { day: "Sat", sales: 400, students: 58 },
  ];

  const performanceData = [
    { name: "Completed", value: 75, color: "#3B82F6" },
    { name: "In Progress", value: 20, color: "#10B981" },
    { name: "Pending", value: 5, color: "#F59E0B" },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 transition-all duration-700">
      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full z-30">
        <TeacherSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 space-y-8 overflow-y-auto">
        {/* Top Navigation */}
        <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 bg-clip-text text-transparent leading-tight">
              Teaching Hub
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg font-medium">
              Empowering minds, shaping futures ✨
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
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              {notifications.filter((n) => !n.isRead).length > 0 && (
                <span className="absolute -top-2 -right-3 inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 dark:bg-red-500 rounded-full min-w-6 h-6 flex items-center justify-center">
                  +{notifications.filter((n) => !n.isRead).length}
                </span>
              )}
            </motion.button>

            <motion.button
              onClick={() => navigate("/teacher/profile")}
              className="group flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
            >
              <User className="w-5 h-5" />
              <span className="font-semibold hidden sm:block">Profile</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Notifications Panel */}
        {showNotifications && (
          <motion.div
            className="fixed top-24 right-8 w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 max-h-96 overflow-y-auto"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
          >
            <div className="sticky top-0 bg-white dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                Notifications
              </h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                ✕
              </button>
            </div>

            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {notifications.slice(0, 10).map((notification) => (
                  <motion.div
                    key={notification._id}
                    className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer ${
                      !notification.isRead
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : ""
                    }`}
                    whileHover={{ x: 4 }}
                    onClick={() =>
                      !notification.isRead &&
                      markNotificationAsRead(notification._id)
                    }
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notification.isRead ? "bg-blue-600" : "bg-transparent"}`}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 dark:text-white text-sm">
                          {notification.title}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
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
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Overlay for notifications */}
        {showNotifications && (
          <motion.div
            className="fixed inset-0 z-40"
            onClick={() => setShowNotifications(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        {/* Hero Banner */}
        <motion.div
          className="relative w-full h-96 rounded-3xl overflow-hidden shadow-2xl group"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-500 to-indigo-700"></div>
          <div className="absolute inset-0 backdrop-blur-3xl opacity-40" />
          <div
            className="absolute inset-0 opacity-25 bg-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>

          <div className="relative z-10 h-full flex items-center justify-between px-12 py-8">
            <div className="text-white space-y-6 max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span className="text-yellow-300 font-bold text-xs uppercase tracking-widest">
                    Welcome Back
                  </span>
                </div>
                <h1 className="text-6xl font-black leading-tight mb-3">
                  Hello,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-200">
                    {user.name}
                  </span>
                </h1>
                <p className="text-lg text-blue-50 font-medium">
                  Ready to inspire and educate today? Your students are waiting!
                  🚀
                </p>
              </motion.div>

              <motion.div
                className="flex items-center gap-3 flex-wrap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
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
                    {studentsCount} Students
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-xl rounded-full px-5 py-3 border border-white/30 hover:bg-white/30 transition-all">
                  <Award className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-semibold">Top Educator ⭐</span>
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
                  className="absolute w-44 h-44 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <BookOpen className="w-20 h-20 text-yellow-200" />
                </motion.div>
                <motion.div
                  className="absolute w-32 h-32 rounded-full bg-white/5"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Active Courses"
            value={courses.length}
            color="from-blue-500 to-cyan-500"
            icon={<BookMarked className="w-7 h-7" />}
            trend="+12%"
            subtitle="This month"
          />
          <StatCard
            title="Study Groups"
            value={groups.length}
            color="from-emerald-500 to-teal-500"
            icon={<Users className="w-7 h-7" />}
            trend="+8%"
            subtitle="Active groups"
          />
          <StatCard
            title="Total Students"
            value={studentsCount}
            color="from-violet-500 to-purple-500"
            icon={<User className="w-7 h-7" />}
            trend="+24%"
            subtitle="Enrolled"
          />
          <StatCard
            title="Engagements"
            value={engagements}
            color="from-rose-500 to-pink-500"
            icon={<TrendingUp className="w-7 h-7" />}
            trend="+18%"
            subtitle="This week"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Chart */}
          <motion.div
            className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-blue-100 dark:border-slate-700 shadow-xl"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                  Weekly Activity
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Student engagement trends
                </p>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">+15.3%</span>
              </div>
            </div>

            <ResponsiveContainer
              width="100%"
              height={280}
            >
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient
                    id="colorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#3B82F6"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#3B82F6"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  strokeOpacity={0.1}
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: darkMode ? "#94A3B8" : "#64748B",
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: darkMode ? "#94A3B8" : "#64748B",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#1E293B" : "white",
                    border: "none",
                    borderRadius: "16px",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fill="url(#colorGradient)"
                  dot={{
                    r: 6,
                    fill: "#3B82F6",
                    strokeWidth: 2,
                    stroke: "white",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Performance Overview */}
          <motion.div
            className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-blue-100 dark:border-slate-700 shadow-xl"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                Course Progress
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Overall completion
              </p>
            </div>

            <ResponsiveContainer
              width="100%"
              height={200}
            >
              <PieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {performanceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-3 mt-4">
              {performanceData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-white">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              Quick Actions
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActionCard
              title="Create New Course"
              description="Design and launch courses"
              icon={<PlusCircle className="w-8 h-8" />}
              onClick={() => navigate("/teacher/course")}
              color="from-blue-500 to-cyan-500"
            />
            <ActionCard
              title="Manage Students"
              description="View and organize students"
              icon={<Users className="w-8 h-8" />}
              onClick={() => navigate("/students")}
              color="from-emerald-500 to-teal-500"
            />
            <ActionCard
              title="View Leaderboard"
              description="Check teacher rankings"
              icon={<Award className="w-8 h-8" />}
              onClick={() => navigate("/teacher/leaderboard")}
              color="from-violet-500 to-purple-500"
            />
          </div>
        </motion.div>

        {/* Leaderboard Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                Top Educators
              </h2>
            </div>
            <motion.button
              onClick={() => navigate("/teacher/leaderboard")}
              className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg text-sm font-semibold"
              whileHover={{ scale: 1.02 }}
            >
              View All
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.button>
          </div>

          <div className="relative">
            {leaderboard.length === 0 ? (
              <motion.div
                className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-blue-100 dark:border-slate-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Award className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400 text-lg">
                  <ActionCard
                    title="Top Teeachers"
                    description="Check teacher rankings"
                    icon={<Award className="w-8 h-8" />}
                    onClick={() => navigate("/teacher/leaderboard")}
                    color="from-violet-500 to-purple-500"
                  />
                </p>
              </motion.div>
            ) : (
              <div className="flex gap-6 overflow-x-auto pb-4">
                {leaderboard.slice(0, 5).map((teacher, idx) => (
                  <motion.div
                    key={teacher._id || idx}
                    className="flex-none w-80 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-blue-100 dark:border-slate-700 shadow-lg hover:shadow-2xl transition-all duration-300">
                      {/* Rank Badge */}
                      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {idx + 1}
                      </div>

                      {/* Tier Badge */}
                      <div className="absolute -top-3 -right-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${getTierColor(getTier(teacher))}`}
                        >
                          {getTier(teacher)}
                        </span>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-bold text-lg text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {teacher.name}
                        </h4>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                              <Clock className="w-4 h-4 text-blue-500" />
                              <span className="text-sm font-medium">
                                Teaching Hours
                              </span>
                            </div>
                            <span className="font-bold text-slate-800 dark:text-white">
                              {teacher.hours}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                              <BarChart2 className="w-4 h-4 text-emerald-500" />
                              <span className="text-sm font-medium">
                                Engagements
                              </span>
                            </div>
                            <span className="font-bold text-slate-800 dark:text-white">
                              {teacher.engagements}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                            <span>Progress to next tier</span>
                            <span>85%</span>
                          </div>
                          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: "85%" }}
                              transition={{
                                delay: idx * 0.1 + 0.5,
                                duration: 1,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="flex justify-center pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        ></motion.div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
