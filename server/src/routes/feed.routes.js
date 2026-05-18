const express = require("express");
const {
  getFeeds,
  getMyFeeds,
  getFeedById,
  createFeed,
  updateFeed,
} = require("../controllers/feed.controller");
const commentRoutes = require("./comment.routes");
const likeRoutes = require("./like.routes");
const { authenticate, authorize } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const {
  createFeedSchema,
  updateFeedSchema,
  feedQuerySchema,
} = require("../validators/feed.validator");

const router = express.Router();

router.get("/", validate(feedQuerySchema, "query"), getFeeds);

router.get(
  "/mine",
  authenticate,
  authorize("coach", "admin"),
  validate(feedQuerySchema, "query"),
  getMyFeeds
);

router.post(
  "/",
  authenticate,
  authorize("coach", "admin"),
  validate(createFeedSchema),
  createFeed
);

router.get(
  "/:feedId",
  authenticate,
  authorize("coach", "admin"),
  getFeedById
);

router.patch(
  "/:feedId",
  authenticate,
  authorize("coach", "admin"),
  validate(updateFeedSchema),
  updateFeed
);

router.use("/:feedId/comments", commentRoutes);
router.use("/:feedId/like", likeRoutes);

module.exports = router;
