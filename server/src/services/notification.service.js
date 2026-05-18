const Notification = require("../models/Notification");
const User = require("../models/User");

const getNotificationsByUserService = async (userId) => {
  return Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
};

const markNotificationReadService = async (notificationId, userId) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { read: true },
    { new: true }
  ).lean();
};

const markAllNotificationsReadService = async (userId) => {
  await Notification.updateMany({ userId, read: false }, { read: true });
  return { success: true };
};

const createNotificationService = async ({
  userId,
  feedId,
  commentId,
  type,
  message,
}) => {
  return Notification.create({
    userId,
    feedId,
    commentId,
    type,
    message,
    read: false,
  });
};

const notifyFeedAudienceService = async (feed) => {
  if (feed.visibility === "private") {
    return [];
  }

  const query = { isActive: true, role: "student" };

  if (feed.visibility === "team" && feed.cohortId) {
    query.cohortId = feed.cohortId;
  } else if (feed.programId) {
    query.programId = feed.programId;
  }

  const users = await User.find(query).select("_id").lean();
  if (!users.length) {
    return [];
  }

  const notifications = users.map((user) => ({
    userId: user._id,
    feedId: feed._id,
    type: "feed_new",
    message: `New post by ${feed.authorName}`,
    read: false,
  }));

  return Notification.insertMany(notifications);
};

const notifyUserService = async (payload) => {
  return createNotificationService(payload);
};

module.exports = {
  getNotificationsByUserService,
  markNotificationReadService,
  markAllNotificationsReadService,
  createNotificationService,
  notifyFeedAudienceService,
  notifyUserService,
};
