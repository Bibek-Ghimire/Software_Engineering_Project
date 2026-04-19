import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import {
  User,
  Mail,
  GraduationCap,
  BookOpen,
  Award,
  FileText,
} from "lucide-react";

const TeacherPublicProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/teachers/${id}`,
        );
        // Normalize optional arrays to avoid .length errors
        setProfile({
          ...data,
          achievements: data.achievements || [],
          skills: data.skills || [],
          interests: data.interests || [],
        });
      } catch (e) {
        console.error("Failed to fetch teacher:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
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
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Teacher not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-6">
      <motion.div
        className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header (readonly) */}
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

        {/* Body (readonly) */}
        <div className="mt-10 grid md:grid-cols-2 gap-8">
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

          <div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
              <Award className="text-blue-500" /> Achievements
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {profile.achievements.length > 0
                ? profile.achievements.join(", ")
                : "No achievements added yet"}
            </p>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-8">
          {["skills", "interests"].map((field) => (
            <div key={field}>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {profile[field].length > 0
                  ? profile[field].join(", ")
                  : `No ${field} added yet`}
              </p>
            </div>
          ))}
        </div>

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
  );
};

export default TeacherPublicProfile;
