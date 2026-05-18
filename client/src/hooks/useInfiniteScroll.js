"use client";

import { useEffect, useRef } from "react";

/**
 * Observes a sentinel element and calls onLoadMore when it enters the viewport.
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore = false,
  loading = false,
  rootMargin = "240px",
}) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin, threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [onLoadMore, hasMore, loading, rootMargin]);

  return sentinelRef;
}
