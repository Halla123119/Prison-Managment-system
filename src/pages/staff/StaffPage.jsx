import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

const emptyForm = { fullName: "", position: "", phone: "" };

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadStaff();
  }, []);

  function loadStaff() {
    setLoading(true);
    api
      .get("/staff")
      .then((res) => setStaff(res.data))
      .catch(() => setServerError("Could not load staff."))
      .finally(() => setLoading(false));
  }

  function validate() {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    else if (form.fullName.length > 100) e.fullName = "Max 100 characters.";

    if (!form.position.trim()) e.position = "Position is required.";
    else if (form.position.length > 50) e.position = "Max 50 characters.";

    const phoneDigits = form.phone.replace(/\D/g, "");
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    else if (phoneDigits.length < 7)
      e.phone = "Enter a valid phone number.";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setServerError("");
    if (!validate()) return;

    const payload = {
      fullName: form.fullName.trim(),
      position: form.position.trim(),
      phone: form.phone.trim(),
    };

    setSaving(true);
    try {
      if (editingId) {
        await api.put("/staff", { staffId: editingId, ...payload });
      } else {
        await api.post("/staff", payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      loadStaff();
    } catch {
      setServerError("Failed to save staff member.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(s) {
    setEditingId(s.staffId);
    setForm({ fullName: s.fullName, position: s.position, phone: s.phone });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete staff member "${name}"?`)) return;
    try {
      await api.delete(`/staff/${id}`);
      setStaff((prev) => prev.filter((s) => s.staffId !== id));
    } catch {
      alert("Failed to delete staff member.");
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return staff;
    return staff.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.position.toLowerCase().includes(q)
    );
  }, [staff, query]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Staff</h1>
          <p>Manage facility personnel and contact details.</p>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "320px 1fr", gap: "1.5rem" }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>
            {editingId ? "Edit Staff" : "Add Staff"}
          </h3>

          {serverError && (
            <div className="form-error-banner" style={{ marginBottom: "1rem" }}>
              {serverError}
            </div>
          )}

          <form className="form" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                value={form.fullName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fullName: e.target.value }))
                }
              />
              {errors.fullName && (
                <span className="field-error">{errors.fullName}</span>
              )}
            </div>

            <div className="form-row">
              <label htmlFor="position">Position</label>
              <input
                id="position"
                value={form.position}
                onChange={(e) =>
                  setForm((f) => ({ ...f, position: e.target.value }))
                }
              />
              {errors.position && (
                <span className="field-error">{errors.position}</span>
              )}
            </div>

            <div className="form-row">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
              />
              {errors.phone && (
                <span className="field-error">{errors.phone}</span>
              )}
            </div>

            <div style={{ display: "flex", gap: "0.6rem" }}>
              <button className="btn btn-gold" type="submit" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Save" : "Add Staff"}
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
                placeholder="Search by name or position..."
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
                    <th>Name</th>
                    <th>Position</th>
                    <th>Phone</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.staffId}>
                      <td>{s.fullName}</td>
                      <td>{s.position}</td>
                      <td>{s.phone}</td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => startEdit(s)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(s.staffId, s.fullName)}
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
                <div className="empty-state">
                  No staff match your search.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
