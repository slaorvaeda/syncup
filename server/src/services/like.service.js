const Like = require("../models/Like");
const Feed = require("../models/Feed");

const toggleLikeService = async ({ feedId, userId }) => {
  const feed = await Feed.findOne({ _id: feedId, deletedAt: null });
  if (!feed) {
    const error = new Error("Feed not found");
    error.status = 404;
    throw error;
  }

  const existing = await Like.findOne({ feedId, userId });

  if (existing) {
    await Like.deleteOne({ _id: existing._id });
    await Feed.findByIdAndUpdate(feedId, { $inc: { likesCount: -1 } });
    return { liked: false, feedId };
  }

  await Like.create({ feedId, userId });
  await Feed.findByIdAndUpdate(feedId, { $inc: { likesCount: 1 } });
  return { liked: true, feedId };
};

module.exports = { toggleLikeService };
