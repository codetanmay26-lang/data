// App.jsx - FIXED HEADER VISIBILITY
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Map from "./pages/Map";
import DemandAnalysis from "./pages/DemandAnalysis";

export default function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f1f5f9",
        }}
      >
        {/* Fixed Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div style={{
          flex: 1,
          minWidth: 0,  // ✅ Prevents flex child overflow
          display: "flex",
          flexDirection: "column",
          marginLeft: "260px"  // ✅ Sidebar offset
        }}>
          {/* Header - Always visible */}
          <Header style={{ 
            position: "fixed", 
            top: 0, 
            left: "260px", 
            right: 0, 
            zIndex: 100,
            height: "92px"  // ✅ Fixed height
          }} />
          
          {/* Scrollable content area */}
          <main
            style={{
              flex: 1,
              width: "100%",
              backgroundColor: "#f8fafc",
              color: "#0f172a",
              marginTop: "92px",  // ✅ Header offset
              padding: "24px 20px",
              overflow: "auto",
              boxSizing: "border-box"
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/map" element={<Map />} />
              <Route path="/demand" element={<DemandAnalysis />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
