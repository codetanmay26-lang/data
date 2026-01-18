// Sidebar.jsx — FINAL (aligned icon rail, zero reloads, stable hover)
import { useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  Map,
  TrendingUp,
  Filter,
  Activity,
  BarChart3,
} from "lucide-react";

export default function Sidebar({ setSidebarWidth }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Stable handlers (no re-render storms)
  const handleExpand = useCallback(() => {
    setIsExpanded(true);
    setSidebarWidth(260);
  }, [setSidebarWidth]);

  const handleCollapse = useCallback(() => {
    setIsExpanded(false);
    setSidebarWidth(84);
  }, [setSidebarWidth]);

  const navConfig = [
    { to: "/", label: "Home", Icon: Home },
    { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
    { to: "/map", label: "Map View", Icon: Map },
    { to: "/demand", label: "Demand Analysis", Icon: TrendingUp },
    { to: "/migration", label: "Migration Index", Icon: Activity },
    { to: "/migration-forecast", label: "Forecast", Icon: BarChart3 },
    { to: "/data-cleaning", label: "Data Cleaning", Icon: Filter },
  ];

  return (
    <aside
      onMouseEnter={handleExpand}
      onMouseLeave={handleCollapse}
      style={{
        width: isExpanded ? "260px" : "84px",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "4px 0 20px rgba(0,0,0,0.35)",
        overflow: "hidden",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "12px",
      }}
    >
      {/* LOGO ROW — MATCHES NAV GEOMETRY */}
      <div
        style={{
          height: "44px",
          display: "flex",
          alignItems: "center",
          padding: "10px 14px",
          marginBottom: "8px",
        }}
      >
        {/* ICON RAIL (same as nav icons) */}
        <div
  style={{
    width: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transform: "translateX(3px)", // 👈 OPTICAL ALIGNMENT FIX
  }}
>

          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: "#93c5fd" }}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.4"
            />
            <circle cx="12" cy="12" r="4" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="#ffffff" opacity="0.85" />
          </svg>
        </div>

        {/* BRAND TEXT */}
        {isExpanded && (
          <div
            style={{
              marginLeft: "12px",
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: 700,
                color: "#f8fafc",
                lineHeight: 1.2,
              }}
            >
              AadhaarPulse
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: "9px",
                color: "#94a3b8",
                letterSpacing: "0.05em",
                fontWeight: 500,
              }}
            >
              UIDAI Analytics
            </p>
          </div>
        )}
      </div>

      {/* NAVIGATION */}
      <nav
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {navConfig.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            style={({ isActive }) => ({
              height: "44px",
              display: "flex",
              alignItems: "center",
              padding: "10px 14px",
              borderRadius: "8px",
              textDecoration: "none",
              color: isActive ? "#f8fafc" : "#cbd5e1",
              background: isActive
                ? "rgba(59,130,246,0.25)"
                : "transparent",
              borderLeft: isActive
                ? "3px solid #3b82f6"
                : "3px solid transparent",
              fontSize: isExpanded ? "14px" : "0",
              fontWeight: 500,
              transition: "all 0.2s ease",
              cursor: "pointer",
            })}
          >
            {/* ICON RAIL — IDENTICAL TO LOGO */}
            <div
              style={{
                width: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: "#93c5fd",
              }}
            >
              <Icon size={18} strokeWidth={2.5} />
            </div>

            {/* LABEL */}
            <span
              style={{
                marginLeft: isExpanded ? "12px" : "0",
                opacity: isExpanded ? 1 : 0,
                whiteSpace: "nowrap",
                transition: "opacity 0.2s ease",
              }}
            >
              {label}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
