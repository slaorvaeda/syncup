export function validateCommentForm({ text }) {
  const errors = {};
  const trimmed = text?.trim() ?? "";

  if (!trimmed) {
    errors.text = "Comment is required";
  } else if (trimmed.length > 1000) {
    errors.text = "Comment must be at most 1000 characters";
  }

  return errors;
}

export function validateCommentField(field, values) {
  return validateCommentForm(values)[field] || "";
}
