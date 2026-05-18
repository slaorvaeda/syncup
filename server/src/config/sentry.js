const Sentry = require("@sentry/node");
const logger = require("./logger");

function initSentry() {
  if (!process.env.SENTRY_DSN) {
    logger.info("Sentry disabled (SENTRY_DSN not set)");
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0.1),
  });

  logger.info("Sentry initialized");
}

module.exports = { initSentry, Sentry };
