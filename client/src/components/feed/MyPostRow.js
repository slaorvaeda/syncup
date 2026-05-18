import Link from "next/link";
import Badge from "@/components/common/Badge";
import { formatRelativeTime } from "@/lib/format";

const editLinkClass =
  "inline-flex h-9 items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800";

export default function MyPostRow({ feed, showAuthor = false }) {
  const title = feed.title || feed.message;
  const excerpt = feed.title && feed.message ? feed.message : null;

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-indigo-800 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant={feed.type}>{feed.type}</Badge>
          <Badge variant={feed.status}>{feed.status}</Badge>
          {feed.isPinned && <Badge variant="reminder">Pinned</Badge>}
        </div>
        <h3 className="line-clamp-1 text-base font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h3>
        {excerpt && (
          <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
            {excerpt}
          </p>
        )}
        <p className="mt-2 text-xs text-zinc-500">
          {showAuthor && feed.authorName && (
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {feed.authorName}
              {" · "}
            </span>
          )}
          {formatRelativeTime(feed.createdAt)}
          {feed.updatedAt && feed.updatedAt !== feed.createdAt
            ? ` · updated ${formatRelativeTime(feed.updatedAt)}`
            : ""}
          {" · "}
          {feed.likesCount ?? 0} likes · {feed.commentsCount ?? 0} comments
        </p>
      </div>
      <Link href={`/admin/posts/${feed._id}`} className={editLinkClass}>
        Edit
      </Link>
    </article>
  );
}
