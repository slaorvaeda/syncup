export default function Select({
  label,
  error,
  id,
  options = [],
  className = "",
  ...props
}) {
  const selectId = id || props.name;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`h-11 rounded-xl border bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:bg-zinc-950 dark:text-zinc-100 ${
          error
            ? "border-red-400"
            : "border-zinc-300 dark:border-zinc-700"
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

