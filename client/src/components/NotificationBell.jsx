import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { NotificationContext } from "../context/NotificationContext";

const NotificationBell = () => {
  const { getUnreadCount } = useContext(NotificationContext);
  const unreadCount = getUnreadCount();

  return (
    <Link
      to="/notifications"
      className="relative flex items-center text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition"
      title="Notifications"
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-3 inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 dark:bg-red-500 rounded-full min-w-6 h-6 flex items-center justify-center">
          +{unreadCount}
        </span>
      )}
    </Link>
  );
};

export default NotificationBell;
