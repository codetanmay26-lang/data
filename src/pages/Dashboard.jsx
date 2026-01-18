// Dashboard.jsx - FIXED ALIGNMENT ONLY (Same padding as Home)
import React, { useState } from "react";
import NationalDashboard from "./NationalDashboard";
import StateDashboard from "./StateDashboard";
import DistrictDashboard from "./DistrictDashboard";

const CONTAINER_STYLE = {
  // ✅ SAME ALIGNMENT AS HOME PAGE
  padding: '8px 32px 40px 32px', 
  width: '100%'
};

const designTokens = {
  spacing: { xs: '8px', sm: '12px', md: '16px', lg: '20px', xl: '24px' },
  radius: { sm: '8px', md: '10px' },
  colors: {
    slate50: '#f8fafc', slate100: '#f1f5f9', slate200: '#e2e8f0', 
    slate500: '#64748b', slate600: '#475569', slate700: '#334155', 
    slate800: '#1e293b', slate900: '#0f172a',
    gray100: '#f3f4f6'
  }
};

export default function Dashboard() {
  const [view, setView] = useState("national");

  const tabs = [
    { id: 'national', label: 'National' },
    { id: 'state', label: 'States' },
    { id: 'district', label: 'Districts' }
  ];

  const getTabStyle = (isActive) => ({
    padding: '10px 18px',
    minWidth: '120px',
    border: `1px solid ${designTokens.colors.slate200}`,
    background: isActive ? designTokens.colors.slate100 : '#ffffff',
    color: isActive ? designTokens.colors.slate900 : designTokens.colors.slate700,
    cursor: 'pointer',
    borderRadius: designTokens.radius.sm,
    fontWeight: isActive ? 600 : 500,
    fontSize: '14px',
    transition: 'all 150ms ease-in-out',
    boxShadow: 'none',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    outline: 'none'
  });

  // ✅ SIMPLIFIED - SAME BACKGROUND AS MAIN
  return (
    <div style={{
      // ✅ PERFECTLY FLUSH ALIGNMENT
      padding: '8px 32px 40px 32px',
      width: '100%',
      background: '#f8fafc',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* TABS - SAME RHYTHM AS HOME */}
      <div style={{ 
        marginBottom: '28px',
        paddingBottom: '20px',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ 
          display: "flex", 
          gap: designTokens.spacing.xs,
          padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
          background: '#ffffff',
          border: `1px solid ${designTokens.colors.slate200}`,
          borderRadius: designTokens.radius.md,
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              style={getTabStyle(view === tab.id)}
              title={`Switch to ${tab.label} view`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT - PERFECTLY ALIGNED */}
      <div style={{ height: 'auto', width: '100%' }}>
        {view === "national" && <NationalDashboard />}
        {view === "state" && <StateDashboard />}
        {view === "district" && <DistrictDashboard />}
      </div>
    </div>
  );
}
