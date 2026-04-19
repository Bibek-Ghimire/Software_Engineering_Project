import React, { useEffect, useState } from "react";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("syncademy_notifications") || "[]",
    );
    setNotifications(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "syncademy_notifications",
      JSON.stringify(notifications),
    );
  }, [notifications]);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-gray-900 dark:to-gray-950">
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-8">
          Notifications
        </h1>
        {notifications.length === 0 && (
          <div className="bg-white/90 dark:bg-blue-900/20 backdrop-blur-sm rounded-2xl p-12 text-center border border-blue-200/50 dark:border-blue-800/30">
            <p className="text-blue-600 dark:text-blue-300 text-lg">
              No notifications yet.
            </p>
          </div>
        )}
        {notifications.length > 0 && (
          <>
            <button
              onClick={markAllRead}
              className="mb-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              Mark all as read
            </button>
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-5 rounded-xl cursor-pointer transition-all duration-300 border ${
                    n.read
                      ? "bg-blue-50 dark:bg-blue-900/10 border-blue-200/50 dark:border-blue-800/20 text-gray-700 dark:text-gray-300"
                      : "bg-white dark:bg-blue-900/30 border-blue-300 dark:border-blue-700/50 text-blue-900 dark:text-blue-100 font-semibold shadow-md"
                  }`}
                  onClick={() => markAsRead(n.id)}
                >
                  {n.message}
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
