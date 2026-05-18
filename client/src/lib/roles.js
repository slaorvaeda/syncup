export const STAFF_ROLES = ["admin", "coach"];

export function isStaff(user) {
  return Boolean(user && STAFF_ROLES.includes(user.role));
}

export function isAdmin(user) {
  return Boolean(user && user.role === "admin");
}
