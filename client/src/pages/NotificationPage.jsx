import React, { useEffect, useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";

const NotificationPage = () => {
  const {
    allNotifications,
    fetchNotifications,
    markNotificationAsRead,
    getUnreadCount,
  } = useContext(NotificationContext);

  useEffect(() => {
    // Fetch notifications on component mount
    fetchNotifications();
  }, [fetchNotifications]);

  const markAllAsRead = async () => {
    // Mark all unread notifications as read
    for (const notification of allNotifications) {
      if (!notification.isRead) {
        await markNotificationAsRead(notification._id);
      }
    }
  };

  const handleNotificationClick = (notificationId, isRead) => {
    // Only mark as read if not already read
    if (!isRead) {
      markNotificationAsRead(notificationId);
    }
  };

  const unreadCount = getUnreadCount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-gray-900 dark:to-gray-950">
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">
          Notifications
        </h1>
        {unreadCount > 0 && (
          <p className="text-sm text-blue-600 dark:text-blue-400 mb-6">
            You have {unreadCount} unread notification
            {unreadCount !== 1 ? "s" : ""}
          </p>
        )}
        {allNotifications.length === 0 && (
          <div className="bg-white/90 dark:bg-blue-900/20 backdrop-blur-sm rounded-2xl p-12 text-center border border-blue-200/50 dark:border-blue-800/30">
            <p className="text-blue-600 dark:text-blue-300 text-lg">
              No notifications yet.
            </p>
          </div>
        )}
        {allNotifications.length > 0 && (
          <>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="mb-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
              >
                Mark all as read
              </button>
            )}
            <div className="space-y-3">
              {allNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-5 rounded-xl cursor-pointer transition-all duration-300 border ${
                    notification.isRead
                      ? "bg-blue-50 dark:bg-blue-900/10 border-blue-200/50 dark:border-blue-800/20 text-gray-700 dark:text-gray-300"
                      : "bg-white dark:bg-blue-900/30 border-blue-300 dark:border-blue-700/50 text-blue-900 dark:text-blue-100 font-semibold shadow-md hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-600"
                  }`}
                  onClick={() =>
                    handleNotificationClick(
                      notification._id,
                      notification.isRead,
                    )
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">
                        {notification.title}
                      </h3>
                      <p className="text-sm opacity-90">
                        {notification.message}
                      </p>
                      <p className="text-xs opacity-60 mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="ml-3 flex-shrink-0">
                        <span className="inline-block px-3 py-1 bg-red-500 dark:bg-red-600 text-white text-xs font-bold rounded-full">
                          New
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
