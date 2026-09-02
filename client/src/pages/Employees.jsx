import {
  ChevronDown,
  Filter,
  Menu,
  Moon,
  Plus,
  Search,
  Sun,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";

function Employees() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") !== "light",
  );
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/employees",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
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
        setLoading(false);
      }
    };

    if (token) {
      fetchEmployees();
    } else {
      navigate("/login");
    }
  }, [navigate, token]);

  const toggleTheme = () => {
    const nextMode = !darkMode;

    setDarkMode(nextMode);
    localStorage.setItem("theme", nextMode ? "dark" : "light");
  };

  const departments = [
    "all",
    ...new Set(employees.map((employee) => employee.department)),
  ];

  const filteredEmployees = employees.filter((employee) => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();

    const searchValue = search.toLowerCase();

    const matchesSearch =
      fullName.includes(searchValue) ||
      employee.employeeId.toLowerCase().includes(searchValue) ||
      employee.email.toLowerCase().includes(searchValue);

    const matchesDepartment =
      department === "all" || employee.department === department;

    const matchesStatus = status === "all" || employee.status === status;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-[#09090b] text-white"
          : "bg-[#f5f5f5] text-slate-900"
      }`}
    >
      {/* Mobile sidebar overlay: clicking anywhere outside the sidebar closes it. */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Shared sidebar */}
      <Sidebar
        darkMode={darkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        handleLogout={handleLogout}
      />

      {/* Page content */}
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
            {/* Left side: mobile menu + title */}
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
                  Employees
                </h1>

                <p
                  className={`mt-1 truncate text-sm ${
                    darkMode ? "text-slate-500" : "text-slate-500"
                  }`}
                >
                  Manage and organize your workforce.
                </p>
              </div>
            </div>

            {/* Header actions */}
            <div className="flex shrink-0 items-center gap-3">
              {/* Theme toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition ${
                  darkMode
                    ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Add employee */}
              <button
                type="button"
                onClick={() => navigate("/employees/new")}
                className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  darkMode
                    ? "bg-white text-black hover:bg-slate-200"
                    : "bg-black text-white hover:bg-slate-800"
                }`}
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Add employee</span>
              </button>
            </div>
          </div>
        </header>

<main className="p-5 sm:p-8">
        {/* Search + Filters */}
        <section
          className={`mb-6 rounded-2xl border p-4 ${
            darkMode
              ? "border-white/10 bg-[#111113]"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex flex-col gap-3 lg:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={18}
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, ID or email..."
                className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none transition ${
                  darkMode
                    ? "border-white/10 bg-white/[0.03] text-white placeholder:text-slate-600 focus:border-white/30"
                    : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                }`}
              />
            </div>

            {/* Department */}
            <div className="relative">
              <Filter
                size={16}
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              />

              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className={`w-full appearance-none rounded-xl border py-3 pl-10 pr-10 text-sm outline-none lg:w-52 ${
                  darkMode
                    ? "border-white/10 bg-white/[0.03] text-slate-300 focus:border-white/30"
                    : "border-slate-200 bg-slate-50 text-slate-700 focus:border-slate-400 focus:bg-white"
                }`}
              >
                {departments.map((item) => (
                  <option
                    key={item}
                    value={item}
                    className={darkMode ? "bg-[#111113]" : "bg-white"}
                  >
                    {item === "all" ? "All departments" : item}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={15}
                className={`pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              />
            </div>

            {/* Status */}
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`w-full appearance-none rounded-xl border px-4 py-3 pr-10 text-sm outline-none lg:w-44 ${
                  darkMode
                    ? "border-white/10 bg-white/[0.03] text-slate-300 focus:border-white/30"
                    : "border-slate-200 bg-slate-50 text-slate-700 focus:border-slate-400 focus:bg-white"
                }`}
              >
                <option
                  value="all"
                  className={darkMode ? "bg-[#111113]" : "bg-white"}
                >
                  All statuses
                </option>

                <option
                  value="active"
                  className={darkMode ? "bg-[#111113]" : "bg-white"}
                >
                  Active
                </option>

                <option
                  value="inactive"
                  className={darkMode ? "bg-[#111113]" : "bg-white"}
                >
                  Inactive
                </option>
              </select>

              <ChevronDown
                size={15}
                className={`pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              />
            </div>
          </div>
        </section>

        {/* Employee table */}
        <section
          className={`overflow-hidden rounded-2xl border ${
            darkMode
              ? "border-white/10 bg-[#111113]"
              : "border-slate-200 bg-white"
          }`}
        >
          {/* Table header */}
          <div
            className={`flex items-center justify-between border-b px-5 py-5 sm:px-6 ${
              darkMode ? "border-white/10" : "border-slate-200"
            }`}
          >
            <div>
              <h2 className="font-semibold">All employees</h2>

              <p
                className={`mt-1 text-xs ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                {filteredEmployees.length} employee
                {filteredEmployees.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                darkMode
                  ? "bg-white/5 text-slate-400"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <Users size={17} />
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div
              className={`p-12 text-center text-sm ${
                darkMode ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Loading employees...
            </div>
          ) : filteredEmployees.length === 0 ? (
            /* Empty */
            <div className="p-12 text-center">
              <Users
                size={32}
                className={`mx-auto mb-4 ${
                  darkMode ? "text-slate-600" : "text-slate-300"
                }`}
              />

              <h3 className="font-medium">No employees found</h3>

              <p
                className={`mt-1 text-sm ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr
                      className={`border-b text-left ${
                        darkMode ? "border-white/10" : "border-slate-200"
                      }`}
                    >
                      {[
                        "Employee",
                        "Department",
                        "Designation",
                        "Type",
                        "Status",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className={`px-6 py-4 text-xs font-medium uppercase tracking-wider ${
                            darkMode ? "text-slate-500" : "text-slate-400"
                          }`}
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody
                    className={`divide-y ${
                      darkMode ? "divide-white/5" : "divide-slate-100"
                    }`}
                  >
                    {filteredEmployees.map((employee) => (
                      <tr
                        key={employee._id}
                        onClick={() => navigate(`/employees/${employee._id}`)}
                        className={`cursor-pointer transition ${
                          darkMode
                            ? "hover:bg-white/[0.025]"
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
                                {employee.firstName} {employee.lastName}
                              </p>

                              <p
                                className={`mt-0.5 text-xs ${
                                  darkMode ? "text-slate-500" : "text-slate-400"
                                }`}
                              >
                                {employee.employeeId}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td
                          className={`px-6 py-4 text-sm ${
                            darkMode ? "text-slate-300" : "text-slate-600"
                          }`}
                        >
                          {employee.department}
                        </td>

                        <td
                          className={`px-6 py-4 text-sm ${
                            darkMode ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          {employee.designation}
                        </td>

                        <td
                          className={`px-6 py-4 text-sm capitalize ${
                            darkMode ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          {employee.employmentType}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                              employee.status === "active"
                                ? darkMode
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-emerald-50 text-emerald-600"
                                : darkMode
                                  ? "bg-white/5 text-slate-400"
                                  : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {employee.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div
                className={`divide-y md:hidden ${
                  darkMode ? "divide-white/5" : "divide-slate-100"
                }`}
              >
                {filteredEmployees.map((employee) => (
                  <button
                    key={employee._id}
                    onClick={() => navigate(`/employees/${employee._id}`)}
                    className={`flex w-full items-center gap-3 p-5 text-left transition ${
                      darkMode ? "hover:bg-white/[0.025]" : "hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                        darkMode
                          ? "bg-white/10 text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {employee.firstName?.[0]}
                      {employee.lastName?.[0]}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {employee.firstName} {employee.lastName}
                      </p>

                      <p
                        className={`mt-1 truncate text-xs ${
                          darkMode ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        {employee.designation} · {employee.department}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                        employee.status === "active"
                          ? darkMode
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-emerald-50 text-emerald-600"
                          : darkMode
                            ? "bg-white/5 text-slate-400"
                            : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
      </div>
    </div>
  );
}

export default Employees;