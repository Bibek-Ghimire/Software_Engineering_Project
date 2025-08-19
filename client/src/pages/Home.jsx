// Home.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, BookOpen, Award, MessageCircle,
  Globe, Target, Zap, Play, Sun, Moon, ArrowRight, Info,ChevronDown, ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../assets/images/Logo.png";
import team from "../assets/images/team.jpg"; 
import linkedin from "../assets/images/linkedin.png";
import github from "../assets/images/github-sign.png";
import email from "../assets/images/gmail.png";
import team1 from "../assets/images/team1.jpg";
import team2 from "../assets/images/team2.jpg";
import team3 from "../assets/images/team3.jpg";

const features = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Collaborative Peer Study",
    description: "Form study squads and gain insights from every session."
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Crowdsourced Notes",
    description: "Build the ultimate knowledge repository together."
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Achievement Badges",
    description: "Celebrate learning milestones and contributions."
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Live Q&A Chats",
    description: "Engage in real-time peer discussions."
  }
];

const stats = [
  { number: "12K+", label: "Learners" },
  { number: "600+", label: "Study Squads" },
  { number: "75+", label: "Courses" },
  { number: "98%", label: "Satisfaction" }
];

const Home = () => {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const handleNavigation = (path) => navigate(path);

const aboutRef = useRef(null);
const contactRef = useRef(null);




  return (
    <div className="min-h-screen bg-gray-300 dark:bg-gray-900 text-gray-800 dark:text-gray-200 overflow-x-hidden">
      <header className="relative pt-8 px-6 md:px-12 lg:px-20">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="w-14 h-14 rounded-md shadow-sm" />
            <h2 className="text-2xl font-bold text-blue-600">Syncademy</h2>
          </div>

          <div className="flex gap-6 items-center">
            <button onClick={() => handleNavigation("/")} className="text-blue-600 hover:underline">Home</button>


        <button
              onClick={() => aboutRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="text-blue-600 hover:underline"
        >
          About Us
        </button>

           <button onClick={() => contactRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="text-blue-600 hover:underline"
            >
            Contact
            </button>

            <button onClick={() => handleNavigation("/login")} className="text-blue-600 hover:underline">Login</button>
            <button onClick={() => handleNavigation("/register")} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Register</button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 transition"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        <div className="mt-12 flex flex-col-reverse md:flex-row items-center gap-8">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-blue-600">
              Learn Together, Grow Together
            </h1>
            <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
              Build knowledge collaboratively—form squads, share insights, and succeed together.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleNavigation("/register")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleNavigation("/login")}
                className="flex items-center gap-2 border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50"
              >
                Sign In
              </button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1"
          >
            <img
              src="/images/project.png"
              alt="Students collaborating"
              className="rounded-lg shadow-md w-80"
            />
          </motion.div>
        </div>
      </header>

      <section className="px-6 md:px-12 lg:px-20 my-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-700">Why Syncademy?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group perspective">
              <motion.div
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`transition-transform duration-300 transform-style-preserve-3d
                  bg-white border border-blue-100
                  rounded-xl p-6 text-center shadow
                  group-hover:scale-105 group-hover:shadow-xl
                  ${hoveredFeature === index ? "rotate-x-[6deg] rotate-y-[6deg]" : ""}
                `}
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="font-semibold mb-2 text-blue-700">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-20 mb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-3xl font-bold text-blue-600">{s.number}</div>
              <div className="text-sm text-gray-600">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* New About Section */}
    <motion.section
  ref={aboutRef}
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
  className="bg-gray-300 dark:bg-gray-800 px-6 md:px-12 lg:px-20 py-20"
>
  <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
  <img src={team} alt="Team" className="rounded-xl shadow-lg w-full" />

  <div>
    <h2 className="text-3xl font-bold text-blue-700 mb-4">About Syncademy</h2>

    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
      Syncademy is a next-generation peer learning platform designed to empower students through collaborative study methods and community-driven academic support.
    </p>

    {!showMore ? (
      <>
        <button
          onClick={() => setShowMore(true)}
           className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          aria-label="Show More"
        >
          Show More <ChevronDown className="w-4 h-4 ml-1" />
        </button>
      </>
    ) : (
      <>
        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          Our mission is to revolutionize traditional learning by fostering an interactive environment where learners can create study groups, share knowledge, and achieve academic excellence together.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          Unlike conventional e-learning tools, Syncademy encourages active participation, note exchange, live doubt resolution, and structured knowledge sharing. Whether you're preparing for competitive exams or looking to solidify your academic foundations, Syncademy provides the digital infrastructure to make learning social, productive, and goal-oriented.
        </p>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300 mt-4">
          <li>✔ Foster real-time collaboration and discussion</li>
          <li>✔ Encourage peer mentorship and community growth</li>
          <li>✔ Provide scalable tools for both students and institutions</li>
        </ul>
        <button
          onClick={() => setShowMore(false)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          aria-label="Show Less"
        >
          Show Less <ChevronUp className="w-4 h-4 ml-1" />
        </button>
      </>
    )}
  </div>
</div>

  <div className="grid md:grid-cols-3 gap-6">
    <img
      src={team1}
      alt="Team working together"
      className="rounded-lg shadow-md w-full h-64 object-cover"
    />
    <img
      src={team2}
      alt="Collaborative workspace"
      className="rounded-lg shadow-md w-full h-64 object-cover"
    />
    <img
      src={team3}
      alt="Students brainstorming"
      className="rounded-lg shadow-md w-full h-64 object-cover"
    />
  </div>
</motion.section>



      {/* Business Process */}
      <section className="bg-gray-100 dark:bg-gray-900 px-6 md:px-12 lg:px-20 py-16">
        <h2 className="text-3xl font-bold text-blue-700 mb-10 text-center">How it Works</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-2xl font-bold text-green-500 mb-2">01</h3>
            <p className="font-semibold mb-1">Create a Squad</p>
            <p className="text-sm text-gray-600">Start with friends or classmates with shared goals.</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-yellow-500 mb-2">02</h3>
            <p className="font-semibold mb-1">Collaborate & Contribute</p>
            <p className="text-sm text-gray-600">Exchange notes, quizzes, and support each other in real-time.</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-blue-500 mb-2">03</h3>
            <p className="font-semibold mb-1">Celebrate Progress</p>
            <p className="text-sm text-gray-600">Earn badges and reflect on your shared journey.</p>
          </div>
        </div>
      </section>


     <motion.section
            ref={contactRef}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gray-100 dark:bg-gray-900 px-6 md:px-12 lg:px-20 py-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-blue-700 mb-4">Contact Us</h2>
              <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Have questions, feedback, or looking to contribute? Get in touch with us through our professional networks. Syncademy is open source and built with love by passionate developers. 
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
              {/* GitHub */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
                <div className="flex justify-center mb-4">
                  <img src={github} alt="GitHub" className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-semibold text-blue-600 mb-2">GitHub</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Browse our source code, report issues, or contribute directly.</p>
                <a
                  href="https://github.com/your-syncademy-repo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  github.com/your-syncademy-repo
                </a>
              </div>

              {/* LinkedIn */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
                <div className="flex justify-center mb-4">
                  <img src={linkedin} alt="LinkedIn" className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-semibold text-blue-600 mb-2">LinkedIn</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Connect with our team or follow us for updates on new features.</p>
                <a
                  href="https://www.linkedin.com/in/your-profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  linkedin.com/in/your-profile
                </a>
              </div>

              {/* Email / License */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
                <div className="flex justify-center mb-4">
                  <img src={email} alt="Email" className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-semibold text-blue-600 mb-2">Connect with us</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Email us with inquiries or collaboration ideas.</p>
                <a href="mailto:support@syncademy.com" className="text-blue-600 hover:underline text-sm font-medium">
                  syncademy@gmail.com
                </a>
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">© 2025 Syncademy | License: MIT</p>
              </div>
            </div>
    </motion.section>



      <section className="bg-blue-50 py-16">
        <div className="text-center px-6 md:px-12 lg:px-20">
          <h2 className="text-3xl font-bold mb-4 text-blue-700">Start Learning Together</h2>
          <p className="text-lg mb-6 text-gray-700">
            Create your first study squad and see the power of collaborative learning.
          </p>
          <button
            onClick={() => handleNavigation("/register")}
            className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow hover:bg-blue-700"
          >
            Join Syncademy
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
