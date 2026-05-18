"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin } from "@/lib/roles";
import { useMyFeeds } from "@/hooks/useMyFeeds";
import MyPostRow from "@/components/feed/MyPostRow";
import Button from "@/components/common/Button";
import Alert from "@/components/common/Alert";
import EmptyState from "@/components/common/EmptyState";
import Skeleton from "@/components/common/Skeleton";
import InfiniteScrollSentinel from "@/components/common/InfiniteScrollSentinel";

export default function MyPostsPage() {
  const { user } = useAuth();
  const adminView = isAdmin(user);
  const { feeds, pagination, loading, loadingMore, error, loadMore, refresh } =
    useMyFeeds();

  return (
    <>
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            {adminView ? "Moderation" : "Library"}
          </p>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-50">
            {adminView ? "All posts" : "My posts"}
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {adminView
              ? "View and edit every feed on the platform, from all coaches."
              : "All feeds you have published or saved as drafts. Edit any post below."}
          </p>
        </div>
        <Link
          href="/admin"
          className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-500 sm:w-auto"
        >
          New post
        </Link>
      </header>

      {error && (
        <Alert variant="error" className="mb-4 flex flex-col gap-2">
          <p>{error}</p>
          <Button variant="secondary" size="sm" onClick={refresh}>
            Try again
          </Button>
        </Alert>
      )}

      {loading && feeds.length === 0 && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {!loading && feeds.length === 0 && !error && (
        <EmptyState
          title={adminView ? "No posts in the system" : "No posts yet"}
          description={
            adminView
              ? "When coaches publish feeds, they will appear here."
              : "Create your first coaching feed post to see it here."
          }
          action={
            !adminView ? (
              <Link
                href="/admin"
                className="inline-flex h-10 items-center rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-500"
              >
                Create post
              </Link>
            ) : null
          }
        />
      )}

      {feeds.length > 0 && (
        <div className="space-y-3">
          {feeds.map((feed) => (
            <MyPostRow key={feed._id} feed={feed} showAuthor={adminView} />
          ))}
        </div>
      )}

      <InfiniteScrollSentinel
        hasMore={Boolean(pagination?.hasNextPage)}
        loading={loadingMore}
        onLoadMore={loadMore}
        label="Loading more posts..."
      />
    </>
  );
}
