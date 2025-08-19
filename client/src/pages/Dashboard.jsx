import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  Users,
  BookOpen,
  Rocket,
  User,
  Sparkles,
  Star,
  TrendingUp,
  Award,
  Sun,
  Moon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CARD_INFO = [
  { stats: "2.3k+ Active Groups", icon: <TrendingUp className="w-4 h-4" />, color: "text-blue-400" },
  { stats: "18k+ Resources", icon: <BookOpen className="w-4 h-4" />, color: "text-sky-400" },
  { stats: "Top Creators: 150+", icon: <Award className="w-4 h-4" />, color: "text-purple-400" },
  { stats: "Profile Completeness: 82%", icon: <Star className="w-4 h-4" />, color: "text-indigo-400" }
];

const Dashboard = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const cards = [
    {
      title: "Study Groups",
      description: "Join or create peer groups to collaborate and excel.",
      icon: Users,
      link: "/groups",
      gradient: "from-blue-500 via-blue-700 to-indigo-600",
      shadow: "shadow-blue-400/60",
      info: CARD_INFO[0],
    },
    {
      title: "Resources",
      description: "Find and share useful notes, links, PDFs, and videos.",
      icon: BookOpen,
      link: "/resources",
      gradient: "from-sky-500 via-cyan-500 to-indigo-500",
      shadow: "shadow-sky-400/60",
      info: CARD_INFO[1],
    },
    {
      title: "Create Group",
      description: "Build your own learning community with friends.",
      icon: Rocket,
      link: "/create-group",
      gradient: "from-purple-600 via-pink-500 to-indigo-600",
      shadow: "shadow-purple-400/60",
      info: CARD_INFO[2],
    },
    {
      title: "Profile",
      description: "Manage your personal details, skills, and interests.",
      icon: User,
      link: "/profile",
      gradient: "from-indigo-500 via-blue-600 to-purple-500",
      shadow: "shadow-indigo-400/60",
      info: CARD_INFO[3],
    },
  ];

  const getCardTilt = (index) => {
    if (hoveredCard === index) return { rotateY: 8, rotateX: 2, scale: 1.06 };
    return { rotateY: 0, rotateX: 0, scale: 1 };
  };

  const Particles = () => (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      <motion.div
        className="absolute left-[12%] top-[18%] opacity-40"
        animate={{ y: [0, -20, 0], x: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 7, repeat: Infinity }}
      >
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
          <circle cx="35" cy="35" r="32" fill="url(#blue1)" opacity="0.7" />
          <defs>
            <radialGradient id="blue1" cx="0.5" cy="0.5" r="0.5">
              <stop stopColor="#7dd3fc" />
              <stop offset="1" stopColor="#1e3a8a" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>
      <motion.div
        className="absolute right-[15%] bottom-[20%] opacity-40"
        animate={{ y: [0, 25, 0], x: [0, -20, 0], scale: [1, 1.07, 1] }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
      >
        <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
          <ellipse cx="45" cy="45" rx="37" ry="30" fill="url(#purple1)" opacity="0.55" />
          <defs>
            <radialGradient id="purple1" cx="0.5" cy="0.5" r="0.5">
              <stop stopColor="#c4b5fd" />
              <stop offset="1" stopColor="#a21caf" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );

  const ShimmerButton = ({ children, gradient }) => (
    <div className="relative group">
      <button
        className={`w-full py-2 px-6 rounded-xl font-semibold transition-all bg-gradient-to-r ${gradient} text-white shadow-xl overflow-hidden`}
      >
        <span className="relative z-10">{children}</span>
        <span className="absolute inset-0 bg-white/20 blur-sm opacity-0 group-hover:opacity-100 transition-all" />
        <span className="absolute -top-3 left-0 w-full h-1 bg-gradient-to-r from-white/60 to-transparent blur-xl opacity-80 animate-pulse pointer-events-none" />
      </button>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-200 transition-colors overflow-x-hidden">
      <Particles />
      <Navbar />

      {/* Dark Mode Toggle Button */}
      <div className="absolute top-5 right-5 z-50">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white/80 dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-md hover:scale-105 transition-all"
        >
          {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>

      {/* Hero */}
      <section className="relative text-center pt-20 pb-12 px-6 z-10">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-500 animate-gradient-move"
          initial={{ opacity: 0, y: -32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to <span className="inline-flex items-center gap-1">Syncademy <Sparkles className="w-8 h-8 text-indigo-400 animate-spin-slow" /></span>
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl max-w-4xl mx-auto mt-6 text-gray-600 dark:text-gray-300 leading-relaxed font-medium"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
        >
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent font-bold">
            Elevate your learning journey
          </span>
          : Connect in study groups, exchange resources, and track your growth with creative tools and a vibrant community.
        </motion.p>
        <motion.div
          className="text-6xl mt-8"
          animate={{ scale: [1, 1.12, 1], rotate: [0, 6, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          🎓
        </motion.div>
      </section>

      {/* Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto px-6 pb-24 z-10 relative">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={index}
              whileHover={getCardTilt(index)}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              className="relative group cursor-pointer transition-transform duration-300"
              style={{ perspective: "1200px" }}
            >
              <Link to={card.link} className="outline-none focus:ring-4 focus:ring-indigo-300 rounded-3xl">
                <motion.div
                  className={`relative bg-white/70 dark:bg-gray-900/80 border border-white/20 dark:border-gray-700 shadow-2xl rounded-3xl p-10 overflow-hidden backdrop-blur-lg ${card.shadow}`}
                  whileHover={{ boxShadow: "0 20px 60px 0 rgba(59,130,246,0.35), 0 1.5px 15px 0 #818cf8" }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${card.gradient} opacity-20 group-hover:opacity-35 blur-xl transition-all pointer-events-none`}
                  />
                  <motion.div
                    className="absolute top-[-28px] right-[-28px] z-0 opacity-40"
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 18, 0] }}
                    transition={{ repeat: Infinity, duration: 5 + index }}
                  >
                    <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
                      <circle cx="35" cy="35" r="30" fill="url(#blob1)" opacity="0.5" />
                      <defs>
                        <radialGradient id="blob1" cx="0.5" cy="0.5" r="0.5">
                          <stop stopColor="#f9fafb" />
                          <stop offset="1" stopColor="#818cf8" />
                        </radialGradient>
                      </defs>
                    </svg>
                  </motion.div>

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-6 flex items-center gap-3">
                      <motion.div
                        className={`w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} shadow-lg ring-2 ring-white/50 dark:ring-gray-900/40 animate-pulse`}
                        whileHover={{ scale: 1.15, rotate: 6 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <Icon className="text-white w-8 h-8 drop-shadow-lg" />
                      </motion.div>
                      <Star className="w-5 h-5 text-yellow-400 animate-twinkle" />
                    </div>

                    <h2 className="text-2xl font-extrabold mb-2 text-blue-700 dark:text-white tracking-tight drop-shadow">
                      {card.title}
                    </h2>

                    <p className="text-gray-700 dark:text-gray-300 mb-5 flex-grow text-base leading-relaxed font-medium">
                      {card.description}
                    </p>

                    <div className="flex items-center gap-2 mb-5 text-sm font-semibold">
                      <span className={`inline-flex items-center gap-1 ${card.info.color}`}>
                        {card.info.icon} {card.info.stats}
                      </span>
                    </div>

                    <ShimmerButton gradient={card.gradient}>
                      <span className="flex items-center gap-2">
                        <Rocket className="w-4 h-4" /> Explore {card.title}
                      </span>
                    </ShimmerButton>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </section>
    </div>
  );
};

export default Dashboard;
