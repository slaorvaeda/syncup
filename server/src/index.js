require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDb = require("./config/db");
const connectRedis = require("./config/redis");
const socketInit = require("./socket");
const logger = require("./config/logger");
const { initSentry } = require("./config/sentry");
const { initCloudinary } = require("./config/cloudinary");

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    initSentry();
    initCloudinary();
    await connectDb();
    await connectRedis();

    const server = http.createServer(app);
    const io = socketInit(server);
    app.set("io", io);

    server.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server", { error: error.message, stack: error.stack });
    process.exit(1);
  }
}

start();
