"use client";

import FeedCard from "@/components/feed/FeedCard";
import FeedListSkeleton from "@/components/feed/FeedListSkeleton";
import Alert from "@/components/common/Alert";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import InfiniteScrollSentinel from "@/components/common/InfiniteScrollSentinel";

export default function FeedList({
  feeds,
  loading,
  loadingMore = false,
  error,
  pagination,
  onLoadMore,
  onRetry,
  onFeedUpdate,
  readOnly = false,
}) {
  if (loading && feeds.length === 0) {
    return <FeedListSkeleton count={4} />;
  }

  if (error && feeds.length === 0) {
    return (
      <Alert variant="error" className="flex flex-col gap-3">
        <p>{error}</p>
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      </Alert>
    );
  }

  if (!loading && feeds.length === 0) {
    return (
      <EmptyState
        title="No feeds yet"
        description="Coaches will post tips and announcements here. Check back soon."
      />
    );
  }

  return (
    <div className="space-y-4">
      {feeds.map((feed) => (
        <FeedCard
          key={feed._id}
          feed={feed}
          onFeedUpdate={onFeedUpdate}
          readOnly={readOnly}
        />
      ))}

      {loadingMore && feeds.length > 0 && <FeedListSkeleton count={1} />}

      <InfiniteScrollSentinel
        hasMore={Boolean(pagination?.hasNextPage)}
        loading={loadingMore}
        onLoadMore={onLoadMore}
        label="Loading more feeds..."
      />
    </div>
  );
}
