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
  PlusCircle,
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
        badge:
          "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-300 dark:border-rose-900/40",
        label: "Popular",
        bar: "bg-rose-400",
      };
    if (count >= 10)
      return {
        badge:
          "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-300 dark:border-orange-900/40",
        label: "Active",
        bar: "bg-orange-400",
      };
    if (count >= 5)
      return {
        badge:
          "bg-stone-100 text-stone-700 border-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-600",
        label: "Growing",
        bar: "bg-stone-400",
      };
    return {
      badge:
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/40",
      label: "New",
      bar: "bg-amber-400",
    };
  };

  return (
    <div className="flex min-h-screen page-surface transition-all duration-500">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="icon-action absolute top-8 right-8 z-10"
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Page Header */}
        <div className="mb-10">
          <span className="section-kicker" />
          <h1 className="section-title">Study Groups</h1>
          <p className="body-copy mt-2 text-base">
            Connect, collaborate, and learn together
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {[
            {
              title: "Collaborate",
              desc: "Share knowledge and learn from peers",
            },
            {
              title: "Progress Together",
              desc: "Track progress and motivate each other",
            },
            {
              title: "Expert Support",
              desc: "Get guidance from experienced mentors",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="surface-card p-5 hover:-translate-y-px transition-transform duration-200"
            >
              <h3 className="font-semibold text-stone-900 dark:text-stone-50 mb-1">
                {item.title}
              </h3>
              <p className="body-copy text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        {groups.length > 0 && (
          <div className="mb-10 surface-card-strong p-7">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50">
                Community Overview
              </h2>
              <p className="body-copy text-sm mt-1">
                Join our thriving learning community
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  label: "Active Groups",
                  sub: "Ready to join",
                  value: groups.length,
                },
                {
                  label: "Total Members",
                  sub: "Learning together",
                  value: groups.reduce(
                    (sum, group) => sum + (group.memberCount || 0),
                    0,
                  ),
                },
                {
                  label: "Study Topics",
                  sub: "Diverse subjects",
                  value: new Set(
                    groups.map((group) => group.courseDetail).filter(Boolean),
                  ).size,
                },
              ].map((stat) => (
                <div key={stat.label} className="surface-panel p-5">
                  <p className="text-3xl font-black text-stone-900 dark:text-stone-50">
                    {stat.value}
                  </p>
                  <p className="font-semibold text-stone-800 dark:text-stone-200 mt-1">
                    {stat.label}
                  </p>
                  <p className="body-copy text-xs mt-0.5">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Groups Content */}
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="surface-card-strong p-14 text-center max-w-md">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                <Users className="w-8 h-8 text-stone-500 dark:text-stone-400" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-50 mb-3">
                Start Your Study Journey
              </h3>
              <p className="body-copy text-sm leading-relaxed mb-6">
                No study groups available yet. Be the first to create one and
                build an amazing learning community!
              </p>
              <button className="primary-action px-6 py-3">
                <PlusCircle className="w-4 h-4" />
                Create First Group
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {groups.map((group, index) => {
              const memberStyling = getMemberCountStyling(
                group.memberCount || 0,
              );
              return (
                <div
                  key={group._id}
                  className="surface-card overflow-hidden transition-all duration-200 hover:shadow-md flex flex-col"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Top accent bar */}
                  <div className={`h-1 ${memberStyling.bar}`} />

                  {/* Card Header */}
                  <div className="p-6 border-b border-stone-100 dark:border-stone-800">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50 leading-snug mb-2">
                          {group.name}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${memberStyling.badge}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                          {memberStyling.label} Group
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                        <Users className="w-5 h-5 text-stone-500 dark:text-stone-400" />
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-grow flex flex-col">
                    <p className="body-copy text-sm leading-relaxed mb-5 flex-grow">
                      {group.description}
                    </p>

                    <div className="space-y-3 mb-5">
                      {/* Members row */}
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50">
                        <div className="p-1.5 rounded-lg bg-white dark:bg-stone-800 shadow-sm">
                          <Users className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                        </div>
                        <div>
                          <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm block">
                            Members
                          </span>
                          <p className="body-copy text-xs">
                            {group.memberCount || 0} active learners
                          </p>
                        </div>
                      </div>

                      {group.courseDetail && (
                        <div className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50">
                          <div className="p-1.5 rounded-lg bg-white dark:bg-stone-800 shadow-sm">
                            <BookOpen className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                          </div>
                          <div>
                            <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm block">
                              Course Focus
                            </span>
                            <p className="body-copy text-xs">
                              {group.courseDetail}
                            </p>
                          </div>
                        </div>
                      )}

                      {group.members && group.members.length > 0 && (
                        <div className="p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50">
                          <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm block mb-2">
                            Current Members
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {group.members.slice(0, 3).map((member, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 rounded-full text-xs font-medium text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800"
                              >
                                {member}
                              </span>
                            ))}
                            {group.members.length > 3 && (
                              <span className="px-2.5 py-1 rounded-full text-xs font-medium text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800">
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
                      className="primary-action w-full py-3 gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          <span>Joining...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          <span>Join Study Group</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Groups;
