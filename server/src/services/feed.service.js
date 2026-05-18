const Feed = require("../models/Feed");
const User = require("../models/User");
const { HttpError } = require("../utils/httpError");

/** @returns {Record<string, unknown>} */
const publishedFeedFilter = () => ({
  status: "published",
  deletedAt: null,
  $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
  $and: [
    {
      $or: [{ scheduledAt: null }, { scheduledAt: { $lte: new Date() } }],
    },
  ],
});

const getFeedService = async ({ page = 1, limit = 10 }) => {
  const filter = publishedFeedFilter();
  const skip = (page - 1) * limit;

  const [feeds, total] = await Promise.all([
    Feed.find(filter)
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Feed.countDocuments(filter),
  ]);

  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  return {
    feeds,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

const resolveAuthor = async (authorId, fallback = {}) => {
  if (!authorId) {
    return {
      authorName: fallback.authorName || "Coach",
      authorAvatar: fallback.authorAvatar || null,
    };
  }

  const user = await User.findById(authorId).lean();
  if (!user) {
    return {
      authorName: fallback.authorName || "Coach",
      authorAvatar: fallback.authorAvatar || null,
    };
  }

  return {
    authorId: user._id,
    authorName: user.name,
    authorAvatar: user.avatar,
    createdBy: user._id,
    updatedBy: user._id,
  };
};

const createFeedService = async (payload) => {
  const author = await resolveAuthor(payload.authorId, {
    authorName: payload.authorName,
    authorAvatar: payload.authorAvatar,
  });

  return Feed.create({
    message: payload.message.trim(),
    title: payload.title?.trim() || null,
    type: payload.type || "tip",
    status: payload.status || "published",
    ...author,
    imageUrl: payload.imageUrl || null,
    attachments: payload.attachments || [],
    visibility: payload.visibility || "public",
    programId: payload.programId || null,
    cohortId: payload.cohortId || null,
    scheduledAt: payload.scheduledAt || null,
    expiresAt: payload.expiresAt || null,
    isPinned: payload.isPinned || false,
    tags: payload.tags || [],
  });
};

const getMyFeedsService = async ({ authorId, page = 1, limit = 10 }) => {
  const filter = { authorId, deletedAt: null };
  const skip = (page - 1) * limit;

  const [feeds, total] = await Promise.all([
    Feed.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Feed.countDocuments(filter),
  ]);

  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  return {
    feeds,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

/** Coaches see their posts; admins see every post. */
const getStaffFeedsService = async ({ user, page = 1, limit = 10 }) => {
  if (user.role === "admin") {
    const filter = { deletedAt: null };
    const skip = (page - 1) * limit;

    const [feeds, total] = await Promise.all([
      Feed.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Feed.countDocuments(filter),
    ]);

    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    return {
      feeds,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  return getMyFeedsService({ authorId: user._id, page, limit });
};

const getFeedByIdService = async (feedId) => {
  const feed = await Feed.findOne({ _id: feedId, deletedAt: null }).lean();
  if (!feed) {
    throw new HttpError("Feed not found", 404);
  }
  return feed;
};

const canManageFeed = (feed, user) => {
  if (!feed || feed.deletedAt || !user) return false;
  if (user.role === "admin") return true;
  return (
    feed.authorId && String(feed.authorId) === String(user._id)
  );
};

const updateFeedService = async (feedId, user, payload) => {
  const feed = await Feed.findOne({ _id: feedId, deletedAt: null });
  if (!feed) {
    throw new HttpError("Feed not found", 404);
  }

  if (!canManageFeed(feed, user)) {
    throw new HttpError("You can only edit your own posts", 403);
  }

  const isOwner =
    feed.authorId && String(feed.authorId) === String(user._id);

  feed.message = payload.message.trim();
  feed.title = payload.title?.trim() || null;
  feed.type = payload.type || feed.type;
  feed.status = payload.status || feed.status;
  feed.imageUrl = payload.imageUrl ?? null;
  feed.attachments = payload.attachments ?? feed.attachments;
  feed.visibility = payload.visibility || feed.visibility;
  feed.programId = payload.programId || null;
  feed.cohortId = payload.cohortId || null;
  feed.scheduledAt = payload.scheduledAt ?? null;
  feed.expiresAt = payload.expiresAt ?? null;
  feed.isPinned = Boolean(payload.isPinned);
  feed.tags = payload.tags ?? [];
  feed.updatedBy = user._id;

  if (isOwner) {
    const author = await resolveAuthor(user._id, {
      authorName: user.name,
      authorAvatar: user.avatar,
    });
    feed.authorName = author.authorName;
    feed.authorAvatar = author.authorAvatar;
  }

  await feed.save();
  return feed.toObject();
};

module.exports = {
  getFeedService,
  getMyFeedsService,
  getStaffFeedsService,
  getFeedByIdService,
  updateFeedService,
  createFeedService,
  canManageFeed,
};
