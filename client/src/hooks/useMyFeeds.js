"use client";

import { useCallback, useEffect, useState } from "react";
import { getMyFeeds } from "@/lib/api";

export function useMyFeeds({ limit = 10 } = {}) {
  const [feeds, setFeeds] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const fetchFeeds = useCallback(
    async (pageNum = 1, append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      try {
        const res = await getMyFeeds({ page: pageNum, limit });
        setFeeds((prev) =>
          append ? [...prev, ...res.data] : res.data || []
        );
        setPagination(res.pagination);
        setPage(pageNum);
      } catch (err) {
        setError(err.message || "Failed to load posts");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    fetchFeeds(1, false);
  }, [fetchFeeds]);

  const loadMore = useCallback(() => {
    if (!pagination?.hasNextPage || loading || loadingMore) return;
    fetchFeeds(page + 1, true);
  }, [pagination, loading, loadingMore, page, fetchFeeds]);

  const refresh = useCallback(() => fetchFeeds(1, false), [fetchFeeds]);

  const removeFeed = useCallback((feedId) => {
    setFeeds((prev) => prev.filter((f) => f._id !== feedId));
  }, []);

  const upsertFeed = useCallback((feed) => {
    setFeeds((prev) => {
      const idx = prev.findIndex((f) => f._id === feed._id);
      if (idx === -1) return [feed, ...prev];
      const next = [...prev];
      next[idx] = feed;
      return next;
    });
  }, []);

  return {
    feeds,
    pagination,
    loading,
    loadingMore,
    error,
    loadMore,
    refresh,
    removeFeed,
    upsertFeed,
  };
}
