const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    feedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feed",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

likeSchema.index({ feedId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Like", likeSchema);
