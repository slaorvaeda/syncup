import { isValidEmail } from "@/lib/validation/utils";

const ROLES = ["coach", "student", "admin"];

export function validateLoginForm({ email, password }) {
  const errors = {};

  const trimmedEmail = email?.trim() ?? "";
  if (!trimmedEmail) {
    errors.email = "Email is required";
  } else if (!isValidEmail(trimmedEmail)) {
    errors.email = "Invalid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length > 128) {
    errors.password = "Password must be at most 128 characters";
  }

  return errors;
}

export function validateRegisterForm({ name, email, password, role }) {
  const errors = {};

  const trimmedName = name?.trim() ?? "";
  if (!trimmedName) {
    errors.name = "Name is required";
  } else if (trimmedName.length > 100) {
    errors.name = "Name must be at most 100 characters";
  }

  const trimmedEmail = email?.trim() ?? "";
  if (!trimmedEmail) {
    errors.email = "Email is required";
  } else if (!isValidEmail(trimmedEmail)) {
    errors.email = "Invalid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  } else if (password.length > 128) {
    errors.password = "Password must be at most 128 characters";
  }

  if (role && !ROLES.includes(role)) {
    errors.role = "Invalid account type";
  }

  return errors;
}

export function validateLoginField(field, values) {
  return validateLoginForm(values)[field] || "";
}

export function validateRegisterField(field, values) {
  return validateRegisterForm(values)[field] || "";
}
