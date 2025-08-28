import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Calendar, Bell, User, Sun, Moon,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import student from "../assets/images/student.jpg";

const user = JSON.parse(localStorage.getItem("user")) || { name: "Student" };

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [groupsCount, setGroupsCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [badgesCount, setBadgesCount] = useState(0);
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data);
        setCompletedCount(res.data.filter(c => c.completed).length);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchGroups = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/groups", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroupsCount(res.data.length);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchBadges = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/badges", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBadgesCount(res.data.length);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchTeachers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/teachers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeachers(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCourses();
    fetchGroups();
    fetchBadges();
    fetchTeachers();
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  };

  // Determine leaderboard tier based on hours taught and engagements
  const getTier = (teacher) => {
    if (teacher.hours >= 500 && teacher.engagements >= 2000) return "Platinum";
    if (teacher.hours >= 300 && teacher.engagements >= 1000) return "Diamond";
    if (teacher.hours >= 200 && teacher.engagements >= 500) return "Gold";
    if (teacher.hours >= 100 && teacher.engagements >= 200) return "Silver";
    return "Basic";
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <div className="flex items-center gap-4">
            <Sun
              className={`w-5 h-5 cursor-pointer ${darkMode ? "hidden" : "block"}`}
              onClick={toggleDarkMode}
            />
            <Moon
              className={`w-5 h-5 cursor-pointer ${darkMode ? "block" : "hidden"}`}
              onClick={toggleDarkMode}
            />
            <Bell className="w-5 h-5" />
            <User
              className="w-6 h-6 rounded-full border p-1 cursor-pointer"
              onClick={() => navigate("/profile")}
            />
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative w-full h-64 md:h-72 lg:h-80 rounded-2xl overflow-hidden shadow-lg mb-8">
          <img
            src={student}
            alt="Learning background"
            className="absolute inset-0 w-full h-fit object-cover"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
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
          <StatCard title="Courses" value={courses.length} />
          <StatCard title="Groups Joined" value={groupsCount} />
          <StatCard title="Completed" value={completedCount} />
          <StatCard title="Badges Earned" value={badgesCount} />
        </div>

        {/* Available Courses Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 col-span-2">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
              Available Courses
            </h3>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
              {courses.map((course) => (
                <div
                  key={course._id || course.id}
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
                    onClick={() => alert(`Course "${course.title}" reserved!`)}
                    className="mt-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all duration-200 text-sm font-medium"
                  >
                    Reserve Course
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Teachers Leaderboard */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mt-8">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            🏆 Teachers Leaderboard
          </h3>
          {teachers.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No teachers data available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {teachers.map((teacher, idx) => (
                <div
                  key={teacher._id || idx}
                  className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 shadow hover:shadow-lg transition"
                >
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    {idx + 1}. {teacher.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Hours Taught: {teacher.hours} | Engagements: {teacher.engagements}
                  </p>
                  <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                    teacher.hours >= 500 ? "bg-yellow-400 text-white" :
                    teacher.hours >= 300 ? "bg-blue-400 text-white" :
                    teacher.hours >= 200 ? "bg-green-400 text-white" :
                    teacher.hours >= 100 ? "bg-gray-400 text-white" :
                    "bg-gray-200 text-gray-800"
                  }`}>
                    {getTier(teacher)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">{value}</p>
    <p className="text-gray-600 dark:text-gray-300 mt-1">{title}</p>
  </div>
);

export default StudentDashboard;
