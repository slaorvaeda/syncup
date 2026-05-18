"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { isStaff } from "@/lib/roles";
import { useNotificationsContext } from "@/contexts/NotificationsContext";
import { BellIcon } from "@/components/common/icons";

export default function NotificationBell() {
  const { user } = useAuth();
  const { unreadCount } = useNotificationsContext();

  if (!isStaff(user)) return null;

  return (
    <Link
      href="/notifications"
      className="relative rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
      aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
    >
      <BellIcon className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
