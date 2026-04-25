// src/pages/Leaderboard.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  User,
  Trophy,
  Star,
  Users,
  TrendingUp,
  BookOpen,
  Clock,
  DollarSign,
  Award,
  Sun,
  Moon,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TeacherSidebar from "../../components/TeacherSidebar";

const Leaderboard = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );
  const token = sessionStorage.getItem("token");

  // Fetch leaderboard from backend
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/leaderboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeachers(res.data);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        setTeachers([]);
      }
    };
    fetchLeaderboard();
  }, [token]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleExpand = (id) => {
    setExpanded({ ...expanded, [id]: !expanded[id] });
  };

  const navigateToTeacher = async (teacherId) => {
    try {
      const { data } = await axios.get(`/api/users/${teacherId}`);
      if (data) {
        navigate(`/teacher/${teacherId}`, { state: { viewOnly: true } });
      } else {
        console.log("Teacher not found");
      }
    } catch (error) {
      console.error("Failed to fetch teacher profile:", error.message);
    }
  };

  const batchConfig = {
    Diamond: {
      gradient: "from-cyan-400 via-blue-500 to-purple-600",
      shadow: "shadow-blue-500/20",
      badge: "from-cyan-200 to-blue-200",
      icon: "💎",
      glow: "shadow-cyan-500/30",
    },
    Platinum: {
      gradient: "from-slate-400 via-slate-500 to-slate-600",
      shadow: "shadow-slate-500/20",
      badge: "from-slate-200 to-slate-300",
      icon: "🥈",
      glow: "shadow-slate-500/30",
    },
    Gold: {
      gradient: "from-yellow-400 via-amber-500 to-orange-500",
      shadow: "shadow-yellow-500/20",
      badge: "from-yellow-200 to-amber-200",
      icon: "🥇",
      glow: "shadow-yellow-500/30",
    },
    Silver: {
      gradient: "from-gray-300 via-gray-400 to-gray-500",
      shadow: "shadow-gray-500/20",
      badge: "from-gray-200 to-gray-300",
      icon: "🥉",
      glow: "shadow-gray-500/30",
    },
    Bronze: {
      gradient: "from-orange-400 via-amber-600 to-yellow-600",
      shadow: "shadow-orange-500/20",
      badge: "from-orange-200 to-yellow-200",
      icon: "🏆",
      glow: "shadow-orange-500/30",
    },
    Basic: {
      gradient: "from-green-400 via-emerald-500 to-teal-500",
      shadow: "shadow-green-500/20",
      badge: "from-green-200 to-emerald-200",
      icon: "⭐",
      glow: "shadow-green-500/30",
    },
  };

  const courseLevelConfig = {
    Beginner: {
      bg: "bg-gradient-to-r from-green-100 to-emerald-100",
      text: "text-green-700",
      border: "border-green-200",
      icon: "🌱",
    },
    Intermediate: {
      bg: "bg-gradient-to-r from-yellow-100 to-amber-100",
      text: "text-amber-700",
      border: "border-yellow-200",
      icon: "🔥",
    },
    Expert: {
      bg: "bg-gradient-to-r from-red-100 to-pink-100",
      text: "text-red-700",
      border: "border-red-200",
      icon: "⚡",
    },
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 1:
        return <Award className="w-8 h-8 text-gray-400" />;
      case 2:
        return <Award className="w-8 h-8 text-orange-500" />;
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold text-sm">
            {index + 1}
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-gray-900 dark:to-gray-950 transition-all duration-700">
      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full z-30">
        <TeacherSidebar />
      </div>
      <div className="ml-64 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-gray-900 dark:to-gray-950 w-full relative">
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
        {/* Header Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
          <div className="relative z-10 pt-16 pb-12 px-6">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-purple-700 bg-clip-text text-transparent mb-4">
                Leaderboard
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Celebrating our top-performing educators and their outstanding
                contributions to learning
              </p>
            </motion.div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="max-w-6xl mx-auto px-6 mb-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {[
              {
                icon: Users,
                label: "Active Teachers",
                value: teachers.length,
                color: "text-blue-600",
              },
              {
                icon: BookOpen,
                label: "Total Courses",
                value: teachers.reduce((acc, t) => acc + t.coursesCreated, 0),
                color: "text-green-600",
              },
              {
                icon: TrendingUp,
                label: "Avg Engagement",
                value: (
                  teachers.reduce((acc, t) => acc + t.engagementScore, 0) /
                    teachers.length || 0
                ).toFixed(1),
                color: "text-purple-600",
              },
              {
                icon: Star,
                label: "Top Score",
                value: Math.max(...teachers.map((t) => t.totalScore), 0),
                color: "text-yellow-600",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-r from-slate-100 to-slate-200`}
                  >
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      {stat.label}
                    </p>
                    <p className="text-xl font-bold text-gray-800">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Leaderboard */}
        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="space-y-6">
            {teachers.map((teacher, index) => {
              const config = batchConfig[teacher.batch] || batchConfig.Basic;
              return (
                <motion.div
                  key={teacher._id}
                  className={`group relative overflow-hidden rounded-3xl transition-all duration-300 hover:scale-[1.01] cursor-pointer`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Enhanced background with layered effect */}
                  <div className="absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-95"></div>
                  <div className="absolute inset-0 backdrop-blur-0 group-hover:backdrop-blur-[1px] transition-all duration-300"></div>

                  {/* Premium border effect */}
                  <div
                    className={`absolute inset-0 rounded-3xl border-2 border-white/30 pointer-events-none group-hover:border-white/50 transition-all duration-300`}
                  ></div>

                  {/* Enhanced shadow */}
                  <div
                    className={`absolute -inset-1 bg-gradient-to-r ${config.gradient} opacity-0 group-hover:opacity-30 blur-2xl transition-all duration-300 -z-10`}
                  ></div>

                  {/* Inner glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-3xl"></div>

                  {/* Content */}
                  <div className="relative z-10 p-6 sm:p-7">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                      {/* Left side - Teacher info */}
                      <div
                        className="flex items-center gap-5 cursor-pointer group-hover:scale-105 transition-transform duration-300"
                        onClick={() => navigateToTeacher(teacher._id)}
                      >
                        <div
                          className="flex items-center gap-4 cursor-pointer"
                          onClick={() => navigate(`/teacher/${teacher._id}`)}
                        >
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            {getRankIcon(index)}
                          </motion.div>
                          <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center shadow-2xl border-2 border-white/40 group-hover:border-white/60 transition-all duration-300">
                            <User className="w-8 h-8 text-white" />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl lg:text-2xl font-bold text-blue-600 leading-tight">
                              {teacher.name}
                            </h3>
                            <motion.span
                              className="text-2xl"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              {config.icon}
                            </motion.span>
                          </div>
                          <div
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${config.badge} shadow-lg border border-white/50 backdrop-blur-sm group-hover:shadow-xl transition-all duration-300`}
                          >
                            <span className="text-xs font-semibold text-gray-700">
                              {teacher.batch} Tier
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right side - Stats */}
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 w-full lg:w-auto">
                        <motion.div
                          className="text-center p-3 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 hover:border-white/40 group-hover:bg-white/20 transition-all duration-300"
                          whileHover={{ y: -3 }}
                        >
                          <div className="w-11 h-11 mx-auto mb-2 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-2xl font-bold text-blue-600 leading-none">
                            {teacher.coursesCreated}
                          </p>
                          <p className="text-xs text-blue-700 font-semibold mt-1 uppercase tracking-wide">
                            Courses
                          </p>
                        </motion.div>
                        <motion.div
                          className="text-center p-3 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 hover:border-white/40 group-hover:bg-white/20 transition-all duration-300"
                          whileHover={{ y: -3 }}
                        >
                          <div className="w-11 h-11 mx-auto mb-2 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
                            <TrendingUp className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-2xl font-bold text-blue-600 leading-none">
                            {teacher.engagementScore}
                          </p>
                          <p className="text-xs text-blue-700 font-semibold mt-1 uppercase tracking-wide">
                            Engagement
                          </p>
                        </motion.div>
                        <motion.div
                          className="text-center p-3 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 hover:border-white/40 group-hover:bg-white/20 transition-all duration-300 col-span-2 lg:col-span-1"
                          whileHover={{ y: -3 }}
                        >
                          <div className="w-11 h-11 mx-auto mb-2 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
                            <Star className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-2xl font-bold text-blue-600 leading-none">
                            {teacher.totalScore}
                          </p>
                          <p className="text-xs text-blue-700 font-semibold mt-1 uppercase tracking-wide">
                            Total Score
                          </p>
                        </motion.div>
                      </div>
                    </div>

                    {/* Courses Section */}
                    {teacher.courses && teacher.courses.length > 0 && (
                      <div className="mt-8">
                        <motion.button
                          onClick={() => toggleExpand(teacher._id)}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            {expanded[teacher._id] ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </div>
                          <span>
                            {expanded[teacher._id]
                              ? "Hide Courses"
                              : `View ${teacher.courses.length} Course${teacher.courses.length !== 1 ? "s" : ""}`}
                          </span>
                        </motion.button>

                        {expanded[teacher._id] && (
                          <motion.div
                            className="mt-6 grid gap-4 md:grid-cols-2"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {teacher.courses.map((course) => {
                              const levelConfig =
                                courseLevelConfig[course.level] ||
                                courseLevelConfig.Beginner;
                              return (
                                <motion.div
                                  key={course._id}
                                  className="group/card relative bg-white/98 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/40 hover:border-white/60 overflow-hidden"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3 }}
                                  whileHover={{ y: -4 }}
                                >
                                  {/* Card background effect */}
                                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 pointer-events-none rounded-2xl"></div>
                                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>

                                  <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                      <h4 className="font-bold text-gray-800 text-lg group-hover/card:text-blue-600 transition-colors pr-2">
                                        {course.title}
                                      </h4>
                                      <motion.span
                                        className="text-2xl flex-shrink-0"
                                        whileHover={{ scale: 1.2, rotate: 10 }}
                                        transition={{
                                          type: "spring",
                                          stiffness: 400,
                                        }}
                                      >
                                        {levelConfig.icon}
                                      </motion.span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed">
                                      {course.description}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-2.5">
                                      <span
                                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold ${levelConfig.bg} ${levelConfig.text} border ${levelConfig.border} shadow-sm`}
                                      >
                                        {course.level}
                                      </span>
                                      <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100/50 px-3 py-1.5 rounded-full">
                                        <Clock className="w-3.5 h-3.5" />
                                        {course.duration}
                                      </div>
                                      <div className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-100/50 px-3 py-1.5 rounded-full">
                                        <DollarSign className="w-3.5 h-3.5" />
                                        {course.price}
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
