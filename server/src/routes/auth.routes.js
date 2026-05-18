const express = require("express");
const { register, login, getMe } = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { loginLimiter, registerLimiter } = require("../middleware/rateLimiter");
const { registerSchema, loginSchema } = require("../validators/auth.validator");

const router = express.Router();

router.post("/register", registerLimiter, validate(registerSchema), register);
router.post("/login", loginLimiter, validate(loginSchema), login);
router.get("/me", authenticate, getMe);

module.exports = router;
