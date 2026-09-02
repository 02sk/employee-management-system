const Settings = require("../models/Settings");

const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Get settings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
      error: error.message,
    });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { workStartTime, lateAfterMinutes } = req.body;

    if (
      workStartTime !== undefined &&
      !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(workStartTime)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid work start time",
      });
    }

    if (
      lateAfterMinutes !== undefined &&
      (!Number.isInteger(lateAfterMinutes) ||
        lateAfterMinutes < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid late-after minutes",
      });
    }

    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings();
    }

    if (workStartTime !== undefined) {
      settings.workStartTime = workStartTime;
    }

    if (lateAfterMinutes !== undefined) {
      settings.lateAfterMinutes = lateAfterMinutes;
    }

    await settings.save();

    res.json({
      success: true,
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("Update settings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update settings",
      error: error.message,
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};