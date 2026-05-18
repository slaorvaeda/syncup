const {
  getFeedService,
  getStaffFeedsService,
  getFeedByIdService,
  updateFeedService,
  createFeedService,
  canManageFeed,
} = require("../services/feed.service");
const { getFeedCache, setFeedCache, clearFeedCache } = require("../services/cache.service");
const { notifyFeedAudienceService } = require("../services/notification.service");
const { emitIo } = require("../utils/socket");
const { parsePagination } = require("../utils/pagination");
const { isValidObjectId } = require("../utils/validate");

const getFeeds = async (req, res) => {
  const { page, limit } = parsePagination(req.query);

  let result = await getFeedCache(page, limit);

  if (!result) {
    result = await getFeedService({ page, limit });
    await setFeedCache(page, limit, result);
  }

  return res.status(200).json({
    success: true,
    message: "Feeds fetched successfully",
    data: result.feeds,
    pagination: result.pagination,
  });
};

const getMyFeeds = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const result = await getStaffFeedsService({
    user: req.user,
    page,
    limit,
  });

  const isAdmin = req.user.role === "admin";

  return res.status(200).json({
    success: true,
    message: isAdmin
      ? "All feeds fetched successfully"
      : "Your feeds fetched successfully",
    data: result.feeds,
    pagination: result.pagination,
    scope: isAdmin ? "all" : "mine",
  });
};

const getFeedById = async (req, res) => {
  const { feedId } = req.params;

  if (!isValidObjectId(feedId)) {
    return res.status(400).json({ success: false, message: "Invalid feed id" });
  }

  const feed = await getFeedByIdService(feedId);

  if (!canManageFeed(feed, req.user)) {
    return res.status(403).json({
      success: false,
      message: "You do not have permission to view this post",
    });
  }

  return res.status(200).json({
    success: true,
    data: feed,
  });
};

const createFeed = async (req, res) => {
  const newFeed = await createFeedService({
    ...req.body,
    authorId: req.user._id,
    authorName: req.user.name,
    authorAvatar: req.user.avatar,
  });

  await clearFeedCache();
  await notifyFeedAudienceService(newFeed);

  emitIo(req, "feed:new", newFeed);

  return res.status(201).json({
    success: true,
    message: "Feed created successfully",
    data: newFeed,
  });
};

const updateFeed = async (req, res) => {
  const { feedId } = req.params;

  if (!isValidObjectId(feedId)) {
    return res.status(400).json({ success: false, message: "Invalid feed id" });
  }

  try {
    const updated = await updateFeedService(feedId, req.user, req.body);
    await clearFeedCache();

    emitIo(req, "feed:updated", updated);

    return res.status(200).json({
      success: true,
      message: "Feed updated successfully",
      data: updated,
    });
  } catch (error) {
    if (error.status === 403 || error.status === 404) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }
    throw error;
  }
};

module.exports = {
  getFeeds,
  getMyFeeds,
  getFeedById,
  createFeed,
  updateFeed,
};
