export default function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-zinc-200/80 dark:bg-zinc-800/80 ${className}`}
      aria-hidden="true"
    />
  );
}
