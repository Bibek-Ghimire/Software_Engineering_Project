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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const user = JSON.parse(localStorage.getItem("user"));

const StatCard = ({ title, value, icon, trend, subtitle }) => (
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
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold text-stone-900 dark:text-stone-50">
            {value}
          </h3>
          {trend && (
            <span className="text-orange-600 dark:text-orange-400 text-xs font-semibold">
              {trend}
            </span>
          )}
        </div>
        <p className="text-stone-400 dark:text-stone-500 text-xs">{subtitle}</p>
      </div>
      <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 transition-transform duration-200">
        {icon}
      </div>
    </div>
  </motion.div>
);

const ActionCard = ({ title, description, icon, onClick }) => (
  <motion.div
    whileHover={{ y: -4 }}
    onClick={onClick}
    className="surface-card p-6 cursor-pointer hover:shadow-md transition-all duration-200 group"
  >
    <div className="flex items-start gap-4">
      <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 group-hover:bg-orange-100 dark:group-hover:bg-orange-950/50 transition-colors duration-200">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
          {title}
        </h3>
        <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
          {description}
        </p>
      </div>
    </div>
  </motion.div>
);

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { markNotificationAsRead } = useNotification();
  const [courses, setCourses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [studentsCount, setStudentsCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [engagements, setEngagements] = useState(540);
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark"),
  );
  const [leaderboard, setLeaderboard] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [enrollmentRequestsCount, setEnrollmentRequestsCount] = useState(0);
  const [teacherProfile, setTeacherProfile] = useState(null);

  // Function to fetch dashboard data
  const fetchDashboardData = async (token) => {
    try {
      const [coursesRes, groupsRes, leaderboardRes, enrollmentRes, profileRes] =
        await Promise.all([
          axios.get("http://localhost:5000/api/teachers/courses", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/groups", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/leaderboard", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/enrollment-requests", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      const allCourses = coursesRes.data.courses || coursesRes.data || [];
      setCourses(allCourses);
      setGroups(groupsRes.data.groups || groupsRes.data || []);

      // Calculate total enrollments across all courses using the EXACT logic from ApprovedStudentsGroups
      let totalEnrolled = 0;
      let totalCompleted = 0;
      let totalPending = 0;
      for (const course of allCourses) {
        try {
          const paymentRes = await axios.get(
            `http://localhost:5000/api/payments/teacher/course/${course._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          const enrolledStudents = paymentRes.data.enrolled || [];
          totalEnrolled += enrolledStudents.length;
          totalPending += paymentRes.data.pending?.length || 0;

          for (const student of enrolledStudents) {
            if (student.completedCourses) {
              const isCompleted = student.completedCourses.some((c) => {
                const cId =
                  typeof c === "object" && c !== null ? c._id || c.id || c : c;
                return String(cId) === String(course._id);
              });
              if (isCompleted) {
                totalCompleted++;
              }
            }
          }
        } catch (err) {
          console.error(
            `Error fetching students for course ${course._id}:`,
            err,
          );
        }
      }
      setStudentsCount(totalEnrolled);
      setCompletedCount(totalCompleted);
      setPendingCount(totalPending);

      setLeaderboard(leaderboardRes.data.teachers || leaderboardRes.data || []);
      setTeacherProfile(profileRes.data);

      const pendingRequests = (
        enrollmentRes.data.requests ||
        enrollmentRes.data ||
        []
      ).filter((req) => req.status === "pending");
      setEnrollmentRequestsCount(pendingRequests.length);
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
      console.log(" Enrollment approved - refreshing dashboard data...");
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
        return "bg-stone-500 text-white";
      case "Diamond":
        return "bg-cyan-500 text-white";
      case "Gold":
        return "bg-yellow-500 text-white";
      case "Silver":
        return "bg-gray-400 text-white";
      default:
        return "bg-stone-200 text-stone-700";
    }
  };

  // Chart data

  const performanceData = [
    { name: "Total Courses", value: courses.length, color: "#44403c" },
    { name: "Completed", value: completedCount, color: "#c2651a" },
    {
      name: "Pending",
      value: Math.max(0, studentsCount - completedCount),
      color: "#78716c",
    },
  ];

  const barChartData = [
    { name: "Completed", value: completedCount, color: "#c2651a" },
    {
      name: "Pending",
      value: Math.max(0, studentsCount - completedCount),
      color: "#78716c",
    },
  ];

  const displayPieData =
    completedCount === 0 && studentsCount === 0
      ? [
          { name: "Completed", value: 0, color: "#c2651a" },
          { name: "Pending", value: 1, color: "#78716c" },
        ]
      : barChartData;

  return (
    <div className="flex min-h-screen page-surface transition-all duration-700">
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
            <h1 className="brand-title text-4xl font-bold text-stone-900 dark:text-stone-50 leading-tight">
              Teaching Hub
            </h1>
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
              onClick={() => navigate("/teacher/profile")}
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
            className="fixed top-24 right-8 w-96 surface-card rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-700 z-50 max-h-96 overflow-y-auto"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
          >
            <div className="sticky top-0 surface-card p-4 border-b border-stone-200 dark:border-stone-700 flex justify-between items-center">
              <h3 className="font-bold text-lg text-stone-900 dark:text-stone-50">
                Notifications
              </h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
              ></button>
            </div>

            {notifications.length === 0 ? (
              <div className="p-6 text-center text-stone-500 dark:text-stone-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
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
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notification.isRead ? "bg-orange-500" : "bg-transparent"}`}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-stone-900 dark:text-stone-50 text-sm">
                          {notification.title}
                        </p>
                        <p className="text-stone-600 dark:text-stone-300 text-sm mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
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
          className="relative w-full overflow-hidden rounded-[2.5rem] shadow-2xl border border-stone-200/50 dark:border-stone-800/50"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Enhanced Background with Glassmorphism and Gradients */}
          <div className="absolute inset-0 bg-stone-50 dark:bg-[#0c0a09]">
            <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-orange-100/40 via-transparent to-transparent dark:from-orange-950/20"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-tr from-stone-200/30 via-transparent to-transparent dark:from-stone-900/40"></div>
          </div>

          <div className="relative z-10 h-full flex flex-col md:flex-row items-center justify-between px-10 py-12 md:py-16">
            <div className="flex-1 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-orange-600 dark:text-orange-400 font-bold text-sm tracking-widest uppercase">
                    Instructor Dashboard
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl font-black text-stone-900 dark:text-stone-50 leading-[1.1] mb-6">
                  {(() => {
                    const hour = new Date().getHours();
                    let greeting = "Good Morning";
                    if (hour >= 12 && hour < 17) greeting = "Good Afternoon";
                    else if (hour >= 17) greeting = "Good Evening";
                    return greeting;
                  })()}
                  , <br />
                  <span className="bg-orange-600 bg-clip-text text-transparent">
                    Prof. {(teacherProfile?.name || user.name).split(" ")[0]}
                  </span>
                </h1>

                <div className="space-y-4 max-w-xl">
                  <p className="text-2xl font-medium text-stone-700 dark:text-stone-300 leading-relaxed">
                    You have{" "}
                    <span className="text-orange-600 dark:text-orange-500 font-bold">
                      {enrollmentRequestsCount} enrollment requests
                    </span>{" "}
                    today <br />
                    and{" "}
                    <span className="text-stone-900 dark:text-orange-500 font-bold">
                      {studentsCount} active students
                    </span>{" "}
                    learning.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center gap-4 flex-wrap pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <button
                  onClick={() => navigate("/teacher/enrollment-requests")}
                  className="group relative flex items-center gap-3 bg-stone-900 dark:bg-stone-50 text-white dark:text-stone-900 px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-orange-500/20"
                >
                  View Requests
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>

                <div className="flex items-center gap-2 bg-stone-200/50 dark:bg-stone-800/50 backdrop-blur-md rounded-2xl px-6 py-4 border border-stone-200 dark:border-stone-700">
                  <Calendar className="w-5 h-5 text-stone-600 dark:text-stone-400" />
                  <span className="text-stone-800 dark:text-stone-200 font-bold">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="hidden lg:flex flex-col items-center gap-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1, type: "spring" }}
            >
              <div className="relative group">
                {/* Profile Aura */}

                <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-white dark:border-stone-800 shadow-2xl">
                  {teacherProfile?.profilePicture ? (
                    <img
                      src={`http://localhost:5000${teacherProfile.profilePicture}`}
                      alt={teacherProfile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                      <User className="w-24 h-24 text-stone-400" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Courses"
            value={courses.length}
            icon={
              <BookMarked className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            }
            trend="+12%"
            subtitle="This month"
          />
          <StatCard
            title="Study Groups"
            value={groups.length}
            icon={
              <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            }
            trend="+8%"
            subtitle="Active groups"
          />
          <StatCard
            title="Total Students"
            value={studentsCount}
            icon={
              <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            }
            trend="+24%"
            subtitle="Enrolled"
          />
          <StatCard
            title="Engagements"
            value={engagements}
            icon={
              <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            }
            trend="+18%"
            subtitle="This week"
          />
        </div>

        {/* Charts Section */}
        <div className="w-full">
          {/* Performance Overview */}
          <motion.div
            className="surface-card p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-50">
                Course Progress
              </h3>
              <p className="text-stone-500 dark:text-stone-400 mt-1">
                Overall completion
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ResponsiveContainer
                width="100%"
                height={280}
              >
                <BarChart
                  data={barChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: darkMode ? "#a8a29e" : "#78716c" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: darkMode ? "#a8a29e" : "#78716c" }}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: darkMode ? "#1c1917" : "white",
                      borderRadius: "12px",
                      border: "1px solid #e7e5e4",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    radius={[6, 6, 0, 0]}
                    barSize={80}
                  >
                    {barChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <ResponsiveContainer
                width="100%"
                height={280}
              >
                <PieChart>
                  <Pie
                    data={displayPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {displayPieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1c1917" : "white",
                      borderRadius: "12px",
                      border: "1px solid #e7e5e4",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

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
                    <span className="text-sm font-medium text-stone-600 dark:text-stone-300">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-stone-900 dark:text-stone-50">
                    {item.value}
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
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50">
              Quick Actions
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ActionCard
              title="Create New Course"
              description="Design and launch your next course"
              icon={
                <PlusCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              }
              onClick={() => navigate("/teacher/course")}
            />
            <ActionCard
              title="Manage Students"
              description="View and organise your enrolled students"
              icon={
                <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              }
              onClick={() => navigate("/teacher/approved-students")}
            />
            <ActionCard
              title="View Leaderboard"
              description="Check rankings among educators"
              icon={
                <Award className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              }
              onClick={() => navigate("/teacher/leaderboard")}
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
              <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50">
                Top Educators
              </h2>
            </div>
            <button
              onClick={() => navigate("/teacher/leaderboard")}
              className="secondary-action gap-1.5 text-sm"
            >
              View All
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            {leaderboard.length === 0 ? (
              <motion.div
                className="surface-card rounded-2xl p-12 text-center border border-stone-200 dark:border-stone-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-stone-500 dark:text-stone-400 text-lg">
                  <ActionCard
                    title="Top Teachers"
                    description="Check teacher rankings"
                    icon={<Award className="w-8 h-8" />}
                    onClick={() => navigate("/teacher/leaderboard")}
                    color="from-stone-600 to-stone-700"
                  />
                </p>
              </motion.div>
            ) : (
              <div className="flex gap-6 overflow-x-auto pb-6 pt-6 px-4 -mx-4">
                {leaderboard.slice(0, 3).map((teacher, idx) => (
                  <motion.div
                    key={teacher._id || idx}
                    className="flex-none w-80 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative surface-card rounded-2xl p-8 border border-stone-200 dark:border-stone-800 shadow-lg hover:shadow-2xl transition-all duration-300 mt-2">
                      <div className="absolute top-2 -left-1 w-8 h-8  flex items-center justify-center text-orange-500 font-bold text-sm shadow-lg">
                        {idx + 1}
                      </div>
                      <div className="mt-6">
                        <h4 className="font-bold text-lg text-stone-900 dark:text-stone-50 mb-2 group-hover:text-orange-600 dark:text-orange-400 transition-colors">
                          {getTeacherName(teacher)}
                        </h4>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                              <span className="text-sm font-medium">
                                Teaching Hours
                              </span>
                            </div>
                            <span className="font-bold text-stone-900 dark:text-stone-50">
                              {getTeacherHours(teacher)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                              <span className="text-sm font-medium">
                                Engagements
                              </span>
                            </div>
                            <span className="font-bold text-stone-900 dark:text-stone-50">
                              {getTeacherEngagements(teacher)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                              <span className="text-sm font-medium">
                                Ranking Score
                              </span>
                            </div>
                            <span className="font-bold text-stone-900 dark:text-stone-50">
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
