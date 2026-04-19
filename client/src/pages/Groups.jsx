// src/pages/Groups.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import {
  Users,
  Sun,
  Moon,
  UserPlus,
  BookOpen,
  Crown,
  MessageCircle,
  Sparkles,
  PlusCircle,
  TrendingUp,
} from "lucide-react";

function Groups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

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
      await axios.post(`http://localhost:5000/api/groups/${groupId}/join`, {
        userName,
      });
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

  // Get member count styling
  const getMemberCountStyling = (count) => {
    if (count >= 20)
      return {
        bg: "from-purple-400 to-pink-500",
        text: "text-white",
        label: "Popular",
      };
    if (count >= 10)
      return {
        bg: "from-blue-400 to-indigo-500",
        text: "text-white",
        label: "Active",
      };
    if (count >= 5)
      return {
        bg: "from-green-400 to-emerald-500",
        text: "text-white",
        label: "Growing",
      };
    return {
      bg: "from-amber-400 to-orange-500",
      text: "text-white",
      label: "New",
    };
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-gray-900 dark:to-gray-950 transition-all duration-500">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 relative overflow-auto">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-8 right-8 p-4 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-blue-600 dark:text-blue-400 shadow-xl hover:shadow-2xl hover:scale-110 border-2 border-blue-200/50 dark:border-gray-600/50 transition-all duration-300 z-10 group"
        >
          {darkMode ? (
            <Sun className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
          ) : (
            <Moon className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
          )}
        </button>

        {/* Hero Header Section */}
        <div className="mb-12 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-6 mb-8">
            <div>
              <h1 className="text-6xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent leading-tight">
                Study Groups
              </h1>
              <p className="text-blue-600/80 dark:text-blue-300/80 text-xl mt-3 font-medium">
                Connect, collaborate, and learn together
              </p>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto lg:mx-0">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/40 dark:border-gray-600/40 shadow-lg group hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="font-bold text-blue-800 dark:text-blue-300 text-lg">
                  Collaborate
                </h3>
              </div>
              <p className="text-blue-600/70 dark:text-blue-400/70 text-sm">
                Share knowledge and learn from peers
              </p>
            </div>

            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/40 dark:border-gray-600/40 shadow-lg group hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="font-bold text-blue-800 dark:text-blue-300 text-lg">
                  Progress Together
                </h3>
              </div>
              <p className="text-blue-600/70 dark:text-blue-400/70 text-sm">
                Track progress and motivate each other
              </p>
            </div>

            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/40 dark:border-gray-600/40 shadow-lg group hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="font-bold text-blue-800 dark:text-blue-300 text-lg">
                  Expert Support
                </h3>
              </div>
              <p className="text-blue-600/70 dark:text-blue-400/70 text-sm">
                Get guidance from experienced mentors
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {groups.length > 0 && (
          <div className="mb-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-blue-200/50 dark:border-gray-600/50 p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2">
                Community Overview
              </h2>
              <p className="text-blue-600/70 dark:text-blue-400/70">
                Join our thriving learning community
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="relative mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl font-black text-white">
                      {groups.length}
                    </span>
                  </div>
                </div>
                <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                  Active Groups
                </div>
                <div className="text-blue-600/70 dark:text-blue-400/70 text-sm">
                  Ready to join
                </div>
              </div>

              <div className="text-center group">
                <div className="relative mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-2xl shadow-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl font-black text-white">
                      {groups.reduce(
                        (sum, group) => sum + (group.memberCount || 0),
                        0,
                      )}
                    </span>
                  </div>
                </div>
                <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                  Total Members
                </div>
                <div className="text-blue-600/70 dark:text-blue-400/70 text-sm">
                  Learning together
                </div>
              </div>

              <div className="text-center group">
                <div className="relative mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl shadow-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl font-black text-white">
                      {
                        new Set(
                          groups
                            .map((group) => group.courseDetail)
                            .filter(Boolean),
                        ).size
                      }
                    </span>
                  </div>
                </div>
                <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                  Study Topics
                </div>
                <div className="text-blue-600/70 dark:text-blue-400/70 text-sm">
                  Diverse subjects
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Groups Content */}
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-16 border border-blue-200/50 dark:border-gray-600/50 text-center max-w-2xl">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-200 dark:from-blue-900/50 dark:via-indigo-800/50 dark:to-purple-800/50 rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <Users className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                  <PlusCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-blue-800 dark:text-blue-300 mb-4">
                Start Your Study Journey!
              </h3>
              <p className="text-blue-600/70 dark:text-blue-400/70 text-lg leading-relaxed mb-6">
                No study groups available yet. Be the first to create one and
                build an amazing learning community!
              </p>
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                Create First Group
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {groups.map((group, index) => {
              const memberStyling = getMemberCountStyling(
                group.memberCount || 0,
              );
              return (
                <div
                  key={group._id}
                  className="group bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl border border-blue-200/50 dark:border-gray-600/50 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:border-blue-300/70 dark:hover:border-blue-500/50 flex flex-col"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Group Header */}
                  <div className="relative p-6 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-600/20 dark:via-indigo-600/20 dark:to-purple-600/20 border-b border-blue-200/30 dark:border-gray-600/30">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-200 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors leading-tight mb-3">
                          {group.name}
                        </h3>

                        {/* Status Badge */}
                        <div
                          className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${memberStyling.bg} rounded-full shadow-lg ${memberStyling.shadow}`}
                        >
                          <span className="text-lg">{memberStyling.icon}</span>
                          <span
                            className={`font-bold text-sm ${memberStyling.text}`}
                          >
                            {memberStyling.label} Group
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                        <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </div>

                  {/* Group Content */}
                  <div className="p-6 flex-grow flex flex-col">
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6 flex-grow">
                      {group.description}
                    </p>

                    {/* Group Details */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-4 p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-100/50 dark:border-blue-800/30">
                        <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-blue-800 dark:text-blue-300 text-sm block">
                            Members
                          </span>
                          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                            {group.memberCount || 0} active learners
                          </p>
                        </div>
                        <div className="text-2xl">{memberStyling.icon}</div>
                      </div>

                      {group.courseDetail && (
                        <div className="flex items-center gap-4 p-4 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100/50 dark:border-indigo-800/30">
                          <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div className="flex-1">
                            <span className="font-semibold text-blue-800 dark:text-blue-300 text-sm block">
                              Course Focus
                            </span>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {group.courseDetail}
                            </p>
                          </div>
                          <div className="text-xl"></div>
                        </div>
                      )}

                      {group.members && group.members.length > 0 && (
                        <div className="p-4 bg-purple-50/50 dark:bg-purple-900/20 rounded-xl border border-purple-100/50 dark:border-purple-800/30">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="font-semibold text-blue-800 dark:text-blue-300 text-sm">
                              Current Members
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {group.members.slice(0, 3).map((member, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-white/80 dark:bg-gray-700/80 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-purple-200/50 dark:border-purple-700/50"
                              >
                                {member}
                              </span>
                            ))}
                            {group.members.length > 3 && (
                              <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-full text-xs font-medium text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50">
                                +{group.members.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Join Button */}
                    <button
                      onClick={() => handleJoinGroup(group._id)}
                      disabled={loading}
                      className="group/btn relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          <span className="relative z-10">Joining...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5 relative z-10 group-hover/btn:rotate-12 transition-transform duration-300" />
                          <span className="relative z-10">
                            Join Study Group
                          </span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Card Footer Accent */}
                  <div
                    className={`h-2 bg-gradient-to-r ${memberStyling.bg}`}
                  ></div>
                </div>
              );
            })}
          </div>
        )}

        {/* Enhanced Decorative Elements */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          {/* Animated floating orbs */}
          <div className="absolute top-32 right-32 w-40 h-40 bg-gradient-to-r from-blue-200/20 to-indigo-300/20 dark:from-blue-800/10 dark:to-indigo-700/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-32 left-32 w-52 h-52 bg-gradient-to-r from-purple-200/20 to-pink-300/20 dark:from-purple-700/10 dark:to-pink-600/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-2/3 right-1/4 w-32 h-32 bg-gradient-to-r from-indigo-200/20 to-blue-300/20 dark:from-indigo-600/10 dark:to-blue-500/10 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/4 left-3/4 w-36 h-36 bg-gradient-to-r from-cyan-200/20 to-teal-300/20 dark:from-cyan-600/10 dark:to-teal-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "3s" }}
          ></div>

          {/* Floating particles */}
          <div
            className="absolute top-1/4 left-1/5 w-3 h-3 bg-blue-400/40 dark:bg-blue-300/30 rounded-full animate-bounce"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute top-3/4 right-1/5 w-2 h-2 bg-indigo-400/40 dark:bg-indigo-300/30 rounded-full animate-bounce"
            style={{ animationDelay: "1.5s" }}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/2 w-4 h-4 bg-purple-400/40 dark:bg-purple-300/30 rounded-full animate-bounce"
            style={{ animationDelay: "2.5s" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/6 w-2 h-2 bg-pink-400/40 dark:bg-pink-300/30 rounded-full animate-bounce"
            style={{ animationDelay: "3.5s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Groups;
