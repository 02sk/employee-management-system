import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Menu,
  Moon,
  Search,
  Sun,
  UserRound,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";

function Attendance() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") !== "light",
  );

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  });

  const token = localStorage.getItem("token");

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `https://employee-management-system-6ib0.onrender.com/api/attendance?date=${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAttendance(response.data.attendance || []);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(error.response?.data?.message || "Unable to load attendance.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchAttendance();
  }, [selectedDate]);

  const handleCheckIn = async (employeeId) => {
    try {
      setActionLoading(`in-${employeeId}`);
      setError("");

      await axios.post(
        "https://employee-management-system-6ib0.onrender.com/api/attendance/check-in",
        { employeeId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchAttendance();
    } catch (error) {
      console.error("Check-in failed:", error);

      setError(error.response?.data?.message || "Unable to check in employee.");
    } finally {
      setActionLoading("");
    }
  };

  const handleCheckOut = async (employeeId) => {
    try {
      setActionLoading(`out-${employeeId}`);
      setError("");

      await axios.post(
        "https://employee-management-system-6ib0.onrender.com/api/attendance/check-out",
        { employeeId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchAttendance();
    } catch (error) {
      console.error("Check-out failed:", error);

      setError(
        error.response?.data?.message || "Unable to check out employee.",
      );
    } finally {
      setActionLoading("");
    }
  };

  const toggleTheme = () => {
    const nextMode = !darkMode;

    setDarkMode(nextMode);
    localStorage.setItem("theme", nextMode ? "dark" : "light");
  };




  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const filteredAttendance = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return attendance;
    }

    return attendance.filter((record) => {
      const employee = record.employee;

      const name = `${employee?.firstName || ""} ${
        employee?.lastName || ""
      }`.toLowerCase();

      const employeeId = (employee?.employeeId || "").toLowerCase();

      const department = (employee?.department || "").toLowerCase();

      return (
        name.includes(query) ||
        employeeId.includes(query) ||
        department.includes(query)
      );
    });
  }, [attendance, search]);

  const presentCount = attendance.filter(
    (record) => record.status === "present",
  ).length;

  const lateCount = attendance.filter(
    (record) => record.status === "late",
  ).length;

  const halfDayCount = attendance.filter(
    (record) => record.status === "half-day",
  ).length;

  const notMarkedCount = attendance.filter(
    (record) => record.status === "not-marked",
  ).length;

  const checkedOutCount = attendance.filter((record) => record.checkOut).length;
  const formatTime = (value) => {
    if (!value) return "—";

    return new Date(value).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    if (status === "present") {
      return darkMode
        ? "bg-emerald-500/10 text-emerald-400"
        : "bg-emerald-50 text-emerald-600";
    }

    if (status === "late") {
      return darkMode
        ? "bg-amber-500/10 text-amber-400"
        : "bg-amber-50 text-amber-600";
    }

    if (status === "half-day") {
      return darkMode
        ? "bg-blue-500/10 text-blue-400"
        : "bg-blue-50 text-blue-600";
    }

    if (status === "not-marked") {
      return darkMode
        ? "bg-white/5 text-slate-400"
        : "bg-slate-100 text-slate-500";
    }

    return darkMode ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-600";
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#09090b] text-white" : "bg-[#f5f5f5] text-slate-900"
      }`}
    >
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        darkMode={darkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        handleLogout={handleLogout}
      />

      <main className="lg:pl-72">
        <header
          className={`sticky top-0 z-20 flex h-20 items-center justify-between border-b px-5 backdrop-blur-xl sm:px-8 ${
            darkMode
              ? "border-white/10 bg-[#09090b]/80"
              : "border-slate-200 bg-white/80"
          }`}
        >
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu size={22} />
            </button>

            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                {user?.role === "employee" ? "My Attendance" : "Attendance"}
              </h1>
              <p
                className={`hidden text-xs sm:block ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                {user?.role === "employee"
                  ? "View your attendance and working hours."
                  : "Track employee attendance and working hours."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
              darkMode
                ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        <div className="mx-auto max-w-7xl p-5 sm:p-8">
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard
              label="Present"
              value={presentCount}
              description="Present today"
              icon={CheckCircle2}
              darkMode={darkMode}
            />

            <StatCard
              label="Late"
              value={lateCount}
              description="Late arrivals"
              icon={Clock3}
              darkMode={darkMode}
            />

            <StatCard
              label="Half-day"
              value={halfDayCount}
              description="Half-day attendance"
              icon={Activity}
              darkMode={darkMode}
            />

            <StatCard
              label="Not marked"
              value={notMarkedCount}
              description="Attendance pending"
              icon={UserRound}
              darkMode={darkMode}
            />

            <StatCard
              label="Checked out"
              value={checkedOutCount}
              description="Completed workday"
              icon={XCircle}
              darkMode={darkMode}
            />
          </section>

          <section
            className={`mt-6 rounded-2xl border p-4 ${
              darkMode
                ? "border-white/10 bg-[#111113]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {user?.role !== "employee" && (
                <div className="relative w-full lg:max-w-md">
                  <Search
                    size={18}
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                      darkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search employee..."
                    className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none transition ${
                      darkMode
                        ? "border-white/10 bg-white/[0.03] text-white placeholder:text-slate-600 focus:border-white/30"
                        : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-slate-400"
                    }`}
                  />
                </div>
              )}

              <div className="relative">
                <CalendarDays
                  size={17}
                  className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                />

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className={`rounded-xl border py-3 pl-10 pr-4 text-sm outline-none ${
                    darkMode
                      ? "border-white/10 bg-white/[0.03] text-white"
                      : "border-slate-200 bg-slate-50 text-slate-900"
                  }`}
                />
              </div>
            </div>
          </section>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <section
            className={`mt-6 overflow-hidden rounded-2xl border ${
              darkMode
                ? "border-white/10 bg-[#111113]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div
              className={`border-b px-5 py-5 sm:px-6 ${
                darkMode ? "border-white/10" : "border-slate-200"
              }`}
            >
              <h2 className="font-semibold">
                {user?.role === "employee"
                  ? "My daily attendance"
                  : "Daily attendance"}
              </h2>

              <p
                className={`mt-1 text-xs ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                {user?.role === "employee"
                  ? "Your attendance for "
                  : "Attendance records for "}
                {new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  },
                )}
              </p>
            </div>

            {loading ? (
              <div className="p-10 text-center text-sm text-slate-500">
                Loading attendance...
              </div>
            ) : filteredAttendance.length === 0 ? (
              <div className="p-12 text-center">
                <UserRound size={32} className="mx-auto mb-3 opacity-30" />

                <h3 className="text-sm font-semibold">No attendance records</h3>

                <p
                  className={`mt-1 text-xs ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  No attendance has been recorded for this date.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px]">
                  <thead>
                    <tr
                      className={`border-b text-left text-xs ${
                        darkMode
                          ? "border-white/10 text-slate-500"
                          : "border-slate-200 text-slate-400"
                      }`}
                    >
                      <th className="px-6 py-4 font-medium">Employee</th>

                      <th className="px-6 py-4 font-medium">Department</th>

                      <th className="px-6 py-4 font-medium">Check in</th>

                      <th className="px-6 py-4 font-medium">Check out</th>

                      <th className="px-6 py-4 font-medium">Status</th>

                      <th className="px-6 py-4 text-right font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody
                    className={
                      darkMode
                        ? "divide-y divide-white/5"
                        : "divide-y divide-slate-100"
                    }
                  >
                    {filteredAttendance.map((record) => {
                      const employee = record.employee;

                      if (!employee) return null;

                      const fullName = `${employee.firstName} ${employee.lastName}`;

                      return (
                        <tr
                          key={record._id}
                          className={`transition ${
                            darkMode
                              ? "hover:bg-white/[0.02]"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                                  darkMode
                                    ? "bg-white/10 text-white"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {employee.firstName?.[0]}
                                {employee.lastName?.[0]}
                              </div>

                              <div>
                                <p className="text-sm font-medium">
                                  {fullName}
                                </p>

                                <p
                                  className={`mt-1 text-xs ${
                                    darkMode
                                      ? "text-slate-500"
                                      : "text-slate-400"
                                  }`}
                                >
                                  {employee.employeeId}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-sm">
                            {employee.department || "—"}
                          </td>

                          <td className="px-6 py-4 text-sm">
                            {formatTime(record.checkIn)}
                          </td>

                          <td className="px-6 py-4 text-sm">
                            {formatTime(record.checkOut)}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-[11px] font-medium capitalize ${getStatusClass(
                                record.status,
                              )}`}
                            >
                              {record.status === "not-marked"
                                ? "Not marked"
                                : record.status}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right">
                            {!record.checkIn ? (
                              <button
                                type="button"
                                disabled={
                                  actionLoading === `in-${employee._id}`
                                }
                                onClick={() => handleCheckIn(employee._id)}
                                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                                  darkMode
                                    ? "bg-white text-black hover:bg-slate-200"
                                    : "bg-black text-white hover:bg-slate-800"
                                }`}
                              >
                                {actionLoading === `in-${employee._id}`
                                  ? "Checking..."
                                  : "Check in"}
                              </button>
                            ) : !record.checkOut ? (
                              <button
                                type="button"
                                disabled={
                                  actionLoading === `out-${employee._id}`
                                }
                                onClick={() => handleCheckOut(employee._id)}
                                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                                  darkMode
                                    ? "border-white/10 text-slate-300 hover:bg-white/5"
                                    : "border-slate-200 text-slate-600 hover:bg-slate-100"
                                }`}
                              >
                                {actionLoading === `out-${employee._id}`
                                  ? "Checking..."
                                  : "Check out"}
                              </button>
                            ) : (
                              <span className="text-xs text-slate-500">
                                Completed
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, description, icon: Icon, darkMode }) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        darkMode ? "border-white/10 bg-[#111113]" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={`text-xs ${
              darkMode ? "text-slate-500" : "text-slate-400"
            }`}
          >
            {label}
          </p>

          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            darkMode
              ? "bg-white/5 text-slate-300"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          <Icon size={19} />
        </div>
      </div>

      <p
        className={`mt-4 text-xs ${
          darkMode ? "text-slate-500" : "text-slate-400"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

export default Attendance;
