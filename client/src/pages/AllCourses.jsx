// src/pages/AllCourses.jsx

import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, CalendarCheck } from "lucide-react";

const courseData = [
  {
    title: "UI/UX Design",
    description: "Master modern user interface and experience design.",
    duration: "6 weeks",
    level: "Beginner",
    id: "uiux",
  },
  {
    title: "Web Development",
    description: "Learn HTML, CSS, JavaScript and backend skills.",
    duration: "8 weeks",
    level: "Intermediate",
    id: "webdev",
  },
  {
    title: "Mathematics",
    description: "Core mathematics concepts for college learners.",
    duration: "10 weeks",
    level: "All levels",
    id: "math",
  },
  {
    title: "Machine Learning",
    description: "Fundamentals of machine learning and real-world applications.",
    duration: "12 weeks",
    level: "Advanced",
    id: "ml",
  },
];

const AllCourses = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-blue-700 dark:text-white mb-6">
        All Available Courses
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courseData.map((course) => (
          <div
            key={course.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold text-blue-600 dark:text-white">
                {course.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 my-2">{course.description}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Duration: {course.duration}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Level: {course.level}
              </p>
            </div>
            <div className="mt-4 flex justify-between">
              <Link
                to={`/course/${course.id}`}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-1 transition"
              >
                <BookOpen className="w-4 h-4" /> View Course
              </Link>
              <button
                onClick={() => alert(`Booked: ${course.title}`)}
                className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-1 transition"
              >
                <CalendarCheck className="w-4 h-4" /> Book
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCourses;
