const User = require("../models/User");

const getUsersService = async () => {
  return User.find({ isActive: true }).select("-password").sort({ createdAt: -1 }).lean();
};

const getUserByIdService = async (userId) => {
  return User.findOne({ _id: userId, isActive: true }).select("-password").lean();
};

module.exports = {
  getUsersService,
  getUserByIdService,
};
