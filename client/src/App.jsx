import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";
import EmployeeDetails from "./pages/EmployeeDetails";
import EditEmployee from "./pages/EditEmployee";
import Attendance from "./pages/Attendance";
import Settings from "./pages/Settings";
import Leaves from "./pages/Leaves";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeProfile from "./pages/EmployeeProfile";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    if (user?.role === "employee") {
      return <Navigate to="/employee-dashboard" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "hr"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-profile"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeProfile />
            </ProtectedRoute>
          }
        />

        {/* Employees */}
        <Route
          path="/employees"
          element={
            <ProtectedRoute allowedRoles={["admin", "hr"]}>
              <Employees />
            </ProtectedRoute>
          }
        />

        {/* Add Employee */}
        <Route
          path="/employees/new"
          element={
            <ProtectedRoute allowedRoles={["admin", "hr"]}>
              <AddEmployee />
            </ProtectedRoute>
          }
        />

        {/* Employee Details */}
        <Route
          path="/employees/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "hr"]}>
              <EmployeeDetails />
            </ProtectedRoute>
          }
        />

        {/* Edit Employee */}
        <Route
          path="/employees/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["admin", "hr"]}>
              <EditEmployee />
            </ProtectedRoute>
          }
        />

        {/* Default */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute allowedRoles={["admin", "hr", "employee"]}>
              <Attendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={["admin", "hr", "employee"]}>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leaves"
          element={
            <ProtectedRoute allowedRoles={["admin", "hr", "employee"]}>
              <Leaves />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
