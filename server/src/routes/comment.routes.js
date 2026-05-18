const express = require("express");
const { getComments, createComment } = require("../controllers/comment.controller");
const { authenticate } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router.get("/", getComments);
router.post("/", authenticate, createComment);

module.exports = router;
