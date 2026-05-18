const { registerService, loginService } = require("../services/auth.service");
const logger = require("../config/logger");

const register = async (req, res, next) => {
  try {
    const { user, token } = await registerService(req.body);

    logger.info("User registered", { userId: user._id, email: user.email });

    return res.status(201).json({
      success: true,
      message: "Registered successfully",
      data: { user, token },
    });
  } catch (error) {
    if (error.status === 409) {
      return res.status(409).json({ success: false, message: error.message });
    }
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, token } = await loginService(req.body);

    logger.info("User logged in", { userId: user._id, email: user.email });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: { user, token },
    });
  } catch (error) {
    if (error.status === 401) {
      return res.status(401).json({ success: false, message: error.message });
    }
    return next(error);
  }
};

const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
};

module.exports = { register, login, getMe };
