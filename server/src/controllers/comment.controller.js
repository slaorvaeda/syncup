const {
  getCommentsByFeedService,
  createCommentService,
} = require("../services/comment.service");
const {
  notifyUserService,
} = require("../services/notification.service");
const { clearFeedCache } = require("../services/cache.service");
const { emitIo } = require("../utils/socket");
const { isValidObjectId } = require("../utils/validate");

const getComments = async (req, res) => {
  try {
    const { feedId } = req.params;
    if (!isValidObjectId(feedId)) {
      return res.status(400).json({ success: false, message: "Invalid feed id" });
    }

    const comments = await getCommentsByFeedService(feedId);
    return res.status(200).json({ success: true, data: comments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const createComment = async (req, res) => {
  try {
    const { feedId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    if (!isValidObjectId(feedId)) {
      return res.status(400).json({ success: false, message: "Invalid feed id" });
    }

    if (!text?.trim()) {
      return res.status(400).json({ success: false, message: "text is required" });
    }

    const { comment, feed } = await createCommentService({ feedId, userId, text });
    await clearFeedCache();

    if (feed.authorId && String(feed.authorId) !== String(userId)) {
      const notification = await notifyUserService({
        userId: feed.authorId,
        feedId: feed._id,
        commentId: comment._id,
        type: "comment",
        message: "Someone commented on your post",
      });
      emitIo(req, "notification:new", notification);
    }

    emitIo(req, "comment:new", { feedId, comment });

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: comment,
    });
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { getComments, createComment };
