import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GALLERY = [
  {
    src: "https://images.unsplash.com/photo-1631540376030-acb6beacf09d?auto=format&fit=crop&w=900&q=80",
    caption: "Cell block security",
  },
  {
    src: "https://images.unsplash.com/photo-1687274427456-ccf06e264df2?auto=format&fit=crop&w=900&q=80",
    caption: "Perimeter fencing",
  },
  {
    src: "https://images.unsplash.com/photo-1529873851584-b4afdd3f4dc7?auto=format&fit=crop&w=900&q=80",
    caption: "Facility grounds",
  },
  {
    src: "https://images.unsplash.com/photo-1579668370587-78847a6cc01e?auto=format&fit=crop&w=900&q=80",
    caption: "Perimeter access control",
  },
];

const HERO_BG =
  "https://images.unsplash.com/photo-1631540376030-acb6beacf09d?auto=format&fit=crop&w=1600&q=80";

export default function Home() {
  const { user } = useAuth();

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="page">
      {/* Hero */}
      <div
        className="hero hero-lg hero-photo"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      >
        <div className="hero-eyebrow">
          Secure · Reliable · Built for Facility Staff
        </div>

        <h1>
          Run your facility with <span className="text-gold">clarity</span> and{" "}
          <span className="text-gold">control</span>
        </h1>

        <p>
          Prison Management System brings prisoner records, cell allocation,
          staff directories, and reporting into one secure, easy-to-use
          dashboard — so your team spends less time on paperwork and more
          time on what matters.
        </p>

        <div className="hero-actions">
          <Link className="btn btn-gold btn-lg" to="/login">
            Staff Login →
          </Link>

          <Link className="btn btn-ghost btn-lg" to="/about">
            Learn More
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-strip">
        <div className="stats-strip-item">
          <div className="stats-strip-value">24/7</div>
          <div className="stats-strip-label">Real-time Access</div>
        </div>

        <div className="stats-strip-item">
          <div className="stats-strip-value">100%</div>
          <div className="stats-strip-label">Digital Records</div>
        </div>

        <div className="stats-strip-item">
          <div className="stats-strip-value">Role-based</div>
          <div className="stats-strip-label">Access Control</div>
        </div>

        <div className="stats-strip-item">
          <div className="stats-strip-value">Live</div>
          <div className="stats-strip-label">Occupancy Reports</div>
        </div>
      </div>

      {/* Gallery */}
      <div className="section-header">
        <h2>Inside the Facility</h2>
        <p>A quick look at the environment your team manages every day.</p>
      </div>

      <div className="gallery-grid">
        {GALLERY.map((g) => (
          <div className="gallery-item" key={g.src}>
            <img src={g.src} alt={g.caption} loading="lazy" />
            <div className="gallery-caption">{g.caption}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="section-header">
        <h2>Everything your facility needs</h2>
        <p>One system, four core workflows, zero spreadsheets.</p>
      </div>

      <div className="grid grid-3">
        <div className="card feature-card">
          <div className="feature-icon">🧾</div>
          <h3>Prisoner Records</h3>
          <p style={{ color: "var(--muted)" }}>
            Track full name, age, crime, sentence length, and cell assignment
            for every prisoner — with fast search and validation.
          </p>
        </div>

        <div className="card feature-card">
          <div className="feature-icon">🔐</div>
          <h3>Cell Allocation</h3>
          <p style={{ color: "var(--muted)" }}>
            Manage cell capacity and availability so intake decisions are fast,
            accurate, and always up to date.
          </p>
        </div>

        <div className="card feature-card">
          <div className="feature-icon">👥</div>
          <h3>Staff Directory</h3>
          <p style={{ color: "var(--muted)" }}>
            Keep an up-to-date list of facility staff, roles, and contact
            numbers, all in one searchable place.
          </p>
        </div>

        <div className="card feature-card">
          <div className="feature-icon">📊</div>
          <h3>Live Reporting</h3>
          <p style={{ color: "var(--muted)" }}>
            Instantly see occupancy, headcounts, and trends without waiting on
            a manual report.
          </p>
        </div>

        <div className="card feature-card">
          <div className="feature-icon">🛡️</div>
          <h3>Role-Based Users</h3>
          <p style={{ color: "var(--muted)" }}>
            Create Admin and Staff accounts with the right level of access for
            every team member.
          </p>
        </div>

        <div className="card feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Fast &amp; Simple</h3>
          <p style={{ color: "var(--muted)" }}>
            A clean, distraction-free interface designed for busy staff, not IT
            specialists.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="cta-banner">
        <div>
          <h2 style={{ margin: "0 0 0.35rem" }}>Ready to get started?</h2>

          <p style={{ margin: 0, color: "var(--muted)" }}>
            Sign in with your staff account to open your dashboard.
          </p>
        </div>

        <Link className="btn btn-gold btn-lg" to="/login">
          Staff Login →
        </Link>
      </div>
    </div>
  );
}