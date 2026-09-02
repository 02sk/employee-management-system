const express = require("express");

const {
  getLeaves,
  createLeave,
  approveLeave,
  rejectLeave,
} = require("../controllers/leaveController");

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getLeaves);

router.post("/", authMiddleware, createLeave);

// Only Admin and HR can approve/reject leaves
router.put(
  "/:id/approve",
  authMiddleware,
  authorize("admin", "hr"),
  approveLeave
);

router.put(
  "/:id/reject",
  authMiddleware,
  authorize("admin", "hr"),
  rejectLeave
);

module.exports = router;