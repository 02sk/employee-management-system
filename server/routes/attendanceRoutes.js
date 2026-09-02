const express = require("express");

const {
  getAttendance,
  checkIn,
  checkOut,
} = require("../controllers/attendanceController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getAttendance);

router.post("/check-in", authMiddleware, checkIn);

router.post("/check-out", authMiddleware, checkOut);

module.exports = router;