// FIXED App.jsx - NO RELOAD ON HOVER, RESPONSIVE GRID
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Map from "./pages/Map";
import DemandAnalysis from "./pages/DemandAnalysis";
import DataCleaning from "./pages/data-cleaning/DataCleaning";
import MigrationAnalysis from "./pages/MigrationAnalysis";
import NationalInsights from "./pages/NationalInsights"; // 👈 NEW INSIGHTS PAGE

function Layout() {
  const [sidebarWidth, setSidebarWidth] = useState(84);
  const location = useLocation();

  // ✅ STABLE CALLBACK - PREVENTS RE-RENDERS
  const handleSidebarWidthChange = useCallback((width) => {
    setSidebarWidth(width);
  }, []);

  // ✅ RESPONSIVE SIDEBAR - MOBILE COLLAPSE
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarWidth(84);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "#f1f5f9",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Fixed Sidebar */}
      <Sidebar setSidebarWidth={handleSidebarWidthChange} />
      
      {/* Dynamic Main Content */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          marginLeft: `${sidebarWidth}px`,
          display: "flex",
          flexDirection: "column",
          transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Header sidebarWidth={sidebarWidth} />
        
        <main
          style={{
            flex: 1,
            paddingTop: "120px",
            paddingLeft: "32px",
            paddingRight: "32px",
            paddingBottom: "40px",
            backgroundColor: "#f8fafc",
            overflow: "auto",
            boxSizing: "border-box",
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<Map />} />
            <Route path="/demand" element={<DemandAnalysis />} />
            <Route path="/migration" element={<MigrationAnalysis />} />
            <Route path="/data-cleaning" element={<DataCleaning />} />
            <Route path="/insights" element={<NationalInsights />} /> {/* 👈 NEW ROUTE */}
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
