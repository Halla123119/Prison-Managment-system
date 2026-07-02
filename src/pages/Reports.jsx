import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Reports() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .get("/reports")
      .then((res) => mounted && setData(res.data))
      .catch(() => mounted && setError("Could not load report data."))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const occupancyPct =
    data && data.totalCells > 0
      ? Math.round((data.occupiedCells / data.totalCells) * 100)
      : 0;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Facility Report</h1>
          <p>Live counts pulled from the database via the Reports API.</p>
        </div>
      </div>

      {loading && <p style={{ color: "var(--muted)" }}>Loading report...</p>}
      {error && <div className="form-error-banner">{error}</div>}

      {data && (
        <>
          <div className="grid grid-3">
            <div className="stat-card">
              <div className="stat-value">{data.totalPrisoners}</div>
              <div className="stat-label">Total Prisoners</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{data.totalStaff}</div>
              <div className="stat-label">Total Staff</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{data.totalCells}</div>
              <div className="stat-label">Total Cells</div>
            </div>
          </div>

          <div className="card" style={{ marginTop: "1.5rem" }}>
            <h3 style={{ marginTop: 0 }}>Cell Occupancy</h3>
            <p style={{ color: "var(--muted)", marginTop: 0 }}>
              {data.occupiedCells} occupied / {data.availableCells} available
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
    </div>
  );
}
