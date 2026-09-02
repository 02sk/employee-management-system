const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");
const Settings = require("../models/Settings");

// Get attendance records
// Get attendance records
const getAttendance = async (req, res) => {
  try {
    const { date } = req.query;

    let selectedDate = new Date();

    if (date) {
      const [year, month, day] = date.split("-").map(Number);

      selectedDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    }

    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);

    // Employee: only get their own attendance
    if (req.user.role === "employee") {
      if (!req.user.employee) {
        return res.status(400).json({
          success: false,
          message: "Employee account is not linked to an employee record",
        });
      }

      const employee = await Employee.findById(req.user.employee).select(
        "employeeId firstName lastName department designation",
      );

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee record not found",
        });
      }

      const record = await Attendance.findOne({
        employee: employee._id,
        date: {
          $gte: start,
          $lte: end,
        },
      });

      const attendance = record
        ? {
            ...record.toObject(),
            employee,
          }
        : {
            _id: `pending-${employee._id}`,
            employee,
            date: start,
            checkIn: null,
            checkOut: null,
            status: "not-marked",
            notes: "",
          };

      return res.json({
        success: true,
        count: 1,
        attendance: [attendance],
      });
    }

    // Admin / HR: get all employees
    const employees = await Employee.find({
      status: { $ne: "deleted" },
    }).select("employeeId firstName lastName department designation");

    const attendanceRecords = await Attendance.find({
      date: {
        $gte: start,
        $lte: end,
      },
    });

    const attendanceMap = new Map();

    attendanceRecords.forEach((record) => {
      attendanceMap.set(record.employee.toString(), record);
    });

    const attendance = employees.map((employee) => {
      const record = attendanceMap.get(employee._id.toString());

      if (record) {
        return {
          ...record.toObject(),
          employee,
        };
      }

      return {
        _id: `pending-${employee._id}`,
        employee,
        date: start,
        checkIn: null,
        checkOut: null,
        status: "not-marked",
        notes: "",
      };
    });

    res.json({
      success: true,
      count: attendance.length,
      attendance,
    });
  } catch (error) {
    console.error("Get attendance error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
      error: error.message,
    });
  }
};

// Check in employee
const checkIn = async (req, res) => {
  try {
    if (req.user.role === "employee") {
      if (!req.user.employee) {
        return res.status(400).json({
          success: false,
          message: "Employee account is not linked to an employee record",
        });
      }

      if (req.body.employeeId !== req.user.employee.toString()) {
        return res.status(403).json({
          success: false,
          message: "You can only check in yourself",
        });
      }
    }
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const now = new Date();
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    const [workStartHour, workStartMinute] = settings.workStartTime
      .split(":")
      .map(Number);

    const workStart = new Date(now);

    workStart.setHours(workStartHour, workStartMinute, 0, 0);

    const lateThreshold = new Date(
      workStart.getTime() + settings.lateAfterMinutes * 60 * 1000,
    );

    const status = now > lateThreshold ? "late" : "present";

    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const existing = await Attendance.findOne({
      employee: employeeId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (existing?.checkIn) {
      return res.status(400).json({
        success: false,
        message: "Employee has already checked in today",
      });
    }

    let attendance;

    if (existing) {
      existing.checkIn = now;
      existing.status = status;

      attendance = await existing.save();
    } else {
      attendance = await Attendance.create({
        employee: employeeId,
        date: startOfDay,
        checkIn: now,
        status,
      });
    }

    await attendance.populate(
      "employee",
      "employeeId firstName lastName department designation",
    );

    res.status(201).json({
      success: true,
      message: "Employee checked in successfully",
      attendance,
    });
  } catch (error) {
    console.error("Check in error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to check in employee",
      error: error.message,
    });
  }
};

// Check out employee
const checkOut = async (req, res) => {
  try {
    if (req.user.role === "employee") {
      if (!req.user.employee) {
        return res.status(400).json({
          success: false,
          message: "Employee account is not linked to an employee record",
        });
      }

      if (req.body.employeeId !== req.user.employee.toString()) {
        return res.status(403).json({
          success: false,
          message: "You can only check out yourself",
        });
      }
    }
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    const now = new Date();

    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const attendance = await Attendance.findOne({
      employee: employeeId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Employee has not checked in today",
      });
    }

    if (!attendance.checkIn) {
      return res.status(400).json({
        success: false,
        message: "Employee has not checked in today",
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        message: "Employee has already checked out today",
      });
    }

    attendance.checkOut = now;

    await attendance.save();

    await attendance.populate(
      "employee",
      "employeeId firstName lastName department designation",
    );

    res.json({
      success: true,
      message: "Employee checked out successfully",
      attendance,
    });
  } catch (error) {
    console.error("Check out error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to check out employee",
      error: error.message,
    });
  }
};

module.exports = {
  getAttendance,
  checkIn,
  checkOut,
};
