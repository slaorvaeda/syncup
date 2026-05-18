export default function Spinner({ label = "Loading...", className = "" }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-8 ${className}`}
      role="status"
    >
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      <span className="text-sm text-zinc-600 dark:text-zinc-400">{label}</span>
    </div>
  );
}
