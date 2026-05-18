"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { useFeeds } from "@/hooks/useFeeds";
import PageContainer from "@/components/layout/PageContainer";
import FeedGrid from "@/components/feed/FeedGrid";
import SocketStatusBanner from "@/components/common/SocketStatusBanner";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const { onFeedNew, onCommentNew, onReconnect } = useSocket();
  const {
    feeds,
    loading,
    loadingMore,
    error,
    pagination,
    prependFeed,
    updateFeed,
    loadMore,
    refresh,
  } = useFeeds();

  useEffect(() => {
    const unsubFeed = onFeedNew((feed) => prependFeed(feed));
    const unsubComment = onCommentNew(({ feedId }) => {
      updateFeed(feedId, (f) => ({
        commentsCount: (f.commentsCount ?? 0) + 1,
      }));
    });
    return () => {
      unsubFeed();
      unsubComment();
    };
  }, [onFeedNew, onCommentNew, prependFeed, updateFeed]);

  useEffect(() => {
    return onReconnect(() => refresh());
  }, [onReconnect, refresh]);

  return (
    <PageContainer className="max-w-6xl">
        <SocketStatusBanner onRetry={refresh} />

        <section className="mb-6 sm:mb-8">
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-50">
            Coaching feed
          </h1>
        </section>

        <FeedGrid
          feeds={feeds}
          loading={loading}
          loadingMore={loadingMore}
          error={error}
          pagination={pagination}
          onLoadMore={loadMore}
          onRetry={refresh}
          onFeedUpdate={updateFeed}
          readOnly={!isAuthenticated}
        />
    </PageContainer>
  );
}
