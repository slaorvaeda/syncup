const Comment = require("../models/Comment");
const Feed = require("../models/Feed");

const getCommentsByFeedService = async (feedId) => {
  return Comment.find({ feedId, deletedAt: null })
    .populate("userId", "name email avatar role")
    .sort({ createdAt: -1 })
    .lean();
};

const createCommentService = async ({ feedId, userId, text }) => {
  const feed = await Feed.findOne({ _id: feedId, deletedAt: null });
  if (!feed) {
    const error = new Error("Feed not found");
    error.status = 404;
    throw error;
  }

  const comment = await Comment.create({
    feedId,
    userId,
    text: text.trim(),
    createdBy: userId,
  });

  await Feed.findByIdAndUpdate(feedId, { $inc: { commentsCount: 1 } });

  return { comment, feed };
};

module.exports = {
  getCommentsByFeedService,
  createCommentService,
};
