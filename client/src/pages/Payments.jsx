import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const Payments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(null);

  const token = sessionStorage.getItem("token");

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/payments", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📋 Payments:", response.data);
      setPayments(response.data.payments || []);
    } catch (err) {
      console.error("Error fetching payments:", err);
      toast.error("Failed to fetch payments");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchPayments();
    }
  }, [token, fetchPayments]);

  const handleCompletePayment = async (paymentId) => {
    try {
      setProcessingId(paymentId);

      // For demo purposes, we'll just submit to the backend
      // In a real application, this would integrate with a payment gateway like Stripe
      await axios.put(
        `http://localhost:5000/api/payments/${paymentId}/complete`,
        {
          paymentMethod: "credit_card",
          transactionId: `TXN-${Date.now()}`,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Payment completed successfully! You are now enrolled.", {
        duration: 4000,
        position: "top-center",
      });

      await fetchPayments();
      setShowPaymentForm(null);

      // Dispatch event to update dashboard
      window.dispatchEvent(
        new CustomEvent("paymentCompleted", { detail: { paymentId } }),
      );
    } catch (err) {
      console.error("Error completing payment:", err);
      toast.error(err.response?.data?.message || "Failed to complete payment");
    } finally {
      setProcessingId(null);
    }
  };

  const handleFailPayment = async (paymentId) => {
    try {
      setProcessingId(paymentId);
      await axios.put(
        `http://localhost:5000/api/payments/${paymentId}/fail`,
        {
          failureReason: "User cancelled payment",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.error("Payment cancelled");
      await fetchPayments();
      setShowPaymentForm(null);
    } catch (err) {
      console.error("Error cancelling payment:", err);
      toast.error("Failed to cancel payment");
    } finally {
      setProcessingId(null);
    }
  };

  const getFilteredPayments = (status) => {
    return payments.filter((payment) => payment.status === status);
  };

  const pendingPayments = getFilteredPayments("pending");
  const completedPayments = getFilteredPayments("completed");
  const failedPayments = getFilteredPayments("failed");

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-gray-900 dark:to-gray-950">
      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full z-30">
        <Sidebar />
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
              Course Payments
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your course enrollment payments
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading payments...
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Pending Payments Section */}
              {pendingPayments.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-yellow-500" />
                    Pending Payments
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pendingPayments.map((payment) => (
                      <motion.div
                        key={payment._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-all"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                              {payment.course?.title || "Unknown Course"}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Requested on{" "}
                              {new Date(payment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-semibold">
                            Pending
                          </span>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                            Amount Due
                          </p>
                          <p className="text-3xl font-bold text-gray-800 dark:text-white">
                            ₹{payment.amount}
                          </p>
                        </div>

                        <div className="space-y-2">
                          {showPaymentForm === payment._id ? (
                            <div className="space-y-3 mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                              <input
                                type="text"
                                placeholder="Cardholder Name"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <input
                                type="text"
                                placeholder="Card Number"
                                maxLength="16"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  placeholder="MM/YY"
                                  maxLength="5"
                                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                  type="text"
                                  placeholder="CVV"
                                  maxLength="3"
                                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                          ) : null}

                          <div className="flex gap-2">
                            {showPaymentForm === payment._id ? (
                              <>
                                <button
                                  onClick={() =>
                                    handleCompletePayment(payment._id)
                                  }
                                  disabled={processingId === payment._id}
                                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
                                >
                                  <CreditCard className="w-4 h-4" />
                                  Pay Now
                                </button>
                                <button
                                  onClick={() => handleFailPayment(payment._id)}
                                  disabled={processingId === payment._id}
                                  className="flex-1 px-4 py-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-lg font-semibold transition-all"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => setShowPaymentForm(payment._id)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                              >
                                <CreditCard className="w-4 h-4" />
                                Proceed to Payment
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Payments Section */}
              {completedPayments.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    Completed Payments
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {completedPayments.map((payment) => (
                      <motion.div
                        key={payment._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                              {payment.course?.title || "Unknown Course"}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Paid on{" "}
                              {new Date(
                                payment.paymentDate,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-semibold">
                            Completed
                          </span>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                            Amount Paid
                          </p>
                          <p className="text-3xl font-bold text-gray-800 dark:text-white">
                            ₹{payment.amount}
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            navigate(`/course/${payment.course._id}`)
                          }
                          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                        >
                          Go to Course
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Failed Payments Section */}
              {failedPayments.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    Failed Payments
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {failedPayments.map((payment) => (
                      <motion.div
                        key={payment._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-red-500"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                              {payment.course?.title || "Unknown Course"}
                            </h3>
                            <p className="text-sm text-red-600 dark:text-red-400">
                              {payment.failureReason}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-semibold">
                            Failed
                          </span>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                            Amount
                          </p>
                          <p className="text-3xl font-bold text-gray-800 dark:text-white">
                            ₹{payment.amount}
                          </p>
                        </div>

                        <button
                          onClick={() => setShowPaymentForm(payment._id)}
                          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                        >
                          Retry Payment
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {payments.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <CreditCard className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    No payments found. When your enrollment is approved, payment
                    details will appear here.
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;
