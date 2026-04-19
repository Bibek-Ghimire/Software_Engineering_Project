import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const CourseView = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchCourse = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourse(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching course");
    }
  }, [id, token]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  if (!course) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
        {course.title}
      </h1>
      <p className="text-gray-500 dark:text-gray-300 mb-2">
        <span className="font-semibold">Level:</span> {course.level}
      </p>
      <p className="text-gray-500 dark:text-gray-300 mb-2">
        <span className="font-semibold">Duration:</span> {course.duration}
      </p>
      <p className="text-gray-500 dark:text-gray-300 mb-2">
        <span className="font-semibold">Price:</span> ${course.price}
      </p>
      <p className="text-gray-600 dark:text-gray-200 mt-4">
        {course.description}
      </p>

      {user.role === "teacher" && course.teacher._id === user._id && (
        <div className="flex gap-3 mt-6">
          <Link
            to={`/courses/edit/${course._id}`}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
          >
            Edit Course
          </Link>
          <Link
            to="/courses"
            className="px-4 py-2 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition"
          >
            Back to Courses
          </Link>
        </div>
      )}
      {user.role === "student" && (
        <div className="mt-6">
          <Link
            to="/courses"
            className="px-4 py-2 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition"
          >
            Back to Courses
          </Link>
        </div>
      )}
    </div>
  );
};

export default CourseView;
