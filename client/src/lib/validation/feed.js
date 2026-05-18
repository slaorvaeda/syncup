import { isValidUrl } from "@/lib/validation/utils";

const FEED_TYPES = ["tip", "announcement", "reminder"];
const FEED_STATUS = ["published", "draft", "archived"];
const FEED_VISIBILITY = ["public", "team", "private"];

export function parseTags(raw) {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function toIsoOrNull(value) {
  if (!value?.trim()) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export function buildFeedPayload(form) {
  const payload = {
    message: form.message.trim(),
    type: form.type,
    status: form.status,
    visibility: form.visibility,
    isPinned: Boolean(form.isPinned),
  };

  if (form.title?.trim()) payload.title = form.title.trim();
  payload.imageUrl = form.imageUrl || null;
  if (form.programId?.trim()) payload.programId = form.programId.trim();
  if (form.cohortId?.trim()) payload.cohortId = form.cohortId.trim();

  const scheduledAt = toIsoOrNull(form.scheduledAt);
  const expiresAt = toIsoOrNull(form.expiresAt);
  if (scheduledAt) payload.scheduledAt = scheduledAt;
  if (expiresAt) payload.expiresAt = expiresAt;

  const tags = parseTags(form.tags || "");
  if (tags.length) payload.tags = tags;

  if (form.attachments?.length) payload.attachments = form.attachments;

  return payload;
}

export function validateFeedForm(form) {
  const errors = {};

  const message = form.message?.trim() ?? "";
  if (!message) {
    errors.message = "Message is required";
  } else if (message.length > 2000) {
    errors.message = "Message must be at most 2000 characters";
  }

  const title = form.title?.trim() ?? "";
  if (title.length > 200) {
    errors.title = "Title must be at most 200 characters";
  }

  if (form.type && !FEED_TYPES.includes(form.type)) {
    errors.type = "Invalid post type";
  }

  if (form.status && !FEED_STATUS.includes(form.status)) {
    errors.status = "Invalid status";
  }

  if (form.visibility && !FEED_VISIBILITY.includes(form.visibility)) {
    errors.visibility = "Invalid visibility";
  }

  if (form.imageUrl && !isValidUrl(form.imageUrl)) {
    errors.imageUrl = "Image must be a valid URL";
  }

  if (form.programId?.trim() && form.programId.trim().length > 100) {
    errors.programId = "Program ID must be at most 100 characters";
  }

  if (form.cohortId?.trim() && form.cohortId.trim().length > 100) {
    errors.cohortId = "Cohort ID must be at most 100 characters";
  }

  const tags = parseTags(form.tags || "");
  if (tags.length > 20) {
    errors.tags = "Maximum 20 tags allowed";
  } else if (tags.some((t) => t.length > 50)) {
    errors.tags = "Each tag must be at most 50 characters";
  }

  if (form.attachments?.length > 5) {
    errors.attachments = "Maximum 5 attachments allowed";
  }

  let scheduledDate = null;
  let expiresDate = null;

  if (form.scheduledAt?.trim()) {
    scheduledDate = new Date(form.scheduledAt);
    if (Number.isNaN(scheduledDate.getTime())) {
      errors.scheduledAt = "Invalid publish date";
    }
  }

  if (form.expiresAt?.trim()) {
    expiresDate = new Date(form.expiresAt);
    if (Number.isNaN(expiresDate.getTime())) {
      errors.expiresAt = "Invalid expiry date";
    }
  }

  if (
    scheduledDate &&
    expiresDate &&
    !errors.scheduledAt &&
    !errors.expiresAt &&
    expiresDate <= scheduledDate
  ) {
    errors.expiresAt = "Expiry must be after publish date";
  }

  return errors;
}

export function validateFeedField(field, form) {
  return validateFeedForm(form)[field] || "";
}
