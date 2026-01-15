// src/pages/Dashboard.jsx - PERFECT WIDTH FIX
import React, { useState } from "react";
import NationalDashboard from "./NationalDashboard";
import StateDashboard from "./StateDashboard";
import DistrictDashboard from "./DistrictDashboard";

export default function Dashboard() {
  const [view, setView] = useState("national");

  return (
    <div style={{
      width: "100vw",                    // ✅ Full viewport width
      height: "100vh",                   // ✅ Full viewport height
      margin: 0,                         // ✅ No margins
      padding: 0,                        // ✅ No padding on root
      position: "relative",
      overflow: "hidden",                // ✅ No scrollbars EVER
      boxSizing: "border-box"
    }}>
      {/* Sidebar offset - perfect fit */}
      <div style={{
        marginLeft: "260px",             // Sidebar width
        marginTop: "92px",               // Header height  
        width: "calc(100vw - 260px)",    // ✅ PERFECT: viewport - sidebar
        height: "calc(100vh - 92px)",    // ✅ PERFECT: viewport - header
        padding: "24px 20px",            // ✅ Reduced padding
        overflow: "auto",                // ✅ Internal scroll only if needed
        boxSizing: "border-box"
      }}>
        {/* Tabs */}
        <div style={{ 
          display: "flex", 
          gap: 12, 
          marginBottom: 28,
          flexWrap: "wrap",
          width: "100%"
        }}>
          {["national", "state", "district"].map((t) => (
            <button
              key={t}
              onClick={() => setView(t)}
              style={view === t ? activeTab : tab}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Content - perfect fit */}
        <div style={{ width: "100%", minHeight: "100%" }}>
          {view === "national" && <NationalDashboard />}
          {view === "state" && <StateDashboard />}
          {view === "district" && <DistrictDashboard />}
        </div>
      </div>
    </div>
  );
}

// Styles unchanged
const tab = {
  padding: "12px 20px",
  border: "1px solid #d1d5db",
  background: "#fff",
  cursor: "pointer",
  borderRadius: "8px",
  fontWeight: 600,
  fontSize: 14,
  color: "#374151",
  transition: "all 0.2s",
  whiteSpace: "nowrap",
  flexShrink: 0
};

const activeTab = {
  ...tab,
  background: "#111827",
  color: "#fff",
  boxShadow: "0 4px 12px rgba(17,24,39,0.3)",
  borderColor: "#111827"
};
