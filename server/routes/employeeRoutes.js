const express = require("express");

const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  createEmployeeAccount,
  deleteEmployee,
  updateEmployee,
} = require("../controllers/employeeController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("admin", "hr"),
  getEmployees
);

router.post(
  "/",
  protect,
  authorize("admin", "hr"),
  createEmployee
);

// Employee login account
router.post(
  "/:id/account",
  protect,
  authorize("admin", "hr"),
  createEmployeeAccount
);

router.get(
  "/:id",
  protect,
  authorize("admin", "hr"),
  getEmployeeById
);

router.put(
  "/:id",
  protect,
  authorize("admin", "hr"),
  updateEmployee
);

router.delete(
  "/:id",
  protect,
  authorize("admin", "hr"),
  deleteEmployee
);

module.exports = router;