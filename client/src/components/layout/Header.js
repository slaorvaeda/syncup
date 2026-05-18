"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { isStaff } from "@/lib/roles";
import Logo from "@/components/common/Logo";
import Button from "@/components/common/Button";
import NotificationBell from "@/components/notifications/NotificationBell";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, loading } = useAuth();
  const staff = isStaff(user);

  const links = [{ href: "/", label: "Home" }];

  if (staff) {
    links.push({ href: "/admin", label: "Publish" });
    if (user?.role === "admin") {
      links.push({ href: "/users", label: "Users" });
    }
  } else {
    links.push({ href: "/admin", label: "Admin login" });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-2 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Logo size="sm" />
          <span className="hidden text-lg font-semibold tracking-tight sm:inline">
            SyncUp
          </span>
        </Link>

        <nav className="flex items-center gap-0.5">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-2 py-2 text-sm font-medium transition sm:px-3 ${
                  active
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          {staff && <NotificationBell />}
          {!loading && staff && (
            <>
              <Link
                href="/profile"
                className="hidden max-w-[100px] truncate text-sm text-zinc-600 hover:text-indigo-600 sm:inline dark:text-zinc-400"
              >
                {user?.name}
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
