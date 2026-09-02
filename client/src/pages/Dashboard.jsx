import {
  Activity,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronRight,
  CircleUserRound,
  Clock3,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

import Sidebar from "../components/Sidebar";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "https://employee-management-system-6ib0.onrender.com/api/employees",
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

  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (employee) => employee.status === "active",
  ).length;

  const inactiveEmployees = employees.filter(
    (employee) => employee.status === "inactive",
  ).length;

  const departmentCount = new Set(
    employees.map((employee) => employee.department),
  ).size;

  const recentEmployees = [...employees]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const stats = [
    {
      label: "Total Employees",
      value: totalEmployees,
      icon: Users,
      description: "Across your organization",
    },
    {
      label: "Active Employees",
      value: activeEmployees,
      icon: Activity,
      description: "Currently active",
    },
    {
      label: "Departments",
      value: departmentCount,
      icon: Building2,
      description: "Active departments",
    },
    {
      label: "Employment Types",
      value: new Set(employees.map((employee) => employee.employmentType)).size,
      icon: BriefcaseBusiness,
      description: "Different work types",
    },
  ];

  const navigation = [
    {
      name: "Overview",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Employees",
      icon: Users,
      path: "/employees",
    },
    {
      name: "Attendance",
      icon: Clock3,
      path: "/attendance",
    },
    {
      name: "Leave",
      icon: CalendarDays,
    },
    {
      name: "Payroll",
      icon: BriefcaseBusiness,
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#09090b] text-white" : "bg-[#f5f5f5] text-slate-900"
      }`}
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        darkMode={darkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        handleLogout={handleLogout}
      />

      {/* Main */}
      <main className="lg:pl-72">
        {/* Header */}
        <header
          className={`sticky top-0 z-20 flex h-20 items-center justify-between border-b px-5 backdrop-blur-xl sm:px-8 ${
            darkMode
              ? "border-white/10 bg-[#09090b]/80"
              : "border-slate-200 bg-white/80"
          }`}
        >
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu size={22} />
            </button>

            <div>
              <h1 className="text-lg font-semibold tracking-tight">Overview</h1>

              <p
                className={`hidden text-xs sm:block ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Here's what's happening with your organization.
              </p>
            </div>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
              darkMode
                ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        {/* Content */}
        <div className="p-5 sm:p-8">
          {/* Welcome */}
          <section className="mb-8">
            <p
              className={`mb-2 text-sm ${
                darkMode ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Welcome back,
            </p>

            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {user?.name || "Administrator"}
            </h2>

            <p
              className={`mt-2 max-w-2xl text-sm ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Manage your workforce, monitor employee activity and keep
              everything organized from one place.
            </p>
          </section>

          {/* Stats */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className={`rounded-2xl border p-5 transition ${
                    darkMode
                      ? "border-white/10 bg-[#111113] hover:border-white/20"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        darkMode
                          ? "bg-white/5 text-slate-300"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      <Icon size={19} />
                    </div>

                    <ArrowUpRight
                      size={17}
                      className={darkMode ? "text-slate-600" : "text-slate-400"}
                    />
                  </div>

                  <p
                    className={`text-sm ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {stat.label}
                  </p>

                  <p className="mt-1 text-3xl font-semibold tracking-tight">
                    {loading ? "—" : stat.value}
                  </p>

                  <p
                    className={`mt-2 text-xs ${
                      darkMode ? "text-slate-600" : "text-slate-400"
                    }`}
                  >
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </section>

          {/* Recent Employees */}
          <section className="mt-6">
            <div
              className={`overflow-hidden rounded-2xl border ${
                darkMode
                  ? "border-white/10 bg-[#111113]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between border-b px-5 py-5 sm:px-6">
                <div>
                  <h3 className="font-semibold">Recent Employees</h3>

                  <p
                    className={`mt-1 text-xs ${
                      darkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Latest employees added to the organization
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/employees")}
                  className={`flex items-center gap-1 text-xs font-medium ${
                    darkMode
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-500 hover:text-black"
                  }`}
                >
                  View all
                  <ChevronRight size={15} />
                </button>
              </div>

              {loading ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  Loading employees...
                </div>
              ) : employees.length === 0 ? (
                <div className="p-8 text-center">
                  <UserRound size={28} className="mx-auto mb-3 opacity-40" />

                  <p className="text-sm font-medium">No employees yet</p>

                  <p
                    className={`mt-1 text-xs ${
                      darkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Add your first employee to get started.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {recentEmployees.map((employee) => (
                    <div
                      key={employee._id}
                      className="flex items-center justify-between px-5 py-4 sm:px-6"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                            darkMode
                              ? "bg-white/10 text-white"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {employee.firstName?.[0]}
                          {employee.lastName?.[0]}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {employee.firstName} {employee.lastName}
                          </p>

                          <p
                            className={`truncate text-xs ${
                              darkMode ? "text-slate-500" : "text-slate-400"
                            }`}
                          >
                            {employee.designation} · {employee.department}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`hidden rounded-full px-3 py-1 text-[11px] font-medium sm:inline-flex ${
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
