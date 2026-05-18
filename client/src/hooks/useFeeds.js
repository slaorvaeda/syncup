"use client";

import { useCallback, useEffect, useState } from "react";
import { getFeeds } from "@/lib/api";

export function useFeeds({ limit = 20 } = {}) {
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
        const res = await getFeeds({ page: pageNum, limit });
        setFeeds((prev) =>
          append ? [...prev, ...res.data] : res.data
        );
        setPagination(res.pagination);
        setPage(pageNum);
      } catch (err) {
        setError(err.message || "Failed to load feeds");
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

  const prependFeed = useCallback((feed) => {
    setFeeds((prev) => {
      if (prev.some((item) => item._id === feed._id)) return prev;
      return [feed, ...prev];
    });
  }, []);

  const loadMore = useCallback(() => {
    if (!pagination?.hasNextPage || loading || loadingMore) return;
    fetchFeeds(page + 1, true);
  }, [pagination, loading, loadingMore, page, fetchFeeds]);

  const refresh = useCallback(() => fetchFeeds(1, false), [fetchFeeds]);

  const updateFeed = useCallback((feedId, partialOrFn) => {
    setFeeds((prev) =>
      prev.map((feed) => {
        if (feed._id !== feedId) return feed;
        const partial =
          typeof partialOrFn === "function" ? partialOrFn(feed) : partialOrFn;
        return { ...feed, ...partial };
      })
    );
  }, []);

  return {
    feeds,
    pagination,
    loading,
    loadingMore,
    error,
    prependFeed,
    updateFeed,
    loadMore,
    refresh,
  };
}
