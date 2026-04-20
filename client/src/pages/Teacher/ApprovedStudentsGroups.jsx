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
} from "lucide-react";
import TeacherSidebar from "../../components/TeacherSidebar";

const ApprovedStudentsGroups = () => {
  const navigate = useNavigate();
  const [groupedStudents, setGroupedStudents] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState({});

  const token = sessionStorage.getItem("token");

  const fetchApprovedStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/enrollment-requests",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const approvedRequests = response.data.requests.filter(
        (req) => req.status === "approved",
      );

      console.log("📋 Approved requests:", approvedRequests);

      // Group students by course
      const grouped = {};
      approvedRequests.forEach((request) => {
        const courseTitle = request.course?.title || "Unknown Course";
        if (!grouped[courseTitle]) {
          grouped[courseTitle] = [];
        }
        grouped[courseTitle].push(request.student);
      });

      // Split each course into subgroups of max 10 students
      const groupedWithCapacity = {};
      Object.entries(grouped).forEach(([courseTitle, students]) => {
        const subgroups = [];
        for (let i = 0; i < students.length; i += 10) {
          subgroups.push({
            id: `${courseTitle}-group-${Math.floor(i / 10) + 1}`,
            groupNumber: Math.floor(i / 10) + 1,
            courseName: courseTitle,
            students: students.slice(i, i + 10),
            capacity: students.slice(i, i + 10).length,
          });
        }
        groupedWithCapacity[courseTitle] = subgroups;
      });

      console.log("👥 Grouped students:", groupedWithCapacity);
      setGroupedStudents(groupedWithCapacity);
    } catch (err) {
      console.error("Error fetching approved students:", err);
      toast.error("Failed to fetch approved students");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchApprovedStudents();
    }
  }, [token, fetchApprovedStudents]);

  const toggleGroupExpanded = (groupId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-gray-900 dark:to-gray-950">
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

  const totalCourses = Object.keys(groupedStudents).length;
  const totalGroups = Object.values(groupedStudents).reduce(
    (sum, groups) => sum + groups.length,
    0,
  );
  const totalStudents = Object.values(groupedStudents).reduce(
    (sum, groups) =>
      sum +
      groups.reduce((groupSum, group) => groupSum + group.students.length, 0),
    0,
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-gray-900 dark:to-gray-950">
      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full z-30">
        <TeacherSidebar />
      </div>

      {/* Main Content */}
      <div className="ml-64 w-full">
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
              View and manage approved students organized by course with a
              maximum capacity of 10 students per group
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
                    Total Groups
                  </p>
                  <h3 className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {totalGroups}
                  </h3>
                </div>
                <Users className="w-12 h-12 text-green-200 dark:text-green-900" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">
                    Total Students
                  </p>
                  <h3 className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {totalStudents}
                  </h3>
                </div>
                <Users className="w-12 h-12 text-purple-200 dark:text-purple-900" />
              </div>
            </motion.div>
          </div>

          {/* Courses and Groups */}
          {totalStudents === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <BookOpen className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No approved students yet
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedStudents).map(
                ([courseTitle, groups], courseIndex) => (
                  <motion.div
                    key={courseTitle}
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
                              {courseTitle}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {groups.length} group
                              {groups.length !== 1 ? "s" : ""} •{" "}
                              {groups.reduce(
                                (sum, g) => sum + g.students.length,
                                0,
                              )}{" "}
                              students
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Groups */}
                    <div className="space-y-4 ml-0">
                      {groups.map((group, groupIndex) => (
                        <motion.div
                          key={group.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay:
                              (courseIndex * groups.length + groupIndex) * 0.05,
                          }}
                        >
                          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                            {/* Group Header */}
                            <button
                              onClick={() => toggleGroupExpanded(group.id)}
                              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                            >
                              <div className="flex items-center gap-4 flex-1">
                                <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg">
                                  <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
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
                                      width: `${(group.capacity / 10) * 100}%`,
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
                                      transition={{ delay: index * 0.05 }}
                                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700/50 dark:to-blue-900/20 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all"
                                    >
                                      <div className="flex items-center gap-4 flex-1">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
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
                                            console.log(
                                              "👤 View Profile clicked for student:",
                                              student,
                                            );
                                            console.log(
                                              "📍 Navigating to /profile/" +
                                                student?._id,
                                            );
                                            navigate(
                                              `/profile/${student?._id}`,
                                              {
                                                state: { studentData: student },
                                              },
                                            );
                                          }}
                                          className="flex items-center gap-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all text-sm"
                                          title="View student profile"
                                        >
                                          <Eye className="w-3 h-3" />
                                          Profile
                                        </button>
                                        <span className="ml-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                                          Approved
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
                  </motion.div>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovedStudentsGroups;
