import {
  CheckCircle2,
  Clock3,
  Menu,
  Moon,
  Save,
  Settings as SettingsIcon,
  Sun,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";

function Settings() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdminOrHR = user?.role === "admin" || user?.role === "hr";
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") !== "light",
  );

  const [workStartTime, setWorkStartTime] = useState("09:00");
  const [lateAfterMinutes, setLateAfterMinutes] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSettings = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await axios.get("https://employee-management-system-6ib0.onrender.com/api/settings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const settings = response.data.settings;

        setWorkStartTime(settings.workStartTime || "09:00");
        setLateAfterMinutes(settings.lateAfterMinutes ?? 0);
      } catch (error) {
        console.error("Failed to fetch settings:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        setError(error.response?.data?.message || "Unable to load settings.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [navigate, token]);

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

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await axios.put(
        "https://employee-management-system-6ib0.onrender.com/api/settings",
        {
          workStartTime,
          lateAfterMinutes: Number(lateAfterMinutes),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setWorkStartTime(response.data.settings.workStartTime);

      setLateAfterMinutes(response.data.settings.lateAfterMinutes);

      setMessage("Settings saved successfully.");
    } catch (error) {
      console.error("Failed to save settings:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(error.response?.data?.message || "Unable to save settings.");
    } finally {
      setSaving(false);
    }
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

            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  darkMode
                    ? "bg-white/5 text-slate-300"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <SettingsIcon size={19} />
              </div>

              <div>
                <h1 className="text-lg font-semibold tracking-tight">
                  Settings
                </h1>

                <p
                  className={`hidden text-xs sm:block ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Configure your employee management system.
                </p>
              </div>
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
        <div className="mx-auto max-w-5xl p-5 sm:p-8">
          {isAdminOrHR && (
            <div
              className={`overflow-hidden rounded-2xl border ${
                darkMode
                  ? "border-white/10 bg-[#111113]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div
                className={`border-b px-6 py-6 ${
                  darkMode ? "border-white/10" : "border-slate-200"
                }`}
              >
                <h2 className="font-semibold">Attendance settings</h2>

                <p
                  className={`mt-1 text-sm ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Configure when the working day starts and when an employee
                  should be considered late.
                </p>
              </div>

              {loading ? (
                <div className="p-10 text-center text-sm text-slate-500">
                  Loading settings...
                </div>
              ) : (
                <form onSubmit={handleSave} className="p-6 sm:p-8">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Work start time
                      </label>

                      <div className="relative">
                        <Clock3
                          size={18}
                          className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                            darkMode ? "text-slate-500" : "text-slate-400"
                          }`}
                        />

                        <input
                          type="time"
                          value={workStartTime}
                          onChange={(e) => setWorkStartTime(e.target.value)}
                          className={`w-full rounded-xl border py-3.5 pl-11 pr-4 text-sm outline-none ${
                            darkMode
                              ? "border-white/10 bg-white/[0.03] text-white"
                              : "border-slate-200 bg-slate-50 text-slate-900"
                          }`}
                        />
                      </div>

                      <p
                        className={`mt-2 text-xs ${
                          darkMode ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        The normal start of the working day.
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Late after
                      </label>

                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          value={lateAfterMinutes}
                          onChange={(e) => setLateAfterMinutes(e.target.value)}
                          className={`w-full rounded-xl border px-4 py-3.5 pr-20 text-sm outline-none ${
                            darkMode
                              ? "border-white/10 bg-white/[0.03] text-white"
                              : "border-slate-200 bg-slate-50 text-slate-900"
                          }`}
                        />

                        <span
                          className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs ${
                            darkMode ? "text-slate-500" : "text-slate-400"
                          }`}
                        >
                          minutes
                        </span>
                      </div>

                      <p
                        className={`mt-2 text-xs ${
                          darkMode ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        Grace period after the work start time.
                      </p>
                    </div>
                  </div>

                  <div
                    className={`mt-6 rounded-xl border p-4 ${
                      darkMode
                        ? "border-white/10 bg-white/[0.02]"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <p className="text-sm font-medium">Attendance rule</p>

                    <p
                      className={`mt-2 text-sm ${
                        darkMode ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Employees checking in after{" "}
                      <span className="font-medium text-current">
                        {workStartTime}
                      </span>{" "}
                      plus the{" "}
                      <span className="font-medium text-current">
                        {lateAfterMinutes} minute
                        {Number(lateAfterMinutes) === 1 ? "" : "s"}
                      </span>{" "}
                      grace period will be marked late.
                    </p>
                  </div>

                  {message && (
                    <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-500">
                      <CheckCircle2 size={17} />
                      {message}
                    </div>
                  )}

                  {error && (
                    <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                      {error}
                    </div>
                  )}

                  <div className="mt-8 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
                        saving ? "cursor-not-allowed opacity-60" : ""
                      } ${
                        darkMode
                          ? "bg-white text-black hover:bg-slate-200"
                          : "bg-black text-white hover:bg-slate-800"
                      }`}
                    >
                      <Save size={17} />
                      {saving ? "Saving..." : "Save settings"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
          {!isAdminOrHR && (
            <div
              className={`overflow-hidden rounded-2xl border ${
                darkMode
                  ? "border-white/10 bg-[#111113]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div
                className={`border-b px-6 py-6 ${
                  darkMode ? "border-white/10" : "border-slate-200"
                }`}
              >
                <h2 className="font-semibold">My Account</h2>

                <p
                  className={`mt-1 text-sm ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Manage your personal account settings.
                </p>
              </div>

              <div className="p-6 sm:p-8">
                <div
                  className={`rounded-xl border p-5 ${
                    darkMode
                      ? "border-white/10 bg-white/[0.02]"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <p
                    className={`text-xs ${
                      darkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Logged in as
                  </p>

                  <p className="mt-2 text-sm font-medium">
                    {user?.email || "Employee"}
                  </p>

                  <p
                    className={`mt-1 text-xs capitalize ${
                      darkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    {user?.role || "employee"} account
                  </p>
                </div>

                <div
                  className={`mt-6 flex items-center justify-between rounded-xl border p-5 ${
                    darkMode
                      ? "border-white/10 bg-white/[0.02]"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium">Appearance</p>

                    <p
                      className={`mt-1 text-xs ${
                        darkMode ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      Switch between dark and light mode.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={toggleTheme}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                      darkMode
                        ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {darkMode ? "Light mode" : "Dark mode"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Settings;
