const {
  getNotificationsByUserService,
  markNotificationReadService,
  markAllNotificationsReadService,
} = require("../services/notification.service");
const { emitIo } = require("../utils/socket");
const { isValidObjectId } = require("../utils/validate");

const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    const notifications = await getNotificationsByUserService(userId);
    return res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid notification id" });
    }

    const notification = await markNotificationReadService(id, userId);
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    emitIo(req, "notification:read", notification);
    return res.status(200).json({ success: true, data: notification });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    await markAllNotificationsReadService(userId);
    emitIo(req, "notification:all-read", { userId });

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead };
