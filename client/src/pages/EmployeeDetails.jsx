import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Copy,
  Edit3,
  KeyRound,
  Mail,
  Phone,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState("");


  const [creatingAccount, setCreatingAccount] = useState(false);
const [account, setAccount] = useState(null);
const [accountError, setAccountError] = useState("");
const [copied, setCopied] = useState(false);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") !== "light",
  );

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/employees/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setEmployee(response.data.employee);
      } catch (error) {
        console.error("Failed to fetch employee:", error);

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
      fetchEmployee();
    } else {
      navigate("/login");
    }
  }, [id, navigate, token]);

  const handleCreateAccount = async () => {
  setCreatingAccount(true);
  setAccountError("");
  setCopied(false);

  try {
    const response = await axios.post(
      `http://localhost:5000/api/employees/${id}/account`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setAccount(response.data);
  } catch (error) {
    console.error("Failed to create employee account:", error);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }

    setAccountError(
      error.response?.data?.message ||
        "Failed to create login account."
    );
  } finally {
    setCreatingAccount(false);
  }
};

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");

    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/employees");
    } catch (error) {
      console.error("Failed to delete employee:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setDeleteError(
        error.response?.data?.message ||
          "Failed to delete employee. Please try again.",
      );

      setDeleting(false);
    }
  };

  const toggleTheme = () => {
    const nextMode = !darkMode;

    setDarkMode(nextMode);
    localStorage.setItem("theme", nextMode ? "dark" : "light");
  };

  if (loading) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center ${
          darkMode ? "bg-[#09090b] text-white" : "bg-[#f5f5f5] text-slate-900"
        }`}
      >
        <p className="text-sm text-slate-500">Loading employee...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div
        className={`flex min-h-screen flex-col items-center justify-center px-6 text-center ${
          darkMode ? "bg-[#09090b] text-white" : "bg-[#f5f5f5] text-slate-900"
        }`}
      >
        <UserRound size={40} className="mb-4 opacity-40" />

        <h2 className="text-xl font-semibold">Employee not found</h2>

        <p className="mt-2 text-sm text-slate-500">
          The employee you're looking for doesn't exist.
        </p>

        <button
          onClick={() => navigate("/employees")}
          className="mt-6 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          Back to employees
        </button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#09090b] text-white" : "bg-[#f5f5f5] text-slate-900"
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
              <h1 className="text-xl font-semibold tracking-tight">
                Employee profile
              </h1>

              <p
                className={`mt-1 text-xs ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                View employee information and employment details.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
                darkMode
                  ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {darkMode ? "☀" : "☾"}
            </button>
            {/* delete */}
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                darkMode
                  ? "border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/15"
                  : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
              }`}
            >
              <Trash2 size={17} />
              <span className="hidden sm:inline">Delete</span>
            </button>
            {/* Edit */}
            <button
              type="button"
              onClick={() => navigate(`/employees/${employee._id}/edit`)}
              className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                darkMode
                  ? "bg-white text-black hover:bg-slate-200"
                  : "bg-black text-white hover:bg-slate-800"
              }`}
            >
              <Edit3 size={17} />
              <span className="hidden sm:inline">Edit</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-5 sm:p-8">
        {/* Profile hero */}
        <section
          className={`rounded-2xl border p-6 sm:p-8 ${
            darkMode
              ? "border-white/10 bg-[#111113]"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
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
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {employee.firstName} {employee.lastName}
                  </h2>

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
                </div>

                <p
                  className={`mt-2 text-sm ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {employee.designation}
                </p>

                <p
                  className={`mt-1 text-xs ${
                    darkMode ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  {employee.employeeId}
                </p>
              </div>
            </div>

            <div
              className={`rounded-xl border px-5 py-4 ${
                darkMode
                  ? "border-white/10 bg-white/[0.03]"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <p
                className={`text-xs ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Department
              </p>

              <p className="mt-1 text-sm font-medium">{employee.department}</p>
            </div>
          </div>
        </section>
  {/* Login Account */}
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
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  darkMode
                    ? "bg-white/5 text-slate-300"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <KeyRound size={19} />
              </div>

              <div>
                <h2 className="font-semibold">Login account</h2>

                <p
                  className={`mt-1 text-xs ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Manage this employee's access to EMS.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {!account ? (
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />

                    <p className="text-sm font-medium">
                      No login account
                    </p>
                  </div>

                  <p
                    className={`mt-2 text-sm ${
                      darkMode ? "text-slate-500" : "text-slate-500"
                    }`}
                  >
                    Create an account so this employee can sign in.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCreateAccount}
                  disabled={creatingAccount}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    darkMode
                      ? "bg-white text-black hover:bg-slate-200"
                      : "bg-black text-white hover:bg-slate-800"
                  } ${
                    creatingAccount
                      ? "cursor-not-allowed opacity-60"
                      : ""
                  }`}
                >
                  <KeyRound size={17} />

                  {creatingAccount
                    ? "Creating..."
                    : "Create login account"}
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={19}
                    className="text-emerald-500"
                  />

                  <p className="text-sm font-semibold">
                    Login account created
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p
                      className={`text-xs ${
                        darkMode
                          ? "text-slate-500"
                          : "text-slate-400"
                      }`}
                    >
                      Email
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {account.account.email}
                    </p>
                  </div>

                  <div>
                    <p
                      className={`text-xs ${
                        darkMode
                          ? "text-slate-500"
                          : "text-slate-400"
                      }`}
                    >
                      Role
                    </p>

                    <p className="mt-1 text-sm font-medium capitalize">
                      {account.account.role}
                    </p>
                  </div>
                </div>

                <div
                  className={`rounded-xl border p-4 ${
                    darkMode
                      ? "border-amber-500/20 bg-amber-500/5"
                      : "border-amber-200 bg-amber-50"
                  }`}
                >
                  <p className="text-xs font-medium text-amber-500">
                    Temporary password
                  </p>

                  <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <code className="flex-1 break-all rounded-lg bg-black/10 px-3 py-2 text-sm font-semibold">
                      {account.temporaryPassword}
                    </code>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          account.temporaryPassword
                        );

                        setCopied(true);

                        setTimeout(() => {
                          setCopied(false);
                        }, 2000);
                      }}
                      className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                        darkMode
                          ? "border-white/10 hover:bg-white/5"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <Copy size={15} />

                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>

                  <p className="mt-3 text-xs text-amber-500">
                    Save this password now. It will not be shown again.
                  </p>
                </div>
              </div>
            )}

            {accountError && (
              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {accountError}
              </div>
            )}
          </div>
        </section>

        {/* Information */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Personal */}
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
                  <UserRound size={18} />
                </div>

                <div>
                  <h3 className="font-semibold">Personal information</h3>

                  <p
                    className={`mt-1 text-xs ${
                      darkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Employee contact details.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div className="flex items-start gap-4">
                <Mail
                  size={18}
                  className={`mt-0.5 ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                />

                <div>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Email
                  </p>

                  <p className="mt-1 text-sm font-medium">{employee.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone
                  size={18}
                  className={`mt-0.5 ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                />

                <div>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-medium">{employee.phone}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Employment */}
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
                  <BriefcaseBusiness size={18} />
                </div>

                <div>
                  <h3 className="font-semibold">Employment information</h3>

                  <p
                    className={`mt-1 text-xs ${
                      darkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Role and employment details.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-6 sm:grid-cols-2">
              <InfoItem
                label="Department"
                value={employee.department}
                darkMode={darkMode}
              />

              <InfoItem
                label="Designation"
                value={employee.designation}
                darkMode={darkMode}
              />

              <InfoItem
                label="Employment type"
                value={employee.employmentType}
                darkMode={darkMode}
                capitalize
              />

              <InfoItem
                label="Status"
                value={employee.status}
                darkMode={darkMode}
                capitalize
              />

              <div className="sm:col-span-2">
                <div className="flex items-start gap-3">
                  <CalendarDays
                    size={18}
                    className={`mt-0.5 ${
                      darkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  />

                  <div>
                    <p
                      className={`text-xs ${
                        darkMode ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      Joining date
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {new Date(employee.joiningDate).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* System information */}
        <section
          className={`mt-6 rounded-2xl border ${
            darkMode
              ? "border-white/10 bg-[#111113]"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="p-6">
            <h3 className="font-semibold">Record information</h3>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <InfoItem
                label="Created"
                value={new Date(employee.createdAt).toLocaleString("en-IN")}
                darkMode={darkMode}
              />

              <InfoItem
                label="Last updated"
                value={new Date(employee.updatedAt).toLocaleString("en-IN")}
                darkMode={darkMode}
              />
            </div>
          </div>
        </section>
      </main>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => {
              if (!deleting) {
                setShowDeleteModal(false);
              }
            }}
          />

          {/* Modal */}
          <div
            className={`relative w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
              darkMode
                ? "border-white/10 bg-[#111113]"
                : "border-slate-200 bg-white"
            }`}
          >
            {/* Close */}
            <button
              type="button"
              disabled={deleting}
              onClick={() => setShowDeleteModal(false)}
              className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg transition ${
                darkMode
                  ? "text-slate-500 hover:bg-white/5 hover:text-white"
                  : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              }`}
            >
              <X size={18} />
            </button>

            {/* Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
              <Trash2 size={21} />
            </div>

            <h2 className="mt-5 text-xl font-semibold">Delete employee?</h2>

            <p
              className={`mt-2 pr-6 text-sm leading-6 ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              You are about to permanently delete{" "}
              <span className="font-medium text-current">
                {employee.firstName} {employee.lastName}
              </span>
              . This action cannot be undone.
            </p>

            {deleteError && (
              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {deleteError}
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setShowDeleteModal(false)}
                className={`rounded-xl border px-5 py-3 text-sm font-medium transition ${
                  darkMode
                    ? "border-white/10 text-slate-300 hover:bg-white/5"
                    : "border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className={`flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 ${
                  deleting ? "cursor-not-allowed opacity-60" : ""
                }`}
              >
                <Trash2 size={16} />

                {deleting ? "Deleting..." : "Delete employee"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value, darkMode, capitalize = false }) {
  return (
    <div>
      <p
        className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}
      >
        {label}
      </p>

      <p
        className={`mt-1 text-sm font-medium ${capitalize ? "capitalize" : ""}`}
      >
        {value || "—"}
      </p>
    </div>
  );
}

export default EmployeeDetails;
