export const INITIAL_FEED_FORM = {
  title: "",
  message: "",
  type: "tip",
  status: "published",
  visibility: "public",
  programId: "",
  cohortId: "",
  scheduledAt: "",
  expiresAt: "",
  isPinned: false,
  tags: "",
  imageUrl: null,
  attachments: [],
};

export function toDatetimeLocalValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function feedToFormValues(feed) {
  if (!feed) return { ...INITIAL_FEED_FORM };

  return {
    title: feed.title || "",
    message: feed.message || "",
    type: feed.type || "tip",
    status: feed.status || "published",
    visibility: feed.visibility || "public",
    programId: feed.programId || "",
    cohortId: feed.cohortId || "",
    scheduledAt: toDatetimeLocalValue(feed.scheduledAt),
    expiresAt: toDatetimeLocalValue(feed.expiresAt),
    isPinned: Boolean(feed.isPinned),
    tags: Array.isArray(feed.tags) ? feed.tags.join(", ") : "",
    imageUrl: feed.imageUrl || null,
    attachments: feed.attachments || [],
  };
}
