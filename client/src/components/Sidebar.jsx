import {
  CalendarDays,
  CircleUserRound,
  Clock3,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

function Sidebar({
  darkMode,
  sidebarOpen,
  setSidebarOpen,
  user,
  handleLogout,
}) {
  const navigate = useNavigate();
  const location = useLocation();

const adminNavigation = [
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
    path: "/leaves",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

const employeeNavigation = [
  {
    name: "Overview",
    icon: LayoutDashboard,
    path: "/employee-dashboard",
  },
  {
    name: "My Attendance",
    icon: Clock3,
    path: "/attendance",
  },
  {
    name: "My Leave",
    icon: CalendarDays,
    path: "/leaves",
  },
  {
    name: "My Profile",
    icon: CircleUserRound,
    path: "/employee-profile",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

const navigation =
  user?.role === "employee"
    ? employeeNavigation
    : adminNavigation;
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      } ${
        darkMode ? "border-white/10 bg-[#0d0d0f]" : "border-slate-200 bg-white"
      }`}
    >
      {/* Brand */}
      <div className="flex h-20 items-center justify-between border-b px-6">
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
              Employee Management
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        <p
          className={`mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] ${
            darkMode ? "text-slate-600" : "text-slate-400"
          }`}
        >
          Workspace
        </p>

        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.name}
              type="button"
              disabled={!item.path}
              onClick={() => {
                if (item.path) {
                  navigate(item.path);
                  setSidebarOpen(false);
                }
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? darkMode
                    ? "bg-white text-black"
                    : "bg-black text-white"
                  : darkMode
                    ? "text-slate-400 hover:bg-white/5 hover:text-white"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              } ${!item.path ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <Icon size={18} />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t p-4">
        <div
          className={`mb-3 flex items-center gap-3 rounded-xl p-3 ${
            darkMode ? "bg-white/[0.03]" : "bg-slate-50"
          }`}
        >
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full ${
              darkMode
                ? "bg-white/10 text-white"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            <CircleUserRound size={19} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {user?.name || "Administrator"}
            </p>

            <p
              className={`truncate text-xs ${
                darkMode ? "text-slate-500" : "text-slate-400"
              }`}
            >
              {user?.email || "admin@ems.com"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
            darkMode
              ? "text-slate-400 hover:bg-red-500/10 hover:text-red-400"
              : "text-slate-500 hover:bg-red-50 hover:text-red-600"
          }`}
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
