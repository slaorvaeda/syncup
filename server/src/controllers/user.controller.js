const {
  getUsersService,
  getUserByIdService,
} = require("../services/user.service");
const { isValidObjectId } = require("../utils/validate");

const getUsers = async (req, res) => {
  try {
    const users = await getUsersService();
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    if (req.user.role !== "admin" && String(req.user._id) !== String(id)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: cannot view another user's profile",
      });
    }

    const user = await getUserByIdService(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { getUsers, getUserById };
