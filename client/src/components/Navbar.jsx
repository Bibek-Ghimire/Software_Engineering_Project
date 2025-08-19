import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, User, LogOut } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-gray-200 dark:bg-gray-900 backdrop-blur-md shadow-md border-b border-gray-200 dark:border-gray-700 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/dashboard/student" className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          Syncademy
        </Link>

        {/* Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/dashboard/student/courses" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500 transition">
            <BookOpen className="w-4 h-4 mr-1" /> Courses
          </Link>
          <Link to="/dashboard/student/groups" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500 transition">
            <Users className="w-4 h-4 mr-1" /> Study Groups
          </Link>
          <Link to="/profile/view" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500 transition">
            <User className="w-4 h-4 mr-1" /> Profile
          </Link>
          <Link to="/logout" className="flex items-center text-sm font-medium text-red-500 hover:text-red-600 transition">
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
