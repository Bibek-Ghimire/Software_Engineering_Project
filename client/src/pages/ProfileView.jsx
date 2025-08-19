import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { Linkedin, Github, CalendarDays, FileText, Award } from "lucide-react";

// ✅ Function to create default profile if none found
const createDefaultProfile = () => {
  const defaultProfile = {
    name: "Bibek Ghimire",
    email: "bibek@example.com",
    college: "ABC College of Engineering",
    bio: "Frontend enthusiast, React lover, and peer mentor.",
    photo: "https://via.placeholder.com/150",
    skills: ["React", "Tailwind CSS", "Node.js"],
    interests: ["Peer Learning", "UI/UX", "Community Building"],
  };
  localStorage.setItem("syncademy_profile", JSON.stringify(defaultProfile));
  return defaultProfile;
};

const ProfileView = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("syncademy_profile"));
      if (stored && stored.name) {
        setProfile(stored);
      } else {
        const defaultProfile = createDefaultProfile();
        setProfile(defaultProfile);
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      const defaultProfile = createDefaultProfile();
      setProfile(defaultProfile);
    }
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen flex justify-center items-center text-center text-xl text-gray-600">
        No profile found. Please log in or create your profile.
      </div>
    );
  }

  return (
    <>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-900 dark:to-slate-800 p-6 flex items-center justify-center">

         {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full z-30">
        <Sidebar />
      </div>

      <div className="flex-grow ml-64 p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-900 border border-blue-200 dark:border-gray-700 shadow-2xl rounded-3xl w-full max-w-4xl p-8"
        >


          {/* Profile Header */}
          <div className="text-center">
            {profile.photo && (
              <img
                src={profile.photo}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-blue-500 shadow-md"
              />
            )}
            <h2 className="text-3xl font-bold text-blue-700 dark:text-white">
              {profile.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">{profile.email}</p>
            {profile.college && (
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                🎓 {profile.college}
              </p>
            )}
            {profile.bio && (
              <p className="mt-2 italic text-gray-500 dark:text-gray-400">
                “{profile.bio}”
              </p>
            )}
          </div>

          {/* Timeline */}
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
            <CalendarDays size={18} />
            <span>Joined: March 2024</span>
          </div>

          {/* Skills */}
          {profile.skills?.length > 0 && (
            <div className="mt-6 text-center">
              <h3 className="font-semibold text-blue-600 dark:text-white mb-2">
                💡 Skills:
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {profile.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-white px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {profile.interests?.length > 0 && (
            <div className="mt-6 text-center">
              <h3 className="font-semibold text-blue-600 dark:text-white mb-2">
                🌟 Interests:
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {profile.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-white px-3 py-1 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          <div className="mt-8 text-center">
            <h3 className="font-semibold text-blue-600 dark:text-white mb-3">
              🏅 Achievements & Badges:
            </h3>
            <div className="flex justify-center gap-4 flex-wrap">
              <div className="bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
                <Award size={16} /> Peer Mentor
              </div>
              <div className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
                <Award size={16} /> Top Contributor
              </div>
            </div>
          </div>

          {/* Learning Summary */}
          <div className="mt-8 text-center">
            <h3 className="font-semibold text-blue-600 dark:text-white mb-2">
              📊 Learning Summary:
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Groups Joined:{" "}
              <span className="font-bold text-blue-700 dark:text-blue-300">6</span>{" "}
              &nbsp;|&nbsp; Resources Shared:{" "}
              <span className="font-bold text-blue-700 dark:text-blue-300">
                15+
              </span>
            </p>
          </div>

         {/* Resume Upload */}
          <div className="mt-8 text-center">
  {profile.resume ? (
    <a
      href={profile.resume}
      download="Resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl font-medium hover:brightness-110 transition-all shadow"
    >
      <FileText size={18} className="mr-2" />
      View / Download Resume
    </a>
  ) : (
    <p className="text-sm text-gray-500 italic">
      No resume uploaded yet. Please upload from Edit Profile.
    </p>
  )}
</div>

          {/* Social Links */}
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="text-blue-700 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-gray-800 hover:text-black dark:text-gray-300 dark:hover:text-white transition"
            >
              <Github size={24} />
            </a>
          </div>

          {/* Edit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/profile/edit")}
            className="mt-8 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:brightness-110 transition-all"
          >
            Edit Profile
          </motion.button>
        </motion.div>
      </div>
      </div>
    </>
  );
};

export default ProfileView;
