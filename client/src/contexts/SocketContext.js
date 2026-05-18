"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SOCKET_EVENTS } from "@/constants";
import {
  createSocket,
  disconnectSocket,
  getSocket,
  onReconnect as registerReconnect,
  subscribe,
} from "@/lib/socket";
import { getToken } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";

/** @typedef {'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'error'} ConnectionStatus */

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState("connecting");
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = isAuthenticated ? getToken() : null;
    setStatus("connecting");
    setError(null);

    const socket = createSocket(token);

    const onConnect = () => {
      setError(null);
      setStatus("connected");
    };

    const onDisconnect = (reason) => {
      if (reason === "io server disconnect") {
        setStatus("disconnected");
        return;
      }
      setStatus("reconnecting");
    };

    const onConnectError = (err) => {
      setError(err?.message || "Could not connect to live updates");
      setStatus("error");
    };

    const onReconnectAttempt = () => {
      setStatus("reconnecting");
      setError(null);
    };

    const onReconnectFailed = () => {
      setError("Live updates unavailable. Check your connection.");
      setStatus("error");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("reconnect_attempt", onReconnectAttempt);
    socket.on("reconnect_failed", onReconnectFailed);

    if (socket.connected) {
      setStatus("connected");
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("reconnect_attempt", onReconnectAttempt);
      socket.off("reconnect_failed", onReconnectFailed);
      disconnectSocket();
      setStatus("disconnected");
      setError(null);
    };
  }, [isAuthenticated]);

  const onFeedNew = useCallback(
    (handler) => subscribe(SOCKET_EVENTS.FEED_NEW, handler),
    []
  );
  const onCommentNew = useCallback(
    (handler) => subscribe(SOCKET_EVENTS.COMMENT_NEW, handler),
    []
  );
  const onLikeUpdated = useCallback(
    (handler) => subscribe(SOCKET_EVENTS.LIKE_UPDATED, handler),
    []
  );
  const onNotificationNew = useCallback(
    (handler) => subscribe(SOCKET_EVENTS.NOTIFICATION_NEW, handler),
    []
  );
  const onNotificationRead = useCallback(
    (handler) => subscribe(SOCKET_EVENTS.NOTIFICATION_READ, handler),
    []
  );
  const onNotificationAllRead = useCallback(
    (handler) => subscribe(SOCKET_EVENTS.NOTIFICATION_ALL_READ, handler),
    []
  );
  const onReconnect = useCallback(
    (handler) => registerReconnect(handler),
    []
  );

  const value = useMemo(
    () => ({
      connected: status === "connected",
      status,
      error,
      socket: getSocket(),
      onFeedNew,
      onCommentNew,
      onLikeUpdated,
      onNotificationNew,
      onNotificationRead,
      onNotificationAllRead,
      onReconnect,
    }),
    [
      status,
      error,
      onFeedNew,
      onCommentNew,
      onLikeUpdated,
      onNotificationNew,
      onNotificationRead,
      onNotificationAllRead,
      onReconnect,
    ]
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return ctx;
}
