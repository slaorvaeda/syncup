import api from "@/lib/axios";
import { ApiError } from "@/lib/api-error";

export { ApiError };

// ——— Health ———
export function getHealth() {
  return api.get("/health");
}

// ——— Auth ———
export function login(body) {
  return api.post("/auth/login", body);
}

export function register(body) {
  return api.post("/auth/register", body);
}

export function getMe() {
  return api.get("/auth/me");
}

// ——— Feeds ———
export function getFeeds({ page = 1, limit = 20 } = {}) {
  return api.get("/feed", { params: { page, limit } });
}

export function createFeed(body) {
  return api.post("/feed", body);
}

export function getMyFeeds({ page = 1, limit = 20 } = {}) {
  return api.get("/feed/mine", { params: { page, limit } });
}

export function getFeedById(feedId) {
  return api.get(`/feed/${feedId}`);
}

export function updateFeed(feedId, body) {
  return api.patch(`/feed/${feedId}`, body);
}

export function uploadFeedImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  return api.post("/upload/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function uploadFeedFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/upload/file", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// ——— Comments ———
export function getComments(feedId) {
  return api.get(`/feed/${feedId}/comments`);
}

export function createComment(feedId, text) {
  return api.post(`/feed/${feedId}/comments`, { text });
}

// ——— Likes ———
export function toggleLike(feedId) {
  return api.post(`/feed/${feedId}/like`);
}

// ——— Notifications ———
export function getNotifications(userId) {
  return api.get(`/notifications/user/${userId}`);
}

export function markNotificationRead(notificationId) {
  return api.patch(`/notifications/${notificationId}/read`);
}

export function markAllNotificationsRead(userId) {
  return api.patch(`/notifications/user/${userId}/read-all`);
}

// ——— Users ———
export function getUsers() {
  return api.get("/users");
}

export function getUserById(userId) {
  return api.get(`/users/${userId}`);
}
