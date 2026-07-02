import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

const emptyForm = { cellNumber: "", capacity: "", status: "Available" };

export default function CellsPage() {
  const [cells, setCells] = useState([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCells();
  }, []);

  function loadCells() {
    setLoading(true);
    api
      .get("/cells")
      .then((res) => setCells(res.data))
      .catch(() => setServerError("Could not load cells."))
      .finally(() => setLoading(false));
  }

  function validate() {
    const e = {};
    if (!form.cellNumber.trim()) e.cellNumber = "Cell number is required.";
    else if (form.cellNumber.length > 20)
      e.cellNumber = "Max 20 characters.";

    const capacity = Number(form.capacity);
    if (!form.capacity) e.capacity = "Capacity is required.";
    else if (Number.isNaN(capacity) || capacity < 1)
      e.capacity = "Capacity must be at least 1.";

    if (!form.status) e.status = "Status is required.";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setServerError("");
    if (!validate()) return;

    const payload = {
      cellNumber: form.cellNumber.trim(),
      capacity: Number(form.capacity),
      status: form.status,
    };

    setSaving(true);
    try {
      if (editingId) {
        await api.put("/cells", { cellId: editingId, ...payload });
      } else {
        await api.post("/cells", payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      loadCells();
    } catch {
      setServerError("Failed to save cell.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(cell) {
    setEditingId(cell.cellId);
    setForm({
      cellNumber: cell.cellNumber,
      capacity: String(cell.capacity),
      status: cell.status,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
  }

  async function handleDelete(id, label) {
    if (!window.confirm(`Delete cell "${label}"?`)) return;
    try {
      await api.delete(`/cells/${id}`);
      setCells((prev) => prev.filter((c) => c.cellId !== id));
    } catch {
      alert("Failed to delete cell.");
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cells;
    return cells.filter((c) => c.cellNumber.toLowerCase().includes(q));
  }, [cells, query]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Cells</h1>
          <p>Manage cell numbers, capacity, and availability.</p>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "320px 1fr", gap: "1.5rem" }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>
            {editingId ? "Edit Cell" : "Add Cell"}
          </h3>

          {serverError && (
            <div className="form-error-banner" style={{ marginBottom: "1rem" }}>
              {serverError}
            </div>
          )}

          <form className="form" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <label htmlFor="cellNumber">Cell Number</label>
              <input
                id="cellNumber"
                value={form.cellNumber}
                onChange={(e) =>
                  setForm((f) => ({ ...f, cellNumber: e.target.value }))
                }
              />
              {errors.cellNumber && (
                <span className="field-error">{errors.cellNumber}</span>
              )}
            </div>

            <div className="form-row">
              <label htmlFor="capacity">Capacity</label>
              <input
                id="capacity"
                type="number"
                value={form.capacity}
                onChange={(e) =>
                  setForm((f) => ({ ...f, capacity: e.target.value }))
                }
              />
              {errors.capacity && (
                <span className="field-error">{errors.capacity}</span>
              )}
            </div>

            <div className="form-row">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value }))
                }
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
              </select>
              {errors.status && (
                <span className="field-error">{errors.status}</span>
              )}
            </div>

            <div style={{ display: "flex", gap: "0.6rem" }}>
              <button className="btn btn-gold" type="submit" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Save" : "Add Cell"}
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
                placeholder="Search by cell number..."
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
                    <th>Cell #</th>
                    <th>Capacity</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.cellId}>
                      <td>{c.cellNumber}</td>
                      <td>{c.capacity}</td>
                      <td>
                        <span
                          className={`badge ${
                            c.status === "Available"
                              ? "badge-available"
                              : "badge-occupied"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => startEdit(c)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              handleDelete(c.cellId, c.cellNumber)
                            }
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
                <div className="empty-state">No cells match your search.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
