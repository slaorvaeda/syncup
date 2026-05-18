export function hasErrors(errors) {
  return Object.values(errors).some(Boolean);
}

export function mapApiFieldErrors(apiErrors) {
  const fieldErrors = {};
  if (!apiErrors) return fieldErrors;

  const list = Array.isArray(apiErrors) ? apiErrors : [];
  for (const item of list) {
    if (!item?.message) continue;
    const key = item.field === "body" || !item.field ? "_form" : item.field;
    if (!fieldErrors[key]) {
      fieldErrors[key] = item.message;
    }
  }
  return fieldErrors;
}

export function getApiErrorMessage(err, fallback = "Something went wrong") {
  if (!err) return fallback;
  if (err.status === 429) {
    return err.message || "Too many attempts. Please try again later.";
  }
  if (err.status === 503) {
    return err.message || "Service unavailable. Check server configuration.";
  }
  if (err.status >= 500) {
    return "Server error. Please try again in a moment.";
  }
  return err.message || fallback;
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

export function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function scrollToFirstError(errors, formRef) {
  const firstKey = Object.keys(errors).find((k) => errors[k]);
  if (!firstKey) return;

  const root = formRef?.current;
  const el =
    root?.querySelector(`[name="${firstKey}"]`) ||
    root?.querySelector(`[data-field="${firstKey}"]`);

  el?.scrollIntoView({ behavior: "smooth", block: "center" });
  el?.focus?.();
}
