const express = require("express");

const {
  getSettings,
  updateSettings,
} = require("../controllers/settingsController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getSettings);

router.put("/", authMiddleware, updateSettings);

module.exports = router;