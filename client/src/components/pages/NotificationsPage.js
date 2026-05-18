"use client";

import { useNotificationsContext } from "@/contexts/NotificationsContext";
import NotificationItem from "@/components/notifications/NotificationItem";
import Button from "@/components/common/Button";
import Spinner from "@/components/common/Spinner";
import EmptyState from "@/components/common/EmptyState";
import Alert from "@/components/common/Alert";

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markRead,
    markAllRead,
    fetchNotifications,
  } = useNotificationsContext();

  return (
    <>
      <section className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                Notifications
              </h1>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Likes and comments on your posts.
              </p>
            </div>
            {unreadCount > 0 && (
              <Button variant="secondary" size="sm" onClick={markAllRead}>
                Mark all read
              </Button>
            )}
          </section>

          {loading && <Spinner label="Loading notifications..." />}

          {error && (
            <Alert variant="error" className="mb-4">
              {error}
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={fetchNotifications}
              >
                Retry
              </Button>
            </Alert>
          )}

          {!loading && notifications.length === 0 && (
            <EmptyState
              title="All caught up"
              description="You have no notifications yet."
            />
          )}

          {notifications.length > 0 && (
            <div className="space-y-2 rounded-2xl border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-950">
              {notifications.map((n) => (
                <NotificationItem
                  key={n._id}
                  notification={n}
                  onMarkRead={markRead}
                />
              ))}
            </div>
          )}
    </>
  );
}
