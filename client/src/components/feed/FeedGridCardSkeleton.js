import Skeleton from "@/components/common/Skeleton";

export default function FeedGridCardSkeleton() {
  return (
    <article className="feed-card relative flex w-full min-w-0 max-w-full flex-col p-4 pt-5 sm:p-5 sm:pt-6">
      <div className="feed-card-notch absolute top-0 right-0 flex items-center justify-center">
        <Skeleton className="h-10 w-10 rounded-full sm:h-11 sm:w-11" />
      </div>
      <div className="feed-card-body flex flex-1 flex-col">
        <Skeleton className="feed-card-media mb-0 w-full rounded-xl sm:rounded-2xl" />
        <div className="mt-3 flex min-w-0 flex-col gap-0.5">
          <Skeleton className="h-4 w-full sm:h-5" />
          <Skeleton className="h-4 w-4/5 sm:h-5" />
          <div
            className="space-y-1"
            style={{ minHeight: "var(--feed-card-excerpt-min-h)" }}
          >
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-5/6" />
          </div>
        </div>
        <div
          className="mt-2"
          style={{ minHeight: "var(--feed-card-tags-min-h)" }}
        />
      </div>
      <div className="mt-3 space-y-1.5 sm:mt-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </article>
  );
}
