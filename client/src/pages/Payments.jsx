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
  Zap,
  Wallet,
  DollarSign,
  X,
  Sun,
  Moon,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useNotification } from "../hooks/useNotification";

const Payments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [lastEnrollmentPaymentId, setLastEnrollmentPaymentId] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [esewaPhoneEmail, setEsewaPhoneEmail] = useState("");
  const [khaltiPhoneEmail, setKhaltiPhoneEmail] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  const token = sessionStorage.getItem("token");
  const { notification } = useNotification();

  const PAYMENT_METHODS = [
    {
      id: "card_credit",
      name: "Credit Card",
      image: "/images/payment-methods/creditcard.jpg",
      description: "Pay securely with your credit card",
      color: "from-blue-500 to-blue-600",
      textColor: "text-orange-600",
    },
    {
      id: "card_debit",
      name: "Debit Card",
      image: "/images/payment-methods/debitcard.jpg",
      description: "Pay directly from your bank account",
      color: "from-purple-500 to-purple-600",
      textColor: "text-purple-600",
    },
    {
      id: "esewa",
      name: "eSewa",
      image: "/images/payment-methods/esewa.jpg",
      description: "Quick payment via eSewa digital wallet",
      color: "from-green-500 to-green-600",
      textColor: "text-green-600",
    },
    {
      id: "khalti",
      name: "Khalti",
      image: "/images/payment-methods/khalti.png",
      description: "Instant payment through Khalti wallet",
      color: "from-purple-600 to-purple-700",
      textColor: "text-purple-700",
    },
  ];

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/payments", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Payments:", response.data);
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

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Update last enrollment payment when notification comes in
  useEffect(() => {
    if (notification && notification.payment?.id) {
      setLastEnrollmentPaymentId(notification.payment.id);
      // Auto-highlight the payment for 10 seconds
      setTimeout(() => {
        setLastEnrollmentPaymentId(null);
      }, 10000);
      // Refresh payments to show the new enrollment payment
      setTimeout(() => {
        fetchPayments();
      }, 500);
    }
  }, [notification, fetchPayments]);

  const handleCompletePayment = async (paymentId) => {
    try {
      if (!selectedPaymentMethod) {
        toast.error("Please select a payment method");
        return;
      }

      setProcessingId(paymentId);

      // Validation based on payment method
      if (
        selectedPaymentMethod === "card_credit" ||
        selectedPaymentMethod === "card_debit"
      ) {
        if (
          !cardDetails.cardholderName ||
          !cardDetails.cardNumber ||
          !cardDetails.expiryDate ||
          !cardDetails.cvv
        ) {
          toast.error("Please fill in all card details");
          setProcessingId(null);
          return;
        }
        if (cardDetails.cardNumber.length !== 16) {
          toast.error("Card number must be 16 digits");
          setProcessingId(null);
          return;
        }
        if (cardDetails.cvv.length !== 3) {
          toast.error("CVV must be 3 digits");
          setProcessingId(null);
          return;
        }
      } else if (selectedPaymentMethod === "esewa") {
        if (!esewaPhoneEmail) {
          toast.error("Please enter your eSewa phone number or email");
          setProcessingId(null);
          return;
        }
      } else if (selectedPaymentMethod === "khalti") {
        if (!khaltiPhoneEmail) {
          toast.error("Please enter your Khalti phone number or email");
          setProcessingId(null);
          return;
        }
      }

      const paymentData = {
        paymentMethod: selectedPaymentMethod,
        transactionId: `TXN-${Date.now()}`,
      };

      if (
        selectedPaymentMethod === "card_credit" ||
        selectedPaymentMethod === "card_debit"
      ) {
        paymentData.cardDetails = {
          last4Digits: cardDetails.cardNumber.slice(-4),
          cardholderName: cardDetails.cardholderName,
        };
      } else if (selectedPaymentMethod === "esewa") {
        paymentData.esewaDetails = { phoneEmail: esewaPhoneEmail };
      } else if (selectedPaymentMethod === "khalti") {
        paymentData.khaltiDetails = { phoneEmail: khaltiPhoneEmail };
      }

      // Submit payment
      await axios.put(
        `http://localhost:5000/api/payments/${paymentId}/complete`,
        paymentData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Payment completed successfully! You are now enrolled.", {
        duration: 4000,
        position: "top-center",
      });

      // Reset form
      setCardDetails({
        cardholderName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
      });
      setEsewaPhoneEmail("");
      setKhaltiPhoneEmail("");
      setSelectedPaymentMethod(null);

      await fetchPayments();
      setShowPaymentModal(null);

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
      setShowPaymentModal(null);
      setSelectedPaymentMethod(null);
      setCardDetails({
        cardholderName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
      });
      setEsewaPhoneEmail("");
      setKhaltiPhoneEmail("");
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
    <div className="flex min-h-screen page-surface">
      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full z-30">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="ml-64 w-full relative">
        {/* Dark Mode Toggle */}
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
              Course Payments
            </h1>
            <p className="text-stone-500 dark:text-stone-500">
              Manage your course enrollment payments
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-stone-500 dark:text-stone-500">
                Loading payments...
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* New Enrollment Approval Banner */}
              {notification && notification.payment?.id && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border-l-4 border-green-500 shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-green-900 dark:text-green-100 mb-1">
                        Enrollment Approved!
                      </h3>
                      <p className="text-green-800 dark:text-green-200 mb-3">
                        Your enrollment request for{" "}
                        <span className="font-semibold">
                          {notification.course?.title}
                        </span>{" "}
                        has been approved. Complete the payment of{" "}
                        <span className="font-bold text-lg">
                          {notification.course?.price}
                        </span>{" "}
                        to finalize your enrollment.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setShowPaymentModal(lastEnrollmentPaymentId);
                            setSelectedPaymentMethod(null);
                          }}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
                        >
                          <CreditCard className="w-4 h-4" />
                          Pay Now
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Pending Payments Section */}
              {pendingPayments.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50 mb-4 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-yellow-500" />
                    Pending Payments
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pendingPayments.map((payment) => (
                      <motion.div
                        key={payment._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`bg-white dark:bg-stone-900 rounded-xl shadow-lg p-6 border-l-4 hover:shadow-xl transition-all ${
                          lastEnrollmentPaymentId === payment._id
                            ? "border-l-green-500 ring-2 ring-green-400 dark:ring-green-600 ring-offset-2 dark:ring-offset-gray-900"
                            : "border-l-yellow-500"
                        }`}
                      >
                        {lastEnrollmentPaymentId === payment._id && (
                          <div className="mb-3 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-semibold inline-block">
                            Just Approved 
                          </div>
                        )}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50">
                              {payment.course?.title || "Unknown Course"}
                            </h3>
                            <p className="text-sm text-stone-500 dark:text-stone-400">
                              Requested on{" "}
                              {new Date(payment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-semibold">
                            Pending
                          </span>
                        </div>

                        <div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-4 mb-4">
                          <p className="text-stone-600 dark:text-stone-400 text-sm mb-1">
                            Amount Due
                          </p>
                          <p className="text-3xl font-bold text-stone-900 dark:text-stone-50">
                            {payment.amount}
                          </p>
                        </div>

                        <div className="space-y-2">
                          {showPaymentModal === payment._id ? (
                            <div className="space-y-4 mb-4 p-4 bg-stone-100 dark:bg-orange-950/30 rounded-lg border border-stone-200 dark:border-blue-800">
                              {/* Payment Method Selection */}
                              {!selectedPaymentMethod ? (
                                <div>
                                  <h4 className="font-semibold text-stone-900 dark:text-stone-50 mb-3">
                                    Select Payment Method
                                  </h4>
                                  <div className="grid grid-cols-2 gap-3">
                                    {PAYMENT_METHODS.map((method) => (
                                      <motion.button
                                        key={method.id}
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => {
                                          setSelectedPaymentMethod(method.id);
                                        }}
                                        className={`p-3 rounded-lg border-2 transition-all text-center ${
                                          selectedPaymentMethod === method.id
                                            ? `border-${method.id.includes("card") ? "blue" : "green"}-500 bg-stone-100 dark:bg-orange-950/50`
                                            : "border-stone-300 dark:border-stone-700 hover:border-gray-400 dark:hover:border-gray-500"
                                        }`}
                                      >
                                        <div className="flex justify-center mb-2">
                                          <img
                                            src={method.image}
                                            alt={method.name}
                                            className="w-16 h-16 object-contain"
                                            onError={(e) => {
                                              e.target.src =
                                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Crect x='1' y='5' width='22' height='14' rx='2'%3E%3C/rect%3E%3Cpath d='M1 10h22'%3E%3C/path%3E%3C/svg%3E";
                                            }}
                                          />
                                        </div>
                                        <div className="text-xs font-semibold text-stone-900 dark:text-stone-50">
                                          {method.name}
                                        </div>
                                      </motion.button>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  {/* Credit/Debit Card Form */}
                                  {(selectedPaymentMethod === "card_credit" ||
                                    selectedPaymentMethod === "card_debit") && (
                                    <div className="space-y-3">
                                      <h4 className="font-semibold text-stone-900 dark:text-stone-50 flex items-center gap-2">
                                        <button
                                          onClick={() =>
                                            setSelectedPaymentMethod(null)
                                          }
                                          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                        >
                                          
                                        </button>
                                        {selectedPaymentMethod === "card_credit"
                                          ? "Credit Card Details"
                                          : "Debit Card Details"}
                                      </h4>
                                      <input
                                        type="text"
                                        placeholder="Cardholder Name"
                                        value={cardDetails.cardholderName}
                                        onChange={(e) =>
                                          setCardDetails({
                                            ...cardDetails,
                                            cardholderName: e.target.value,
                                          })
                                        }
                                        className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg dark:bg-stone-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                      />
                                      <input
                                        type="text"
                                        placeholder="Card Number (16 digits)"
                                        maxLength="16"
                                        value={cardDetails.cardNumber}
                                        onChange={(e) => {
                                          const val = e.target.value.replace(
                                            /\D/g,
                                            "",
                                          );
                                          setCardDetails({
                                            ...cardDetails,
                                            cardNumber: val,
                                          });
                                        }}
                                        className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg dark:bg-stone-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                      />
                                      <div className="grid grid-cols-2 gap-2">
                                        <input
                                          type="text"
                                          placeholder="MM/YY"
                                          maxLength="5"
                                          value={cardDetails.expiryDate}
                                          onChange={(e) => {
                                            let val = e.target.value
                                              .replace(/\D/g, "")
                                              .slice(0, 4);
                                            if (val.length >= 2) {
                                              val =
                                                val.slice(0, 2) +
                                                "/" +
                                                val.slice(2);
                                            }
                                            setCardDetails({
                                              ...cardDetails,
                                              expiryDate: val,
                                            });
                                          }}
                                          className="px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg dark:bg-stone-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                        />
                                        <input
                                          type="text"
                                          placeholder="CVV (3 digits)"
                                          maxLength="3"
                                          value={cardDetails.cvv}
                                          onChange={(e) => {
                                            const val = e.target.value.replace(
                                              /\D/g,
                                              "",
                                            );
                                            setCardDetails({
                                              ...cardDetails,
                                              cvv: val,
                                            });
                                          }}
                                          className="px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg dark:bg-stone-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {/* eSewa Form */}
                                  {selectedPaymentMethod === "esewa" && (
                                    <div className="space-y-3">
                                      <h4 className="font-semibold text-stone-900 dark:text-stone-50 flex items-center gap-2">
                                        <button
                                          onClick={() =>
                                            setSelectedPaymentMethod(null)
                                          }
                                          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                        >
                                          
                                        </button>
                                        eSewa Wallet Details
                                      </h4>
                                      <input
                                        type="text"
                                        placeholder="Phone Number or Email"
                                        value={esewaPhoneEmail}
                                        onChange={(e) =>
                                          setEsewaPhoneEmail(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg dark:bg-stone-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                      />
                                      <p className="text-xs text-stone-500 dark:text-stone-400">
                                        You'll be redirected to eSewa to
                                        complete the payment
                                      </p>
                                    </div>
                                  )}

                                  {/* Khalti Form */}
                                  {selectedPaymentMethod === "khalti" && (
                                    <div className="space-y-3">
                                      <h4 className="font-semibold text-stone-900 dark:text-stone-50 flex items-center gap-2">
                                        <button
                                          onClick={() =>
                                            setSelectedPaymentMethod(null)
                                          }
                                          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                        >
                                          
                                        </button>
                                        Khalti Wallet Details
                                      </h4>
                                      <input
                                        type="text"
                                        placeholder="Phone Number or Email"
                                        value={khaltiPhoneEmail}
                                        onChange={(e) =>
                                          setKhaltiPhoneEmail(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg dark:bg-stone-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                      />
                                      <p className="text-xs text-stone-500 dark:text-stone-400">
                                        You'll be redirected to Khalti to
                                        complete the payment
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : null}

                          <div className="flex gap-2">
                            {showPaymentModal === payment._id ? (
                              <>
                                <button
                                  onClick={() =>
                                    handleCompletePayment(payment._id)
                                  }
                                  disabled={
                                    processingId === payment._id ||
                                    !selectedPaymentMethod
                                  }
                                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <CreditCard className="w-4 h-4" />
                                  {processingId === payment._id
                                    ? "Processing..."
                                    : "Complete Payment"}
                                </button>
                                <button
                                  onClick={() => {
                                    handleFailPayment(payment._id);
                                  }}
                                  disabled={processingId === payment._id}
                                  className="flex-1 px-4 py-3 bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-gray-500 text-stone-900 dark:text-stone-50 rounded-lg font-semibold transition-all disabled:opacity-50"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => {
                                  setShowPaymentModal(payment._id);
                                  setSelectedPaymentMethod(null);
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-all"
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
                  <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    Completed Payments
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {completedPayments.map((payment) => (
                      <motion.div
                        key={payment._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="surface-card p-6 border-l-4 border-emerald-400"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50">
                              {payment.course?.title || "Unknown Course"}
                            </h3>
                            <p className="text-sm text-stone-500 dark:text-stone-400">
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

                        <div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-4 mb-4">
                          <p className="text-stone-600 dark:text-stone-400 text-sm mb-1">
                            Amount Paid
                          </p>
                          <p className="text-3xl font-bold text-stone-900 dark:text-stone-50">
                            {payment.amount}
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            navigate(`/course/${payment.course._id}`)
                          }
                          className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-all"
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
                  <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    Failed Payments
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {failedPayments.map((payment) => (
                      <motion.div
                        key={payment._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-stone-900 rounded-xl shadow-lg p-6 border-l-4 border-red-500"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50">
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

                        <div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-4 mb-4">
                          <p className="text-stone-600 dark:text-stone-400 text-sm mb-1">
                            Amount
                          </p>
                          <p className="text-3xl font-bold text-stone-900 dark:text-stone-50">
                            {payment.amount}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setShowPaymentModal(payment._id);
                            setSelectedPaymentMethod(null);
                          }}
                          className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-all"
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
                  <p className="text-stone-500 dark:text-stone-500 text-lg">
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


