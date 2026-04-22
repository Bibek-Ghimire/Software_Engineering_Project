import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, CreditCard } from "lucide-react";

const NotificationPopup = ({
  isOpen,
  notification,
  onClose,
  onActionClick,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen && notification) {
      // Auto-close after 15 seconds if no action taken
      const timer = setTimeout(() => {
        handleClose();
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, notification]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleActionClick = () => {
    onActionClick?.();
    handleClose();
  };

  if (!isOpen || !notification) return null;

  return (
    <AnimatePresence>
      {isOpen && !isClosing && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, translateY: 100, translateX: 100 }}
            animate={{ opacity: 1, translateY: 0, translateX: 0 }}
            exit={{ opacity: 0, translateY: 100, translateX: 100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-md bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl shadow-2xl border border-green-200 dark:border-green-800/50 pointer-events-auto overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
                <h3 className="text-lg font-bold text-white">
                  {notification.title || "Enrollment Approved"}
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:bg-white/20 rounded-lg p-1 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {notification.message}
              </p>

              {/* Course Details */}
              {notification.course && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Course
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white mb-3">
                    {notification.course.title}
                  </p>
                  {notification.course.price && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Payment Amount:
                      </span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ₹{notification.course.price}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Time info */}
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                {new Date(notification.timestamp).toLocaleString()}
              </p>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition"
              >
                Dismiss
              </button>
              <button
                onClick={handleActionClick}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium transition flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Pay Now
              </button>
            </div>

            {/* Progress bar - auto close indicator */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 15, ease: "linear" }}
              className="h-1 bg-gradient-to-r from-green-500 to-blue-500 origin-left"
              style={{ transformOrigin: "left" }}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPopup;
