import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Moon, Sun } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import Logo from "../assets/images/Logo.png";
import team from "../assets/images/team.jpg";
import team1 from "../assets/images/team1.jpg";
import team2 from "../assets/images/team2.jpg";
import team3 from "../assets/images/team3.jpg";
import linkedin from "../assets/images/linkedin.png";
import github from "../assets/images/github-sign.png";
import email from "../assets/images/gmail.png";

const pillars = [
  {
    title: "Small Cohorts, Real Accountability",
    description:
      "Every learner gets matched into tighter study circles where goals and check-ins actually happen.",
  },
  {
    title: "Teacher Feedback In Context",
    description:
      "Mentors see your progress and discussion trail before giving feedback, so guidance is specific.",
  },
  {
    title: "Progress That Feels Visible",
    description:
      "Milestones are practical and transparent, helping students feel momentum week by week.",
  },
];

const stats = [
  { value: "50k+", label: "Students onboarded" },
  { value: "2.5k+", label: "Active study groups" },
  { value: "200+", label: "Live courses" },
  { value: "99%", label: "Course completion lift" },
];

const channels = [
  {
    title: "GitHub",
    subtitle: "Contribute and inspect",
    icon: github,
    href: "https://github.com/Bibek-Ghimire",
    display: "github.com/Bibek-Ghimire",
  },
  {
    title: "LinkedIn",
    subtitle: "Follow updates",
    icon: linkedin,
    href: "https://www.linkedin.com/in/your-profile",
    display: "linkedin.com/in/your-profile",
  },
  {
    title: "Email",
    subtitle: "Partnerships and support",
    icon: email,
    href: "mailto:bibekghimire764@gmail.com",
    display: "bibekghimire764@gmail.com",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  return (
    <div className="page-surface relative min-h-screen overflow-x-hidden pb-14">
      <div className="section-shell pt-6 md:pt-8">
        <header className="surface-card relative grain-overlay rounded-3xl px-5 py-4 md:px-8 md:py-5">
          <div className="relative z-10 flex items-center justify-between gap-3">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-3"
            >
              <img
                src={Logo}
                alt="Syncademy"
                className="h-10 w-10 rounded-xl"
              />
              <span className="brand-title text-xl font-bold md:text-2xl">
                Syncademy
              </span>
            </button>

            <nav className="hidden items-center gap-2 md:flex">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="nav-chip rounded-full px-4 py-2 text-sm font-semibold"
              >
                Home
              </button>
              <button
                onClick={() =>
                  aboutRef.current?.scrollIntoView({ behavior: "smooth" })
                }
                className="nav-chip rounded-full px-4 py-2 text-sm font-semibold"
              >
                About
              </button>
              <button
                onClick={() =>
                  contactRef.current?.scrollIntoView({ behavior: "smooth" })
                }
                className="nav-chip rounded-full px-4 py-2 text-sm font-semibold"
              >
                Contact
              </button>
            </nav>

            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={() => navigate("/login")}
                className="nav-chip rounded-full px-4 py-2 text-sm font-semibold"
              >
                Login
              </button>
              <button
                onClick={toggleTheme}
                className="nav-chip rounded-full p-2.5"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-amber-400" />
                ) : (
                  <Moon className="h-5 w-5 text-stone-700" />
                )}
              </button>
            </div>
          </div>
        </header>
      </div>

      <main className="section-shell mt-10">
        <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-kicker mb-5" />
            <h1 className="section-title text-4xl leading-[1.06] md:text-6xl">
              Study feels better when the platform feels human.
            </h1>
            <p className="body-copy mt-6 max-w-xl text-base leading-relaxed md:text-lg">
              Syncademy brings courses, discussion, mentoring, and peer momentum
              into one space designed for real students and real habits.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/register")}
                className="cta-main rounded-full px-6 py-3 text-sm font-bold md:text-base"
              >
                Start Learning
              </button>
              <button
                onClick={() => navigate("/login")}
                className="cta-ghost rounded-full px-6 py-3 text-sm font-bold md:text-base"
              >
                I Already Have an Account
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="surface-card-strong relative rounded-[2rem] p-3"
          >
            <img
              src={team}
              alt="Students collaborating"
              className="h-[420px] w-full rounded-[1.6rem] object-cover"
            />
            <div className="absolute bottom-8 left-8 rounded-2xl bg-black/70 px-4 py-3 text-sm font-semibold text-white backdrop-blur">
              Collaboration-first learning ecosystem
            </div>
          </motion.div>
        </section>

        <section className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="surface-card rounded-2xl px-5 py-5"
            >
              <p className="brand-title text-3xl font-bold">{item.value}</p>
              <p className="body-copy mt-1 text-sm">{item.label}</p>
            </div>
          ))}
        </section>

        <section
          ref={aboutRef}
          className="mt-16 grid items-start gap-8 lg:grid-cols-[1fr_1fr]"
        >
          <div>
            <span className="section-kicker mb-5" />
            <h2 className="section-title">
              Built for community learning, not solo content bingeing.
            </h2>
            <div className="mt-6 space-y-4">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="surface-card rounded-2xl px-5 py-4"
                >
                  <h3 className="font-bold">{pillar.title}</h3>
                  <p className="body-copy mt-1 text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/register")}
              className="cta-ghost mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold"
            >
              Join Your First Study Circle
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[team1, team2, team3].map((img, index) => (
              <div
                key={img}
                className={`surface-card overflow-hidden rounded-2xl ${index === 2 ? "col-span-2" : ""}`}
              >
                <img
                  src={img}
                  alt="Syncademy learning activity"
                  className={`w-full object-cover ${index === 2 ? "h-64" : "h-48"}`}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card-strong mt-16 rounded-3xl px-6 py-8 md:px-10 md:py-10">
          <h2 className="section-title">What students get in practice</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              "Clear weekly milestones and peer accountability loops",
              "Active discussions around real assignments, not empty forums",
              "Fast teacher responses with context from your progress",
              "Simple payment and enrollment flow for premium courses",
            ].map((line) => (
              <div
                key={line}
                className="flex items-start gap-3 rounded-2xl border border-stone-200/70 bg-white/70 px-4 py-3 dark:border-stone-700 dark:bg-stone-950/60"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />
                <p className="text-sm leading-relaxed body-copy">{line}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          ref={contactRef}
          className="mt-16"
        >
          <h2 className="section-title">Connect with the team</h2>
          <p className="body-copy mt-3 max-w-2xl">
            Want to contribute, share feedback, or collaborate on
            education-focused tools? Reach us directly through any of these
            channels.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {channels.map((channel) => (
              <a
                key={channel.title}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                className="surface-card rounded-2xl px-5 py-5 transition-transform hover:-translate-y-1"
              >
                <img
                  src={channel.icon}
                  alt={channel.title}
                  className="h-9 w-9"
                />
                <h3 className="mt-4 font-bold">{channel.title}</h3>
                <p className="body-copy mt-1 text-sm">{channel.subtitle}</p>
                <p className="mt-3 text-xs text-stone-500 dark:text-stone-400">
                  {channel.display}
                </p>
              </a>
            ))}
          </div>
        </section>

        <section className="surface-card-strong mt-14 px-6 py-10 text-center md:px-10">
          <h2 className="section-title text-3xl md:text-5xl">
            Start your next productive semester now.
          </h2>
          <p className="body-copy mx-auto mt-3 max-w-2xl">
            No fluff. No fake engagement. Just better collaboration and smarter
            learning workflows.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="primary-action mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold"
          >
            Create Free Account
            <ArrowRight className="h-4 w-4" />
          </button>
        </section>
      </main>
    </div>
  );
};

export default Home;

