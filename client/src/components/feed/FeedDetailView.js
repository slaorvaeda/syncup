"use client";

import { useCallback, useEffect, useState } from "react";
import Badge from "@/components/common/Badge";
import { MessageCircleIcon, PaperclipIcon } from "@/components/common/icons";
import Button from "@/components/common/Button";
import LikeButton from "@/components/feed/LikeButton";
import CommentSection from "@/components/feed/CommentSection";
import { formatRelativeTime, getInitials } from "@/lib/format";
import { useSocket } from "@/contexts/SocketContext";

function formatDateTime(dateString) {
  if (!dateString) return null;
  return new Date(dateString).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function FeedDetailView({ feed, onFeedUpdate, readOnly = false }) {
  const [commentsOpen, setCommentsOpen] = useState(true);
  const [likesCount, setLikesCount] = useState(feed.likesCount ?? 0);
  const [commentsCount, setCommentsCount] = useState(feed.commentsCount ?? 0);
  const { onLikeUpdated } = useSocket();

  useEffect(() => {
    setLikesCount(feed.likesCount ?? 0);
    setCommentsCount(feed.commentsCount ?? 0);
  }, [feed.likesCount, feed.commentsCount]);

  useEffect(() => {
    const unsub = onLikeUpdated((payload) => {
      if (payload.feedId !== feed._id) return;
      setLikesCount(payload.likesCount);
      onFeedUpdate?.(feed._id, { likesCount: payload.likesCount });
    });
    return unsub;
  }, [feed._id, onLikeUpdated, onFeedUpdate]);

  const handleCommentAdded = useCallback(() => {
    setCommentsCount((c) => c + 1);
    onFeedUpdate?.(feed._id, (f) => ({
      commentsCount: (f.commentsCount ?? 0) + 1,
    }));
  }, [feed._id, onFeedUpdate]);

  return (
    <article>
      <header className="flex items-start gap-3">
        {feed.authorAvatar ? (
          <img
            src={feed.authorAvatar}
            alt={feed.authorName}
            className="h-11 w-11 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            {getInitials(feed.authorName)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
              {feed.authorName || "Coach"}
            </h3>
            {feed.type && <Badge variant={feed.type}>{feed.type}</Badge>}
            {feed.status && feed.status !== "published" && (
              <Badge variant="default">{feed.status}</Badge>
            )}
            {feed.visibility && feed.visibility !== "public" && (
              <Badge variant="announcement">{feed.visibility}</Badge>
            )}
            {feed.isPinned && <Badge variant="reminder">Pinned</Badge>}
          </div>
          <p className="text-xs text-zinc-500">
            {formatRelativeTime(feed.createdAt)}
          </p>
        </div>
      </header>

      {feed.title && (
        <h4 className="mt-5 text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-100">
          {feed.title}
        </h4>
      )}

      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {feed.message}
      </p>

      {feed.imageUrl && (
        <div className="mt-5 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900">
          <img
            src={feed.imageUrl}
            alt={feed.title ? `${feed.title} image` : "Feed image"}
            className="mx-auto h-auto max-h-[min(70vh,720px)] w-full object-contain"
          />
        </div>
      )}

      {feed.tags?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {feed.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {(feed.programId || feed.cohortId) && (
        <p className="mt-3 text-xs text-zinc-500">
          {feed.programId && <span>Program: {feed.programId} </span>}
          {feed.cohortId && <span>Cohort: {feed.cohortId}</span>}
        </p>
      )}

      {(feed.scheduledAt || feed.expiresAt) && (
        <p className="mt-2 text-xs text-zinc-500">
          {feed.scheduledAt && (
            <span>Scheduled: {formatDateTime(feed.scheduledAt)} · </span>
          )}
          {feed.expiresAt && (
            <span>Expires: {formatDateTime(feed.expiresAt)}</span>
          )}
        </p>
      )}

      {feed.attachments?.length > 0 && (
        <ul className="mt-4 space-y-2">
          {feed.attachments.map((att, i) => (
            <li key={`${att.url}-${i}`}>
              <a
                href={att.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline dark:text-indigo-400"
              >
                <PaperclipIcon className="h-4 w-4 shrink-0" />
                {att.name || "Attachment"}
              </a>
            </li>
          ))}
        </ul>
      )}

      <footer className="mt-6 flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <LikeButton
          feedId={feed._id}
          likesCount={likesCount}
          readOnly={readOnly}
          onUpdate={(data) => {
            setLikesCount(data.likesCount);
            onFeedUpdate?.(feed._id, data);
          }}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="inline-flex !h-8 items-center gap-1.5 !px-2 text-zinc-600"
          onClick={() => setCommentsOpen((o) => !o)}
        >
          <MessageCircleIcon className="h-4 w-4" />
          {commentsCount} {commentsOpen ? "Hide" : "Comments"}
        </Button>
      </footer>

      <CommentSection
        feedId={feed._id}
        open={commentsOpen}
        readOnly={readOnly}
        onCommentAdded={handleCommentAdded}
      />
    </article>
  );
}
