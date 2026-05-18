const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { HttpError } = require("../utils/httpError");

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const sanitizeUser = (user) => {
  const { password, ...safeUser } =
    typeof user.toObject === "function" ? user.toObject() : user;
  return safeUser;
};

const registerService = async ({
  name,
  email,
  password,
  role,
  avatar,
  programId,
  cohortId,
}) => {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new HttpError("Email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "student",
    avatar,
    programId,
    cohortId,
  });

  const token = signToken(user._id);
  return { user: sanitizeUser(user), token };
};

const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  if (!user || !user.isActive) {
    throw new HttpError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new HttpError("Invalid email or password", 401);
  }

  const token = signToken(user._id);
  return { user: sanitizeUser(user), token };
};

module.exports = { registerService, loginService, signToken, sanitizeUser };
