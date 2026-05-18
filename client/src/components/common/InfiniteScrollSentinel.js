"use client";

import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import Spinner from "@/components/common/Spinner";

export default function InfiniteScrollSentinel({
  hasMore,
  loading,
  onLoadMore,
  label = "Loading more...",
}) {
  const sentinelRef = useInfiniteScroll({ onLoadMore, hasMore, loading });

  if (!hasMore && !loading) return null;

  return (
    <div
      ref={sentinelRef}
      className="flex w-full items-center justify-center py-6"
      aria-busy={loading}
      aria-live="polite"
    >
      {loading ? (
        <Spinner label={label} className="py-2" />
      ) : (
        <span className="h-px w-full max-w-xs opacity-0" aria-hidden>
          &nbsp;
        </span>
      )}
    </div>
  );
}
