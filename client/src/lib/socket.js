import { io } from "socket.io-client";
import { API_URL } from "@/constants";
import { SOCKET_EVENTS } from "@/constants";

let socket = null;
let hasConnectedOnce = false;

const seenEventKeys = new Set();
const MAX_SEEN = 1000;

/** @type {Map<string, Set<Function>>} */
const handlerSets = new Map();

/** @type {Set<Function>} */
const reconnectHandlers = new Set();

const MANAGED_EVENTS = Object.values(SOCKET_EVENTS);

function getHandlerSet(event) {
  if (!handlerSets.has(event)) {
    handlerSets.set(event, new Set());
  }
  return handlerSets.get(event);
}

function buildEventKey(event, payload) {
  if (!payload) return null;

  switch (event) {
    case SOCKET_EVENTS.FEED_NEW:
      return payload._id ? `feed:new:${payload._id}` : null;
    case SOCKET_EVENTS.COMMENT_NEW:
      return payload.comment?._id
        ? `comment:new:${payload.comment._id}`
        : null;
    case SOCKET_EVENTS.LIKE_UPDATED:
      return payload.feedId != null
        ? `like:updated:${payload.feedId}:${payload.likesCount}:${payload.liked}`
        : null;
    case SOCKET_EVENTS.NOTIFICATION_NEW:
      return payload._id ? `notification:new:${payload._id}` : null;
    case SOCKET_EVENTS.NOTIFICATION_READ:
      return payload._id ? `notification:read:${payload._id}` : null;
    case SOCKET_EVENTS.NOTIFICATION_ALL_READ:
      return payload.userId
        ? `notification:all-read:${payload.userId}`
        : null;
    default:
      return payload._id ? `${event}:${payload._id}` : null;
  }
}

function shouldDedupe(event, payload) {
  const key = buildEventKey(event, payload);
  if (!key) return false;
  if (seenEventKeys.has(key)) return true;

  seenEventKeys.add(key);
  if (seenEventKeys.size > MAX_SEEN) {
    const first = seenEventKeys.values().next().value;
    seenEventKeys.delete(first);
  }
  return false;
}

function dispatchEvent(event, payload) {
  if (shouldDedupe(event, payload)) return;

  const handlers = handlerSets.get(event);
  if (!handlers?.size) return;

  handlers.forEach((handler) => {
    try {
      handler(payload);
    } catch (err) {
      console.error(`[socket] Handler error for ${event}:`, err);
    }
  });
}

function notifyReconnect() {
  reconnectHandlers.forEach((handler) => {
    try {
      handler();
    } catch (err) {
      console.error("[socket] Reconnect handler error:", err);
    }
  });
}

function bindSocketListeners(sock) {
  if (sock.__syncupBound) return;
  sock.__syncupBound = true;

  MANAGED_EVENTS.forEach((event) => {
    sock.on(event, (payload) => dispatchEvent(event, payload));
  });

  sock.on("connect", () => {
    if (hasConnectedOnce) {
      seenEventKeys.clear();
      notifyReconnect();
    }
    hasConnectedOnce = true;
  });
}

function unbindSocketListeners(sock) {
  if (!sock?.__syncupBound) return;

  MANAGED_EVENTS.forEach((event) => {
    sock.off(event);
  });
  sock.off("connect");
  sock.__syncupBound = false;
}

export function getSocket() {
  return socket;
}

export function createSocket(token = null) {
  const authToken = token || null;

  if (socket?.connected && socket.auth?.token === authToken) {
    return socket;
  }

  if (socket) {
    unbindSocketListeners(socket);
    socket.disconnect();
    socket.removeAllListeners();
    socket = null;
    hasConnectedOnce = false;
  }

  const options = {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 8000,
    timeout: 20000,
  };

  if (authToken) {
    options.auth = { token: authToken };
  }

  socket = io(API_URL, options);
  bindSocketListeners(socket);

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    unbindSocketListeners(socket);
    socket.disconnect();
    socket.removeAllListeners();
    socket = null;
  }
  hasConnectedOnce = false;
  seenEventKeys.clear();
}

export function subscribe(event, handler) {
  const set = getHandlerSet(event);
  set.add(handler);

  return () => {
    set.delete(handler);
  };
}

export function onReconnect(handler) {
  reconnectHandlers.add(handler);
  return () => reconnectHandlers.delete(handler);
}

export function clearSeenEvents() {
  seenEventKeys.clear();
}
