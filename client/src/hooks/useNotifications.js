"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { isStaff } from "@/lib/roles";

export function useNotifications() {
  const { user, isAuthenticated } = useAuth();
  const {
    onNotificationNew,
    onNotificationRead,
    onNotificationAllRead,
    onReconnect,
  } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    if (!user?._id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getNotifications(user._id);
      setNotifications(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    if (isAuthenticated && isStaff(user) && user?._id) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated, user, fetchNotifications]);

  useEffect(() => {
    if (!isAuthenticated || !isStaff(user)) return;

    const unsubNew = onNotificationNew((notification) => {
      if (String(notification.userId) !== String(user?._id)) return;
      setNotifications((prev) => {
        if (prev.some((n) => n._id === notification._id)) return prev;
        return [notification, ...prev];
      });
    });

    const unsubRead = onNotificationRead((notification) => {
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notification._id ? { ...n, read: true } : n
        )
      );
    });

    const unsubAll = onNotificationAllRead((payload) => {
      if (String(payload.userId) !== String(user?._id)) return;
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    });

    return () => {
      unsubNew();
      unsubRead();
      unsubAll();
    };
  }, [
    isAuthenticated,
    user?._id,
    onNotificationNew,
    onNotificationRead,
    onNotificationAllRead,
  ]);

  useEffect(() => {
    if (!isAuthenticated || !isStaff(user)) return;
    return onReconnect(() => fetchNotifications());
  }, [isAuthenticated, user, onReconnect, fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = useCallback(async (notificationId) => {
    const res = await markNotificationRead(notificationId);
    setNotifications((prev) =>
      prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
    );
    return res.data;
  }, []);

  const markAllRead = useCallback(async () => {
    if (!user?._id) return;
    await markAllNotificationsRead(user._id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, [user?._id]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markRead,
    markAllRead,
  };
}
