"use client";

import { useCallback, useEffect, useState } from "react";
import { createComment, getComments } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export function useComments(feedId, { enabled = false } = {}) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async () => {
    if (!feedId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getComments(feedId);
      setComments(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, [feedId]);

  useEffect(() => {
    if (enabled && feedId) {
      fetchComments();
    }
  }, [enabled, feedId, fetchComments]);

  const addComment = useCallback(
    async (text) => {
      setSubmitting(true);
      setError(null);
      try {
        const res = await createComment(feedId, text);
        const enriched = {
          ...res.data,
          userId: user
            ? { _id: user._id, name: user.name, email: user.email }
            : res.data.userId,
        };
        setComments((prev) => {
          if (prev.some((c) => c._id === res.data._id)) return prev;
          return [enriched, ...prev];
        });
        return res.data;
      } catch (err) {
        setError(err.message || "Failed to post comment");
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [feedId]
  );

  const prependComment = useCallback((comment) => {
    setComments((prev) => {
      if (prev.some((c) => c._id === comment._id)) return prev;
      return [comment, ...prev];
    });
  }, []);

  return {
    comments,
    loading,
    submitting,
    error,
    fetchComments,
    addComment,
    prependComment,
  };
}
