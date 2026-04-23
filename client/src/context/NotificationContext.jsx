import { createContext, useState, useEffect, useCallback } from "react";
import io from "socket.io-client";
import axios from "axios";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [allNotifications, setAllNotifications] = useState([]);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const response = await axios.get(
          "http://localhost:5000/api/notifications",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        console.log("📬 Fetched notifications from API:", response.data);
        setAllNotifications(response.data);
      }
    } catch (error) {
      console.error("🔔 Error fetching notifications:", error);
    }
  }, []);

  useEffect(() => {
    // Get user ID from session storage
    const user = sessionStorage.getItem("user");
    const token = sessionStorage.getItem("token");

    if (user && token) {
      try {
        const userData = JSON.parse(user);
        const userId = userData._id || userData.id;

        if (!userId) {
          console.error("🔔 No userId found in user data:", userData);
          return;
        }

        console.log("🔔 Initializing notification socket for user:", userId);

        // Connect to notification socket with namespace
        const newSocket = io("http://localhost:5000/notifications", {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
          transports: ["websocket", "polling"],
        });

        newSocket.on("connect", () => {
          console.log(
            "🔔 Connected to notification socket:",
            newSocket.id,
            "- Joining room for user:",
            userId,
          );
          // Join user's personal notification room
          newSocket.emit("join_notifications", userId);
        });

        newSocket.on("connection_confirmed", (data) => {
          console.log("✅ Notification connection confirmed:", data);
        });

        newSocket.on("disconnect", () => {
          console.log("🔔 Disconnected from notification socket");
        });

        newSocket.on("connect_error", (error) => {
          console.error("🔔 Notification socket connection error:", error);
        });

        // Listen for enrollment approved notifications
        newSocket.on("enrollment_approved", (data) => {
          console.log("📬 Enrollment approved notification received:", data);
          setNotification(data);
          setIsPopupOpen(true);
          // Refresh notifications from API
          fetchNotifications();
        });

        newSocket.on("error", (error) => {
          console.error("🔔 Notification socket error:", error);
        });

        setSocket(newSocket);

        // Fetch initial notifications
        fetchNotifications();

        // Cleanup on unmount
        return () => {
          if (newSocket && userId) {
            console.log("🔔 Cleaning up socket for user:", userId);
            newSocket.emit("leave_notifications", userId);
            newSocket.disconnect();
          }
        };
      } catch (err) {
        console.error("🔔 Error in notification provider:", err);
      }
    }
  }, [fetchNotifications]);

  const closePopup = useCallback(() => {
    setIsPopupOpen(false);
    setTimeout(() => {
      setNotification(null);
    }, 300); // Wait for animation to complete
  }, []);

  const handleNotificationAction = useCallback(() => {
    // This will be called when user clicks the action button
    // The action URL is available in notification.actionUrl
  }, []);

  // Calculate unread notification count
  const getUnreadCount = useCallback(() => {
    return allNotifications.filter((notif) => !notif.isRead).length;
  }, [allNotifications]);

  // Mark a notification as read
  const markNotificationAsRead = useCallback(async (notificationId) => {
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        await axios.put(
          `http://localhost:5000/api/notifications/${notificationId}/read`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        console.log("✅ Notification marked as read:", notificationId);

        // Update local state
        setAllNotifications((prevNotifications) =>
          prevNotifications.map((notif) =>
            notif._id === notificationId ? { ...notif, isRead: true } : notif,
          ),
        );
      }
    } catch (error) {
      console.error("🔔 Error marking notification as read:", error);
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        socket,
        notification,
        isPopupOpen,
        closePopup,
        handleNotificationAction,
        allNotifications,
        fetchNotifications,
        getUnreadCount,
        markNotificationAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
