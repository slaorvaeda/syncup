"use client";

import Modal from "@/components/common/Modal";
import FeedDetailView from "@/components/feed/FeedDetailView";

export default function FeedDetailModal({
  feed,
  open,
  onClose,
  onFeedUpdate,
  readOnly = false,
}) {
  if (!feed) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={feed.title || "Feed details"}
    >
      <FeedDetailView
        feed={feed}
        onFeedUpdate={onFeedUpdate}
        readOnly={readOnly}
      />
    </Modal>
  );
}
