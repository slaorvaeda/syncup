"use client";

import { useEffect, useState } from "react";
import { toggleLike } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/common/Button";
import { toast } from "@/lib/toast";
import { HeartIcon } from "@/components/common/icons";

export default function LikeButton({
  feedId,
  likesCount = 0,
  onUpdate,
  readOnly = false,
}) {
  const { isAuthenticated } = useAuth();
  const canLike = !readOnly && isAuthenticated;
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(likesCount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCount(likesCount);
  }, [likesCount]);

  const handleToggle = async () => {
    if (!canLike) return;
    setLoading(true);
    setError(null);
    try {
      const res = await toggleLike(feedId);
      setLiked(res.data.liked);
      setCount(res.data.likesCount);
      onUpdate?.({ likesCount: res.data.likesCount });
    } catch (err) {
      const message = err.message || "Could not update like";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!canLike) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-zinc-500">
        <HeartIcon className="h-4 w-4" />
        {count}
      </span>
    );
  }

  return (
    <div className="inline-flex flex-col gap-0.5">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        loading={loading}
        onClick={handleToggle}
        className={`inline-flex !h-8 items-center gap-1.5 !px-2 ${liked ? "text-rose-600" : "text-zinc-600"}`}
      >
        <HeartIcon className="h-4 w-4" filled={liked} />
        {count}
      </Button>
      {error && <span className="text-xs text-rose-600">{error}</span>}
    </div>
  );
}
