const express = require("express");
const cors = require("cors");
require("dotenv").config();

// connect database
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const healthRoutes = require("./routes/healthRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const leaveRoutes = require("./routes/leaveRoutes");

const app = express();



const PORT = process.env.PORT || 5000;
connectDB();

// Middleware
app.use(cors());
app.use(express.json());


app.use("/api/health", healthRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/leaves", leaveRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Employee Management System API is running",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});