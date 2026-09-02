import {
  ArrowLeft,
  CalendarDays,
  Mail,
  Phone,
  Save,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddEmployee() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") !== "light"
  );

  const [formData, setFormData] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    joiningDate: "",
    employmentType: "full-time",
    status: "active",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await axios.post(
        "https://employee-management-system-6ib0.onrender.com/api/employees",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/employees");
    } catch (error) {
      console.error("Failed to create employee:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to create employee. Please check the information and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full rounded-xl border py-3.5 px-4 text-sm outline-none transition ${
    darkMode
      ? "border-white/10 bg-white/[0.03] text-white placeholder:text-slate-600 focus:border-white/30 focus:bg-white/[0.05]"
      : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
  }`;

  const labelClass = `mb-2 block text-sm font-medium ${
    darkMode ? "text-slate-300" : "text-slate-700"
  }`;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-[#09090b] text-white"
          : "bg-[#f5f5f5] text-slate-900"
      }`}
    >
      {/* Header */}
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
              onClick={() => navigate("/employees")}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                darkMode
                  ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Add employee
              </h1>

              <p
                className={`mt-1 text-sm ${
                  darkMode ? "text-slate-500" : "text-slate-500"
                }`}
              >
                Add a new employee to your organization.
              </p>
            </div>
          </div>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={() => {
              const nextMode = !darkMode;

              setDarkMode(nextMode);
              localStorage.setItem(
                "theme",
                nextMode ? "dark" : "light"
              );
            }}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition ${
              darkMode
                ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {darkMode ? (
              <span className="text-base">☀</span>
            ) : (
              <span className="text-base">☾</span>
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-5 sm:p-8">
        <form onSubmit={handleSubmit}>
          {/* Personal information */}
          <section
            className={`rounded-2xl border ${
              darkMode
                ? "border-white/10 bg-[#111113]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div
              className={`border-b px-6 py-5 ${
                darkMode ? "border-white/10" : "border-slate-200"
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
                      darkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Basic information about the employee.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-6 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Employee ID
                </label>

                <input
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  placeholder="EMP002"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  First name
                </label>

                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Last name
                </label>

                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                      darkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Phone number
                </label>

                <div className="relative">
                  <Phone
                    size={17}
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                      darkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    required
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Joining date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={17}
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                      darkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  />

                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    required
                    className={`${inputClass} pl-10`}
                  />
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
                darkMode ? "border-white/10" : "border-slate-200"
              }`}
            >
              <h2 className="font-semibold">
                Employment information
              </h2>

              <p
                className={`mt-1 text-xs ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Role and employment details.
              </p>
            </div>

            <div className="grid gap-5 p-6 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Department
                </label>

                <input
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Engineering"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Designation
                </label>

                <input
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Software Engineer"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Employment type
                </label>

                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option
                    value="full-time"
                    className={darkMode ? "bg-[#111113]" : "bg-white"}
                  >
                    Full-time
                  </option>

                  <option
                    value="part-time"
                    className={darkMode ? "bg-[#111113]" : "bg-white"}
                  >
                    Part-time
                  </option>

                  <option
                    value="contract"
                    className={darkMode ? "bg-[#111113]" : "bg-white"}
                  >
                    Contract
                  </option>

                  <option
                    value="intern"
                    className={darkMode ? "bg-[#111113]" : "bg-white"}
                  >
                    Intern
                  </option>
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={inputClass}
                >
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
              </div>
            </div>
          </section>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/employees")}
              className={`rounded-xl border px-5 py-3 text-sm font-medium transition ${
                darkMode
                  ? "border-white/10 text-slate-300 hover:bg-white/5"
                  : "border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
                darkMode
                  ? "bg-white text-black hover:bg-slate-200"
                  : "bg-black text-white hover:bg-slate-800"
              } ${
                loading
                  ? "cursor-not-allowed opacity-60"
                  : ""
              }`}
            >
              <Save size={17} />

              {loading ? "Creating..." : "Create employee"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AddEmployee;