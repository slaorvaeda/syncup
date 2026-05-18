const mongoose = require("mongoose");
const logger = require("./logger");
require("dotenv").config();

const connectDb = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/sync_up"
    );
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("MongoDB connection failed", { error: error.message });
    process.exit(1);
  }
};

module.exports = connectDb;