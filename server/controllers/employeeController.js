const Employee = require("../models/Employee");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
    });
  }
};

const createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create employee",
      error: error.message,
    });
  }
};

const createEmployeeAccount = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const existingEmployeeAccount = await User.findOne({
      employee: employee._id,
    });

    if (existingEmployeeAccount) {
      return res.status(409).json({
        success: false,
        message: "This employee already has a login account",
      });
    }

    const existingEmailAccount = await User.findOne({
      email: employee.email,
    });

    if (existingEmailAccount) {
      return res.status(409).json({
        success: false,
        message: "An account with this employee email already exists",
      });
    }

    const temporaryPassword =
      "EMS@" + crypto.randomBytes(4).toString("hex");

    const hashedPassword = await bcrypt.hash(
      temporaryPassword,
      10
    );

    const user = await User.create({
      name: `${employee.firstName} ${employee.lastName}`,
      email: employee.email,
      password: hashedPassword,
      role: "employee",
      employee: employee._id,
    });

    res.status(201).json({
      success: true,
      message: "Employee login account created successfully",
      account: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: employee._id,
      },
      temporaryPassword,
    });
  } catch (error) {
    console.error("Failed to create employee account:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create employee login account",
      error: error.message,
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete employee",
      error: error.message,
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update employee",
      error: error.message,
    });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch employee",
      error: error.message,
    });
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  createEmployeeAccount,
  deleteEmployee,
  updateEmployee,
};