const Leave = require("../models/Leave");
const Employee = require("../models/Employee");

// Get leave requests
const getLeaves = async (req, res) => {
  try {
    let query = {};

    // Employees can only see their own leaves
    if (req.user.role === "employee") {
      if (!req.user.employee) {
        return res.status(400).json({
          success: false,
          message: "Employee account is not linked to an employee record",
        });
      }

      query.employee = req.user.employee;
    }

    const leaves = await Leave.find(query)
      .populate(
        "employee",
        "employeeId firstName lastName department designation",
      )
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    console.error("Get leaves error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch leave requests",
      error: error.message,
    });
  }
};
// Create leave request
const createLeave = async (req, res) => {
  try {
    let { employeeId, leaveType, startDate, endDate, reason } = req.body;

    // Employees can only create leave for themselves
    if (req.user.role === "employee") {
      if (!req.user.employee) {
        return res.status(400).json({
          success: false,
          message: "Employee account is not linked to an employee record",
        });
      }

      employeeId = req.user.employee.toString();
    }

    if (!employeeId || !leaveType || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Employee, leave type, start date and end date are required",
      });
    }

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid leave dates",
      });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date",
      });
    }

    // Inclusive day count
    const millisecondsPerDay = 24 * 60 * 60 * 1000;

    const days = Math.floor((end - start) / millisecondsPerDay) + 1;

    // Prevent overlapping pending/approved leave
    const overlappingLeave = await Leave.findOne({
      employee: employeeId,
      status: {
        $in: ["pending", "approved"],
      },
      startDate: {
        $lte: end,
      },
      endDate: {
        $gte: start,
      },
    });

    if (overlappingLeave) {
      return res.status(409).json({
        success: false,
        message:
          "Employee already has a pending or approved leave during this period",
      });
    }

    const leave = await Leave.create({
      employee: employeeId,
      leaveType,
      startDate: start,
      endDate: end,
      days,
      reason: reason || "",
      status: "pending",
    });

    await leave.populate(
      "employee",
      "employeeId firstName lastName department designation",
    );

    res.status(201).json({
      success: true,
      message: "Leave request created successfully",
      leave,
    });
  } catch (error) {
    console.error("Create leave error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create leave request",
      error: error.message,
    });
  }
};

// Approve leave
const approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewComment } = req.body;

    const leave = await Leave.findById(id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    if (leave.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending leave requests can be approved",
      });
    }

    leave.status = "approved";
    leave.reviewedBy = req.user.userId;
    leave.reviewedAt = new Date();
    leave.reviewComment = reviewComment || "";

    await leave.save();

    await leave.populate(
      "employee",
      "employeeId firstName lastName department designation",
    );

    res.json({
      success: true,
      message: "Leave request approved",
      leave,
    });
  } catch (error) {
    console.error("Approve leave error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to approve leave request",
      error: error.message,
    });
  }
};

// Reject leave
const rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewComment } = req.body;

    const leave = await Leave.findById(id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    if (leave.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending leave requests can be rejected",
      });
    }

    leave.status = "rejected";
    leave.reviewedBy = req.user.userId;
    leave.reviewedAt = new Date();
    leave.reviewComment = reviewComment || "";

    await leave.save();

    await leave.populate(
      "employee",
      "employeeId firstName lastName department designation",
    );

    res.json({
      success: true,
      message: "Leave request rejected",
      leave,
    });
  } catch (error) {
    console.error("Reject leave error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to reject leave request",
      error: error.message,
    });
  }
};

module.exports = {
  getLeaves,
  createLeave,
  approveLeave,
  rejectLeave,
};
