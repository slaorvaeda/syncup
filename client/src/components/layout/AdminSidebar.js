"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { isStaff } from "@/lib/roles";
import Button from "@/components/common/Button";
import ThemeToggle from "@/components/common/ThemeToggle";
import Logo from "@/components/common/Logo";
import NotificationBell from "@/components/notifications/NotificationBell";

const NAV = [
  { href: "/admin", label: "Publish", roles: ["coach", "admin"] },
  { href: "/admin/posts", label: "My posts", roles: ["coach", "admin"] },
  { href: "/users", label: "Users", roles: ["admin"] },
  { href: "/notifications", label: "Notifications", roles: ["coach", "admin"] },
  { href: "/profile", label: "Profile", roles: ["coach", "admin"] },
];

function isNavActive(pathname, href) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({ href, label, active }) {
  return (
    <Link
      href={href}
      className={`block shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition lg:w-full lg:py-2.5 ${
        active
          ? "bg-indigo-600 text-white shadow-sm"
          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/80"
      }`}
    >
      {label}
    </Link>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const staff = isStaff(user);

  const links = staff
    ? NAV.filter((item) => item.roles.includes(user.role))
    : [];

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-3 py-3 dark:border-zinc-800 sm:px-4 sm:py-4">
        <Link href="/admin" className="flex min-w-0 items-center gap-2.5">
          <Logo size="md" />
          <div className="min-w-0">
            <p className="truncate font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              SyncUp
            </p>
            <p className="text-xs text-zinc-500">Admin</p>
          </div>
        </Link>
        <div className="flex shrink-0 items-center gap-1">
          {staff && <NotificationBell />}
          <ThemeToggle />
        </div>
      </div>

      {staff ? (
        <>
          <nav
            className="flex gap-1 overflow-x-auto border-b border-zinc-100 p-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:flex-1 lg:flex-col lg:space-y-1 lg:overflow-y-auto lg:overflow-x-visible lg:border-b-0 lg:p-3 [&::-webkit-scrollbar]:hidden"
            aria-label="Admin navigation"
          >
            {links.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={isNavActive(pathname, item.href)}
              />
            ))}
          </nav>

          {/* Mobile footer */}
          <div className="flex items-center justify-between gap-2 px-3 py-3 lg:hidden">
            <Link
              href="/"
              className="shrink-0 rounded-lg px-2 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/80"
            >
              ← Feed
            </Link>
            {!loading && (
              <p className="min-w-0 flex-1 truncate text-center text-xs text-zinc-500">
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {user?.name}
                </span>
                <span className="capitalize"> · {user?.role}</span>
              </p>
            )}
            <Button variant="secondary" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>

          {/* Desktop footer — unchanged layout */}
          <div className="hidden border-t border-zinc-100 p-4 dark:border-zinc-800 lg:block">
            <Link
              href="/"
              className="mb-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/80"
            >
              <span aria-hidden>←</span>
              View public feed
            </Link>

            {!loading && (
              <div className="mb-3 rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-900/60">
                <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {user?.name}
                </p>
                <p className="truncate text-xs capitalize text-zinc-500">
                  {user?.role}
                </p>
              </div>
            )}

            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col justify-between p-3 sm:p-4">
          <p className="text-sm leading-relaxed text-zinc-500">
            {loading
              ? "Loading..."
              : "Sign in on this page to access publish and staff tools."}
          </p>
          <Link
            href="/"
            className="mt-6 block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/80"
          >
            ← Back to public feed
          </Link>
        </div>
      )}
    </aside>
  );
}
