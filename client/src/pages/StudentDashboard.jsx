import React from "react";
import {
  BookOpen, Calendar, Bell, User, Settings, Sun, Moon,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar"; // optional if you use one?
import { Link } from "react-router-dom";
import student from "../assets/images/student.jpg"; // optional, if you want to use an image
// Place this at the top of your component
const user = JSON.parse(localStorage.getItem("user")) || { name: "Student" };


const courses = [
  {
    id: 1,
    title: "UI/UX Design",
    instructor: "Emily Smith",
    description: "Learn the principles of modern interface design using Figma and Adobe XD.",
  },
  {
    id: 2,
    title: "Web Development",
    instructor: "James Doe",
    description: "Master HTML, CSS, JavaScript, and React to build interactive web applications.",
  },
  {
    id: 3,
    title: "Mathematics",
    instructor: "Sophia Lee",
    description: "Strengthen your core mathematical concepts with real-world problem solving.",
  },
  {
    id: 4,
    title: "Machine Learning",
    instructor: "Alex Johnson",
    description: "Explore AI and ML fundamentals using Python and scikit-learn.",
  },
];

<>
  <Link
    to="/courses"
    className="text-sm text-blue-500 hover:underline mt-2 block"
  >
    View All Courses →
  </Link>

  <Link to="/groups" className="text-sm text-blue-500 hover:underline">
    Explore Study Groups →
  </Link>
</>




const StudentDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <div className="flex items-center gap-4">
            <Sun className="w-5 h-5 cursor-pointer hidden dark:block" />
            <Moon className="w-5 h-5 cursor-pointer block dark:hidden" />
            <Bell className="w-5 h-5" />
            <User className="w-6 h-6 rounded-full border p-1" />
          </div>
        </div>

        {/* Hero Section */}
<div className="relative w-full h-64 md:h-72 lg:h-80 rounded-2xl overflow-hidden shadow-lg mb-8">
  {/* Background image */}
  <img
    src={student}
    alt="Learning background"
    className="absolute inset-0 w-full h-fit object-cover"
  />

  {/* Dark overlay */}
  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

  {/* Content */}
  <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 lg:px-16 text-white">
    <h1 className="text-3xl sm:text-4xl font-bold mb-2">
      Welcome Back, <span className="text-yellow-300">{user.name}</span>!
    </h1>
    <p className="text-sm sm:text-base max-w-2xl leading-relaxed text-gray-200">
      Ready to explore new study groups, dive into fresh resources, and connect with peers to supercharge your learning journey? Let’s go! 🚀
    </p>
  </div>
</div>


        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Courses" value="12" />
          <StatCard title="Groups Joined" value="5" />
          <StatCard title="Completed" value="8" />
          <StatCard title="Badges Earned" value="3" />
        </div>

        {/* Main Widgets */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Popular Courses */}
          {/* Course Cards Section */}
<div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 col-span-2">
  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Available Courses</h3>
  
  <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
    {courses.map((course) => (
      <div
        key={course.id}
        className="bg-gray-100 dark:bg-gray-700 p-5 rounded-xl shadow hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
      >
        <div>
          <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-1">
            {course.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Instructor: <span className="font-medium">{course.instructor}</span>
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
            {course.description}
          </p>
        </div>
        <button
          onClick={() => alert(`Course "${course.title}" reserved!`)} // Replace with real logic
          className="mt-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all duration-200 text-sm font-medium"
        >
          Reserve Course
        </button>
      </div>
    ))}
  </div>
</div>


          {/* Progress Chart Placeholder */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Monthly Progress</h3>
            <div className="h-40 bg-gradient-to-br from-blue-200 to-blue-500 rounded-lg"></div>
          </div>
        </div>

        {/* Bottom Panels */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Course Completion */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Course Completion</h3>
            {["In Progress", "Completed", "Inactive", "Expired"].map((status, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>{status}</span>
                  <span>{Math.floor(Math.random() * 100)}%</span>
                </div>
                <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.floor(Math.random() * 100)}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Lessons */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Upcoming Lessons</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span>Informatic Course</span><span className="text-gray-400">19 July</span>
              </li>
              <li className="flex justify-between">
                <span>Live Drawing</span><span className="text-gray-400">22 July</span>
              </li>
              <li className="flex justify-between">
                <span>Modern Physics</span><span className="text-gray-400">25 July</span>
              </li>
            </ul>
          </div>

          {/* Notice Board */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Notice Board</h3>
            <ul className="text-sm space-y-2">
              <li><strong>New Teacher:</strong> Ms. Amanda joined Physics.</li>
              <li><strong>Updated Syllabus:</strong> Maths and Biology revised.</li>
              <li><strong>New Course:</strong> Join Machine Learning track!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable StatCard component
const StatCard = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">{value}</p>
    <p className="text-gray-600 dark:text-gray-300 mt-1">{title}</p>
  </div>
);

export default StudentDashboard;
