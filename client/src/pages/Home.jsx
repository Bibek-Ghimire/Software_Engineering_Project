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
  Crown,
  Focus,
  PenTool,
  Library,
  Lightbulb,
  Trophy,
  FileText,
  Video,
  MessageSquare,
  BarChart3,
  Coffee,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../assets/images/Logo.png";
import team from "../assets/images/team.jpg";
import team1 from "../assets/images/team1.jpg";
import team2 from "../assets/images/team2.jpg";
import team3 from "../assets/images/team3.jpg";
import linkedin from "../assets/images/linkedin.png";
import github from "../assets/images/github-sign.png";
import email from "../assets/images/gmail.png";
import { ThemeContext } from "../context/ThemeContext";

const features = [
  {
    icon: <Users className="w-8 h-8" />,
    title: "Active Study Squads",
    description:
      "Connects you with motivated study partners based on learning goals, schedules, and academic interests.",
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Collaborative Knowledge Hub",
    description:
      "Build comprehensive study materials together with real-time editing, version control, and expert-verified content.",
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Entertaining Learning Journey",
    description:
      "Earn badges, climb leaderboards, and unlock achievements as you progress through your academic milestones.",
  },
  {
    icon: <MessageCircle className="w-8 h-8" />,
    title: "24/7 Peer Support Network",
    description:
      "Access instant help through live chat, video calls, and discussion forums moderated by mentors.",
  },
  {
    icon: <Library className="w-8 h-8" />,
    title: "Tailored Learning Paths",
    description:
      "Personalized study plans that adapt to your pace, strengths, and areas for improvement using expert curriculum mapping.",
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Goal Tracking & Analytics",
    description:
      "Monitor your progress with detailed insights, performance metrics, and tangible success indicators.",
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
  },
  {
    name: "Samir Dawadi",
    role: "Engineering Student",
    content:
      "The peer support network is incredible. Having study partners available 24/7 made med school so much more manageable.",
    rating: 5,
  },
  {
    name: "Kushal Ranabhat",
    role: "IT Student",
    content:
      "The peer to peer learning aspect keeps me motivated. I've never been more engaged with my studies than I am now!",
    rating: 5,
  },
];

const channels = [
  {
    title: "GitHub",
    subtitle: "Open Source",
    icon: github,
    href: "https://github.com/Bibek-Ghimire",
    display: "github.com/Bibek-Ghimire",
  },
  {
    title: "LinkedIn",
    subtitle: "Professional Network",
    icon: linkedin,
    href: "https://www.linkedin.com/in/samir-dawadi-516293353/",
    display: "linkedin.com/in/samir-dawadi",
  },
  {
    title: "Email",
    subtitle: "Direct Contact",
    icon: email,
    href: "mailto:sushimzoro777@gmail.com",
    display: "sushimzoro777@gmail.com",
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
    <div className="page-surface relative min-h-screen overflow-x-hidden pb-14 selection:bg-orange-500/30">
      {/* ─── Navigation ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="section-shell pt-4 md:pt-6">
          <header className="surface-card-strong relative backdrop-blur-md bg-white/80 dark:bg-stone-900/80 rounded-3xl px-5 py-4 md:px-8">
            <div className="relative z-10 flex items-center justify-between gap-3">
              <button
                onClick={scrollToTop}
                className="flex items-center gap-3 transition-transform active:scale-95"
              >
                <img
                  src={Logo}
                  alt="Syncademy"
                  className="h-10 w-10 rounded-xl shadow-sm"
                />
                <span className="brand-title text-xl font-bold md:text-2xl">
                  Syncademy
                </span>
              </button>

              <nav className="hidden items-center gap-2 lg:flex">
                <button
                  onClick={scrollToTop}
                  className="nav-chip px-4 py-2 font-semibold"
                >
                  Home
                </button>
                <button
                  onClick={() =>
                    aboutRef.current?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="nav-chip px-4 py-2 font-semibold"
                >
                  About
                </button>
                <button
                  onClick={() =>
                    contactRef.current?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="nav-chip px-4 py-2 font-semibold"
                >
                  Contact
                </button>
              </nav>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNavigation("/login")}
                  className="hidden sm:block nav-chip px-4 py-2 font-semibold"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigation("/register")}
                  className="primary-action rounded-full px-6 py-2.5 text-sm font-bold"
                >
                  Get Started
                </button>
                <button
                  onClick={toggleTheme}
                  className="icon-action rounded-full p-2.5"
                  aria-label="Toggle theme"
                >
                  {isDark ? (
                    <Sun className="h-5 w-5 text-orange-400" />
                  ) : (
                    <Moon className="h-5 w-5 text-stone-700" />
                  )}
                </button>
              </div>
            </div>
          </header>
        </div>
      </nav>

      <main className="section-shell pt-28 md:pt-40">
        {/* ─── Hero Section ─── */}
        <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest">
                Learn Together, Grow Together
              </span>
            </div>
            <h1 className="brand-title text-5xl leading-[1.05] font-black md:text-7xl lg:text-8xl">
              Success is <span className="text-orange-600">better</span> when
              shared.
            </h1>
            <p className="body-copy mt-8 max-w-xl text-lg leading-relaxed md:text-xl">
              Transform your learning experience with collaborative study
              squads, interactive note-taking, and a supportive community of
              over 50,000 learners.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => handleNavigation("/register")}
                className="primary-action rounded-2xl px-8 py-4 text-base font-bold shadow-xl shadow-orange-600/20"
              >
                Start Learning Free
              </button>
              <button
                onClick={() => handleNavigation("/login")}
                className="secondary-action rounded-2xl px-8 py-4 text-base font-bold"
              >
                Sign In
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="surface-card-strong relative rounded-[2.5rem] p-4 group"
          >
            <div className="absolute inset-0 bg-orange-500/10 rounded-[2.5rem] blur-3xl -z-10 group-hover:bg-orange-500/20 transition-all" />
            <img
              src={team}
              alt="Students collaborating"
              className="h-[480px] w-full rounded-[2rem] object-cover shadow-2xl"
            />
          </motion.div>
        </section>

        {/* ─── Trust Indicators ─── */}
        <section className="mt-24 md:mt-32 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="surface-card rounded-2xl p-6 hover:-translate-y-1 transition-all"
            >
              <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/20 rounded-xl flex items-center justify-center text-orange-600 mb-4 border border-orange-100 dark:border-orange-900/40">
                {item.icon}
              </div>
              <p className="brand-title text-4xl font-black text-stone-900 dark:text-white">
                {item.number}
              </p>
              <p className="body-copy mt-1 font-semibold text-sm uppercase tracking-wider">
                {item.label}
              </p>
            </motion.div>
          ))}
        </section>

        {/* ─── Features Section ─── */}
        <section className="mt-32">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title text-4xl md:text-5xl">
              Why Choose <span className="text-orange-600">Syncademy?</span>
            </h2>
            <p className="body-copy mt-4 text-lg">
              Experience the future of education with cutting-edge technology
              designed to maximize your learning potential through collaboration
              and community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="surface-card p-8 group hover:border-orange-500/50 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-stone-50 dark:bg-stone-800 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-stone-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="body-copy leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── How It Works ─── */}
        <section className="mt-32 bg-stone-100/50 dark:bg-stone-900/30 rounded-[3rem] px-8 py-20 border border-stone-200 dark:border-stone-800">
          <div className="text-center mb-20">
            <h2 className="section-title text-4xl">Simple Steps to Success</h2>
            <p className="body-copy mt-3">
              Get started in minutes and unlock the power of collaborative
              learning
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                description:
                  "Sign up in seconds and tell us about your goals. We match you with compatible partners based on academic interests.",
                icon: <Users className="w-6 h-6" />,
                features: [
                  "Matching Interests",
                  "Goal setting",
                  "Schedule sync",
                ],
              },
              {
                step: "02",
                title: "Join Study Squads",
                description:
                  "Connect with peers who share your academic interests. Collaborate on notes and participate in live study sessions.",
                icon: <Heart className="w-6 h-6" />,
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
                  "Track your progress with detailed analytics, earn badges, and celebrate milestones together with your squad.",
                icon: <Trophy className="w-6 h-6" />,
                features: [
                  "Progress tracking",
                  "Achievement system",
                  "Success analytics",
                ],
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="relative group"
              >
                <div className="surface-card p-8 pt-12 h-full hover:shadow-xl transition-all border-l-4 border-l-orange-500">
                  <div className="absolute -top-6 left-8 w-12 h-12 bg-stone-900 dark:bg-stone-100 rounded-full flex items-center justify-center text-white dark:text-stone-900 font-bold text-lg shadow-lg">
                    {step.step}
                  </div>
                  <div className="mb-6 text-orange-600">{step.icon}</div>
                  <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                  <p className="body-copy text-sm mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  <div className="space-y-2">
                    {step.features.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs font-semibold text-stone-500 dark:text-stone-400"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Modern Tools Showcase ─── */}
        <section className="mt-32">
          <div className="text-center mb-16">
            <h2 className="section-title text-4xl font-black text-stone-900 dark:text-white">
              Powerful Tools for{" "}
              <span className="text-orange-600">Modern Learning</span>
            </h2>
            <p className="body-copy mt-3">
              Everything you need to excel academically, all in one platform
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FileText size={24} />,
                title: "Artisan Notes",
                desc: "Collaborative drafting",
              },
              {
                icon: <Video size={24} />,
                title: "Live Rooms",
                desc: "Interactive study spaces",
              },
              {
                icon: <MessageSquare size={24} />,
                title: "Instant Chat",
                desc: "Real-time messaging",
              },
              {
                icon: <BarChart3 size={24} />,
                title: "Analytics",
                desc: "Progress insights",
              },
            ].map((tool, idx) => (
              <div
                key={idx}
                className="surface-card p-6 text-center group hover:border-orange-500/30 transition-all"
              >
                <div className="w-12 h-12 bg-orange-600 text-white rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {tool.icon}
                </div>
                <h4 className="font-bold text-stone-900 dark:text-white mb-1">
                  {tool.title}
                </h4>
                <p className="text-xs body-copy">{tool.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Testimonials ─── */}
        <section className="mt-32">
          <div className="surface-card-strong bg-stone-900 dark:bg-stone-900 rounded-[2.5rem] overflow-hidden relative">
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <Quote className="w-64 h-64 text-white" />
            </div>

            <div className="bg-white relative z-10 px-8 py-16 md:px-16 md:py-20 flex flex-col md:flex-row items-center gap-12 dark:bg-black border border-stone-200 dark:border-stone-700 rounded-[2rem] shadow-2xl">
              <div className="flex-1 text-center md:text-left">
                <h2 className="brand-title text-4xl md:text-5xl font-black text-black mb-6 dark:text-stone-200">
                  What Students Say
                </h2>
                <p className="text-black text-lg max-w-md dark:text-stone-300">
                  Join thousands of students who have transformed their learning
                  experience.
                </p>
                <div className="mt-10 flex gap-2 justify-center md:justify-start">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentTestimonial(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentTestimonial
                          ? "w-12 bg-orange-500"
                          : "w-6 bg-stone-700 hover:bg-stone-600"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex-1 w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="surface-card bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl dark:bg-white border border-stone-200 dark:border-stone-700"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
                        <Users className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-lg">
                          {testimonials[currentTestimonial].name}
                        </h4>
                        <p className="text-stone-500 text-sm">
                          {testimonials[currentTestimonial].role}
                        </p>
                      </div>
                      <div className="ml-auto hidden sm:flex gap-1 text-orange-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-current"
                          />
                        ))}
                      </div>
                    </div>
                    <blockquote className="text-xl text-stone-700 italic leading-relaxed">
                      "{testimonials[currentTestimonial].content}"
                    </blockquote>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* ─── About Section ─── */}
        <section
          ref={aboutRef}
          className="mt-32 grid lg:grid-cols-[1fr_1.1fr] gap-16 items-start"
        >
          <div className="relative">
            <div className="surface-card-strong overflow-hidden rounded-[2.5rem]">
              <img
                src={team}
                alt="Syncademy Team"
                className="w-full h-[500px] object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 hidden xl:grid grid-cols-2 gap-4">
              <div className="surface-card p-3 rounded-2xl w-32 h-32 overflow-hidden shadow-2xl">
                <img
                  src={team1}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="surface-card p-3 rounded-2xl w-32 h-32 overflow-hidden shadow-2xl">
                <img
                  src={team2}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="section-title text-4xl md:text-5xl">
              Built for <span className="text-orange-600">community</span>{" "}
              learning.
            </h2>
            <p className="body-copy mt-8 text-lg leading-relaxed">
              Syncademy is a next-generation peer learning platform designed to
              empower students through collaborative study methods and
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
                  className="mt-8 space-y-8 overflow-hidden"
                >
                  <div className="surface-panel p-6">
                    <h4 className="font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
                      {/* <Target className="w-5 h-5 text-orange-500" /> */}
                      Our Core Values:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "Inclusive Learning",
                        "Community-Driven",
                        "Innovation",
                        "Data-Driven Results",
                      ].map((v) => (
                        <div
                          key={v}
                          className="flex items-center gap-3"
                        >
                          {/* <CheckCircle className="w-4 h-4 text-orange-500" /> */}
                          <span className="font-semibold text-sm">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-stone-100 dark:bg-stone-900/50 rounded-2xl p-6 border border-stone-200 dark:border-stone-800">
                    <h4 className="font-bold text-stone-900 dark:text-white mb-4">
                      What Makes Us Different:
                    </h4>
                    <ul className="space-y-3">
                      {[
                        "Foster real-time collaboration and discussions",
                        "Encourage peer mentorship and growth",
                        "Provide scalable tools for institutions",
                        "Integrate gamification to boost engagement",
                      ].map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-3 text-sm body-copy"
                        >
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setShowMore(!showMore)}
              className="cta-ghost mt-10 inline-flex items-center gap-3 rounded-full px-8 py-4 font-bold"
            >
              {showMore ? "Show Less" : "Learn More"}
              {showMore ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </section>

        {/* ─── Contact Section ─── */}
        <section
          ref={contactRef}
          className="mt-32"
        >
          <div className="text-center mb-16">
            <h2 className="section-title text-4xl">
              Ready to <span className="text-orange-600">Connect?</span>
            </h2>
            <p className="body-copy mt-3">
              We welcome contributions from passionate educators and developers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {channels.map((channel) => (
              <a
                key={channel.title}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                className="surface-card group p-8 hover:border-orange-500/40 transition-all"
              >
                <div className="w-14 h-14 bg-stone-50 dark:bg-stone-800 rounded-2xl flex items-center justify-center p-3 mb-6 group-hover:scale-110 transition-transform">
                  <img
                    src={channel.icon}
                    alt={channel.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold mb-1">{channel.title}</h3>
                <p className="text-orange-600 dark:text-orange-400 text-sm font-bold uppercase tracking-wider mb-4">
                  {channel.subtitle}
                </p>
                <p className="body-copy text-sm leading-relaxed mb-6">
                  Stay updated with our latest features, join discussions, and
                  connect with our team members.
                </p>
                <div className="flex items-center gap-2 text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-100 transition-colors">
                  <span className="text-xs font-mono">{channel.display}</span>
                  <ArrowRight size={14} />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ─── CTA Section ─── */}
        <section className="mt-32 relative overflow-hidden rounded-[3rem] bg-orange-600 dark:bg-orange-600 px-8 py-20 md:py-28 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10 max-w-4xl mx-auto"
          >
            <h2 className="brand-title text-5xl md:text-7xl font-black mb-8 leading-tight">
              Your Academic Success <br />{" "}
              <span className="text-orange-200">Starts Today.</span>
            </h2>
            <p className="text-orange-50 text-xl max-w-2xl mx-auto mb-12 opacity-90">
              Join over 50,000 students who have already transformed their
              learning experience. Start collaborating, start achieving, start
              succeeding.
            </p>
            <button
              onClick={() => handleNavigation("/register")}
              className="bg-white text-orange-600 hover:bg-orange-50 active:scale-95 px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-2xl shadow-orange-950/20"
            >
              Create Your Squad Now
            </button>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default Home;
