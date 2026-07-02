import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-badge">PMS</span>
        <span>Prison Management System</span>
      </div>

      <nav className="navbar-links">
        {user ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/prisoners">Prisoners</NavLink>
            <NavLink to="/cells">Cells</NavLink>
            <NavLink to="/staff">Staff</NavLink>
            <NavLink to="/users">Users</NavLink>
            <NavLink to="/reports">Reports</NavLink>
          </>
        ) : (
          <NavLink to="/" end>
            Home
          </NavLink>
        )}
        <NavLink to="/about">About</NavLink>
      </nav>

      <div className="navbar-auth">
        {user ? (
          <>
            <span className="navbar-user">
              {user.username} <em>({user.role})</em>
            </span>
            <button className="btn btn-ghost" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className="btn btn-gold">
            Login
          </NavLink>
        )}
      </div>
    </header>
  );
}
