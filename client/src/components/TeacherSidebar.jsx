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
    { to: "/dashboard/teacher", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/teacher/profile", label: "Profile", icon: <User size={20} /> },
    { to: "/teacher/resources", label: "Resources", icon: <FileText size={20} /> },
    { to: "/teacher/leaderboard", label: "Leaderboard", icon: <Award size={20} /> },
    { to: "/teacher/course", label: "Add Course", icon: <PlusCircle size={20} /> },
    { to: "/teacher/chat", label: "Chat", icon: <MessageSquare size={20} /> },
    { to: "/teacher/enrollment-requests", label: "Enrollments", icon: <Users size={20} /> },
    { to: "/teacher/approved-students", label: "Students", icon: <Users size={20} /> },
  ];

  return (
    <div
      className={`flex flex-col h-screen bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top: Logo & Collapse */}
      <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} px-4 py-8`}>
        {!collapsed ? (
          <button
            onClick={() => navigate("/dashboard/teacher")}
            className="flex items-center gap-3 px-2 group transition-all"
          >
            <div className="p-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40 group-hover:scale-110 transition-transform">
              <img src={Logo} alt="Syncademy" className="h-7 w-7 rounded-lg" />
            </div>
            <span className="brand-title text-xl font-bold text-stone-900 dark:text-stone-50">
              Syncademy
            </span>
          </button>
        ) : (
          <div className="p-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40">
            <img src={Logo} alt="Syncademy" className="h-7 w-7 rounded-lg" />
          </div>
        )}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-auto mb-6 p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-500 hover:text-orange-600 transition-colors"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1.5 px-3 overflow-y-auto scrollbar-none">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            title={collapsed ? link.label : ""}
            className={({ isActive }) =>
              `flex items-center gap-3 ${collapsed ? "justify-center px-0" : "px-3"} py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                isActive
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20 active-nav-link"
                  : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800"
              }`
            }
          >
            <div className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
              "group-[.active-nav-link]:bg-white/20 bg-stone-100 dark:bg-stone-800 group-hover:bg-white dark:group-hover:bg-stone-700 shadow-sm"
            }`}>
              {link.icon}
            </div>
            {!collapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="mt-auto pt-6 pb-8 px-3 border-t border-stone-100 dark:border-stone-800/50">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 ${collapsed ? "justify-center px-0" : "px-3"} py-3 w-full text-sm font-semibold text-stone-600 dark:text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all group`}
        >
          <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/30 transition-colors flex-shrink-0">
            <LogOut size={20} />
          </div>
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );
};

export default TeacherSidebar;
