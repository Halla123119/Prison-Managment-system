import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const emptyForm = { username: "", password: "", role: "Staff" };

const DASHBOARD_BANNER =
  "https://images.unsplash.com/photo-1579668370587-78847a6cc01e?auto=format&fit=crop&w=1600&q=80";

export default function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [statsError, setStatsError] = useState("");
  const [loading, setLoading] = useState(true);

  // Quick "create user" panel
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get("/reports")
      .then((res) => setStats(res.data))
      .catch(() => setStatsError("Could not load live stats."))
      .finally(() => setLoading(false));
  }, []);

  function validate() {
    const e = {};
    if (!form.username.trim()) e.username = "Username is required.";
    else if (form.username.length > 50) e.username = "Max 50 characters.";

    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 4)
      e.password = "Password must be at least 4 characters.";

    if (!form.role) e.role = "Role is required.";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleCreateUser(ev) {
    ev.preventDefault();
    setServerError("");
    setSuccessMsg("");
    if (!validate()) return;

    setSaving(true);
    try {
      await api.post("/users", {
        username: form.username.trim(),
        password: form.password,
        role: form.role,
      });
      setSuccessMsg(`User "${form.username.trim()}" was created.`);
      setForm(emptyForm);
      setErrors({});
    } catch (err) {
      if (err.response?.status === 400 && err.response.data) {
        setServerError(
          typeof err.response.data === "string"
            ? err.response.data
            : "Username already exists."
        );
      } else {
        setServerError("Failed to create user.");
      }
    } finally {
      setSaving(false);
    }
  }

  const occupancyPct =
    stats && stats.totalCells > 0
      ? Math.round((stats.occupiedCells / stats.totalCells) * 100)
      : 0;

  return (
    <div className="page">
      <div
        className="dashboard-banner"
        style={{ backgroundImage: `url(${DASHBOARD_BANNER})` }}
      >
        <div className="page-header" style={{ margin: 0 }}>
          <div>
            <h1>Welcome back, {user?.username}</h1>
            <p>Here's a quick snapshot of the facility right now.</p>
          </div>
          <Link className="btn btn-ghost" to="/reports">
            Full Report →
          </Link>
        </div>
      </div>

      {loading && <p style={{ color: "var(--muted)" }}>Loading dashboard...</p>}
      {statsError && <div className="form-error-banner">{statsError}</div>}

      {stats && (
        <>
          <div className="grid grid-3">
            <div className="stat-card">
              <div className="stat-value">{stats.totalPrisoners}</div>
              <div className="stat-label">Total Prisoners</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.totalStaff}</div>
              <div className="stat-label">Total Staff</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.totalCells}</div>
              <div className="stat-label">Total Cells</div>
            </div>
          </div>

          <div className="card" style={{ marginTop: "1.5rem" }}>
            <h3 style={{ marginTop: 0 }}>Cell Occupancy</h3>
            <p style={{ color: "var(--muted)", marginTop: 0 }}>
              {stats.occupiedCells} occupied / {stats.availableCells} available
              ({occupancyPct}% occupied)
            </p>
            <div
              style={{
                background: "var(--navy-700)",
                borderRadius: "999px",
                height: "14px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${occupancyPct}%`,
                  height: "100%",
                  background:
                    "linear-gradient(90deg, var(--gold-500), var(--gold-400))",
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* Quick navigation */}
      <div className="grid grid-3" style={{ marginTop: "1.5rem" }}>
        <Link to="/prisoners" className="card" style={{ textDecoration: "none" }}>
          <h3 style={{ color: "var(--ink)" }}>Manage Prisoners →</h3>
          <p style={{ color: "var(--muted)", margin: 0 }}>
            View, add, edit, or search prisoner records.
          </p>
        </Link>
        <Link to="/cells" className="card" style={{ textDecoration: "none" }}>
          <h3 style={{ color: "var(--ink)" }}>Manage Cells →</h3>
          <p style={{ color: "var(--muted)", margin: 0 }}>
            Update cell capacity and availability.
          </p>
        </Link>
        <Link to="/staff" className="card" style={{ textDecoration: "none" }}>
          <h3 style={{ color: "var(--ink)" }}>Manage Staff →</h3>
          <p style={{ color: "var(--muted)", margin: 0 }}>
            Keep the personnel directory current.
          </p>
        </Link>
      </div>

      {/* Quick create user */}
      <div className="card quick-user-card" style={{ marginTop: "1.5rem" }}>
        <div className="page-header" style={{ marginBottom: "1rem" }}>
          <div>
            <h3 style={{ margin: 0 }}>Create a New User</h3>
            <p style={{ margin: "0.2rem 0 0" }}>
              Add a login account for a staff member right from the dashboard.
            </p>
          </div>
          <Link className="btn btn-ghost btn-sm" to="/users">
            Manage all users →
          </Link>
        </div>

        {serverError && (
          <div className="form-error-banner" style={{ marginBottom: "1rem" }}>
            {serverError}
          </div>
        )}
        {successMsg && (
          <div className="form-success-banner" style={{ marginBottom: "1rem" }}>
            {successMsg}
          </div>
        )}

        <form className="form form-inline" onSubmit={handleCreateUser} noValidate>
          <div className="form-row">
            <label htmlFor="qu-username">Username</label>
            <input
              id="qu-username"
              value={form.username}
              onChange={(e) =>
                setForm((f) => ({ ...f, username: e.target.value }))
              }
            />
            {errors.username && (
              <span className="field-error">{errors.username}</span>
            )}
          </div>

          <div className="form-row">
            <label htmlFor="qu-password">Password</label>
            <input
              id="qu-password"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          <div className="form-row">
            <label htmlFor="qu-role">Role</label>
            <select
              id="qu-role"
              value={form.role}
              onChange={(e) =>
                setForm((f) => ({ ...f, role: e.target.value }))
              }
            >
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          <div className="form-row form-row-btn">
            <button className="btn btn-gold" type="submit" disabled={saving}>
              {saving ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
