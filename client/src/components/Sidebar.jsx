import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
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
    <div className="w-64 h-screen flex flex-col sticky top-0 surface-card rounded-none border-l-0 border-t-0 border-b-0 px-3 py-5">
      {/* Logo */}
      <button
        onClick={() => navigate("/dashboard/student")}
        className="flex items-center gap-2.5 px-2 py-2 mb-6 hover:opacity-80 transition-opacity"
      >
        <img src={Logo} alt="Syncademy" className="h-8 w-8 rounded-lg" />
        <span className="brand-title text-xl font-bold text-stone-900 dark:text-white">
          Syncademy
        </span>
      </button>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto">
        <p className="px-3 pt-1 pb-2 text-xs font-semibold body-copy uppercase tracking-wider">
          Main
        </p>
        <SidebarLink to="/dashboard/student" label="Dashboard" icon={<LayoutDashboard size={18} />} />
        <SidebarLink to="/courses" label="Courses" icon={<BookOpen size={18} />} />
        <SidebarLink to="/groups" label="Study Groups" icon={<Users size={18} />} />
        <SidebarLink to="/resources" label="Resources" icon={<GraduationCap size={18} />} />

        <p className="px-3 pt-4 pb-2 text-xs font-semibold body-copy uppercase tracking-wider">
          Community
        </p>
        <SidebarLink to="/leaderboard" label="Leaderboard" icon={<Award size={18} />} />
        <SidebarLink to="/student/chat" label="Chat" icon={<MessageSquare size={18} />} />
        <SidebarLink to="/discussions" label="Discussions" icon={<Hash size={18} />} />

        <p className="px-3 pt-4 pb-2 text-xs font-semibold body-copy uppercase tracking-wider">
          Account
        </p>
        <SidebarLink to="/payments" label="Payments" icon={<CreditCard size={18} />} />
        <SidebarLink to="/profile" label="Profile" icon={<UserCircle size={18} />} />
      </nav>

      {/* Logout */}
      <div className="border-t border-stone-200/70 dark:border-stone-700/70 pt-3 mt-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-stone-700 dark:text-stone-300 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all duration-150"
        >
          <LogOut size={18} />
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
      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
        isActive
          ? "bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-300 border border-orange-200 dark:border-orange-900/40"
          : "text-stone-700 dark:text-stone-300 hover:bg-white/70 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white"
      }`
    }
  >
    <span className="flex-shrink-0">{icon}</span>
    {label}
  </NavLink>
);

export default Sidebar;
