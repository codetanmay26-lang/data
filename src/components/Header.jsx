// Header.jsx
import { useEffect, useState } from "react";

export default function Header({ sidebarWidth = 260 }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: `${sidebarWidth}px`,
        right: 0,
        height: "88px",
        display: "flex",
        alignItems: "center",
        padding: "16px 32px",
        background: scrolled
          ? "rgba(255,255,255,0.85)"
          : "#ffffff",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        boxShadow: scrolled
          ? "0 2px 8px rgba(0,0,0,0.06)"
          : "none",
        borderBottom: "1px solid #e5e7eb",
        transition: "all 0.25s ease",
        zIndex: 200,
        boxSizing: "border-box",
      }}
    >
      {/* LEFT CONTEXT (NO ICON, NO DUPLICATE BRANDING) */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {/* Accent bar */}
        <div
          style={{
            width: "3px",
            height: "26px",
            background: "#3b82f6",
            borderRadius: "2px",
          }}
        />

        {/* Contextual Title */}
        <div>
          <div
            style={{
              fontSize: "22px",
              fontWeight: 600,
              color: "#0f172a",
              lineHeight: 1.2,
            }}
          >
            AadhaarPulse
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "#6b7280",
              fontWeight: 500,
              marginTop: "2px",
            }}
          >
            UIDAI Analytics Platform
          </div>
        </div>
      </div>
    </header>
  );
}
