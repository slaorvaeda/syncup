export default function Checkbox({ label, checked, onChange, id, className = "" }) {
  const inputId = id || label?.replace(/\s+/g, "-").toLowerCase();

  return (
    <label
      htmlFor={inputId}
      className={`flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 ${className}`}
    >
      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
      />
      {label}
    </label>
  );
}
