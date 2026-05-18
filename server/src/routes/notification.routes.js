const express = require("express");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notification.controller");
const { authenticate, ownUserOrAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/user/:userId", authenticate, ownUserOrAdmin, getNotifications);
router.patch("/:id/read", authenticate, markAsRead);
router.patch("/user/:userId/read-all", authenticate, ownUserOrAdmin, markAllAsRead);

module.exports = router;
