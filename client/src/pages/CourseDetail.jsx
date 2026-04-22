import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  DollarSign,
  User,
  Star,
  BarChart3,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentRequestStatus, setEnrollmentRequestStatus] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const response = await fetch(
          `http://localhost:5000/api/courses/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch course: ${response.status}`);
        }

        const data = await response.json();
        setCourse(data);

        // ✅ STRICT AUTHENTICATION: Use server-verified enrollment status
        // This comes from the backend which verifies the user via JWT token
        // Each user gets their own enrollment status based on their authenticated identity
        if (data.isCurrentUserEnrolled !== undefined) {
          console.log(
            `Server verified enrollment status: ${data.isCurrentUserEnrolled}`,
          );
          setIsEnrolled(data.isCurrentUserEnrolled);
        } else {
          // Fallback for older API responses
          console.warn(" No server enrollment status - using fallback");
          setIsEnrolled(false);
        }

        // Check for pending enrollment request
        if (data.enrollmentRequestStatus !== undefined) {
          console.log(
            `Enrollment request status: ${data.enrollmentRequestStatus}`,
          );
          setEnrollmentRequestStatus(data.enrollmentRequestStatus);
        }

        // Check for pending/completed payment
        if (data.paymentStatus !== undefined) {
          console.log(`Payment status: ${data.paymentStatus}`);
          setPaymentStatus(data.paymentStatus);
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseDetail();
    }
  }, [id]);

  // Listen for enrollment approval event and refresh course data
  useEffect(() => {
    const handleEnrollmentApproved = async () => {
      console.log("✅ Enrollment approved - refreshing course data...");
      const token = sessionStorage.getItem("token");
      try {
        const response = await fetch(
          `http://localhost:5000/api/courses/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.ok) {
          const data = await response.json();
          setCourse(data);
          // Update enrollment status if approved
          if (
            data.enrollmentRequestStatus === null &&
            data.isCurrentUserEnrolled
          ) {
            setIsEnrolled(true);
            setEnrollmentRequestStatus(null);
            toast.success("Your enrollment has been approved! 🎉");
          }
        }
      } catch (err) {
        console.error("Error refreshing course data:", err);
      }
    };

    window.addEventListener("enrollmentApproved", handleEnrollmentApproved);
    return () => {
      window.removeEventListener(
        "enrollmentApproved",
        handleEnrollmentApproved,
      );
    };
  }, [id]);

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/courses/${id}/enroll`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setEnrollmentRequestStatus("pending");
        toast.success(
          "Enrollment request sent! Waiting for teacher approval.",
          {
            duration: 4000,
            position: "top-center",
          },
        );
      } else {
        toast.error(
          data.message ||
            "Failed to send enrollment request. Please try again.",
          {
            duration: 4000,
            position: "top-center",
          },
        );
      }
    } catch (err) {
      console.error("Error enrolling:", err);
      toast.error("Error sending enrollment request. Please try again.", {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setEnrolling(false);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Beginner":
        return "from-green-500 to-emerald-500";
      case "Intermediate":
        return "from-orange-500 to-amber-500";
      case "Expert":
        return "from-red-500 to-pink-500";
      default:
        return "from-blue-500 to-indigo-500";
    }
  };

  const getLevelBgColor = (level) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-orange-100 text-orange-800";
      case "Expert":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-gray-900 dark:to-gray-950">
        <div className="w-64 fixed top-0 left-0 h-full z-30">
          <Sidebar />
        </div>
        <div className="ml-64 w-full flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 border-4 border-blue-400 border-t-blue-600 rounded-full"
          />
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-gray-900 dark:to-gray-950">
        <div className="w-64 fixed top-0 left-0 h-full z-30">
          <Sidebar />
        </div>
        <div className="ml-64 w-full">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <motion.div
              className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-2xl p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-2">
                Course Not Found
              </h2>
              <p className="text-red-700 dark:text-red-300 mb-6">
                {error || "The course you're looking for doesn't exist."}
              </p>
              <button
                onClick={() => navigate("/courses")}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Back to Courses
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-gray-900 dark:to-gray-950">
      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full z-30">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="ml-64 w-full">
        {/* Back Button */}
        <div className="pt-8 px-6">
          <motion.button
            onClick={() => navigate("/courses")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors"
            whileHover={{ x: -4 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Courses
          </motion.button>
        </div>

        {/* Course Header */}
        <motion.div
          className="max-w-5xl mx-auto px-6 py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            {/* Header Background */}
            <div
              className={`h-64 bg-gradient-to-r ${getLevelColor(course.level)} opacity-90`}
            ></div>

            {/* Course Info Card */}
            <div className="px-8 py-8 -mt-32 relative z-10 bg-white dark:bg-gray-800 rounded-3xl mx-8 mb-8 shadow-xl">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`p-4 rounded-xl bg-gradient-to-r ${getLevelColor(course.level)}`}
                    >
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-3 leading-tight">
                        {course.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-bold ${getLevelBgColor(course.level)}`}
                        >
                          {course.level}
                        </span>
                        {course.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              {course.rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Price
                    </p>
                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 justify-end">
                      <DollarSign className="w-8 h-8" />
                      {course.price}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (paymentStatus === "pending") {
                        navigate("/payments");
                      } else {
                        handleEnroll();
                      }
                    }}
                    disabled={
                      isEnrolled ||
                      enrollmentRequestStatus === "pending" ||
                      enrolling
                    }
                    className={`px-8 py-3 rounded-xl font-bold text-white transition-all duration-300 flex items-center gap-2 ${
                      isEnrolled
                        ? "bg-green-400 cursor-not-allowed"
                        : enrollmentRequestStatus === "pending"
                          ? "bg-yellow-400 cursor-not-allowed"
                          : paymentStatus === "pending"
                            ? "bg-orange-500 hover:bg-orange-600"
                            : enrolling
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 cursor-wait"
                              : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
                    }`}
                  >
                    {isEnrolled ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Enrolled
                      </>
                    ) : enrollmentRequestStatus === "pending" ? (
                      <>
                        <AlertCircle className="w-5 h-5" />
                        Request Pending
                      </>
                    ) : paymentStatus === "pending" ? (
                      <>
                        <DollarSign className="w-5 h-5" />
                        Complete Payment
                      </>
                    ) : enrolling ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Sending Request...
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-5 h-5" />
                        Enroll Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Key Information Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-8 pb-8">
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/50 rounded-2xl p-6"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                    Duration
                  </p>
                </div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {course.duration}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-900/50 rounded-2xl p-6"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                    Enrolled
                  </p>
                </div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {course.enrollmentCount || 0}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-900/50 rounded-2xl p-6"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                    Level
                  </p>
                </div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {course.level}
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-900/50 rounded-2xl p-6"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                    Instructor
                  </p>
                </div>
                <p className="text-lg font-bold text-gray-800 dark:text-white truncate">
                  {course.teacher?.name || "Instructor"}
                </p>
              </motion.div>
            </div>

            {/* Description Section */}
            <div className="px-8 pb-8">
              <motion.div
                className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/30 dark:to-slate-900/50 rounded-2xl p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                  About This Course
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {course.description}
                </p>
              </motion.div>
            </div>

            {/* Instructor Info */}
            {course.teacher && (
              <div className="px-8 pb-8">
                <motion.div
                  className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-2xl p-8 border-2 border-indigo-200 dark:border-indigo-800"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    Your Instructor
                  </h2>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center flex-shrink-0">
                      <User className="w-12 h-12 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        {course.teacher.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {course.teacher.email}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {course.teacher.role === "teacher"
                          ? "Expert Instructor"
                          : "Educational Professional"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Keywords/Tags Section */}
            {course.keywords && course.keywords.length > 0 && (
              <div className="px-8 pb-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    Topics Covered
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {course.keywords.map((keyword, index) => (
                      <motion.span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 text-blue-800 dark:text-blue-200 rounded-full font-semibold text-sm"
                        whileHover={{ scale: 1.05 }}
                      >
                        #{keyword}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {/* Footer CTA */}
            <div className="px-8 py-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-t-2 border-blue-200 dark:border-blue-900">
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
                  {isEnrolled
                    ? "You're now part of this course! Happy learning! 🎉"
                    : "Ready to start learning? Enroll now and begin your journey!"}
                </p>
                {!isEnrolled && (
                  <button
                    onClick={handleEnroll}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105"
                  >
                    Enroll in This Course
                  </button>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Spacing */}
        <div className="h-16"></div>
      </div>
    </div>
  );
};

export default CourseDetail;
