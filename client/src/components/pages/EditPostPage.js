"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getFeedById } from "@/lib/api";
import { isAdmin } from "@/lib/roles";
import FeedForm from "@/components/feed/FeedForm";
import Alert from "@/components/common/Alert";
import Spinner from "@/components/common/Spinner";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const feedId = params.feedId;
  const adminView = isAdmin(user);

  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!feedId) return;
    setLoading(true);
    setError(null);
    getFeedById(feedId)
      .then((res) => setFeed(res.data))
      .catch((err) => setError(err.message || "Failed to load post"))
      .finally(() => setLoading(false));
  }, [feedId]);

  return (
    <>
      <header className="mb-6">
        <Link
          href="/admin/posts"
          className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Back to {adminView ? "all posts" : "my posts"}
        </Link>
        <h1 className="mt-3 text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-50">
          Edit post
        </h1>
        {feed?.title && (
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {feed.title}
          </p>
        )}
      </header>

      {loading && (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Spinner label="Loading post..." />
        </div>
      )}

      {error && !loading && (
        <Alert variant="error">{error}</Alert>
      )}

      {!loading && feed && adminView && user?._id && String(feed.authorId) !== String(user._id) && (
        <Alert variant="info" className="mb-4">
          Editing <strong>{feed.authorName || "another coach"}</strong>&apos;s post.
          The original author will stay credited on the public feed.
        </Alert>
      )}

      {!loading && feed && (
        <FeedForm
          key={feed._id}
          feedId={feed._id}
          defaultValues={feed}
          cancelHref="/admin/posts"
          onSuccess={() => {
            router.push("/admin/posts");
          }}
        />
      )}
    </>
  );
}
