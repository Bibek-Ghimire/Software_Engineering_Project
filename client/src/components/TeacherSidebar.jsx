// src/components/TeacherSidebar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  User,
  PlusCircle,
  BookOpen,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  FileText,
  Award,
} from "lucide-react";

const TeacherSidebar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const links = [
    { to: "/teacher/profile", label: "Profile", icon: <User className="w-5 h-5" /> },
    { to: "/teacher/resources", label: "Resources", icon: <FileText className="w-5 h-5" /> },
    { to: "/teacher/leaderboard", label: "Leaderboard", icon: <Award className="w-5 h-5" /> },
    { to: "/teacher/creategroup", label: "Create Group", icon: <Users className="w-5 h-5" /> },
    { to: "/teacher/course", label: "Add Course", icon: <PlusCircle className="w-5 h-5" /> },
    { to: "/teacher/course-requests", label: "Course Requests", icon: <BookOpen className="w-5 h-5" /> },
  ];

  return (
    <div
      className={`flex flex-col justify-between h-screen bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top: Logo & Collapse */}
      <div className="flex items-center justify-between px-4 py-6">
        {!collapsed && <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Syncademy</h1>}
        <button
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2 px-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${
                isActive
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500 dark:text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`
            }
          >
            <span className="mr-3">{link.icon}</span>
            {!collapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t pt-4 px-2">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 rounded-lg transition-colors text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <LogOut className="mr-3 w-5 h-5" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );
};

export default TeacherSidebar;
