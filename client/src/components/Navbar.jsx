import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, User, LogOut, Users2 } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-white/80 dark:bg-blue-950/80 backdrop-blur-md shadow-lg border-b border-blue-200/50 dark:border-blue-900/50 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/dashboard/student"
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 text-transparent bg-clip-text"
        >
          Syncademy
        </Link>

        {/* Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link
            to="/dashboard/student/courses"
            className="flex items-center text-sm font-medium text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 transition"
          >
            <BookOpen className="w-4 h-4 mr-1" /> Courses
          </Link>
          <Link
            to="/dashboard/student/groups"
            className="flex items-center text-sm font-medium text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 transition"
          >
            <Users className="w-4 h-4 mr-1" /> Study Groups
          </Link>
          <Link
            to="/study-batch"
            className="flex items-center text-sm font-medium text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 transition"
          >
            <Users2 className="w-4 h-4 mr-1" /> My Batch
          </Link>
          <Link
            to="/profile/view"
            className="flex items-center text-sm font-medium text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 transition"
          >
            <User className="w-4 h-4 mr-1" /> Profile
          </Link>
          <Link
            to="/logout"
            className="flex items-center text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition"
          >
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
