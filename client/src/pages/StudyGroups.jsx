import React, { useState } from "react";
import { PlusCircle, Users, Search, BookOpen } from "lucide-react";
import groupBanner from "../assets/images/group-banner.png";

const StudyGroups = () => {
  const [groups, setGroups] = useState([
    {
      name: "Web Dev Enthusiasts",
      description: "Learn React, Node, and more!",
    },
    {
      name: "AI & ML Learners",
      description: "Discuss machine learning algorithms and projects.",
    },
    {
      name: "DSA Warriors",
      description: "Daily DSA problems and mock interviews.",
    },
  ]);
  const [newGroup, setNewGroup] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateGroup = () => {
    if (newGroup && description) {
      setGroups([...groups, { name: newGroup, description }]);
      setNewGroup("");
      setDescription("");
    }
  };

  return (
    <div className="min-h-screen page-surface py-16 px-6 md:px-12">
      {/* Content Wrapper */}
      <div className="bg-white/80 dark:bg-orange-950/20 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-stone-200/50 dark:border-blue-800/30">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow">
            Discover & Join Study Groups
          </h1>
          <p className="text-gray-300 mt-3 text-lg">
            Collaborate, learn, and grow with like-minded peers across
            Syncademy.
          </p>
        </div>

        {/* Group Creation */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 shadow-md mb-12 max-w-2xl mx-auto">
          <h2 className="text-xl text-white font-semibold mb-4 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-green-400" /> Create a New Group
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Group Name"
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <textarea
              placeholder="Short description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-green-400"
            ></textarea>
            <button
              onClick={handleCreateGroup}
              className="w-full py-3 bg-gradient-to-r from-green-400 to-lime-500 rounded-lg text-white font-bold hover:from-green-500 hover:to-lime-600 transition"
            >
              Create Group
            </button>
          </div>
        </div>

        {/* Group List */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/10 shadow-md hover:scale-105 transition-transform"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={groupBanner}
                  alt="Group"
                  className="w-12 h-12 rounded-full border border-white shadow"
                />
                <div>
                  <h3 className="text-lg font-bold text-white">{group.name}</h3>
                  <p className="text-sm text-gray-300">{group.description}</p>
                </div>
              </div>
              <button className="mt-4 w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition">
                Join Group
              </button>
            </div>
          ))}
        </div>

        {/* Search Groups */}
        <div className="mt-12 max-w-lg mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 dark:text-stone-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search groups..."
              className="w-full py-3 pl-10 pr-4 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyGroups;


