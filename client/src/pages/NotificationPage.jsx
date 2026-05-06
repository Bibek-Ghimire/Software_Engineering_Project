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
    <div className="min-h-screen page-surface">
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="section-title text-4xl mb-2">
          Notifications
        </h1>
        {unreadCount > 0 && (
          <p className="text-sm body-copy mb-6">
            You have {unreadCount} unread notification
            {unreadCount !== 1 ? "s" : ""}
          </p>
        )}
        {allNotifications.length === 0 && (
          <div className="surface-card p-12 text-center">
            <p className="body-copy text-lg">
              No notifications yet.
            </p>
          </div>
        )}
        {allNotifications.length > 0 && (
          <>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="mb-6 primary-action rounded-xl px-6 py-3"
              >
                Mark all as read
              </button>
            )}
            <div className="space-y-3">
              {allNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-5 rounded-xl cursor-pointer transition-all duration-200 border ${
                    notification.isRead
                      ? "surface-panel"
                      : "surface-card-strong border-l-4 border-l-orange-500 hover:shadow-md"
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
                      <p className="text-sm body-copy">
                        {notification.message}
                      </p>
                      <p className="text-xs body-copy mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="ml-3 flex-shrink-0">
                        <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 text-xs font-bold border border-orange-200 dark:border-orange-900/40">
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

