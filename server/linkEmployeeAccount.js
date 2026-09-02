const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Employee = require("./models/Employee");

const linkEmployeeAccount = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const employee = await Employee.findOne({
      employeeId: "EMP001",
    });

    if (!employee) {
      console.log("Employee EMP001 not found");
      process.exit(1);
    }

    const user = await User.findOne({
      email: "anand@example.com",
    });

    if (!user) {
      console.log("Employee user account not found");
      process.exit(1);
    }

    user.employee = employee._id;

    await user.save();

    console.log("Employee account linked successfully");
    console.log({
      user: user.email,
      employeeId: employee.employeeId,
      employeeMongoId: employee._id.toString(),
    });

    process.exit(0);
  } catch (error) {
    console.error("Failed to link employee account:", error.message);
    process.exit(1);
  }
};

linkEmployeeAccount();
