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
            className="surface-card-strong w-full max-w-md overflow-hidden pointer-events-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-stone-500 to-stone-600 px-6 py-4 flex items-center justify-between">
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
              <p className="body-copy mb-4">{notification.message}</p>

              {/* Course Details */}
              {notification.course && (
                <div className="surface-panel mb-4 p-4">
                  <p className="text-sm text-stone-500 dark:text-stone-400 mb-1">
                    Course
                  </p>
                  <p className="font-semibold text-stone-900 dark:text-white mb-3">
                    {notification.course.title}
                  </p>
                  {notification.course.price && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-stone-500 dark:text-stone-400">
                        Payment Amount:
                      </span>
                      <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {notification.course.price}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Time info */}
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
                {new Date(notification.timestamp).toLocaleString()}
              </p>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-stone-50/80 dark:bg-stone-950/40 flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 rounded-full border border-stone-200 bg-white/80 px-4 py-2 font-medium text-stone-700 transition hover:bg-white dark:border-stone-700 dark:bg-stone-900/60 dark:text-stone-300 dark:hover:bg-stone-800"
              >
                Dismiss
              </button>
              <button
                onClick={handleActionClick}
                className="flex-1 rounded-full bg-stone-900 dark:bg-stone-100 px-4 py-2 font-medium text-white dark:text-stone-900 transition flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-white"
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
              className="h-1 bg-orange-500 origin-left"
              style={{ transformOrigin: "left" }}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPopup;
