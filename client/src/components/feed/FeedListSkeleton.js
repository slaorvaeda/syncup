import FeedCardSkeleton from "@/components/feed/FeedCardSkeleton";

export default function FeedListSkeleton({ count = 4 }) {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading feeds">
      {Array.from({ length: count }).map((_, i) => (
        <FeedCardSkeleton key={i} />
      ))}
    </div>
  );
}
