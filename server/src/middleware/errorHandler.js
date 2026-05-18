const { ZodError } = require("zod");
const logger = require("../config/logger");
const { Sentry } = require("../config/sentry");
const { formatZodErrors } = require("./validate");

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: formatZodErrors(err),
    });
  }

  const status = err.status || err.statusCode || 500;
  const message =
    status >= 500 ? "Internal server error" : err.message || "Request failed";

  logger.error("Request error", {
    method: req.method,
    url: req.originalUrl,
    status,
    message: err.message,
    stack: err.stack,
  });

  if (status >= 500 && process.env.SENTRY_DSN) {
    Sentry.captureException(err);
  }

  return res.status(status).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
