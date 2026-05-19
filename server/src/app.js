const express = require("express");
const authRoutes = require("./routes/auth.routes");
const feedRoutes = require("./routes/feed.routes");
const userRoutes = require("./routes/user.routes");
const notificationRoutes = require("./routes/notification.routes");
const uploadRoutes = require("./routes/upload.routes");
const errorHandler = require("./middleware/errorHandler");
const requestLogger = require("./middleware/requestLogger");
const { getHealth } = require("./controllers/health.controller");
const cors = require("cors");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowVercelPreviews = process.env.CORS_ALLOW_VERCEL !== "false";
const vercelOriginPattern = /^https:\/\/[\w-]+(\.[\w-]+)*\.vercel\.app$/;

function corsOrigin(origin, callback) {
  if (!origin) return callback(null, true);
  if (allowedOrigins.includes(origin)) return callback(null, true);
  if (allowVercelPreviews && vercelOriginPattern.test(origin)) {
    return callback(null, true);
  }
  callback(null, false);
}

app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: corsOrigin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.get("/health", getHealth);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/feed", feedRoutes);
app.use("/notifications", notificationRoutes);
app.use("/upload", uploadRoutes);
app.use(errorHandler);

module.exports = app;
