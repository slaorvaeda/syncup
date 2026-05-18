"use client";

import { useEffect } from "react";
import { useComments } from "@/hooks/useComments";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import CommentItem from "@/components/feed/CommentItem";
import CommentForm from "@/components/feed/CommentForm";
import Spinner from "@/components/common/Spinner";
import Alert from "@/components/common/Alert";
import Skeleton from "@/components/common/Skeleton";

export default function CommentSection({
  feedId,
  open,
  readOnly = false,
  onCommentAdded,
}) {
  const { isAuthenticated } = useAuth();
  const canComment = !readOnly && isAuthenticated;
  const { onCommentNew, onReconnect } = useSocket();
  const {
    comments,
    loading,
    submitting,
    error,
    addComment,
    prependComment,
    fetchComments,
  } = useComments(feedId, { enabled: open });

  useEffect(() => {
    if (!open) return;
    const unsub = onCommentNew(({ feedId: id, comment }) => {
      if (id !== feedId) return;
      prependComment(comment);
    });
    return unsub;
  }, [open, feedId, onCommentNew, prependComment]);

  useEffect(() => {
    if (!open) return;
    return onReconnect(() => fetchComments());
  }, [open, feedId, onReconnect, fetchComments]);

  const handleSubmit = async (text) => {
    await addComment(text);
    onCommentAdded?.();
  };

  if (!open) return null;

  return (
    <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
      {loading && (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {error && !loading && (
        <Alert variant="error" className="mb-3">
          {error}
          <button
            type="button"
            className="ml-2 underline"
            onClick={fetchComments}
          >
            Retry
          </button>
        </Alert>
      )}

      {!loading && comments.length === 0 && (
        <p className="text-sm text-zinc-500">No comments yet.</p>
      )}

      <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} />
        ))}
      </ul>

      {canComment && (
        <CommentForm onSubmit={handleSubmit} submitting={submitting} />
      )}
    </div>
  );
}
