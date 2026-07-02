export default function About() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>About This Project</h1>
          <p>React + ASP.NET Core Web API coursework project.</p>
        </div>
      </div>

      <div className="grid grid-3">
        <div className="card">
          <h3>Frontend</h3>
          <p style={{ color: "var(--muted)" }}>
            Built with React, React Router, and Axios. Includes Home,
            Login, List, Add, Update, Report, and About pages.
          </p>
        </div>
        <div className="card">
          <h3>Backend</h3>
          <p style={{ color: "var(--muted)" }}>
            ASP.NET Core Web API using ADO.NET (SqlConnection, SqlCommand,
            ExecuteReader/ExecuteNonQuery/ExecuteScalar) against SQL Server.
          </p>
        </div>
        <div className="card">
          <h3>Database</h3>
          <p style={{ color: "var(--muted)" }}>
            SQL Server database with Cells, Prisoners, Staff, and Users
            tables, related by foreign keys.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1.5rem" }}>
        <h3 style={{ marginTop: 0 }}>Contact</h3>
        <p style={{ color: "var(--muted)" }}>
          Project developed by Malawax — IT student, Jamhuriya University of
          Science and Technology.
        </p>
      </div>
    </div>
  );
}
