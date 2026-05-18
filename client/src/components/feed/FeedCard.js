"use client";

import FeedDetailView from "@/components/feed/FeedDetailView";

export default function FeedCard({ feed, onFeedUpdate, readOnly = false }) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <FeedDetailView
        feed={feed}
        onFeedUpdate={onFeedUpdate}
        readOnly={readOnly}
      />
    </article>
  );
}
