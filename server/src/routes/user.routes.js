const express = require("express");
const { getUsers, getUserById } = require("../controllers/user.controller");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", authenticate, authorize("admin"), getUsers);
router.get("/:id", authenticate, getUserById);

module.exports = router;
