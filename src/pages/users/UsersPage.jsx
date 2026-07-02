import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

const emptyForm = { username: "", password: "", role: "Staff" };

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  function loadUsers() {
    setLoading(true);
    api
      .get("/users")
      .then((res) => setUsers(res.data))
      .catch(() => setServerError("Could not load users."))
      .finally(() => setLoading(false));
  }

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

  async function handleSubmit(ev) {
    ev.preventDefault();
    setServerError("");
    setSuccessMsg("");
    if (!validate()) return;

    const payload = {
      username: form.username.trim(),
      password: form.password,
      role: form.role,
    };

    setSaving(true);
    try {
      if (editingId) {
        await api.put("/users", { userId: editingId, ...payload });
        setSuccessMsg("User updated.");
      } else {
        await api.post("/users", payload);
        setSuccessMsg("User registered.");
      }
      setForm(emptyForm);
      setEditingId(null);
      loadUsers();
    } catch (err) {
      if (err.response?.status === 400 && err.response.data) {
        setServerError(
          typeof err.response.data === "string"
            ? err.response.data
            : "Username already exists."
        );
      } else {
        setServerError("Failed to save user.");
      }
    } finally {
      setSaving(false);
    }
  }

  function startEdit(u) {
    setEditingId(u.userId);
    setSuccessMsg("");
    // Password is never returned by the API, so it must be re-entered
    // whenever a user record is updated.
    setForm({ username: u.username, password: "", role: u.role });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
  }

  async function handleDelete(id, username) {
    if (!window.confirm(`Delete user "${username}"?`)) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.userId !== id));
    } catch {
      alert("Failed to delete user.");
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.username.toLowerCase().includes(q));
  }, [users, query]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Users</h1>
          <p>Manage login accounts and roles.</p>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "320px 1fr", gap: "1.5rem" }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>
            {editingId ? "Edit User" : "Add User"}
          </h3>

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

          <form className="form" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <label htmlFor="username">Username</label>
              <input
                id="username"
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
              <label htmlFor="password">
                Password{editingId ? " (re-enter to change)" : ""}
              </label>
              <input
                id="password"
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
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={form.role}
                onChange={(e) =>
                  setForm((f) => ({ ...f, role: e.target.value }))
                }
              >
                <option value="Admin">Admin</option>
                <option value="Staff">Staff</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "0.6rem" }}>
              <button className="btn btn-gold" type="submit" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Save" : "Add User"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div>
          <div className="table-toolbar">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by username..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <p style={{ color: "var(--muted)" }}>Loading...</p>
          ) : (
            <div className="card" style={{ padding: 0, overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Role</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.userId}>
                      <td>{u.username}</td>
                      <td>{u.role}</td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => startEdit(u)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(u.userId, u.username)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="empty-state">No users match your search.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
