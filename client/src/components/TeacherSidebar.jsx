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
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";

const TeacherSidebar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const links = [
    {
      to: "/dashboard/teacher",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      to: "/teacher/profile",
      label: "Profile",
      icon: <User className="w-5 h-5" />,
    },
    {
      to: "/teacher/resources",
      label: "Resources",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      to: "/teacher/leaderboard",
      label: "Leaderboard",
      icon: <Award className="w-5 h-5" />,
    },
    {
      to: "/teacher/course",
      label: "Add Course",
      icon: <PlusCircle className="w-5 h-5" />,
    },
    {
      to: "/teacher/chat",
      label: "Chat",
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      to: "/teacher/enrollment-requests",
      label: "Enrollment Requests",
      icon: <Users className="w-5 h-5" />,
    },
    {
      to: "/teacher/approved-students",
      label: "Manage Students",
      icon: <Users className="w-5 h-5" />,
    },
  ];

  return (
    <div
      className={`flex flex-col justify-between h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-gray-900 shadow-lg border-r border-blue-200/60 dark:border-blue-900/40 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top: Logo & Collapse */}
      <div className="flex items-center justify-between px-4 py-6">
        {!collapsed && (
          <h1
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/dashboard/teacher")}
          >
            Syncademy
          </h1>
        )}
        <button
          className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition text-blue-700 dark:text-blue-300"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium ${
                isActive
                  ? "bg-blue-200 text-blue-800 dark:bg-blue-700/60 dark:text-blue-100 shadow-md"
                  : "text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-800 dark:hover:text-blue-200"
              }`
            }
          >
            <span className="mr-3">{link.icon}</span>
            {!collapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-blue-200/60 dark:border-blue-900/40 pt-4 px-2">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-800 dark:hover:text-blue-200 group"
        >
          <LogOut className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );
};

export default TeacherSidebar;
