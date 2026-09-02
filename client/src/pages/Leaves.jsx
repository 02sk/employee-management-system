import {
  CalendarDays,
  Check,
  Clock3,
  FileText,
  Menu,
  Plus,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Leaves() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin =
  user?.role === "admin" || user?.role === "hr";

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") !== "light"
  );

  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState("");

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [showForm, setShowForm] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    employeeId: "",
    leaveType: "casual",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "https://employee-management-system-6ib0.onrender.com/api/leaves",
        authConfig
      );

      const fetchedLeaves = response.data.leaves || [];

      setLeaves(fetchedLeaves); 
    } catch (error) {
      console.error("Failed to fetch leaves:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load leave requests."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      setEmployeesLoading(true);

      const response = await axios.get(
        "https://employee-management-system-6ib0.onrender.com/api/employees",
        authConfig
      );

      setEmployees(response.data.employees || []);
    } catch (error) {
      console.error("Failed to fetch employees:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setEmployeesLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchLeaves();
    fetchEmployees();
  }, [navigate, token, isAdmin]);

  const toggleTheme = () => {
    const nextMode = !darkMode;

    setDarkMode(nextMode);

    localStorage.setItem(
      "theme",
      nextMode ? "dark" : "light"
    );
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const calculateDays = () => {
    if (!form.startDate || !form.endDate) {
      return 0;
    }

    const start = new Date(`${form.startDate}T00:00:00`);
    const end = new Date(`${form.endDate}T00:00:00`);

    if (end < start) {
      return 0;
    }

    return (
      Math.floor(
        (end - start) / (24 * 60 * 60 * 1000)
      ) + 1
    );
  };

  const resetForm = () => {
    setForm({
      employeeId: "",
      leaveType: "casual",
      startDate: "",
      endDate: "",
      reason: "",
    });
  };

  const handleCreateLeave = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await axios.post(
        "https://employee-management-system-6ib0.onrender.com/api/leaves",
        form,
        authConfig
      );

      setMessage("Leave request created successfully.");

      resetForm();
      setShowForm(false);

      await fetchLeaves();
    } catch (error) {
      console.error("Failed to create leave:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to create leave request."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleReview = async (id, action) => {
    const actionName =
      action === "approve" ? "approve" : "reject";

    try {
      setActionLoading(`${actionName}-${id}`);
      setError("");
      setMessage("");

      await axios.put(
        `https://employee-management-system-6ib0.onrender.com/api/leaves/${id}/${actionName}`,
        {},
        authConfig
      );

      setMessage(
        `Leave request ${actionName}d successfully.`
      );

      await fetchLeaves();
    } catch (error) {
      console.error(
        `Failed to ${actionName} leave:`,
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          `Unable to ${actionName} leave request.`
      );
    } finally {
      setActionLoading("");
    }
  };

  const filteredLeaves = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leaves.filter((leave) => {
      if (
        activeTab !== "all" &&
        leave.status !== activeTab
      ) {
        return false;
      }

      if (!query) {
        return true;
      }

      const employee = leave.employee;

      const name =
        `${employee?.firstName || ""} ${
          employee?.lastName || ""
        }`.toLowerCase();

      const employeeId = (
        employee?.employeeId || ""
      ).toLowerCase();

      const department = (
        employee?.department || ""
      ).toLowerCase();

      const leaveType = (
        leave.leaveType || ""
      ).toLowerCase();

      return (
        name.includes(query) ||
        employeeId.includes(query) ||
        department.includes(query) ||
        leaveType.includes(query)
      );
    });
  }, [leaves, activeTab, search]);

  const counts = {
    all: leaves.length,
    pending: leaves.filter(
      (leave) => leave.status === "pending"
    ).length,
    approved: leaves.filter(
      (leave) => leave.status === "approved"
    ).length,
    rejected: leaves.filter(
      (leave) => leave.status === "rejected"
    ).length,
  };

  const formatDate = (value) => {
    if (!value) return "—";

    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    if (status === "approved") {
      return darkMode
        ? "bg-emerald-500/10 text-emerald-400"
        : "bg-emerald-50 text-emerald-600";
    }

    if (status === "rejected") {
      return darkMode
        ? "bg-red-500/10 text-red-400"
        : "bg-red-50 text-red-600";
    }

    return darkMode
      ? "bg-amber-500/10 text-amber-400"
      : "bg-amber-50 text-amber-600";
  };

  const getLeaveTypeLabel = (type) => {
    const labels = {
      casual: "Casual",
      sick: "Sick",
      annual: "Annual",
      unpaid: "Unpaid",
      other: "Other",
    };

    return labels[type] || type;
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-[#09090b] text-white"
          : "bg-[#f5f5f5] text-slate-900"
      }`}
    >
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar
        darkMode={darkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        handleLogout={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }}
      />

      <div className="lg:pl-72">
      {/* Header */}
      <header
        className={`sticky top-0 z-20 border-b backdrop-blur-xl ${
          darkMode
            ? "border-white/10 bg-[#09090b]/90"
            : "border-slate-200 bg-white/90"
        }`}
      >
        <div className="flex min-h-20 items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border lg:hidden ${
                darkMode
                  ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Menu size={20} />
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold tracking-tight">
                {isAdmin ? "Leave Management" : "My Leave"}
              </h1>
              <p
                className={`mt-1 truncate text-sm ${
                  darkMode ? "text-slate-500" : "text-slate-500"
                }`}
              >
                {isAdmin
                  ? "Manage employee leave requests and approvals."
                  : "Apply for leave and track your requests."}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
                darkMode
                  ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {darkMode ? "☀" : "☾"}
            </button>

            {!isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setForm((current) => ({
                    ...current,
                    employeeId:
                      user?.employeeId ||
                      user?.employee?._id ||
                      user?._id ||
                      "",
                  }));
                  setShowForm(true);
                  setError("");
                  setMessage("");
                }}
                className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  darkMode
                    ? "bg-white text-black hover:bg-slate-200"
                    : "bg-black text-white hover:bg-slate-800"
                }`}
              >
                <Plus size={17} />
                <span className="hidden sm:inline">New leave</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-5 sm:p-8">
        {/* Summary */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="All requests"
            value={counts.all}
            icon={FileText}
            darkMode={darkMode}
          />

          <SummaryCard
            label="Pending"
            value={counts.pending}
            icon={Clock3}
            darkMode={darkMode}
          />

          <SummaryCard
            label="Approved"
            value={counts.approved}
            icon={Check}
            darkMode={darkMode}
          />

          <SummaryCard
            label="Rejected"
            value={counts.rejected}
            icon={X}
            darkMode={darkMode}
          />
        </section>

        {/* Search and tabs */}
        <section
          className={`mt-6 rounded-2xl border ${
            darkMode
              ? "border-white/10 bg-[#111113]"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search
                size={18}
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                  darkMode
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employee or leave type..."
                className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none ${
                  darkMode
                    ? "border-white/10 bg-white/[0.03] text-white placeholder:text-slate-600"
                    : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                }`}
              />
            </div>

            <div
              className={`flex overflow-x-auto rounded-xl border p-1 ${
                darkMode
                  ? "border-white/10 bg-white/[0.02]"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              {[
                ["all", "All"],
                ["pending", "Pending"],
                ["approved", "Approved"],
                ["rejected", "Rejected"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setActiveTab(value)}
                  className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-medium transition ${
                    activeTab === value
                      ? darkMode
                        ? "bg-white text-black"
                        : "bg-black text-white"
                      : darkMode
                        ? "text-slate-400 hover:text-white"
                        : "text-slate-500 hover:text-black"
                  }`}
                >
                  {label} ({counts[value]})
                </button>
              ))}
            </div>
          </div>
        </section>

        {message && (
          <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-500">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Table */}
        <section
          className={`mt-6 overflow-hidden rounded-2xl border ${
            darkMode
              ? "border-white/10 bg-[#111113]"
              : "border-slate-200 bg-white"
          }`}
        >
          <div
            className={`border-b px-5 py-5 sm:px-6 ${
              darkMode
                ? "border-white/10"
                : "border-slate-200"
            }`}
          >
            <h2 className="font-semibold">
              Leave requests
            </h2>

            <p
              className={`mt-1 text-xs ${
                darkMode
                  ? "text-slate-500"
                  : "text-slate-400"
              }`}
            >
              Review and manage employee leave applications.
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Loading leave requests...
            </div>
          ) : filteredLeaves.length === 0 ? (
            <div className="p-12 text-center">
              <FileText
                size={32}
                className="mx-auto mb-3 opacity-30"
              />

              <h3 className="text-sm font-semibold">
                No leave requests
              </h3>

              <p
                className={`mt-1 text-xs ${
                  darkMode
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              >
                There are no requests matching your filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead>
                  <tr
                    className={`border-b text-left text-xs ${
                      darkMode
                        ? "border-white/10 text-slate-500"
                        : "border-slate-200 text-slate-400"
                    }`}
                  >
                    <th className="px-6 py-4 font-medium">
                      Employee
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Leave type
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Dates
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Days
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Status
                    </th>
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
                  {filteredLeaves.map((leave) => {
                    const employee = leave.employee;

                    if (!employee) return null;

                    return (
                      <tr
                        key={leave._id}
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
                                {employee.firstName}{" "}
                                {employee.lastName}
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
                          {getLeaveTypeLabel(
                            leave.leaveType
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm">
                            <CalendarDays
                              size={15}
                              className={
                                darkMode
                                  ? "text-slate-500"
                                  : "text-slate-400"
                              }
                            />

                            <span>
                              {formatDate(leave.startDate)}
                              {" – "}
                              {formatDate(leave.endDate)}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm">
                          {leave.days}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-medium capitalize ${getStatusClass(
                              leave.status
                            )}`}
                          >
                            {leave.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          {isAdmin && leave.status === "pending" ? (
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                disabled={
                                  actionLoading ===
                                  `approve-${leave._id}`
                                }
                                onClick={() =>
                                  handleReview(
                                    leave._id,
                                    "approve"
                                  )
                                }
                                className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-500 transition hover:bg-emerald-500/20"
                              >
                                {actionLoading ===
                                `approve-${leave._id}`
                                  ? "..."
                                  : "Approve"}
                              </button>

                              <button
                                type="button"
                                disabled={
                                  actionLoading ===
                                  `reject-${leave._id}`
                                }
                                onClick={() =>
                                  handleReview(
                                    leave._id,
                                    "reject"
                                  )
                                }
                                className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/20"
                              >
                                {actionLoading ===
                                `reject-${leave._id}`
                                  ? "..."
                                  : "Reject"}
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500">
                              Reviewed
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
      </main>

      {/* New Leave Modal */}
      {showForm && !isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            className={`w-full max-w-2xl overflow-hidden rounded-2xl border shadow-2xl ${
              darkMode
                ? "border-white/10 bg-[#111113]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div
              className={`flex items-center justify-between border-b px-6 py-5 ${
                darkMode
                  ? "border-white/10"
                  : "border-slate-200"
              }`}
            >
              <div>
                <h2 className="font-semibold">
                  New leave request
                </h2>

                <p
                  className={`mt-1 text-xs ${
                    darkMode
                      ? "text-slate-500"
                      : "text-slate-400"
                  }`}
                >
                  Submit your leave application for approval.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  darkMode
                    ? "text-slate-400 hover:bg-white/5 hover:text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleCreateLeave}
              className="space-y-5 p-6"
            >
              {/* Employee */}
              <div
                className={`rounded-xl border px-4 py-3 ${
                  darkMode
                    ? "border-white/10 bg-white/[0.02]"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <p className="text-sm font-medium">
                  Leave request for {user?.name || "you"}
                </p>
              </div>

              {/* Leave type */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Leave type
                </label>

                <select
                  name="leaveType"
                  value={form.leaveType}
                  onChange={handleFormChange}
                  className={`w-full rounded-xl border px-4 py-3.5 text-sm outline-none ${
                    darkMode
                      ? "border-white/10 bg-white/[0.03] text-white"
                      : "border-slate-200 bg-slate-50 text-slate-900"
                  }`}
                >
                  <option value="casual">Casual leave</option>
                  <option value="sick">Sick leave</option>
                  <option value="annual">Annual leave</option>
                  <option value="unpaid">Unpaid leave</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Dates */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Start date
                  </label>

                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleFormChange}
                    required
                    className={`w-full rounded-xl border px-4 py-3.5 text-sm outline-none ${
                      darkMode
                        ? "border-white/10 bg-white/[0.03] text-white"
                        : "border-slate-200 bg-slate-50 text-slate-900"
                    }`}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    End date
                  </label>

                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleFormChange}
                    required
                    className={`w-full rounded-xl border px-4 py-3.5 text-sm outline-none ${
                      darkMode
                        ? "border-white/10 bg-white/[0.03] text-white"
                        : "border-slate-200 bg-slate-50 text-slate-900"
                    }`}
                  />
                </div>
              </div>

              {/* Days */}
              <div
                className={`rounded-xl border px-4 py-3 ${
                  darkMode
                    ? "border-white/10 bg-white/[0.02]"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm ${
                      darkMode
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    Leave duration
                  </span>

                  <span className="font-semibold">
                    {calculateDays()}{" "}
                    {calculateDays() === 1
                      ? "day"
                      : "days"}
                  </span>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Reason
                </label>

                <textarea
                  name="reason"
                  value={form.reason}
                  onChange={handleFormChange}
                  rows={4}
                  placeholder="Enter the reason for leave..."
                  className={`w-full resize-none rounded-xl border px-4 py-3.5 text-sm outline-none ${
                    darkMode
                      ? "border-white/10 bg-white/[0.03] text-white placeholder:text-slate-600"
                      : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                  }`}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className={`rounded-xl border px-5 py-3 text-sm font-medium ${
                    darkMode
                      ? "border-white/10 text-slate-300 hover:bg-white/5"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className={`rounded-xl px-5 py-3 text-sm font-semibold ${
                    darkMode
                      ? "bg-white text-black hover:bg-slate-200"
                      : "bg-black text-white hover:bg-slate-800"
                  } ${
                    saving
                      ? "cursor-not-allowed opacity-60"
                      : ""
                  }`}
                >
                  {saving
                    ? "Creating..."
                    : "Create request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  darkMode,
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        darkMode
          ? "border-white/10 bg-[#111113]"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={`text-xs ${
              darkMode
                ? "text-slate-500"
                : "text-slate-400"
            }`}
          >
            {label}
          </p>

          <p className="mt-2 text-3xl font-semibold tracking-tight">
            {value}
          </p>
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
    </div>
  );
}

export default Leaves;