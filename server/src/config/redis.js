const { Redis } = require("ioredis");
require("dotenv").config();

let client;

function getRedis() {
  if (!client) {
    client = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");
    const logger = require("./logger");
    client.on("connect", () => logger.info("Connected to Redis"));
    client.on("error", (err) => logger.error("Redis error", { error: err.message }));
  }
  return client;
}

async function connectRedis() {
  const redis = getRedis();
  await redis.ping();
  return redis;
}

module.exports = connectRedis;
module.exports.getRedis = getRedis;
