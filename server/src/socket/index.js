const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const socketInit = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1];

      if (!token) {
        socket.data.user = null;
        socket.data.isGuest = true;
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user || !user.isActive) {
        return next(new Error("User not found or inactive"));
      }

      socket.data.user = user;
      socket.data.isGuest = false;
      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    if (socket.data.isGuest) {
      console.log("Guest connected (public feed listener)");
    } else {
      console.log(
        `User connected: ${socket.data?.user?.name} (${socket.data?.user?._id})`
      );
      socket.join(String(socket.data?.user?._id));
    }

    socket.on("disconnect", () => {
      if (socket.data.isGuest) {
        console.log("Guest disconnected");
      } else {
        console.log(`User disconnected: ${socket.data?.user?.name}`);
      }
    });
  });

  return io;
};

module.exports = socketInit;
