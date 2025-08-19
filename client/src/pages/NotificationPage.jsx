import React, { useEffect, useState } from "react";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("syncademy_notifications") || "[]");
    setNotifications(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("syncademy_notifications", JSON.stringify(notifications));
  }, [notifications]);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Notifications</h1>
      {notifications.length === 0 && <p>No notifications yet.</p>}
      {notifications.length > 0 && (
        <>
          <button
            onClick={markAllRead}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Mark all as read
          </button>
          <ul>
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`p-3 mb-2 border rounded cursor-pointer ${
                  n.read ? "bg-gray-100" : "bg-white font-semibold"
                }`}
                onClick={() => markAsRead(n.id)}
              >
                {n.message}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default NotificationPage;
