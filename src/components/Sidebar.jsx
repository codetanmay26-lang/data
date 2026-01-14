import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside
      style={{
        width: "240px",
        backgroundColor: "#0f172a",
        color: "white",
        padding: "20px",
        boxShadow: "2px 0 14px rgba(0,0,0,0.2)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <h2 style={{ marginBottom: "4px" }}>AadhaarPulse</h2>
      <p style={{ fontSize: "13px", opacity: 0.8 }}>
        UIDAI Analytics Dashboard
      </p>

      <nav style={{ marginTop: "30px" }}>
        <NavLink to="/" end className={navClass}>
          Home
        </NavLink>
        <NavLink to="/dashboard" className={navClass}>
          Dashboard
        </NavLink>
        <NavLink to="/map" className={navClass}>
          Map View
        </NavLink>
      </nav>
    </aside>
  );
}

function navClass({ isActive }) {
  return isActive
    ? "sidebar-link sidebar-link-active"
    : "sidebar-link";
}
