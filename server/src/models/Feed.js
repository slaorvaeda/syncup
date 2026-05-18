const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    name: { type: String, default: "" },
    type: { type: String, default: "file" },
  },
  { _id: false }
);

const feedSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: 2000,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 200,
      default: null,
    },
    type: {
      type: String,
      enum: ["tip", "announcement", "reminder"],
      default: "tip",
    },
    status: {
      type: String,
      enum: ["published", "draft", "archived"],
      default: "published",
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    authorName: {
      type: String,
      default: "Coach",
      trim: true,
    },
    authorAvatar: {
      type: String,
      default: null,
    },
    imageUrl: { type: String, default: null },
    attachments: {
      type: [attachmentSchema],
      default: [],
    },
    visibility: {
      type: String,
      enum: ["public", "team", "private"],
      default: "public",
    },
    programId: { type: String, default: null, index: true },
    cohortId: { type: String, default: null, index: true },
    scheduledAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
    likesCount: { type: Number, default: 0, min: 0 },
    commentsCount: { type: Number, default: 0, min: 0 },
    isPinned: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

feedSchema.index({ status: 1, deletedAt: 1, createdAt: -1 });
feedSchema.index({ isPinned: -1, createdAt: -1 });

module.exports = mongoose.model("Feed", feedSchema);
