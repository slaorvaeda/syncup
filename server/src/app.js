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

app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"],
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
