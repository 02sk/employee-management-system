import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EmployeeProfile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") !== "light",
  );

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "https://employee-management-system-6ib0.onrender.com/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setEmployee(response.data.employee);
      } catch (error) {
        console.error("Failed to fetch profile:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        setError(
          error.response?.data?.message ||
            "Unable to load your profile.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (!token) {
      navigate("/login");
      return;
    }

    fetchProfile();
  }, [navigate, token]);

  const toggleTheme = () => {
    const nextMode = !darkMode;

    setDarkMode(nextMode);
    localStorage.setItem("theme", nextMode ? "dark" : "light");
  };

  if (loading) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center ${
          darkMode
            ? "bg-[#09090b] text-white"
            : "bg-[#f5f5f5] text-slate-900"
        }`}
      >
        <p className="text-sm text-slate-500">
          Loading profile...
        </p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center px-6 ${
          darkMode
            ? "bg-[#09090b] text-white"
            : "bg-[#f5f5f5] text-slate-900"
        }`}
      >
        <div className="text-center">
          <UserRound
            size={40}
            className="mx-auto mb-4 opacity-40"
          />

          <h2 className="text-xl font-semibold">
            Profile unavailable
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error || "Your employee profile could not be loaded."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/employee-dashboard")}
            className={`mt-6 rounded-xl px-5 py-3 text-sm font-semibold ${
              darkMode
                ? "bg-white text-black"
                : "bg-black text-white"
            }`}
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-[#09090b] text-white"
          : "bg-[#f5f5f5] text-slate-900"
      }`}
    >
      <header
        className={`sticky top-0 z-20 border-b backdrop-blur-xl ${
          darkMode
            ? "border-white/10 bg-[#09090b]/90"
            : "border-slate-200 bg-white/90"
        }`}
      >
        <div className="flex min-h-20 items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/employee-dashboard")}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                darkMode
                  ? "border-white/10 bg-white/5 text-slate-300"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                My Profile
              </h1>

              <p
                className={`mt-1 text-xs ${
                  darkMode
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              >
                View your employee information.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
              darkMode
                ? "border-white/10 bg-white/5 text-slate-300"
                : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            {darkMode ? "☀" : "☾"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-5 sm:p-8">
        {/* Profile header */}
        <section
          className={`rounded-2xl border p-6 sm:p-8 ${
            darkMode
              ? "border-white/10 bg-[#111113]"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div
              className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-2xl font-semibold ${
                darkMode
                  ? "bg-white/10 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {employee.firstName?.[0]}
              {employee.lastName?.[0]}
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                {employee.firstName} {employee.lastName}
              </h2>

              <p
                className={`mt-2 text-sm ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                {employee.designation}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    darkMode
                      ? "bg-white/5 text-slate-300"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {employee.employeeId}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    employee.status === "active"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-slate-500/10 text-slate-500"
                  }`}
                >
                  {employee.status}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Personal information */}
        <section
          className={`mt-6 rounded-2xl border ${
            darkMode
              ? "border-white/10 bg-[#111113]"
              : "border-slate-200 bg-white"
          }`}
        >
          <div
            className={`border-b px-6 py-5 ${
              darkMode
                ? "border-white/10"
                : "border-slate-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  darkMode
                    ? "bg-white/5 text-slate-300"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <UserRound size={19} />
              </div>

              <div>
                <h2 className="font-semibold">
                  Personal information
                </h2>

                <p
                  className={`mt-1 text-xs ${
                    darkMode
                      ? "text-slate-500"
                      : "text-slate-400"
                  }`}
                >
                  Your contact information.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2">
            <div className="flex gap-3">
              <Mail
                size={18}
                className="mt-0.5 text-slate-400"
              />

              <div>
                <p className="text-xs text-slate-500">
                  Email
                </p>
                <p className="mt-1 text-sm font-medium">
                  {employee.email}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Phone
                size={18}
                className="mt-0.5 text-slate-400"
              />

              <div>
                <p className="text-xs text-slate-500">
                  Phone
                </p>
                <p className="mt-1 text-sm font-medium">
                  {employee.phone || "—"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Employment information */}
        <section
          className={`mt-6 rounded-2xl border ${
            darkMode
              ? "border-white/10 bg-[#111113]"
              : "border-slate-200 bg-white"
          }`}
        >
          <div
            className={`border-b px-6 py-5 ${
              darkMode
                ? "border-white/10"
                : "border-slate-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  darkMode
                    ? "bg-white/5 text-slate-300"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <BriefcaseBusiness size={19} />
              </div>

              <div>
                <h2 className="font-semibold">
                  Employment information
                </h2>

                <p
                  className={`mt-1 text-xs ${
                    darkMode
                      ? "text-slate-500"
                      : "text-slate-400"
                  }`}
                >
                  Your current employment details.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2">
            <div>
              <p className="text-xs text-slate-500">
                Department
              </p>
              <p className="mt-1 text-sm font-medium">
                {employee.department}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Designation
              </p>
              <p className="mt-1 text-sm font-medium">
                {employee.designation}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Employment type
              </p>
              <p className="mt-1 text-sm font-medium capitalize">
                {employee.employmentType?.replace("-", " ")}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Joining date
              </p>
              <div className="mt-1 flex items-center gap-2 text-sm font-medium">
                <CalendarDays
                  size={16}
                  className="text-slate-400"
                />
                {new Date(employee.joiningDate).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  },
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default EmployeeProfile;