const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    workStartTime: {
      type: String,
      default: "09:00",
    },

    lateAfterMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Settings", settingsSchema);