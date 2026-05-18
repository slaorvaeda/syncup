const mongoose = require("mongoose");
const { getRedis } = require("../config/redis");

const getHealth = async (req, res) => {
  const mongoStates = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  let redisStatus = "disconnected";
  let redisLatencyMs = null;

  try {
    const redis = getRedis();
    const start = Date.now();
    await redis.ping();
    redisLatencyMs = Date.now() - start;
    redisStatus = "connected";
  } catch {
    redisStatus = "error";
  }

  const mongoReady = mongoose.connection.readyState;
  const isHealthy = mongoReady === 1 && redisStatus === "connected";

  return res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    message: isHealthy ? "Server is healthy" : "Server is degraded",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    metrics: {
      mongodb: {
        status: mongoStates[mongoReady] || "unknown",
        readyState: mongoReady,
      },
      redis: {
        status: redisStatus,
        latencyMs: redisLatencyMs,
      },
      memory: {
        rss: process.memoryUsage().rss,
        heapUsed: process.memoryUsage().heapUsed,
      },
    },
  });
};

module.exports = { getHealth };
