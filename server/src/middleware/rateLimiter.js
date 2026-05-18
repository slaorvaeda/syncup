const rateLimit = /** @type {import("express-rate-limit").rateLimit} */ (
  require("express-rate-limit").rateLimit
);

const skipInDev = () =>
  process.env.NODE_ENV !== "production" &&
  process.env.DISABLE_AUTH_RATE_LIMIT !== "false";

const loginLimiter = rateLimit({
  windowMs: Number(process.env.LOGIN_RATE_WINDOW_MS || 15 * 60 * 1000),
  max: Number(process.env.LOGIN_RATE_MAX || 5),
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInDev,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

const registerLimiter = rateLimit({
  windowMs: Number(process.env.REGISTER_RATE_WINDOW_MS || 60 * 60 * 1000),
  max: Number(process.env.REGISTER_RATE_MAX || 10),
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInDev,
  message: {
    success: false,
    message: "Too many registration attempts. Please try again later.",
  },
});

module.exports = { loginLimiter, registerLimiter };
