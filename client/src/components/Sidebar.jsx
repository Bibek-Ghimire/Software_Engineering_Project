import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Hash,
  LogOut,
  Award,
  GraduationCap,
  UserCircle,
  CreditCard,
} from "lucide-react";
import Logo from "../assets/images/Logo.png";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="w-64 h-screen flex flex-col sticky top-0 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 px-4 py-6">
      {/* Logo */}
      <button
        onClick={() => navigate("/dashboard/student")}
        className="flex items-center gap-3 px-2 mb-8 group transition-all"
      >
        <div className="p-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40 group-hover:scale-110 transition-transform">
          <img
            src={Logo}
            alt="Syncademy"
            className="h-7 w-7 rounded-lg"
          />
        </div>
        <span className="brand-title text-xl font-bold text-stone-900 dark:text-stone-50">
          Syncademy
        </span>
      </button>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-none">
        <div className="px-3 mb-2">
          <p className="text-[10px] font-black body-copy uppercase tracking-[0.2em] opacity-60">
            Main
          </p>
        </div>
        <SidebarLink
          to="/dashboard/student"
          label="Dashboard"
          icon={<LayoutDashboard size={18} />}
        />
        <SidebarLink
          to="/courses"
          label="Courses"
          icon={<BookOpen size={18} />}
        />
        <SidebarLink
          to="/resources"
          label="Resources"
          icon={<GraduationCap size={18} />}
        />

        <div className="px-3 mt-6 mb-2">
          <p className="text-[10px] font-black body-copy uppercase tracking-[0.2em] opacity-60">
            Community
          </p>
        </div>
        <SidebarLink
          to="/leaderboard"
          label="Leaderboard"
          icon={<Award size={18} />}
        />
        <SidebarLink
          to="/student/chat"
          label="Chat"
          icon={<MessageSquare size={18} />}
        />
        <SidebarLink
          to="/discussions"
          label="Discussions"
          icon={<Hash size={18} />}
        />

        <div className="px-3 mt-6 mb-2">
          <p className="text-[10px] font-black body-copy uppercase tracking-[0.2em] opacity-60">
            Account
          </p>
        </div>
        <SidebarLink
          to="/payments"
          label="Payments"
          icon={<CreditCard size={18} />}
        />
        <SidebarLink
          to="/profile"
          label="Profile"
          icon={<UserCircle size={18} />}
        />
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-6 border-t border-stone-100 dark:border-stone-800/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 text-sm font-semibold text-stone-600 dark:text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all group"
        >
          <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/30 transition-colors">
            <LogOut size={18} />
          </div>
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
      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
        isActive
          ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20 active-nav-link"
          : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800"
      }`
    }
  >
    <div
      className={`p-2 rounded-lg transition-colors ${"group-[.active-nav-link]:bg-white/20 bg-stone-100 dark:bg-stone-800 group-hover:bg-white dark:group-hover:bg-stone-700 shadow-sm"}`}
    >
      {icon}
    </div>
    {label}
  </NavLink>
);

export default Sidebar;
