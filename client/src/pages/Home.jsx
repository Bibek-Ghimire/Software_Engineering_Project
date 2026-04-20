// Home.jsx
import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  Award,
  MessageCircle,
  Globe,
  Target,
  Zap,
  Play,
  Sun,
  Moon,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
  Star,
  TrendingUp,
  Shield,
  Clock,
  Heart,
  CheckCircle,
  Quote,
  Sparkles,
  Brain,
  Lightbulb,
  Trophy,
  FileText,
  Video,
  MessageSquare,
  BarChart3,
  Rocket,
  Coffee,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import Logo from "../assets/images/Logo.png";
import team from "../assets/images/team.jpg";
import linkedin from "../assets/images/linkedin.png";
import github from "../assets/images/github-sign.png";
import email from "../assets/images/gmail.png";
import team1 from "../assets/images/team1.jpg";
import team2 from "../assets/images/team2.jpg";
import team3 from "../assets/images/team3.jpg";
import { ThemeContext } from "../context/ThemeContext";

const features = [
  {
    icon: <Users className="w-8 h-8" />,
    title: "Smart Study Squads",
    description:
      "Connects you with compatible study partners based on learning goals, schedules, and academic interests.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Collaborative Knowledge Hub",
    description:
      "Build comprehensive study materials together with real-time editing, version control, and expert-verified content.",
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Entartaining Learning Journey",
    description:
      "Earn badges, climb leaderboards, and unlock achievements as you progress through your academic milestones.",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: <MessageCircle className="w-8 h-8" />,
    title: "24/7 Peer Support Network",
    description:
      "Access instant help through live chat, video calls, and discussion forums moderated by AI and peer mentors.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Adaptive Learning Paths",
    description:
      "Personalized study plans that adapt to your pace, strengths, and areas for improvement using machine learning.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Goal Tracking & Analytics",
    description:
      "Monitor your progress with detailed insights, performance metrics, and predictive success indicators.",
    gradient: "from-red-500 to-pink-500",
  },
];

const stats = [
  {
    number: "50K+",
    label: "Active Learners",
    icon: <Users className="w-6 h-6" />,
  },
  {
    number: "2.5K+",
    label: "Study Squads",
    icon: <Heart className="w-6 h-6" />,
  },
  { number: "200+", label: "Courses", icon: <BookOpen className="w-6 h-6" /> },
  {
    number: "99.2%",
    label: "Success Rate",
    icon: <TrendingUp className="w-6 h-6" />,
  },
];

const testimonials = [
  {
    name: "Sanjit Poudel",
    role: "Computer Science Student",
    content:
      "Syncademy transformed my study routine. The collaborative notes feature helped me ace my algorithms course!",
    rating: 5,
    avatar: "",
  },
  {
    name: "Samir Dawadi",
    role: "Engineering Student",
    content:
      "The peer support network is incredible. Having study partners available 24/7 made med school so much more manageable.",
    rating: 5,
    avatar: "",
  },
  {
    name: "Kushal Ranabhat",
    role: "IT Student",
    content:
      "The peer to peer learning aspect keeps me motivated. I've never been more engaged with my studies than I am now!",
    rating: 5,
    avatar: "",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [showMore, setShowMore] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigation = (path) => navigate(path);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-gray-900 dark:to-gray-950 text-gray-800 dark:text-gray-200 overflow-x-hidden">
      {/* Enhanced Header */}
      <header className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 dark:from-blue-500/20 dark:to-indigo-500/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.2),transparent)]"></div>

        <div className="relative pt-8 px-6 md:px-12 lg:px-20">
          {/* Navigation */}
          <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 p-4 shadow-lg border border-white/20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={scrollToTop}
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="relative">
                <img
                  src={Logo}
                  alt="Logo"
                  className="w-12 h-12 rounded-xl shadow-md"
                />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Syncademy
              </h2>
            </motion.div>

            <div className="flex gap-8 items-center">
              <button
                onClick={scrollToTop}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Home
              </button>
              <button
                onClick={() =>
                  aboutRef.current?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                About
              </button>
              <button
                onClick={() =>
                  contactRef.current?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Contact
              </button>
              <button
                onClick={() => handleNavigation("/login")}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => handleNavigation("/register")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Get Started
              </button>
              <button
                onClick={toggleTheme}
                className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </nav>

          {/* Hero Section */}
          <div className="mt-20 flex flex-col-reverse lg:flex-row items-center gap-12 pb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 space-y-8"
            >
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Learn Together,
                  </span>
                  <br />
                  <span className="text-gray-800 dark:text-white">
                    Grow Together
                  </span>
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                  Transform your learning experience with collaborative study
                  groups, collaborative note-taking, and a supportive community
                  of learners. Success is better when shared.
                </p>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation("/register")}
                  className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-bold shadow-2xl hover:shadow-blue-500/25 transition-all duration-200"
                >
                  Start Learning Free
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation("/login")}
                  className="flex items-center gap-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                >
                  Sign In
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex-1 relative"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-3xl blur-2xl opacity-20 transform rotate-6"></div>
                <img
                  src="/images/project.png"
                  alt="Students collaborating on Syncademy"
                  className="relative rounded-3xl shadow-2xl w-full max-w-lg mx-auto border-4 border-white/50 dark:border-gray-700/50"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Trust Indicators */}
      <section className="bg-white dark:bg-gray-800/50 backdrop-blur-sm py-12 border-y border-blue-100 dark:border-blue-800/30">
        <div className="px-6 md:px-12 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-200">
                  <div className="text-white">{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="px-6 md:px-12 lg:px-20 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gray-800 dark:text-white">Why Choose </span>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Syncademy?
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience the future of education with cutting-edge technology
            designed to maximize your learning potential through collaboration
            and community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
              ></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl mb-6 text-white shadow-lg`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20">
        <div className="px-6 md:px-12 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              What Students Say
            </h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Join thousands of students who have transformed their learning
              experience with Syncademy
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white text-lg">
                      {testimonials[currentTestimonial].name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {testimonials[currentTestimonial].role}
                    </p>
                  </div>
                  <div className="ml-auto flex gap-1">
                    {[...Array(testimonials[currentTestimonial].rating)].map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ),
                    )}
                  </div>
                </div>
                <blockquote className="text-lg text-gray-700 dark:text-gray-300 italic leading-relaxed">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    i === currentTestimonial
                      ? "bg-white scale-125"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <motion.section
        ref={aboutRef}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 px-6 md:px-12 lg:px-20 py-24"
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-3xl blur-2xl opacity-10 transform rotate-3"></div>
            <div className="relative bg-white dark:bg-gray-800 p-2 rounded-3xl shadow-2xl">
              <img
                src={team}
                alt="Syncademy Team"
                className="rounded-2xl w-full"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              <span className="text-gray-800 dark:text-white">About </span>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Syncademy
              </span>
            </h2>

            <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p className="text-lg">
                Syncademy is a next-generation peer learning platform designed
                to empower students through collaborative study methods and
                community-driven academic support. We revolutionize traditional
                learning by creating an interactive environment where knowledge
                flows freely.
              </p>

              <AnimatePresence>
                {showMore && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6"
                  >
                    <p>
                      Our mission is to transform education by fostering
                      collaborative learning environments where students can
                      create study groups, share knowledge, and achieve academic
                      excellence together. Unlike conventional e-learning tools,
                      Syncademy encourages active participation and real-time
                      collaboration.
                    </p>
                    <p>
                      Whether you're preparing for competitive exams or
                      solidifying academic foundations, Syncademy provides the
                      digital infrastructure to make learning social,
                      productive, and goal-oriented. Our platform combines AI
                      technology with proven collaborative methodologies.
                    </p>

                    <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
                      <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Our Core Values:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">
                            Inclusive Learning for All
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">
                            Community-Driven Growth
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">
                            Innovation in Education
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">
                            Data-Driven Results
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6">
                      <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2">
                        What Makes Us Different:
                      </h4>
                      <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Foster real-time collaboration and meaningful
                          discussions
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Encourage peer mentorship and organic community growth
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          Provide scalable tools for students and educational
                          institutions
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          Integrate gamification to boost engagement and
                          motivation
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMore(!showMore)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {showMore ? "Show Less" : "Learn More"}
                {showMore ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Team Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            {
              img: team1,
              title: "Collaborative Workspace",
              desc: "Students working together in our modern learning environment",
              highlight: "Real-time collaboration",
            },
            {
              img: team2,
              title: "Innovation Hub",
              desc: "Where creativity meets technology to enhance learning experiences",
              highlight: "Clear insights",
            },
            {
              img: team3,
              title: "Study Sessions",
              desc: "Peer-to-peer learning sessions that drive academic success",
              highlight: "Community support",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                {/* Floating highlight badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                  {item.highlight}
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="font-bold text-xl mb-2">{item.title}</h4>
                  <p className="text-sm opacity-90 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Enhanced How It Works */}
      <section className="bg-gray-50 dark:bg-gray-800/50 px-6 md:px-12 lg:px-20 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6">
            <span className="text-gray-800 dark:text-white">
              Simple Steps to{" "}
            </span>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Success
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get started in minutes and unlock the power of collaborative
            learning
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {[
            {
              step: "01",
              title: "Create Your Profile",
              description:
                "Sign up in seconds and tell us about your learning goals, subjects, and preferences. Our AI will help match you with compatible study partners based on your academic interests and schedule.",
              icon: <Users className="w-8 h-8" />,
              color: "from-green-500 to-emerald-500",
              features: [
                "Matching your Interests",
                "Goal setting",
                "Schedule sync",
              ],
            },
            {
              step: "02",
              title: "Join Study Squads",
              description:
                "Connect with peers who share your academic interests. Collaborate on notes, share resources, participate in live study sessions, and support each other through challenging topics.",
              icon: <Heart className="w-8 h-8" />,
              color: "from-yellow-500 to-orange-500",
              features: [
                "Real-time collaboration",
                "Resource sharing",
                "Live sessions",
              ],
            },
            {
              step: "03",
              title: "Achieve & Celebrate",
              description:
                "Track your progress with detailed analytics, earn achievement badges, and celebrate milestones. Watch as collaborative learning accelerates your academic success exponentially.",
              icon: <Trophy className="w-8 h-8" />,
              color: "from-blue-500 to-indigo-500",
              features: [
                "Progress tracking",
                "Achievement system",
                "Success analytics",
              ],
            },
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative group"
            >
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 transition-all duration-300 transform hover:-translate-y-2">
                {/* Step Number Badge */}
                <div
                  className={`absolute -top-6 left-8 w-12 h-12 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                >
                  {step.step}
                </div>

                <div className="pt-8">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl mb-6 text-white shadow-lg`}
                  >
                    {step.icon}
                  </div>

                  <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Feature highlights */}
                  <div className="space-y-2">
                    {step.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div
                          className={`w-2 h-2 bg-gradient-to-r ${step.color} rounded-full`}
                        ></div>
                        <span className="text-gray-600 dark:text-gray-400">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Connection line */}
              {index < 2 && (
                <div className="hidden md:block absolute top-20 -right-6 w-12 h-0.5 bg-gradient-to-r from-blue-300 to-transparent z-10"></div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* New Features Showcase */}
      <section className="bg-white dark:bg-gray-800 px-6 md:px-12 lg:px-20 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6">
            <span className="text-gray-800 dark:text-white">
              Powerful Tools for{" "}
            </span>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Modern Learning
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to excel academically, all in one platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <FileText className="w-6 h-6" />,
              title: "Smart Notes",
              desc: "AI-enhanced note-taking",
              color: "blue",
            },
            {
              icon: <Video className="w-6 h-6" />,
              title: "Live Sessions",
              desc: "HD video study rooms",
              color: "green",
            },
            {
              icon: <MessageSquare className="w-6 h-6" />,
              title: "Instant Chat",
              desc: "Real-time messaging",
              color: "purple",
            },
            {
              icon: <BarChart3 className="w-6 h-6" />,
              title: "Analytics",
              desc: "Progress insights",
              color: "orange",
            },
          ].map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-200 group"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 bg-${tool.color}-500 rounded-xl mb-3 text-white group-hover:scale-110 transition-transform duration-200`}
              >
                {tool.icon}
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                {tool.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {tool.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <motion.section
        ref={contactRef}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 px-6 md:px-12 lg:px-20 py-24"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            <span className="text-gray-800 dark:text-white">Ready to </span>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Connect?
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join our community, share feedback, or collaborate with us. We're
            here to support your learning journey and welcome contributions from
            passionate educators and developers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {[
            {
              icon: github,
              title: "Open Source",
              subtitle: "Contribute & Collaborate",
              description:
                "Explore our codebase, report issues, submit pull requests, and help us build the future of education together.",
              link: "https://github.com/Bibek-Ghimire",
              linkText: "github.com/Bibek-Ghimire",
              gradient: "from-gray-600 to-gray-800",
              features: [
                "View source code",
                "Report bugs",
                "Submit features",
                "Join development",
              ],
            },
            {
              icon: linkedin,
              title: "Professional Network",
              subtitle: "Connect & Follow",
              description:
                "Stay updated with our latest features, join professional discussions, and connect with our team members.",
              link: "https://www.linkedin.com/in/your-profile",
              linkText: "linkedin.com/in/your-profile",
              gradient: "from-blue-600 to-blue-800",
              features: [
                "Follow updates",
                "Network with team",
                "Career opportunities",
                "Industry insights",
              ],
            },
            {
              icon: email,
              title: "Direct Contact",
              subtitle: "Questions & Partnerships",
              description:
                "Have specific questions, partnership ideas, or need enterprise solutions? We'd love to hear from you.",
              link: "mailto:bibekghimire764@gmail.com",
              linkText: "bibekghimire764@gmail.com",
              gradient: "from-red-500 to-red-600",
              features: [
                "General inquiries",
                "Partnership opportunities",
                "Enterprise solutions",
                "Technical support",
              ],
            },
          ].map((contact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${contact.gradient} rounded-3xl blur opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              ></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                <div className="flex items-center justify-center mb-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${contact.gradient} rounded-2xl flex items-center justify-center p-3 shadow-lg`}
                  >
                    <img
                      src={contact.icon}
                      alt={contact.title}
                      className="w-10 h-10 filter brightness-0 invert"
                    />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 text-center">
                  {contact.title}
                </h3>
                <p
                  className={`text-sm font-semibold bg-gradient-to-r ${contact.gradient} bg-clip-text text-transparent mb-4 text-center`}
                >
                  {contact.subtitle}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-6 leading-relaxed">
                  {contact.description}
                </p>

                {/* Feature list */}
                <div className="space-y-2 mb-6">
                  {contact.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <div
                        className={`w-1.5 h-1.5 bg-gradient-to-r ${contact.gradient} rounded-full`}
                      ></div>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <a
                    href={contact.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 bg-gradient-to-r ${contact.gradient} hover:shadow-lg text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105`}
                  >
                    <ArrowRight className="w-4 h-4" />
                    Connect Now
                  </a>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 font-mono">
                    {contact.linkText}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legal & Copyright */}
      </motion.section>

      {/* Enhanced CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent)]"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>

        <div className="relative px-6 md:px-12 lg:px-20 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Your Academic Success
              <br />
              <span className="text-yellow-300">Starts Today</span>
            </h2>

            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join over 50,000 students who have already transformed their
              learning experience. Start collaborating, start achieving, start
              succeeding with Syncademy.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation("/register")}
                className="bg-white text-blue-600 hover:text-blue-700 px-10 py-4 rounded-xl font-bold shadow-2xl hover:shadow-white/25 transition-all duration-200 flex items-center gap-3"
              >
                Create Your Squad Now
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Floating Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <button
          onClick={() => handleNavigation("/register")}
          className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-200 flex items-center justify-center group"
        >
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </motion.div>
    </div>
  );
};

export default Home;
