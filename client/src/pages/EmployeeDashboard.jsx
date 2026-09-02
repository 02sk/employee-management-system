import {
  CalendarDays,
  Clock3,
  LogOut,
  Settings,
  UserRound,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function EmployeeDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const darkMode = localStorage.getItem("theme") !== "light";
  const [attendance, setAttendance] = useState(null);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  useEffect(() => {
    const fetchTodayAttendance = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/attendance",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setAttendance(response.data.attendance?.[0] || null);
      } catch (error) {
        console.error("Failed to fetch attendance:", error);
      } finally {
        setAttendanceLoading(false);
      }
    };

    fetchTodayAttendance();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-[#09090b] text-white" : "bg-[#f5f5f5] text-slate-900"
      }`}
    >
      {/* Header */}
      <header
        className={`border-b ${
          darkMode
            ? "border-white/10 bg-[#09090b]"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex min-h-20 items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                darkMode ? "bg-white text-black" : "bg-black text-white"
              }`}
            >
              <Users size={20} />
            </div>

            <div>
              <p className="font-semibold tracking-tight">EMS</p>

              <p
                className={`text-[11px] ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Employee Portal
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
              darkMode
                ? "text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                : "text-slate-500 hover:bg-red-50 hover:text-red-600"
            }`}
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl p-5 sm:p-8">
        {/* Welcome */}
        <section className="mb-8">
          <p
            className={`text-sm ${
              darkMode ? "text-slate-500" : "text-slate-500"
            }`}
          >
            Welcome back,
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            {user?.name || "Employee"}
          </h1>

          <p
            className={`mt-2 max-w-2xl text-sm ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            View your attendance, manage leave requests and access your employee
            information.
          </p>
        </section>

        {/* Today's Attendance */}
<section className="mb-8">
  <div
    className={`rounded-2xl border p-6 ${
      darkMode
        ? "border-white/10 bg-[#111113]"
        : "border-slate-200 bg-white"
    }`}
  >
    <div className="flex items-start justify-between gap-4">
      <div>
        <p
          className={`text-sm ${
            darkMode ? "text-slate-500" : "text-slate-500"
          }`}
        >
          Today's Attendance
        </p>

        <h2 className="mt-2 text-2xl font-semibold capitalize">
          {attendanceLoading
            ? "Loading..."
            : attendance?.status || "Not marked"}
        </h2>

        {attendance?.checkIn && (
          <p
            className={`mt-2 text-sm ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Check-in:{" "}
            {new Date(attendance.checkIn).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>

      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
          darkMode
            ? "bg-white/5 text-slate-300"
            : "bg-slate-100 text-slate-600"
        }`}
      >
        <Clock3 size={20} />
      </div>
    </div>

    <div className="mt-5 flex flex-wrap gap-3">
      {!attendance?.checkIn && (
        <button
          type="button"
          onClick={() => navigate("/attendance")}
          className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
            darkMode
              ? "bg-white text-black hover:bg-slate-200"
              : "bg-black text-white hover:bg-slate-800"
          }`}
        >
          Check In
        </button>
      )}

      {attendance?.checkIn && !attendance?.checkOut && (
        <button
          type="button"
          onClick={() => navigate("/attendance")}
          className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
            darkMode
              ? "bg-white text-black hover:bg-slate-200"
              : "bg-black text-white hover:bg-slate-800"
          }`}
        >
          Check Out
        </button>
      )}

      {attendance?.checkIn && attendance?.checkOut && (
        <span
          className={`rounded-xl px-4 py-3 text-sm font-medium ${
            darkMode
              ? "bg-white/5 text-slate-400"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          Attendance completed
        </span>
      )}
    </div>
  </div>
</section>

        {/* Cards */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Profile */}
          <button
            type="button"
            onClick={() => navigate("/employee-profile")}
            className={`rounded-2xl border p-6 text-left transition ${
              darkMode
                ? "border-white/10 bg-[#111113] hover:bg-white/[0.04]"
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <div
              className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${
                darkMode
                  ? "bg-white/5 text-slate-300"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <UserRound size={20} />
            </div>

            <h2 className="font-semibold">My Profile</h2>

            <p
              className={`mt-2 text-sm ${
                darkMode ? "text-slate-500" : "text-slate-500"
              }`}
            >
              View your personal and employment information.
            </p>
          </button>

          {/* Attendance */}
          <button
            type="button"
            onClick={() => navigate("/attendance")}
            className={`rounded-2xl border p-6 text-left transition ${
              darkMode
                ? "border-white/10 bg-[#111113] hover:bg-white/[0.04]"
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <div
              className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${
                darkMode
                  ? "bg-white/5 text-slate-300"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <Clock3 size={20} />
            </div>

            <h2 className="font-semibold">My Attendance</h2>

            <p
              className={`mt-2 text-sm ${
                darkMode ? "text-slate-500" : "text-slate-500"
              }`}
            >
              View your attendance records and activity.
            </p>
          </button>

          {/* Leave */}
          <button
            type="button"
            onClick={() => navigate("/leaves")}
            className={`rounded-2xl border p-6 text-left transition ${
              darkMode
                ? "border-white/10 bg-[#111113] hover:bg-white/[0.04]"
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <div
              className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${
                darkMode
                  ? "bg-white/5 text-slate-300"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <CalendarDays size={20} />
            </div>

            <h2 className="font-semibold">My Leave</h2>

            <p
              className={`mt-2 text-sm ${
                darkMode ? "text-slate-500" : "text-slate-500"
              }`}
            >
              Apply for leave and check your requests.
            </p>
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={() => navigate("/settings")}
            className={`rounded-2xl border p-6 text-left transition ${
              darkMode
                ? "border-white/10 bg-[#111113] hover:bg-white/[0.04]"
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <div
              className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${
                darkMode
                  ? "bg-white/5 text-slate-300"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <Settings size={20} />
            </div>

            <h2 className="font-semibold">Settings</h2>

            <p
              className={`mt-2 text-sm ${
                darkMode ? "text-slate-500" : "text-slate-500"
              }`}
            >
              Manage your account preferences.
            </p>
          </button>
        </section>
      </main>
    </div>
  );
}

export default EmployeeDashboard;
