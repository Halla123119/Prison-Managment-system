import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  function validate() {
    const e = {};
    if (!form.username.trim()) e.username = "Username is required.";
    if (!form.password) e.password = "Password is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await api.post("/users/login", form);
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 401) {
        setServerError("Invalid username or password.");
      } else {
        setServerError("Could not reach the server. Is the API running?");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page login-wrapper">
      <div className="card" style={{ width: "100%", maxWidth: 420 }}>
        <h2 style={{ marginTop: 0 }}>Staff Login</h2>
        <p style={{ color: "var(--muted)", marginTop: 0 }}>
          Sign in with your Prison Management System account.
        </p>

        {serverError && (
          <div className="form-error-banner" style={{ marginBottom: "1rem" }}>
            {serverError}
          </div>
        )}

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
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
            <label htmlFor="password">Password</label>
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

          <button className="btn btn-gold" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "1.25rem" }}>
          Seeded accounts from the sample script: <code>admin / admin123</code>{" "}
          or <code>staff1 / staff123</code>.
        </p>
      </div>
    </div>
  );
}
