import { formatRelativeTime, getInitials } from "@/lib/format";

export default function CommentItem({ comment }) {
  const author = comment.userId;
  const name =
    typeof author === "object" ? author?.name : comment.createdBy?.name || "User";

  return (
    <li className="flex gap-3 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
        {getInitials(name)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {name}
          </span>
          <span className="text-xs text-zinc-500">
            {formatRelativeTime(comment.createdAt)}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-zinc-700 dark:text-zinc-300">
          {comment.text}
        </p>
      </div>
    </li>
  );
}
