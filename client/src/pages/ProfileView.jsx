import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Linkedin, Github, Download, Edit2, Mail, Moon, Sun } from "lucide-react";
import Sidebar from "../components/Sidebar";

const ProfileView = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-medium text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-10 space-y-8 relative">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow hover:scale-110 transition"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Profile Header */}
        <div className="flex flex-col items-center relative">
          <div className="relative">
            {user.profilePicture ? (
              <img
                src={`http://localhost:5000${user.profilePicture}`}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {user.name[0]}
              </div>
            )}
            <button
              onClick={() => navigate("/profile/edit")}
              className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition"
            >
              <Edit2 className="w-5 h-5 text-indigo-600" />
            </button>
          </div>
          <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            {user.college || "Student"}
          </p>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="font-semibold text-lg mb-4 border-b pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoItem label="Full Name" value={user.name} />
                <InfoItem label="Email" value={user.email} icon={<Mail className="w-4 h-4" />} />
                <InfoItem label="College" value={user.college || "Not provided"} />
              </div>
            </div>

            {/* Bio in separate card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="font-semibold text-lg mb-3">Bio</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {user.bio || "Not provided"}
              </p>
            </div>

            {/* Skills */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="font-semibold text-lg mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills?.length
                  ? user.skills.map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-white rounded-full text-sm font-medium"
                      >
                        {s}
                      </span>
                    ))
                  : <p className="text-gray-500">No skills added</p>}
              </div>
            </div>

            {/* Interests */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="font-semibold text-lg mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {user.interests?.length
                  ? user.interests.map((i, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-pink-100 text-pink-700 dark:bg-pink-700 dark:text-white rounded-full text-sm font-medium"
                      >
                        {i}
                      </span>
                    ))
                  : <p className="text-gray-500">No interests added</p>}
              </div>
            </div>

            {/* Resume */}
            {user.resume && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h3 className="font-semibold text-lg mb-3">Resume</h3>
                <a
                  href={`http://localhost:5000${user.resume}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  View Resume <Download className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="font-semibold text-lg mb-4 border-b pb-2">Links & Contact</h3>
              <div className="space-y-3">
                {user.linkedin && (
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline dark:text-blue-400"
                  >
                    <Linkedin className="w-5 h-5" /> LinkedIn
                  </a>
                )}
                {user.github && (
                  <a
                    href={user.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-gray-700 hover:underline dark:text-gray-300"
                  >
                    <Github className="w-5 h-5" /> GitHub
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

// Small reusable component for profile info
const InfoItem = ({ label, value, icon }) => (
  <div>
    <p className="text-gray-500 text-sm flex items-center gap-1">
      {label} {icon && icon}
    </p>
    <p className="font-medium mt-1">{value}</p>
  </div>
);

export default ProfileView;
