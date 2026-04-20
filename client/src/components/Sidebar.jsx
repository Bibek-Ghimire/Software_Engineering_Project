import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  MessageSquare,
  LogOut,
  Award,
  GraduationCap,
  UserCircle,
  PlusCircle,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Sidebar = () => {
  const navigate = useNavigate(); // added navigate

  const handleLogout = () => {
    // Clear auth info
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    // Redirect to homepage
    navigate("/");
  };

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-gray-900 shadow-lg px-4 py-6 flex flex-col justify-between sticky top-0 border-r border-blue-200/60 dark:border-blue-900/40">
      {/* Logo */}
      <div>
        <h1
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-8 px-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate("/dashboard/student")}
        >
          Syncademy
        </h1>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <SidebarLink
            to="/dashboard/student"
            label="Dashboard"
            icon={<LayoutDashboard />}
          />
          <SidebarLink
            to="/courses"
            label="Courses"
            icon={<BookOpen />}
          />
          <SidebarLink
            to="/groups"
            label="Study Groups"
            icon={<Users />}
          />
          <SidebarLink
            to="/resources"
            label="Resources"
            icon={<GraduationCap />}
          />
          <SidebarLink
            to="/leaderboard"
            label="Leaderboard"
            icon={<Award />}
          />
          <SidebarLink
            to="/student/chat"
            label="Chat"
            icon={<MessageSquare />}
          />
          <SidebarLink
            to="/discussions"
            label="Discussions"
            icon={<MessageSquare />}
          />
          <SidebarLink
            to="/profile"
            label="Profile"
            icon={<UserCircle />}
          />
        </nav>
      </div>

      {/* Logout & Theme Toggle */}
      <div className="border-t border-blue-200/60 dark:border-blue-900/40 pt-4 space-y-2">
        <ThemeToggle />
        <button
          onClick={handleLogout}
          className="flex items-center px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 w-full text-left group"
        >
          <LogOut className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform" />{" "}
          Logout
        </button>
      </div>
    </div>
  );
};

const SidebarLink = ({ to, label, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-3 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium ${
        isActive
          ? "bg-blue-200 text-blue-800 dark:bg-blue-700/60 dark:text-blue-100 shadow-md"
          : "text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-800 dark:hover:text-blue-200"
      }`
    }
  >
    <span className="mr-3">{icon}</span>
    {label}
  </NavLink>
);

export default Sidebar;
