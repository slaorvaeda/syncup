import PublicHeader from "@/components/layout/PublicHeader";

export default function PublicLayout({ children }) {
  return (
    <div className="flex min-h-full flex-col overflow-x-hidden">
      <PublicHeader />
      {children}
    </div>
  );
}
