import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, User, LogOut, Users2 } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import Logo from "../assets/images/Logo.png";

const Navbar = () => {
  return (
    <nav className="surface-card fixed top-0 z-50 w-full border-b border-stone-200/70 dark:border-stone-700/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link
          to="/dashboard/student"
          className="brand-title text-2xl font-bold flex items-center gap-2"
        >
          <img
            src={Logo}
            alt="Syncademy"
            className="h-8 w-8 rounded-lg"
          />
          Syncademy
        </Link>

        {/* Links */}
        <div className="hidden items-center space-x-3 md:flex">
          <Link
            to="/dashboard/student/courses"
            className="nav-chip flex items-center rounded-full px-3 py-2 text-sm font-medium text-stone-700 dark:text-stone-300"
          >
            <BookOpen className="w-4 h-4 mr-1" /> Courses
          </Link>
          <Link
            to="/study-batch"
            className="nav-chip flex items-center rounded-full px-3 py-2 text-sm font-medium text-stone-700 dark:text-stone-300"
          >
            <Users2 className="w-4 h-4 mr-1" /> My Batch
          </Link>
          <Link
            to="/profile"
            className="nav-chip flex items-center rounded-full px-3 py-2 text-sm font-medium text-stone-700 dark:text-stone-300"
          >
            <User className="w-4 h-4 mr-1" /> Profile
          </Link>
          <Link
            to="/logout"
            className="nav-chip flex items-center rounded-full px-3 py-2 text-sm font-medium text-rose-600 dark:text-rose-400"
          >
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
