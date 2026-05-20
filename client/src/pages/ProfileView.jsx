import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
  const { id } = useParams(); //  get profile id (if exists)
  const location = useLocation(); //  get state from navigation
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  console.log(" ProfileView - id param:", id);
  console.log(" ProfileView - location:", location);

  const fetchProfile = useCallback(async () => {
    console.log(" Starting fetchProfile, id:", id);
    try {
      const token = sessionStorage.getItem("token");
      console.log(" Got token:", !!token);

      // If viewing another user's profile (id is present), always fetch complete data
      if (id) {
        console.log(" Fetching user profile with id:", id);
        try {
          const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(" Fetched user data:", res.data);
          setUser(res.data);
          return;
        } catch (apiErr) {
          console.error(" API Error fetching user:", apiErr);
          // Try using passed student data if API fails
          if (location.state?.studentData) {
            console.log(
              " Using passed student data as fallback:",
              location.state.studentData,
            );
            setUser(location.state.studentData);
            return;
          }
          // Only navigate back if we have no fallback data
          throw apiErr;
        }
      }

      // If student data was passed through navigation state and no id, use it as initial data
      if (location.state?.studentData) {
        console.log(" Using passed student data:", location.state.studentData);
        setUser(location.state.studentData);
        return;
      }

      // Otherwise, fetch the current user's profile
      console.log(" Fetching current user profile");
      const res = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(" Fetched current user:", res.data);
      setUser(res.data);
    } catch (err) {
      console.error(" Error fetching profile:", err);
      // Only navigate if id is not present (viewing own profile)
      if (!id) {
        console.log(" Error loading own profile, going to home");
        navigate("/");
      } else {
        console.log(" Error loading user profile, but staying on page");
        // Don't navigate away when viewing another user - stay on page
      }
    }
  }, [navigate, id, location.state]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Refetch profile when page becomes visible or regains focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log(" Page became visible - refetching profile data");
        fetchProfile();
      }
    };

    const handleFocus = () => {
      console.log(" Window gained focus - refetching profile data");
      fetchProfile();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchProfile]);

  // Listen for profile update event and refetch immediately
  useEffect(() => {
    const handleProfileUpdate = () => {
      console.log(" Profile update event received - refetching immediately");
      fetchProfile();
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
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
      <div className="flex items-center justify-center min-h-screen page-surface">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-stone-200 dark:border-stone-700 border-t-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-base font-semibold body-copy ">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen page-surface text-gray-900 dark:text-white transition-all duration-500">
      {/* Sidebar - only show if viewing own profile */}
      {!id && <Sidebar />}

      {/* Main Content */}
      <div
        className={`${!id ? "flex-1" : "w-full"} p-6 lg:p-10 space-y-8 relative overflow-hidden`}
      >
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="icon-action absolute top-4 right-4 z-10"
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
                  className="w-40 h-40 rounded-full border-4 border-white dark:border-stone-800 shadow-lg object-cover ring-4 ring-stone-200/70 dark:ring-stone-700/70 transition-all duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full bg-stone-900/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ) : (
              <div className="w-40 h-40 rounded-full bg-stone-900 dark:bg-stone-100 flex items-center justify-center text-white dark:text-stone-900 text-4xl font-bold shadow-lg ring-4 ring-stone-200/70 dark:ring-stone-700/70 transition-all duration-300 group-hover:scale-105 relative overflow-hidden">
                {user.name[0]}
              </div>
            )}
            <button
              onClick={() => (id ? navigate(-1) : navigate("/profile/edit"))}
              className="absolute bottom-2 right-2 icon-action"
              title={id ? "Go back" : "Edit profile"}
            >
              {id ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              ) : (
                <Edit2 className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="text-center mt-6">
            <h2 className="section-title text-4xl mb-2 hover:scale-105 transition-transform duration-300">
              {user.name}
            </h2>
            <div className="flex items-center justify-center gap-2 body-copy mb-2">
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
            <div className="surface-card p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="font-bold text-lg text-stone-900 dark:text-stone-50">
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
                  icon={<Mail className="w-4 h-4 text-orange-500" />}
                />
                <InfoItem
                  label="College"
                  value={user.college || "Not provided"}
                />
              </div>
            </div>

            {/* Bio */}
            <div className="surface-card p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <Edit2 className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                </div>
                <h3 className="font-bold text-lg text-stone-900 dark:text-stone-50">
                  Bio
                </h3>
              </div>
              <div className="surface-panel p-5 border-l-4 border-l-orange-400">
                <p className="body-copy leading-relaxed">
                  {user.bio || "Not provided"}
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="surface-card p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <Star className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                </div>
                <h3 className="font-bold text-lg text-stone-900 dark:text-stone-50">
                  Skills
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {user.skills?.length ? (
                  user.skills.map((s, i) => (
                    <span
                      key={i}
                      className="nav-chip px-4 py-3 cursor-default"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <div className="text-center py-8 w-full">
                    <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                      <Star className="w-6 h-6 text-stone-500 dark:text-stone-400" />
                    </div>
                    <p className="body-copy">No skills added</p>
                  </div>
                )}
              </div>
            </div>

            {/* Interests */}
            <div className="surface-card p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <Star className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                </div>
                <h3 className="font-bold text-lg text-stone-900 dark:text-stone-50">
                  Interests
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {user.interests?.length ? (
                  user.interests.map((i, idx) => (
                    <span
                      key={idx}
                      className="nav-chip px-4 py-3 cursor-default"
                    >
                      {i}
                    </span>
                  ))
                ) : (
                  <div className="text-center py-8 w-full">
                    <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                      <Star className="w-6 h-6 text-stone-500 dark:text-stone-400" />
                    </div>
                    <p className="body-copy">No interests added</p>
                  </div>
                )}
              </div>
            </div>

            {/* Resume */}
            {user.resume && (
              <div className="surface-card p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                    <Download className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                  </div>
                  <h3 className="font-bold text-lg text-stone-900 dark:text-stone-50">
                    Resume
                  </h3>
                </div>
                <div className="surface-panel p-6">
                  <a
                    href={`http://localhost:5000${user.resume}`}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 body-copy font-semibold transition-all duration-300"
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-orange-600 text-white shadow-sm group-hover:scale-105 transition-transform duration-200">
                      <Download className="w-4 h-4" />
                    </div>
                    <span className="group-hover:underline">View Resume</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="surface-card p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <Mail className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                </div>
                <h3 className="font-bold text-lg text-stone-900 dark:text-stone-50">
                  Links &amp; Contact
                </h3>
              </div>
              <div className="space-y-4">
                {user.linkedin && (
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 p-4 surface-panel transition-all duration-300 hover:shadow-md"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-600 text-white transition-transform duration-300 group-hover:rotate-6">
                      <Linkedin className="w-4 h-4 text-white" />
                    </div>
                    <span className="body-copy font-semibold group-hover:underline">
                      LinkedIn
                    </span>
                  </a>
                )}
                {user.github && (
                  <a
                    href={user.github}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 p-4 surface-panel transition-all duration-300 hover:shadow-md"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-stone-800 text-white transition-transform duration-300 group-hover:rotate-6">
                      <Github className="w-4 h-4 text-white" />
                    </div>
                    <span className="body-copy font-semibold group-hover:underline">
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

const InfoItem = ({ label, value, icon }) => (
  <div className="group surface-panel p-4 transition-all duration-200 hover:shadow-sm">
    <div className="flex items-center gap-2 mb-1.5">
      {icon && (
        <div className="p-1 rounded-md bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
          {icon}
        </div>
      )}
      <p className="body-copy text-xs font-bold uppercase tracking-wide">
        {label}
      </p>
    </div>
    <p className="font-semibold text-base text-stone-900 dark:text-stone-50">
      {value}
    </p>
  </div>
);

export default ProfileView;
