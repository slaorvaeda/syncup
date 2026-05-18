"use client";

import { useMemo, useState } from "react";
import FeedGridCard from "@/components/feed/FeedGridCard";
import FeedDetailModal from "@/components/feed/FeedDetailModal";
import FeedGridSkeleton from "@/components/feed/FeedGridSkeleton";
import Alert from "@/components/common/Alert";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import InfiniteScrollSentinel from "@/components/common/InfiniteScrollSentinel";

export default function FeedGrid({
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
  const [selectedId, setSelectedId] = useState(null);
  const selectedFeed = useMemo(
    () => feeds.find((f) => f._id === selectedId) ?? null,
    [feeds, selectedId]
  );

  if (loading && feeds.length === 0) {
    return <FeedGridSkeleton count={6} />;
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
    <>
      <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 [&>*]:min-w-0">
        {feeds.map((feed) => (
          <FeedGridCard
            key={feed._id}
            feed={feed}
            onClick={() => setSelectedId(feed._id)}
          />
        ))}
      </div>

      {loadingMore && feeds.length > 0 && (
        <div className="mt-4 grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 [&>*]:min-w-0">
          <FeedGridSkeleton count={3} />
        </div>
      )}

      <InfiniteScrollSentinel
        hasMore={Boolean(pagination?.hasNextPage)}
        loading={loadingMore}
        onLoadMore={onLoadMore}
        label="Loading more feeds..."
      />

      <FeedDetailModal
        feed={selectedFeed}
        open={Boolean(selectedFeed)}
        onClose={() => setSelectedId(null)}
        onFeedUpdate={onFeedUpdate}
        readOnly={readOnly}
      />
    </>
  );
}
