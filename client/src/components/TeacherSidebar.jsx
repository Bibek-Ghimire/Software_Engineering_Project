// src/components/TeacherSidebar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  User,
  PlusCircle,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  FileText,
  Award,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";
import Logo from "../assets/images/Logo.png";

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
      className={`flex flex-col justify-between h-screen artisan-card border-r border-stone-200/70 dark:border-stone-700/70 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top: Logo & Collapse */}
      <div className="flex items-center justify-between px-4 py-6">
        {!collapsed && (
          <h1
            className="brand-title text-2xl font-bold cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2"
            onClick={() => navigate("/dashboard/teacher")}
          >
            <img
              src={Logo}
              alt="Syncademy"
              className="h-8 w-8 rounded-lg"
            />
            Syncademy
          </h1>
        )}
        <button
          className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-700 dark:text-stone-300"
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
      <nav className="flex-1 flex flex-col gap-1 px-2 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium ${
                isActive
                  ? "bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300 shadow-md"
                  : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-800 dark:hover:text-stone-200"
              }`
            }
          >
            <span className="mr-3">{link.icon}</span>
            {!collapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-stone-200/70 dark:border-stone-700/70 pt-4 px-2">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 dark:hover:text-rose-400 group"
        >
          <LogOut className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );
};

export default TeacherSidebar;
