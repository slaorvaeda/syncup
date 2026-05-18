export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const AUTH_STORAGE_KEY = "syncup_token";
export const USER_STORAGE_KEY = "syncup_user";
export const THEME_STORAGE_KEY = "syncup_theme";

export const FEED_TYPES = [
  { value: "tip", label: "Tip" },
  { value: "announcement", label: "Announcement" },
  { value: "reminder", label: "Reminder" },
];

export const FEED_STATUS = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

export const FEED_VISIBILITY = [
  { value: "public", label: "Public — everyone" },
  { value: "team", label: "Team only" },
  { value: "private", label: "Private" },
];

export const SOCKET_EVENTS = {
  FEED_NEW: "feed:new",
  COMMENT_NEW: "comment:new",
  LIKE_UPDATED: "like:updated",
  NOTIFICATION_NEW: "notification:new",
  NOTIFICATION_READ: "notification:read",
  NOTIFICATION_ALL_READ: "notification:all-read",
};

export const NOTIFICATION_LABELS = {
  feed_new: "New feed",
  comment: "Comment",
  like: "Like",
  mention: "Mention",
  system: "System",
};
