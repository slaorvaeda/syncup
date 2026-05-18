import { isStaff } from "@/lib/roles";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  ADMIN_LOGIN: "/admin",
  ADMIN_POSTS: "/admin/posts",
  USERS: "/users",
  PROFILE: "/profile",
  NOTIFICATIONS: "/notifications",
};

export function isAdminLoginPath(pathname) {
  return pathname === ROUTES.ADMIN_LOGIN;
}

export function requiresStaff(pathname) {
  if (!pathname) return false;
  if (isAdminLoginPath(pathname)) return false;
  return (
    pathname === ROUTES.ADMIN_POSTS ||
    pathname.startsWith(`${ROUTES.ADMIN_POSTS}/`) ||
    pathname === ROUTES.USERS ||
    pathname === ROUTES.PROFILE ||
    pathname === ROUTES.NOTIFICATIONS
  );
}

export function requiresAdmin(pathname) {
  return pathname === ROUTES.USERS || pathname.startsWith(`${ROUTES.USERS}/`);
}

export function isInternalPath(path) {
  if (!path || typeof path !== "string") return false;
  if (!path.startsWith("/") || path.startsWith("//")) return false;
  return true;
}

export function canAccessPath(pathname, user) {
  if (!requiresStaff(pathname)) return true;
  if (!user || !isStaff(user)) return false;
  if (requiresAdmin(pathname)) return user.role === "admin";
  return true;
}

export function buildLoginUrl(returnTo) {
  if (returnTo && isInternalPath(returnTo) && returnTo !== ROUTES.LOGIN) {
    return `${ROUTES.LOGIN}?redirect=${encodeURIComponent(returnTo)}`;
  }
  return ROUTES.LOGIN;
}

export function buildAdminLoginUrl(returnTo) {
  if (returnTo && isInternalPath(returnTo) && returnTo !== ROUTES.ADMIN_LOGIN) {
    return `${ROUTES.ADMIN_LOGIN}?redirect=${encodeURIComponent(returnTo)}`;
  }
  return ROUTES.ADMIN_LOGIN;
}

export function getStaffAuthRedirect(pathname, { loading, isAuthenticated, user }) {
  if (loading || !pathname) return null;
  if (!requiresStaff(pathname)) return null;

  if (!isAuthenticated) {
    return buildAdminLoginUrl(pathname);
  }

  if (!isStaff(user)) {
    return ROUTES.ADMIN_LOGIN;
  }

  if (requiresAdmin(pathname) && user.role !== "admin") {
    return ROUTES.ADMIN_POSTS;
  }

  return null;
}
