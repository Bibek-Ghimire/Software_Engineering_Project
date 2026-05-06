import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Users,
  BookOpen,
  Mail,
  MapPin,
  ChevronDown,
  ChevronUp,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Sun,
  Moon,
} from "lucide-react";
import TeacherSidebar from "../../components/TeacherSidebar";

const ApprovedStudentsGroups = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [studentsByPayment, setStudentsByPayment] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  const token = sessionStorage.getItem("token");

  const fetchCoursesAndStudents = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch all teacher courses
      const coursesResponse = await axios.get(
        "http://localhost:5000/api/teachers/courses",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const teacherCourses =
        coursesResponse.data.courses || coursesResponse.data || [];
      console.log(" Teacher courses:", teacherCourses);
      setCourses(teacherCourses);

      // Fetch students by payment status for each course
      const paymentData = {};

      for (const course of teacherCourses) {
        try {
          const paymentResponse = await axios.get(
            `http://localhost:5000/api/payments/teacher/course/${course._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          const { enrolled, pending, failed } = paymentResponse.data;

          // Group enrolled students into batches
          const groupedEnrolled = [];
          for (let i = 0; i < enrolled.length; i += 10) {
            groupedEnrolled.push({
              id: `${course._id}-enrolled-${Math.floor(i / 10) + 1}`,
              groupNumber: Math.floor(i / 10) + 1,
              courseName: course.title,
              courseId: course._id,
              status: "enrolled",
              students: enrolled.slice(i, i + 10),
              capacity: enrolled.slice(i, i + 10).length,
            });
          }

          // Group pending payment students
          const groupedPending = [];
          for (let i = 0; i < pending.length; i += 10) {
            groupedPending.push({
              id: `${course._id}-pending-${Math.floor(i / 10) + 1}`,
              groupNumber: Math.floor(i / 10) + 1,
              courseName: course.title,
              courseId: course._id,
              status: "pending",
              students: pending.slice(i, i + 10),
              capacity: pending.slice(i, i + 10).length,
            });
          }

          paymentData[course._id] = {
            courseName: course.title,
            enrolled: groupedEnrolled,
            pending: groupedPending,
            failed: failed,
          };
        } catch (err) {
          console.error(
            `Error fetching students for course ${course._id}:`,
            err,
          );
          paymentData[course._id] = {
            courseName: course.title,
            enrolled: [],
            pending: [],
            failed: [],
          };
        }
      }

      console.log(" Students by payment:", paymentData);
      setStudentsByPayment(paymentData);
    } catch (err) {
      console.error("Error fetching courses and students:", err);
      toast.error("Failed to fetch student data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchCoursesAndStudents();
    }
  }, [token, fetchCoursesAndStudents]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleGroupExpanded = (groupId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen page-surface">
        <div className="w-64 fixed top-0 left-0 h-full z-30">
          <TeacherSidebar />
        </div>
        <div className="ml-64 w-full flex items-center justify-center p-6">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            <p className="mt-4 text-gray-700 dark:text-gray-300 text-lg font-semibold">
              Loading student groups...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalCourses = courses.length;
  const totalEnrolledStudents = Object.values(studentsByPayment).reduce(
    (sum, courseData) =>
      sum +
      courseData.enrolled.reduce(
        (groupSum, group) => groupSum + group.students.length,
        0,
      ),
    0,
  );
  const totalPendingStudents = Object.values(studentsByPayment).reduce(
    (sum, courseData) =>
      sum +
      courseData.pending.reduce(
        (groupSum, group) => groupSum + group.students.length,
        0,
      ),
    0,
  );

  return (
    <div className="flex min-h-screen page-surface">
      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full z-30">
        <TeacherSidebar />
      </div>

      {/* Main Content */}
      <div className="ml-64 w-full relative">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-8 right-8 p-4 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-blue-600 dark:text-blue-400 shadow-xl hover:shadow-2xl hover:scale-110 border-2 border-blue-200/50 dark:border-gray-600/50 transition-all duration-300 z-10 group"
        >
          {darkMode ? (
            <Sun className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
          ) : (
            <Moon className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
          )}
        </button>
        <div className="p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              Manage Students
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View enrolled students and those awaiting payment. Groups are
              organized with a maximum capacity of 10 students per group.
            </p>
          </motion.div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">
                    Total Courses
                  </p>
                  <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {totalCourses}
                  </h3>
                </div>
                <BookOpen className="w-12 h-12 text-blue-200 dark:text-blue-900" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">
                    Enrolled Students
                  </p>
                  <h3 className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {totalEnrolledStudents}
                  </h3>
                </div>
                <CheckCircle className="w-12 h-12 text-green-200 dark:text-green-900" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-orange-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">
                    Pending Payment
                  </p>
                  <h3 className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {totalPendingStudents}
                  </h3>
                </div>
                <Clock className="w-12 h-12 text-orange-200 dark:text-orange-900" />
              </div>
            </motion.div>
          </div>

          {/* Courses and Groups */}
          {totalCourses === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <BookOpen className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No courses created yet
              </p>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {courses.map((course, courseIndex) => {
                const coursePaymentData = studentsByPayment[course._id];
                if (!coursePaymentData) return null;

                const { enrolled, pending, failed } = coursePaymentData;
                const totalEnrolledInCourse = enrolled.reduce(
                  (sum, group) => sum + group.students.length,
                  0,
                );
                const totalPendingInCourse = pending.reduce(
                  (sum, group) => sum + group.students.length,
                  0,
                );

                return (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: courseIndex * 0.1 }}
                  >
                    {/* Course Header */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                              {course.title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {totalEnrolledInCourse} enrolled {" "}
                              {totalPendingInCourse} pending payment
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enrolled Students Section */}
                    {enrolled.length > 0 && (
                      <div className="space-y-4 mb-8">
                        <h3 className="text-xl font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          Enrolled Students ({totalEnrolledInCourse})
                        </h3>
                        <div className="space-y-4 ml-0">
                          {enrolled.map((group, groupIndex) => (
                            <motion.div
                              key={group.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: groupIndex * 0.05 }}
                            >
                              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                {/* Group Header */}
                                <button
                                  onClick={() => toggleGroupExpanded(group.id)}
                                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                                >
                                  <div className="flex items-center gap-4 flex-1">
                                    <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg">
                                      <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="text-left">
                                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                                        Group {group.groupNumber}
                                      </h3>
                                      <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {group.capacity} / 10 students
                                      </p>
                                    </div>
                                  </div>

                                  {/* Capacity Bar */}
                                  <div className="hidden md:flex items-center gap-4 flex-1 justify-center">
                                    <div className="w-40 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all"
                                        style={{
                                          width: `${
                                            (group.capacity / 10) * 100
                                          }%`,
                                        }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 w-12 text-right">
                                      {Math.round((group.capacity / 10) * 100)}%
                                    </span>
                                  </div>

                                  <div className="flex-shrink-0">
                                    {expandedGroups[group.id] ? (
                                      <ChevronUp className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                                    ) : (
                                      <ChevronDown className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                                    )}
                                  </div>
                                </button>

                                {/* Group Content */}
                                {expandedGroups[group.id] && (
                                  <div className="border-t border-gray-200 dark:border-gray-700">
                                    <div className="p-6 space-y-3">
                                      {group.students.map((student, index) => (
                                        <motion.div
                                          key={student._id}
                                          initial={{ opacity: 0, x: -10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{
                                            delay: index * 0.05,
                                          }}
                                          className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-green-50 dark:from-gray-700/50 dark:to-green-900/20 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all"
                                        >
                                          <div className="flex items-center gap-4 flex-1">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold text-sm">
                                              {student.name?.[0]?.toUpperCase() ||
                                                "?"}
                                            </div>
                                            <div>
                                              <h4 className="font-semibold text-gray-800 dark:text-white">
                                                {student.name}
                                              </h4>
                                              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                                <Mail className="w-3 h-3" />
                                                {student.email}
                                              </p>
                                            </div>
                                          </div>

                                          {student.college && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                              <MapPin className="w-4 h-4" />
                                              <span className="hidden sm:inline">
                                                {student.college}
                                              </span>
                                            </div>
                                          )}

                                          <div className="flex items-center gap-2">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(
                                                  `/profile/${student?._id}`,
                                                  {
                                                    state: {
                                                      studentData: student,
                                                    },
                                                  },
                                                );
                                              }}
                                              className="flex items-center gap-2 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all text-sm"
                                              title="View student profile"
                                            >
                                              <Eye className="w-3 h-3" />
                                              Profile
                                            </button>
                                            <span className="ml-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                                              Enrolled
                                            </span>
                                          </div>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pending Payment Section */}
                    {pending.length > 0 && (
                      <div className="space-y-4 mb-8">
                        <h3 className="text-xl font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          Pending Payment ({totalPendingInCourse})
                        </h3>
                        <div className="space-y-4 ml-0">
                          {pending.map((group, groupIndex) => (
                            <motion.div
                              key={group.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: groupIndex * 0.05 }}
                            >
                              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                {/* Group Header */}
                                <button
                                  onClick={() => toggleGroupExpanded(group.id)}
                                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                                >
                                  <div className="flex items-center gap-4 flex-1">
                                    <div className="p-3 bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 rounded-lg">
                                      <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div className="text-left">
                                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                                        Group {group.groupNumber}
                                      </h3>
                                      <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {group.capacity} students awaiting
                                        payment
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex-shrink-0">
                                    {expandedGroups[group.id] ? (
                                      <ChevronUp className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                                    ) : (
                                      <ChevronDown className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                                    )}
                                  </div>
                                </button>

                                {/* Group Content */}
                                {expandedGroups[group.id] && (
                                  <div className="border-t border-gray-200 dark:border-gray-700">
                                    <div className="p-6 space-y-3">
                                      {group.students.map((student, index) => (
                                        <motion.div
                                          key={student._id}
                                          initial={{ opacity: 0, x: -10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{
                                            delay: index * 0.05,
                                          }}
                                          className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-orange-50 dark:from-gray-700/50 dark:to-orange-900/20 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all"
                                        >
                                          <div className="flex items-center gap-4 flex-1">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm">
                                              {student.name?.[0]?.toUpperCase() ||
                                                "?"}
                                            </div>
                                            <div>
                                              <h4 className="font-semibold text-gray-800 dark:text-white">
                                                {student.name}
                                              </h4>
                                              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                                <Mail className="w-3 h-3" />
                                                {student.email}
                                              </p>
                                            </div>
                                          </div>

                                          {student.college && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                              <MapPin className="w-4 h-4" />
                                              <span className="hidden sm:inline">
                                                {student.college}
                                              </span>
                                            </div>
                                          )}

                                          <div className="flex items-center gap-2">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(
                                                  `/profile/${student?._id}`,
                                                  {
                                                    state: {
                                                      studentData: student,
                                                    },
                                                  },
                                                );
                                              }}
                                              className="flex items-center gap-2 px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all text-sm"
                                              title="View student profile"
                                            >
                                              <Eye className="w-3 h-3" />
                                              Profile
                                            </button>
                                            <span className="ml-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-semibold rounded-full">
                                              Pending
                                            </span>
                                          </div>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovedStudentsGroups;


