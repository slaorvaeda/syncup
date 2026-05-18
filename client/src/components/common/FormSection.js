export default function FormSection({
  title,
  description,
  children,
  className = "",
}) {
  return (
    <section
      className={`rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6 ${className}`}
    >
      {(title || description) && (
        <header className="mb-5 border-b border-zinc-100 pb-4 dark:border-zinc-800">
          {title && (
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          )}
        </header>
      )}
      <div className="space-y-4">{children}</div>
    </section>
  );
}
