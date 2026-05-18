"use client";

import FeedCardNotch from "@/components/feed/FeedCardNotch";
import { HeartIcon, MessageCircleIcon } from "@/components/common/icons";
import { formatRelativeTime } from "@/lib/format";

function CardTitle({ title, message }) {
  if (!title && !message) {
    return (
      <h3
        className="text-base font-bold leading-[1.15] tracking-tight opacity-0 sm:text-lg"
        style={{ minHeight: "var(--feed-card-title-min-h)" }}
        aria-hidden
      >
        &nbsp;
      </h3>
    );
  }

  if (title) {
    const words = title.trim().split(/\s+/);
    if (words.length >= 2) {
      return (
        <h3
          className="line-clamp-2 text-base font-bold leading-[1.15] tracking-tight sm:text-lg"
          style={{
            color: "var(--feed-card-text)",
            minHeight: "var(--feed-card-title-min-h)",
          }}
        >
          {words[0]}{" "}
          <span style={{ color: "var(--feed-card-accent)" }}>{words[1]}</span>
          {words.length > 2 ? ` ${words.slice(2).join(" ")}` : ""}
        </h3>
      );
    }
    return (
      <h3
        className="line-clamp-2 text-base font-bold leading-[1.15] tracking-tight sm:text-lg"
        style={{
          color: "var(--feed-card-text)",
          minHeight: "var(--feed-card-title-min-h)",
        }}
      >
        {title}
      </h3>
    );
  }

  return (
    <h3
      className="line-clamp-2 text-base font-bold leading-[1.15] tracking-tight sm:text-lg"
      style={{
        color: "var(--feed-card-text)",
        minHeight: "var(--feed-card-title-min-h)",
      }}
    >
      {message}
    </h3>
  );
}

function FeedCardMedia({ imageUrl, isPinned }) {
  return (
    <div className="feed-card-media relative w-full min-w-0 shrink-0 overflow-hidden rounded-xl sm:rounded-2xl">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      ) : (
        <div className="feed-card-media-placeholder" aria-hidden />
      )}
      {isPinned && (
        <span
          className="absolute left-2 top-2 z-[1] rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow-sm sm:px-2.5"
          style={{
            backgroundColor: "var(--feed-card-accent)",
            color: "#3d3d3d",
          }}
        >
          Pinned
        </span>
      )}
    </div>
  );
}

export default function FeedGridCard({ feed, onClick }) {
  const excerpt = feed.title ? feed.message : null;
  const hasTags = feed.tags?.length > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className="feed-card group relative flex w-full min-w-0 max-w-full cursor-pointer flex-col p-4 pt-5 text-left transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_14px_-8px_rgba(0,0,0,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f2a93b] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-card-surface)] active:scale-[0.99] sm:p-5 sm:pt-6 sm:active:scale-100 dark:hover:-translate-y-1 dark:hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.2)]"
    >
      <FeedCardNotch />

      <div className="feed-card-body relative z-[1] flex flex-1 flex-col">
        <FeedCardMedia imageUrl={feed.imageUrl} isPinned={feed.isPinned} />

        <div className="flex min-w-0 flex-col gap-0.5">
          <CardTitle title={feed.title} message={feed.message} />

          <p
            className={`line-clamp-2 text-sm leading-snug ${
              excerpt ? "" : "invisible"
            }`}
            style={{
              color: "var(--feed-card-muted)",
              minHeight: "var(--feed-card-excerpt-min-h)",
            }}
            aria-hidden={!excerpt}
          >
            {excerpt || "\u00a0"}
          </p>
        </div>

        <div
          className="mt-2 flex min-w-0 flex-wrap gap-1.5"
          style={{ minHeight: "var(--feed-card-tags-min-h)" }}
        >
          {hasTags &&
            feed.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="truncate text-[11px] font-medium"
                style={{ color: "var(--feed-card-muted)" }}
              >
                #{tag}
              </span>
            ))}
        </div>
      </div>

      <div className="relative z-[1] mt-3 min-w-0 shrink-0 sm:mt-4">
        <p
          className="truncate text-sm font-semibold"
          style={{ color: "var(--feed-card-text)" }}
        >
          {feed.authorName || "Coach"}
        </p>
        <p
          className="mt-0.5 truncate text-xs"
          style={{ color: "var(--feed-card-muted)" }}
        >
          {formatRelativeTime(feed.createdAt)}
          {feed.type ? ` · ${feed.type}` : ""}
        </p>
        <p
          className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs"
          style={{ color: "var(--feed-card-muted)" }}
        >
          <span className="inline-flex items-center gap-1">
            <HeartIcon className="h-3.5 w-3.5 shrink-0" />
            {feed.likesCount ?? 0}
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageCircleIcon className="h-3.5 w-3.5 shrink-0" />
            {feed.commentsCount ?? 0}
          </span>
        </p>
      </div>
    </button>
  );
}
