import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  BookOpen,
  User,
  GraduationCap,
  Award,
  FileText,
} from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";
import TeacherSidebar from "../../components/TeacherSidebar";

const TeacherProfileView = () => {
  const { id } = useParams(); // teacher id from URL
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/teacher/${id}`
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
<div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 transition-all duration-700">
  {/* Sidebar */}
  <div className="w-64 fixed top-0 left-0 h-full z-30">
    <TeacherSidebar />
  </div>
  <div className="ml-64 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-indigo-900 w-full">
           <motion.div
        className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-10"
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
              className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-md"
              whileHover={{ scale: 1.05 }}
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <User className="text-blue-500" /> {profile.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2 mt-2">
              <Mail className="text-blue-400" /> {profile.email}
            </p>
            <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2 mt-1">
              <GraduationCap className="text-blue-400" />{" "}
              {profile.qualification || "Not added yet"}
            </p>
          </div>
        </div>

        {/* Profile Content */}
        <div className="mt-10 grid md:grid-cols-2 gap-8">
          {/* Left Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
              <BookOpen className="text-blue-500" /> Teaching Info
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              <b>Subject:</b> {profile.subject || "Not added yet"}
            </p>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              <b>Qualification:</b> {profile.qualification || "Not added yet"}
            </p>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              <b>College:</b> {profile.college || "Not added yet"}
            </p>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              <b>Bio:</b> {profile.bio || "Not added yet"}
            </p>
          </div>

          {/* Right Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
              <Award className="text-blue-500" /> Achievements
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
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
              <p className="text-gray-600 dark:text-gray-300">
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
            <FileText className="text-blue-500" /> Resume
          </h2>
          {profile.resume ? (
            <a
              href={`http://localhost:5000${profile.resume}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View / Download Resume
            </a>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
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
