import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import {
  Mail,
  BookOpen,
  User,
  GraduationCap,
  Award,
  FileText,
  Sun,
  Moon,
} from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";
import TeacherSidebar from "../../components/TeacherSidebar";

const TeacherProfileView = () => {
  const { id } = useParams(); // teacher id from URL
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/teacher/${id}`,
        );
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching teacher:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [id]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Teacher not found
      </div>
    );
  }

  return (
    <div className="flex min-h-screen page-surface transition-all duration-700">
      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full z-30">
        <TeacherSidebar />
      </div>
      <div className="ml-64 min-h-screen page-surface w-full relative">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-8 right-8 icon-action absolute top-8 right-8 z-10"
        >
          {darkMode ? (
            <Sun className="w-6 h-6" />
          ) : (
            <Moon className="w-6 h-6" />
          )}
        </button>
        <motion.div
          className="max-w-5xl mx-auto bg-white dark:bg-stone-900 rounded-3xl shadow-xl p-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <motion.img
                src={
                  profile.profilePicture
                    ? `http://localhost:5000${profile.profilePicture}`
                    : "/default-teacher.png"
                }
                alt="Teacher"
                className="w-40 h-40 rounded-full object-cover border-4 border-orange-500 shadow-md"
                whileHover={{ scale: 1.05 }}
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-50 flex items-center gap-2">
                <User className="text-orange-500" /> {profile.name}
              </h1>
              <p className="text-stone-600 dark:text-stone-400 flex items-center gap-2 mt-2">
                <Mail className="text-orange-400" /> {profile.email}
              </p>
              <p className="text-stone-600 dark:text-stone-400 flex items-center gap-2 mt-1">
                <GraduationCap className="text-orange-400" />{" "}
                {profile.qualification || "Not added yet"}
              </p>
            </div>
          </div>

          {/* Profile Content */}
          <div className="mt-10 grid md:grid-cols-2 gap-8">
            {/* Left Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                <BookOpen className="text-orange-500" /> Teaching Info
              </h2>
              <p className="text-stone-600 dark:text-stone-400">
                <b>Subject:</b> {profile.subject || "Not added yet"}
              </p>
              <p className="mt-2 text-stone-600 dark:text-stone-400">
                <b>Qualification:</b> {profile.qualification || "Not added yet"}
              </p>
              <p className="mt-2 text-stone-600 dark:text-stone-400">
                <b>College:</b> {profile.college || "Not added yet"}
              </p>
              <p className="mt-2 text-stone-600 dark:text-stone-400">
                <b>Bio:</b> {profile.bio || "Not added yet"}
              </p>
            </div>

            {/* Right Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                <Award className="text-orange-500" /> Achievements
              </h2>
              <p className="text-stone-600 dark:text-stone-400">
                {profile.achievements?.length > 0
                  ? profile.achievements.join(", ")
                  : "No achievements added yet"}
              </p>
            </div>
          </div>

          {/* Skills & Interests */}
          <div className="mt-8 grid md:grid-cols-2 gap-8">
            {["skills", "interests"].map((field) => (
              <div key={field}>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </h2>
                <p className="text-stone-600 dark:text-stone-400">
                  {profile[field]?.length > 0
                    ? profile[field].join(", ")
                    : `No ${field} added yet`}
                </p>
              </div>
            ))}
          </div>

          {/* Resume */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
              <FileText className="text-orange-500" /> Resume
            </h2>
            {profile.resume ? (
              <a
                href={`http://localhost:5000${profile.resume}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:underline"
              >
                View / Download Resume
              </a>
            ) : (
              <p className="text-stone-600 dark:text-stone-400">
                No resume uploaded yet
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherProfileView;


