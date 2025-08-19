import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Users,
  MessageSquare,
  LogOut,
  GraduationCap,
} from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-white dark:bg-gray-800 shadow-xl px-4 py-6 flex flex-col justify-between sticky top-0">
      {/* Logo */}
      <div>
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-8 px-2">
          Syncademy
        </h1>

        {/* Navigation Links */}
        <nav className="space-y-2">
          <SidebarLink to="/dashboard/student" label="Dashboard" icon={<LayoutDashboard />} />
          <SidebarLink to="/courses" label="My Courses" icon={<BookOpen />} />
          <SidebarLink to="/groups" label="Study Groups" icon={<Users />} />
          <SidebarLink to="/discussions" label="Discussions" icon={<MessageSquare />} />
          <SidebarLink to="/resources" label="Resources" icon={<GraduationCap />} />
          <SidebarLink to="/profile" label="View Profile" icon={<Users className="w-5 h-5" />} />


        </nav>
      </div>

      {/* Logout */}
      <div className="border-t pt-4">
        <SidebarLink to="/logout" label="Logout" icon={<LogOut />} />
      </div>
    </div>
  );
};

const SidebarLink = ({ to, label, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
        isActive
          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500 dark:text-white"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`
    }
  >
    <span className="mr-3">{icon}</span>
    {label}
  </NavLink>
);

export default Sidebar;
