import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  BookOpen,
  Mail,
  Eye,
  Sun,
  Moon,
} from "lucide-react";
import TeacherSidebar from "../../components/TeacherSidebar";

const EnrollmentRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending"); // pending, approved, rejected, all
  const [processingId, setProcessingId] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  const token = sessionStorage.getItem("token");

  const fetchEnrollmentRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/enrollment-requests",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      console.log(" Enrollment Requests:", response.data);
      setRequests(response.data.requests || []);
    } catch (err) {
      console.error("Error fetching enrollment requests:", err);
      toast.error("Failed to fetch enrollment requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchEnrollmentRequests();
    }
  }, [token, fetchEnrollmentRequests]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleApprove = async (requestId) => {
    try {
      setProcessingId(requestId);
      await axios.put(
        `http://localhost:5000/api/enrollment-requests/${requestId}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Enrollment request approved!");
      await fetchEnrollmentRequests();
      // Dispatch event to update dashboard data
      window.dispatchEvent(
        new CustomEvent("enrollmentApproved", { detail: { requestId } }),
      );
    } catch (err) {
      console.error("Error approving request:", err);
      toast.error(err.response?.data?.message || "Failed to approve request");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId) => {
    const reason = window.prompt("Enter rejection reason (optional):");

    if (reason === null) return; // User cancelled

    try {
      setProcessingId(requestId);
      await axios.put(
        `http://localhost:5000/api/enrollment-requests/${requestId}/reject`,
        { reason: reason || undefined },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Enrollment request rejected!");
      await fetchEnrollmentRequests();
    } catch (err) {
      console.error("Error rejecting request:", err);
      toast.error(err.response?.data?.message || "Failed to reject request");
    } finally {
      setProcessingId(null);
    }
  };

  const getFilteredRequests = () => {
    if (filter === "all") return requests;
    return requests.filter((req) => req.status === filter);
  };

  const filteredRequests = getFilteredRequests();

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4" />
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
            <XCircle className="w-4 h-4" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen page-surface">
        <div className="w-64 fixed top-0 left-0 h-full z-30">
          <TeacherSidebar />
        </div>
        <div className="ml-64 w-full flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-stone-200 dark:border-stone-700 border-t-orange-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-stone-700 dark:text-stone-300 text-lg font-semibold">
              Loading enrollment requests...
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          className="absolute top-8 right-8 icon-action absolute top-8 right-8 z-10"
        >
          {darkMode ? (
            <Sun className="w-6 h-6" />
          ) : (
            <Moon className="w-6 h-6" />
          )}
        </button>
        <div className="p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-stone-900 dark:text-stone-50 mb-2">
              Enrollment Requests
            </h1>
            <p className="text-stone-500 dark:text-stone-500">
              Manage student enrollment requests for your courses
            </p>
          </motion.div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {["pending", "approved", "rejected", "all"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === f
                    ? "bg-orange-600 text-white shadow-sm"
                    : "surface-panel text-stone-700 dark:text-stone-300 hover:border-orange-400"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Requests List */}
          {filteredRequests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <BookOpen className="w-14 h-14 mx-auto text-stone-300 dark:text-stone-600 mb-4" />
              <p className="text-stone-500 dark:text-stone-500 text-lg">
                No {filter !== "all" ? filter : ""} enrollment requests
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request, index) => (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="surface-card p-6 border-l-4 border-orange-400"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50">
                            {request.student?.name || "Unknown Student"}
                          </h3>
                          <p className="text-sm text-stone-500 dark:text-stone-500 flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {request.student?.email || "No email"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300 mb-2">
                        <BookOpen className="w-4 h-4" />
                        <span className="font-semibold">
                          {request.course?.title || "Unknown Course"}
                        </span>
                      </div>

                      <p className="text-sm text-stone-500 dark:text-stone-400">
                        Requested on{" "}
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>

                      {request.rejectionReason && (
                        <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm text-red-700 dark:text-red-400">
                          <strong>Rejection Reason:</strong>{" "}
                          {request.rejectionReason}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(request.status)}

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log(
                            " View Profile clicked for student:",
                            request.student,
                          );
                          console.log(
                            " Navigating to /profile/" + request.student?._id,
                          );
                          navigate(`/profile/${request.student?._id}`, {
                            state: { studentData: request.student },
                          });
                        }}
                        className="secondary-action text-sm"
                        title="View student profile"
                      >
                        <Eye className="w-4 h-4" />
                        View Profile
                      </button>

                      {request.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(request._id)}
                            disabled={processingId === request._id}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(request._id)}
                            disabled={processingId === request._id}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrollmentRequests;


