import Badge from "@/components/common/Badge";
import { NOTIFICATION_LABELS } from "@/constants";
import { formatRelativeTime } from "@/lib/format";

export default function NotificationItem({ notification, onMarkRead }) {
  return (
    <button
      type="button"
      onClick={() => !notification.read && onMarkRead(notification._id)}
      className={`w-full rounded-xl px-3 py-3 text-left transition ${
        notification.read
          ? "bg-transparent opacity-70"
          : "bg-indigo-50/80 dark:bg-indigo-950/40"
      } hover:bg-zinc-100 dark:hover:bg-zinc-900`}
    >
      <div className="flex items-start justify-between gap-2">
        <Badge variant="default">
          {NOTIFICATION_LABELS[notification.type] || notification.type}
        </Badge>
        <span className="shrink-0 text-xs text-zinc-500">
          {formatRelativeTime(notification.createdAt)}
        </span>
      </div>
      <p className="mt-1 text-sm text-zinc-800 dark:text-zinc-200">
        {notification.message}
      </p>
      {!notification.read && (
        <span className="mt-1 inline-block text-xs font-medium text-indigo-600">
          Tap to mark read
        </span>
      )}
    </button>
  );
}
