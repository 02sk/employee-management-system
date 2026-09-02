const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const createHR = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingUser = await User.findOne({
      email: "hr@ems.com",
    });

    if (existingUser) {
      console.log("HR user already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("HR@12345", 10);

    await User.create({
      name: "HR Manager",
      email: "hr@ems.com",
      password: hashedPassword,
      role: "hr",
    });

    console.log("HR user created successfully");

    process.exit(0);
  } catch (error) {
    console.error("Failed to create HR:", error.message);
    process.exit(1);
  }
};

createHR();
