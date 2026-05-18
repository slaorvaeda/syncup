const express = require("express");
const { toggleLike } = require("../controllers/like.controller");
const { authenticate } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router.post("/", authenticate, toggleLike);

module.exports = router;
