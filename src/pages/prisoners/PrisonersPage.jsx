import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

const emptyForm = {
  fullName: "",
  gender: "Male",
  age: "",
  crime: "",
  sentenceYears: "",
  cellId: "",
};

export default function PrisonersPage() {
  const [prisoners, setPrisoners] = useState([]);
  const [cells, setCells] = useState([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    setLoading(true);
    setServerError("");
    Promise.all([api.get("/prisoners"), api.get("/cells")])
      .then(([pRes, cRes]) => {
        setPrisoners(pRes.data);
        setCells(cRes.data);
      })
      .catch(() => setServerError("Could not load prisoners. Is the API running?"))
      .finally(() => setLoading(false));
  }

  function cellNumberFor(cellId) {
    const cell = cells.find((c) => c.cellId === cellId);
    return cell ? cell.cellNumber : `#${cellId}`;
  }

  function validate() {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    else if (form.fullName.length > 100)
      e.fullName = "Max 100 characters.";

    if (!form.gender) e.gender = "Gender is required.";

    const age = Number(form.age);
    if (!form.age) e.age = "Age is required.";
    else if (Number.isNaN(age) || age < 12 || age > 120)
      e.age = "Age must be between 12 and 120.";

    if (!form.crime.trim()) e.crime = "Crime is required.";
    else if (form.crime.length > 200) e.crime = "Max 200 characters.";

    const sentence = Number(form.sentenceYears);
    if (form.sentenceYears === "") e.sentenceYears = "Sentence is required.";
    else if (Number.isNaN(sentence) || sentence < 0 || sentence > 100)
      e.sentenceYears = "Must be between 0 and 100 years.";

    if (!form.cellId) e.cellId = "Please select a cell.";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setServerError("");
    if (!validate()) return;

    const payload = {
      fullName: form.fullName.trim(),
      gender: form.gender,
      age: Number(form.age),
      crime: form.crime.trim(),
      sentenceYears: Number(form.sentenceYears),
      cellId: Number(form.cellId),
    };

    setSaving(true);
    try {
      if (editingId) {
        await api.put("/prisoners", { prisonerId: editingId, ...payload });
      } else {
        await api.post("/prisoners", payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      loadData();
    } catch {
      setServerError("Failed to save prisoner.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(p) {
    setEditingId(p.prisonerId);
    setForm({
      fullName: p.fullName,
      gender: p.gender,
      age: String(p.age),
      crime: p.crime,
      sentenceYears: String(p.sentenceYears),
      cellId: String(p.cellId),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete prisoner "${name}"? This cannot be undone.`))
      return;
    try {
      await api.delete(`/prisoners/${id}`);
      setPrisoners((prev) => prev.filter((p) => p.prisonerId !== id));
    } catch {
      alert("Failed to delete prisoner.");
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return prisoners;
    return prisoners.filter(
      (p) =>
        p.fullName.toLowerCase().includes(q) ||
        p.crime.toLowerCase().includes(q)
    );
  }, [prisoners, query]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Prisoners</h1>
          <p>Add, search, edit, or remove prisoner records.</p>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "340px 1fr", gap: "1.5rem" }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>
            {editingId ? "Edit Prisoner" : "Add Prisoner"}
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
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                value={form.gender}
                onChange={(e) =>
                  setForm((f) => ({ ...f, gender: e.target.value }))
                }
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="form-row">
              <label htmlFor="age">Age</label>
              <input
                id="age"
                type="number"
                value={form.age}
                onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
              />
              {errors.age && <span className="field-error">{errors.age}</span>}
            </div>

            <div className="form-row">
              <label htmlFor="crime">Crime</label>
              <input
                id="crime"
                value={form.crime}
                onChange={(e) =>
                  setForm((f) => ({ ...f, crime: e.target.value }))
                }
              />
              {errors.crime && (
                <span className="field-error">{errors.crime}</span>
              )}
            </div>

            <div className="form-row">
              <label htmlFor="sentenceYears">Sentence (years)</label>
              <input
                id="sentenceYears"
                type="number"
                value={form.sentenceYears}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sentenceYears: e.target.value }))
                }
              />
              {errors.sentenceYears && (
                <span className="field-error">{errors.sentenceYears}</span>
              )}
            </div>

            <div className="form-row">
              <label htmlFor="cellId">Cell</label>
              <select
                id="cellId"
                value={form.cellId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, cellId: e.target.value }))
                }
              >
                <option value="">Select a cell...</option>
                {cells.map((c) => (
                  <option key={c.cellId} value={c.cellId}>
                    {c.cellNumber} ({c.status})
                  </option>
                ))}
              </select>
              {errors.cellId && (
                <span className="field-error">{errors.cellId}</span>
              )}
            </div>

            <div style={{ display: "flex", gap: "0.6rem" }}>
              <button className="btn btn-gold" type="submit" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Save" : "Add Prisoner"}
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
                placeholder="Search by name or crime..."
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
                    <th>Gender</th>
                    <th>Age</th>
                    <th>Crime</th>
                    <th>Sentence</th>
                    <th>Cell</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.prisonerId}>
                      <td>{p.fullName}</td>
                      <td>{p.gender}</td>
                      <td>{p.age}</td>
                      <td>{p.crime}</td>
                      <td>{p.sentenceYears} yr(s)</td>
                      <td>{cellNumberFor(p.cellId)}</td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => startEdit(p)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              handleDelete(p.prisonerId, p.fullName)
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
                <div className="empty-state">
                  No prisoners match your search.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
