const variants = {
  tip: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
  announcement:
    "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200",
  reminder:
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  live: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  published:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  draft: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  archived: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
  default: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

export default function Badge({ children, variant = "default", className = "" }) {
  const style = variants[variant] || variants.default;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${style} ${className}`}
    >
      {children}
    </span>
  );
}
