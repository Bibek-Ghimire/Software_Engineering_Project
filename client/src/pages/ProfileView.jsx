import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Linkedin,
  Github,
  Download,
  Edit2,
  Mail,
  Moon,
  Sun,
  MapPin,
  Star,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const ProfileView = () => {
  const navigate = useNavigate();
  // const { id } = useParams(); // ✅ get profile id (if exists)
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error(err);
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Handle theme toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-blue-700 animate-pulse">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-white transition-all duration-500">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-10 space-y-8 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-sky-200/20 to-blue-300/15 rounded-full blur-3xl -translate-y-32 translate-x-32 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/15 to-sky-300/20 rounded-full blur-3xl translate-y-48 -translate-x-48 animate-pulse"></div>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4 p-3 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-sky-600 dark:text-sky-400 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 border border-sky-200/50 dark:border-gray-700 ring-2 ring-sky-100/50 dark:ring-sky-800/50"
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Profile Header */}
        <div className="flex flex-col items-center relative z-10">
          <div className="relative group">
            {user.profilePicture ? (
              <div className="relative">
                <img
                  src={`http://localhost:5000${user.profilePicture}`}
                  alt="Profile"
                  className="w-40 h-40 rounded-full border-4 border-white dark:border-gray-700 shadow-2xl object-cover ring-4 ring-sky-200/50 dark:ring-sky-800/50 transition-all duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-400/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ) : (
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl ring-4 ring-sky-200/50 dark:ring-sky-800/50 transition-all duration-300 group-hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rotate-45 translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
                {user.name[0]}
              </div>
            )}
            <button
              onClick={() => navigate("/profile/edit")}
              className="absolute bottom-2 right-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 border-2 border-white dark:border-gray-700 hover:rotate-12"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center mt-6">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 dark:from-sky-400 dark:to-blue-500 bg-clip-text text-transparent mb-2 hover:scale-105 transition-transform duration-300">
              {user.name}
            </h2>
            <div className="flex items-center justify-center gap-2 text-sky-600 dark:text-sky-400 mb-2">
              <MapPin className="w-4 h-4" />
              <p className="text-lg font-medium">{user.college || "Student"}</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 relative z-10">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-sky-100/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-xl text-sky-700 dark:text-sky-300">
                  Basic Information
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <InfoItem
                  label="Full Name"
                  value={user.name}
                />
                <InfoItem
                  label="Email"
                  value={user.email}
                  icon={<Mail className="w-4 h-4 text-sky-500" />}
                />
                <InfoItem
                  label="College"
                  value={user.college || "Not provided"}
                />
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-sky-100/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                  <Edit2 className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-xl text-sky-700 dark:text-sky-300">
                  Bio
                </h3>
              </div>
              <div className="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl p-6 border-l-4 border-sky-400 shadow-inner">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {user.bio || "Not provided"}
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-sky-100/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-xl text-sky-700 dark:text-sky-300">
                  Skills
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {user.skills?.length ? (
                  user.skills.map((s, i) => (
                    <span
                      key={i}
                      className="group px-4 py-3 bg-gradient-to-r from-sky-100 to-blue-100 text-sky-800 dark:from-sky-800/80 dark:to-blue-800/80 dark:text-sky-100 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border border-sky-200/50 dark:border-sky-700/50 cursor-default hover:-translate-y-0.5"
                    >
                      <span className="group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors">
                        {s}
                      </span>
                    </span>
                  ))
                ) : (
                  <div className="text-center py-8 w-full">
                    <div className="w-16 h-16 bg-gradient-to-br from-sky-200 to-blue-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Star className="w-6 h-6 text-sky-600" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      No skills added
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Interests */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-sky-100/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center shadow-md">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-xl text-sky-700 dark:text-sky-300">
                  Interests
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {user.interests?.length ? (
                  user.interests.map((i, idx) => (
                    <span
                      key={idx}
                      className="group px-4 py-3 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 dark:from-rose-800/80 dark:to-pink-800/80 dark:text-rose-100 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border border-rose-200/50 dark:border-rose-700/50 cursor-default hover:-translate-y-0.5"
                    >
                      <span className="group-hover:text-rose-600 dark:group-hover:text-rose-300 transition-colors">
                        {i}
                      </span>
                    </span>
                  ))
                ) : (
                  <div className="text-center py-8 w-full">
                    <div className="w-16 h-16 bg-gradient-to-br from-rose-200 to-pink-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Star className="w-6 h-6 text-rose-600" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      No interests added
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Resume */}
            {user.resume && (
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-sky-100/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                    <Download className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-sky-700 dark:text-sky-300">
                    Resume
                  </h3>
                </div>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl p-6 border border-indigo-200/50 dark:border-indigo-700/50">
                  <a
                    href={`http://localhost:5000${user.resume}`}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md">
                      <Download className="w-5 h-5 text-white" />
                    </div>
                    <span className="group-hover:underline">View Resume</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-sky-100/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-xl text-sky-700 dark:text-sky-300">
                  Links & Contact
                </h3>
              </div>
              <div className="space-y-4">
                {user.linkedin && (
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border border-blue-200/50 dark:border-blue-700/50 hover:shadow-md transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                      <Linkedin className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:underline">
                      LinkedIn
                    </span>
                  </a>
                )}
                {user.github && (
                  <a
                    href={user.github}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-700/30 dark:to-slate-700/30 rounded-xl border border-gray-200/50 dark:border-gray-600/50 hover:shadow-md transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-slate-700 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                      <Github className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-semibold group-hover:underline">
                      GitHub
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced InfoItem component with better styling
const InfoItem = ({ label, value, icon }) => (
  <div className="group p-4 bg-gradient-to-r from-sky-25 to-blue-25 dark:from-sky-900/20 dark:to-blue-900/20 rounded-xl border border-sky-100/50 dark:border-sky-800/50 hover:shadow-md transition-all duration-300">
    <div className="flex items-center gap-2 mb-2">
      {icon && (
        <div className="p-1.5 bg-sky-100 dark:bg-sky-900/50 rounded-md group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      )}
      <p className="text-sky-600 dark:text-sky-400 text-sm font-bold uppercase tracking-wide">
        {label}
      </p>
    </div>
    <p className="font-bold text-lg text-gray-800 dark:text-gray-200 group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors duration-300">
      {value}
    </p>
  </div>
);

export default ProfileView;
