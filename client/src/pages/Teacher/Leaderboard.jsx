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
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TeacherSidebar from "../../components/TeacherSidebar";

const Leaderboard = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [expanded, setExpanded] = useState({});
  const token = localStorage.getItem("token");

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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 transition-all duration-700">
      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full z-30">
        <TeacherSidebar />
      </div>
      <div className="ml-64 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-indigo-900 w-full">
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
                  className={`group relative overflow-hidden rounded-2xl shadow-2xl ${config.shadow} hover:${config.glow} transition-all duration-300 hover:scale-[1.02]`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Background gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-90`}
                  ></div>

                  {/* Content */}
                  <div className="relative z-10 p-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                      {/* Left side - Teacher info */}
                      <div
                        className="flex items-center gap-6 cursor-pointer group-hover:scale-105 transition-transform duration-200"
                        onClick={() => navigateToTeacher(teacher._id)}
                      >
                        <div
                          className="flex items-center gap-4 cursor-pointer"
                          onClick={() => navigate(`/teacher/${teacher._id}`)}
                        >
                          {getRankIcon(index)}
                          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                            <User className="w-8 h-8 text-white" />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl lg:text-3xl font-bold text-white">
                              {teacher.name}
                            </h3>
                            <span className="text-2xl">{config.icon}</span>
                          </div>
                          <div
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${config.badge} shadow-lg`}
                          >
                            <span className="text-sm font-semibold text-gray-700">
                              {teacher.batch} Tier
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right side - Stats */}
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-3xl font-bold text-white">
                            {teacher.coursesCreated}
                          </p>
                          <p className="text-sm text-white/80 font-medium">
                            Courses
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-3xl font-bold text-white">
                            {teacher.engagementScore}
                          </p>
                          <p className="text-sm text-white/80 font-medium">
                            Engagement
                          </p>
                        </div>
                        <div className="text-center col-span-2 lg:col-span-1">
                          <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Star className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-3xl font-bold text-white">
                            {teacher.totalScore}
                          </p>
                          <p className="text-sm text-white/80 font-medium">
                            Total Score
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Courses Section */}
                    {teacher.courses && teacher.courses.length > 0 && (
                      <div className="mt-8">
                        <motion.button
                          onClick={() => toggleExpand(teacher._id)}
                          className="flex items-center gap-3 text-white/90 hover:text-white transition-colors duration-200 font-medium"
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
                                  className="group/card bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3 }}
                                  whileHover={{ y: -2 }}
                                >
                                  <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-bold text-gray-800 text-lg group-hover/card:text-blue-600 transition-colors">
                                      {course.title}
                                    </h4>
                                    <span className="text-lg">
                                      {levelConfig.icon}
                                    </span>
                                  </div>
                                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {course.description}
                                  </p>

                                  <div className="flex flex-wrap items-center gap-3">
                                    <span
                                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${levelConfig.bg} ${levelConfig.text} border ${levelConfig.border}`}
                                    >
                                      {course.level}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                      <Clock className="w-3 h-3" />
                                      {course.duration}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
                                      <DollarSign className="w-3 h-3" />
                                      {course.price}
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
