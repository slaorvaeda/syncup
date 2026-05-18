const { toggleLikeService } = require("../services/like.service");
const Feed = require("../models/Feed");
const { notifyUserService } = require("../services/notification.service");
const { clearFeedCache } = require("../services/cache.service");
const { emitIo } = require("../utils/socket");
const { isValidObjectId } = require("../utils/validate");

const toggleLike = async (req, res) => {
  try {
    const { feedId } = req.params;
    const userId = req.user._id;

    if (!isValidObjectId(feedId)) {
      return res.status(400).json({ success: false, message: "Invalid feed id" });
    }

    const result = await toggleLikeService({ feedId, userId });
    const feed = await Feed.findById(feedId).lean();
    await clearFeedCache();

    if (
      result.liked &&
      feed?.authorId &&
      String(feed.authorId) !== String(userId)
    ) {
      const notification = await notifyUserService({
        userId: feed.authorId,
        feedId: feed._id,
        type: "like",
        message: "Someone liked your post",
      });
      emitIo(req, "notification:new", notification);
    }

    emitIo(req, "like:updated", {
      feedId,
      likesCount: feed?.likesCount ?? 0,
      liked: result.liked,
    });

    return res.status(200).json({
      success: true,
      message: result.liked ? "Feed liked" : "Feed unliked",
      data: { ...result, likesCount: feed?.likesCount ?? 0 },
    });
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { toggleLike };
