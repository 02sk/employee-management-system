import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Moon,
  Sun,
  ShieldCheck,
  Users,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState("admin");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      console.log("Login Success");
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        },
      );

      const { token, user } = response.data;

      // The backend remains the source of truth for the account role.
      const actualRole = user?.role?.toLowerCase();
      if (actualRole && actualRole !== selectedRole) {
        setError(
          `This account is registered as ${actualRole}. Please select ${actualRole} to continue.`,
        );
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user?.role === "employee") {
        navigate("/employee-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to login. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#09090b] text-white" : "bg-[#f5f5f5] text-slate-900"
      }`}
    >
      {/* Theme Toggle */}
      <button
        type="button"
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed right-6 top-6 z-10 flex h-11 w-11 items-center justify-center rounded-full border transition ${
          darkMode
            ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
        }`}
      >
        {darkMode ? <Sun size={19} /> : <Moon size={19} />}
      </button>

      <div className="flex min-h-screen">
        {/* Left branding section */}
        <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
          <div
            className={`absolute inset-0 ${
              darkMode ? "bg-[#09090b]" : "bg-white"
            }`}
          />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
                  <ShieldCheck size={22} />
                </div>

                <span className="text-lg font-semibold tracking-tight">
                  EMS
                </span>
              </div>
            </div>

            <div className="max-w-xl">
              <p
                className={`mb-4 text-sm font-medium uppercase tracking-[0.25em] ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Employee Management
              </p>

              <h1 className="text-5xl font-semibold leading-tight tracking-tight xl:text-6xl">
                Everything your team needs,
                <span
                  className={`block ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  in one place.
                </span>
              </h1>

              <p
                className={`mt-6 max-w-md text-base leading-7 ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Manage employees, attendance, leave, payroll and organizational
                workflows from one powerful platform.
              </p>
            </div>

            <p
              className={`text-xs ${
                darkMode ? "text-slate-600" : "text-slate-400"
              }`}
            >
              © 2026 Employee Management System
            </p>
          </div>
        </div>

        {/* Login section */}
        <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
          <div className="w-full max-w-md">
            <div
              className={`rounded-3xl border p-8 shadow-2xl sm:p-10 ${
                darkMode
                  ? "border-white/10 bg-[#111113] shadow-black/40"
                  : "border-slate-200 bg-white shadow-slate-200/60"
              }`}
            >
              {/* Mobile logo */}
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                  <ShieldCheck size={22} />
                </div>

                <span className="font-semibold">EMS</span>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-semibold tracking-tight">
                  Welcome back
                </h2>

                <p
                  className={`mt-2 text-sm ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Sign in to access your workspace.
                </p>
              </div>

              {/* Role selector */}
              <div
                className={`mb-6 rounded-2xl border p-1.5 ${
                  darkMode
                    ? "border-white/10 bg-white/[0.03]"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="relative grid grid-cols-3">
                  <div
                    className={`absolute inset-y-0 left-0 w-1/3 rounded-xl transition-transform duration-300 ${
                      selectedRole === "employee"
                        ? "translate-x-[200%]"
                        : selectedRole === "hr"
                          ? "translate-x-full"
                          : "translate-x-0"
                    } ${
                      darkMode
                        ? "bg-white shadow-lg shadow-black/20"
                        : "bg-black shadow-lg shadow-slate-300/40"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole("admin");
                      setError("");
                    }}
                    className={`relative z-10 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      selectedRole === "admin"
                        ? darkMode
                          ? "text-black"
                          : "text-white"
                        : darkMode
                          ? "text-slate-400 hover:text-white"
                          : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <ShieldCheck size={17} />
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole("hr");
                      setError("");
                    }}
                    className={`relative z-10 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      selectedRole === "hr"
                        ? darkMode
                          ? "text-black"
                          : "text-white"
                        : darkMode
                          ? "text-slate-400 hover:text-white"
                          : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <Users size={17} />
                    HR
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole("employee");
                      setError("");
                    }}
                    className={`relative z-10 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      selectedRole === "employee"
                        ? darkMode
                          ? "text-black"
                          : "text-white"
                        : darkMode
                          ? "text-slate-400 hover:text-white"
                          : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <Users size={17} />
                    Employee
                  </button>
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleLogin}>
                {/* Email */}
                <div>
                  <label
                    className={`mb-2 block text-sm font-medium ${
                      darkMode ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                        darkMode ? "text-slate-500" : "text-slate-400"
                      }`}
                    />

                    <input
                      type="email"
                      placeholder={
                        selectedRole === "admin"
                          ? "admin@ems.com"
                          : "employee@ems.com"
                      }
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full rounded-xl border py-3.5 pl-11 pr-4 text-sm outline-none transition ${
                        darkMode
                          ? "border-white/10 bg-white/[0.03] text-white placeholder:text-slate-600 focus:border-white/30 focus:bg-white/[0.05]"
                          : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                      }`}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      className={`text-sm font-medium ${
                        darkMode ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      className={`text-xs font-medium ${
                        darkMode
                          ? "text-slate-400 hover:text-white"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <Lock
                      size={18}
                      className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                        darkMode ? "text-slate-500" : "text-slate-400"
                      }`}
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full rounded-xl border py-3.5 pl-11 pr-12 text-sm outline-none transition ${
                        darkMode
                          ? "border-white/10 bg-white/[0.03] text-white placeholder:text-slate-600 focus:border-white/30 focus:bg-white/[0.05]"
                          : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${
                        darkMode
                          ? "text-slate-500 hover:text-white"
                          : "text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className={`w-full rounded-xl py-3.5 text-sm font-semibold transition ${
                    darkMode
                      ? "bg-white text-black hover:bg-slate-200"
                      : "bg-black text-white hover:bg-slate-800"
                  }`}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <p
                className={`mt-8 text-center text-xs ${
                  darkMode ? "text-slate-600" : "text-slate-400"
                }`}
              >
                Secure access · Employee Management System
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
