const mongoose = require("mongoose");

const { Schema } = mongoose;

const pollSchema = new Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    subject: {
      type: String,
      required: true,
    },
    left: {
      type: Number,
      default: 0,
    },
    right: {
      type: Number,
      default: 0,
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "polls",
  }
);

module.exports = mongoose.model("Poll", pollSchema);
