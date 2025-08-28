// src/pages/Groups.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Users, Sun, Moon } from "lucide-react";

function Groups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  // Fetch groups from backend
  const fetchGroups = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/groups");
      setGroups(res.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // Join group
  const handleJoinGroup = async (groupId) => {
    try {
      const userName = "Student Name"; // replace with actual logged-in user
      setLoading(true);
      await axios.post(`http://localhost:5000/api/groups/${groupId}/join`, { userName });
      fetchGroups(); // refresh UI
    } catch (error) {
      console.error("Error joining group:", error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 relative">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow hover:scale-110 transition"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Page Header */}
        <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-300 mb-8">
          👥 Study Groups
        </h1>

        {groups.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300 text-lg">
            No groups available. Create one to get started!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <div
                key={group._id}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:scale-[1.01] hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300">
                    {group.name}
                  </h3>
                  <Users className="text-blue-500 w-6 h-6" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                  {group.description}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  👥 Members: <span className="font-semibold">{group.memberCount}</span>
                </p>
                {group.members && group.members.length > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {group.members.join(", ")}
                  </p>
                )}
                {group.courseDetail && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    📘 Course: {group.courseDetail}
                  </p>
                )}

                <button
                  onClick={() => handleJoinGroup(group._id)}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Joining..." : "Join Group"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Groups;
