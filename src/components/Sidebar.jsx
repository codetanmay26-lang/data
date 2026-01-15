// Sidebar.jsx - PERFECT WITH YOUR CSS
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside
      style={{
        width: "260px",
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        color: "#e2e8f0",
        padding: "32px 24px",
        boxShadow: "4px 0 24px rgba(0,0,0,0.4)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 99,
        overflowY: "auto"
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: "48px" }}>
        <h2 
          style={{ 
            margin: "0 0 8px 0", 
            fontSize: "24px", 
            fontWeight: "800",
            background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          AadhaarPulse
        </h2>
        <p style={{ 
          fontSize: "13px", 
          opacity: 0.7, 
          margin: 0,
          fontWeight: "500"
        }}>
          UIDAI Analytics Dashboard
        </p>
      </div>

      {/* Navigation - Uses YOUR CSS classes */}
      <nav style={{ marginTop: "8px" }}>
        <NavLink 
          to="/" 
          end 
          className={({ isActive }) => 
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
          style={{ 
            display: 'block', 
            marginBottom: '4px',
            textDecoration: 'none'  // ✅ Prevents underline
          }}
        >
          {({ isActive }) => (
            <>
              <span style={{ 
                marginRight: '16px', 
                width: '20px', 
                display: 'inline-block', 
                textAlign: 'center', 
                fontSize: '16px',
                color: isActive ? '#60a5fa' : '#ffffff'
              }}>
                ▣
              </span>
              Home
            </>
          )}
        </NavLink>

        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => 
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
          style={{ 
            display: 'block', 
            marginBottom: '4px',
            textDecoration: 'none'
          }}
        >
          {({ isActive }) => (
            <>
              <span style={{ 
                marginRight: '16px', 
                width: '20px', 
                display: 'inline-block', 
                textAlign: 'center', 
                fontSize: '16px',
                color: isActive ? '#60a5fa' : '#ffffff'
              }}>
                ▥
              </span>
              Dashboard
            </>
          )}
        </NavLink>

        <NavLink 
          to="/map" 
          className={({ isActive }) => 
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
          style={{ 
            display: 'block', 
            marginBottom: '4px',
            textDecoration: 'none'
          }}
        >
          {({ isActive }) => (
            <>
              <span style={{ 
                marginRight: '16px', 
                width: '20px', 
                display: 'inline-block', 
                textAlign: 'center', 
                fontSize: '16px',
                color: isActive ? '#60a5fa' : '#ffffff'
              }}>
                ◈
              </span>
              Map View
            </>
          )}
        </NavLink>

        <NavLink 
          to="/demand" 
          className={({ isActive }) => 
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
          style={{ 
            display: 'block', 
            marginBottom: '4px',
            textDecoration: 'none'
          }}
        >
          {({ isActive }) => (
            <>
              <span style={{ 
                marginRight: '16px', 
                width: '20px', 
                display: 'inline-block', 
                textAlign: 'center', 
                fontSize: '16px',
                color: isActive ? '#60a5fa' : '#10b981'
              }}>
                ⚡
              </span>
              Demand Analysis
            </>
          )}
        </NavLink>
      </nav>
    </aside>
  );
}
