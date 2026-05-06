// src/pages/Leaderboard.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  User,
  Trophy,
  Users,
  TrendingUp,
  BookOpen,
  Clock,
  DollarSign,
  Award,
  Sun,
  Moon,
  Star,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const LeaderBoard = () => {
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

  // Tier config — stone-based, no rainbow gradients
  const batchConfig = {
    Diamond: {
      border: "border-l-4 border-l-cyan-400",
      badge: "bg-cyan-50 text-cyan-800 border border-cyan-200 dark:bg-cyan-950/20 dark:text-cyan-300 dark:border-cyan-900/40",
      dot: "bg-cyan-400",
    },
    Platinum: {
      border: "border-l-4 border-l-stone-400",
      badge: "bg-stone-100 text-stone-700 border border-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-600",
      dot: "bg-stone-400",
    },
    Gold: {
      border: "border-l-4 border-l-amber-400",
      badge: "bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/40",
      dot: "bg-amber-400",
    },
    Silver: {
      border: "border-l-4 border-l-stone-300",
      badge: "bg-stone-50 text-stone-600 border border-stone-200 dark:bg-stone-800/60 dark:text-stone-400 dark:border-stone-700",
      dot: "bg-stone-300",
    },
    Bronze: {
      border: "border-l-4 border-l-orange-400",
      badge: "bg-orange-50 text-orange-800 border border-orange-200 dark:bg-orange-950/20 dark:text-orange-300 dark:border-orange-900/40",
      dot: "bg-orange-400",
    },
    Basic: {
      border: "border-l-4 border-l-stone-200",
      badge: "bg-stone-50 text-stone-500 border border-stone-200 dark:bg-stone-800/40 dark:text-stone-500 dark:border-stone-700",
      dot: "bg-stone-200",
    },
  };

  const courseLevelConfig = {
    Beginner: {
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/40",
    },
    Intermediate: {
      badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/40",
    },
    Expert: {
      badge: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-300 dark:border-rose-900/40",
    },
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-amber-500" />;
      case 1:
        return <Award className="w-6 h-6 text-stone-400" />;
      case 2:
        return <Award className="w-6 h-6 text-orange-500" />;
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-300 font-bold text-xs">
            {index + 1}
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen page-surface transition-all duration-700">
      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full z-30">
        <Sidebar />
      </div>
      <div className="ml-64 min-h-screen page-surface w-full">
        {/* Header */}
        <div className="px-8 pt-10 pb-8 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between mb-1">
            <div>
              <span className="section-kicker" />
              <h1 className="section-title">Leaderboard</h1>
              <p className="body-copy mt-2">
                Celebrating our top-performing educators and their outstanding
                contributions to learning
              </p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="icon-action"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="px-8 py-6 border-b border-stone-200 dark:border-stone-800">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {[
              {
                icon: Users,
                label: "Active Teachers",
                value: teachers.length,
              },
              {
                icon: BookOpen,
                label: "Total Courses",
                value: teachers.reduce((acc, t) => acc + t.coursesCreated, 0),
              },
              {
                icon: TrendingUp,
                label: "Avg Engagement",
                value: (
                  teachers.reduce((acc, t) => acc + t.engagementScore, 0) /
                    teachers.length || 0
                ).toFixed(1),
              },
              {
                icon: Star,
                label: "Top Score",
                value: Math.max(...teachers.map((t) => t.totalScore), 0),
              },
            ].map((stat, index) => (
              <div key={index} className="surface-panel p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                    <stat.icon className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                      {stat.label}
                    </p>
                    <p className="text-xl font-bold text-stone-900 dark:text-stone-50">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Leaderboard List */}
        <div className="px-8 py-8">
          <div className="space-y-4">
            {teachers.map((teacher, index) => {
              const config = batchConfig[teacher.batch] || batchConfig.Basic;
              return (
                <motion.div
                  key={teacher._id}
                  className={`surface-card ${config.border} overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
                      {/* Left — Teacher info */}
                      <div
                        className="flex items-center gap-4"
                        onClick={() => navigateToTeacher(teacher._id)}
                      >
                        <div
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => navigate(`/teacher/${teacher._id}`)}
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            {getRankIcon(index)}
                          </motion.div>
                          <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center">
                            <User className="w-6 h-6 text-stone-500 dark:text-stone-400" />
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50 leading-tight mb-1">
                            {teacher.name}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.badge}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                            {teacher.batch} Tier
                          </span>
                        </div>
                      </div>

                      {/* Right — Stats */}
                      <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
                        {[
                          {
                            icon: BookOpen,
                            label: "Courses",
                            value: teacher.coursesCreated,
                          },
                          {
                            icon: TrendingUp,
                            label: "Engagement",
                            value: teacher.engagementScore,
                          },
                          {
                            icon: Star,
                            label: "Score",
                            value: teacher.totalScore,
                          },
                        ].map((stat) => (
                          <motion.div
                            key={stat.label}
                            className="surface-panel p-3 text-center"
                            whileHover={{ y: -2 }}
                          >
                            <div className="w-8 h-8 mx-auto mb-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center">
                              <stat.icon className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                            </div>
                            <p className="text-xl font-bold text-stone-900 dark:text-stone-50 leading-none">
                              {stat.value}
                            </p>
                            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5 uppercase tracking-wide">
                              {stat.label}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Courses Section */}
                    {teacher.courses && teacher.courses.length > 0 && (
                      <div className="mt-5 pt-5 border-t border-stone-100 dark:border-stone-800">
                        <motion.button
                          onClick={() => toggleExpand(teacher._id)}
                          className="flex items-center gap-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="w-6 h-6 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center">
                            {expanded[teacher._id] ? (
                              <ChevronUp size={12} />
                            ) : (
                              <ChevronDown size={12} />
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
                            className="mt-4 grid gap-3 md:grid-cols-2"
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
                                  className="surface-panel rounded-xl p-5 transition-all duration-200 hover:shadow-sm"
                                  initial={{ opacity: 0, y: 12 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.25 }}
                                  whileHover={{ y: -2 }}
                                >
                                  <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-semibold text-stone-900 dark:text-stone-50 text-sm leading-snug pr-2">
                                      {course.title}
                                    </h4>
                                  </div>
                                  <p className="text-stone-500 dark:text-stone-400 text-xs mb-4 line-clamp-2 leading-relaxed">
                                    {course.description}
                                  </p>

                                  <div className="flex flex-wrap items-center gap-2">
                                    <span
                                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${levelConfig.badge}`}
                                    >
                                      {course.level}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-full border border-stone-200 dark:border-stone-700">
                                      <Clock className="w-3 h-3" />
                                      {course.duration}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900/40">
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

export default LeaderBoard;
