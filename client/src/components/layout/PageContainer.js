export default function PageContainer({ children, className = "" }) {
  return (
    <main
      className={`mx-auto w-full min-w-0 max-w-3xl flex-1 px-3 py-6 sm:px-6 sm:py-8 ${className}`}
    >
      {children}
    </main>
  );
}
