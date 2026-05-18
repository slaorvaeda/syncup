import FeedGridCardSkeleton from "@/components/feed/FeedGridCardSkeleton";

export default function FeedGridSkeleton({ count = 6 }) {
  return (
    <div
      className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 [&>*]:min-w-0"
      aria-busy="true"
      aria-label="Loading feeds"
    >
      {Array.from({ length: count }).map((_, i) => (
        <FeedGridCardSkeleton key={i} />
      ))}
    </div>
  );
}
