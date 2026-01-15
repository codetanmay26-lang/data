// src/components/DashboardComponents.jsx
export function KPIGrid({ items }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: 24,
      width: "100%",
      marginBottom: 32
    }}>
      {items.map(([label, value]) => (
        <div key={label} style={{
          padding: 24,
          background: "#fff",
          borderLeft: "4px solid #3b82f6",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          borderRadius: "8px",
          boxSizing: "border-box"
        }}>
          <p style={{
            fontSize: 13,
            textTransform: "uppercase",
            color: "#6b7280",
            margin: 0,
            marginBottom: 8,
            fontWeight: 500
          }}>{label}</p>
          <h3 style={{
            fontSize: 32,
            fontWeight: 700,
            margin: 0,
            color: "#111827"
          }}>{value.toLocaleString()}</h3>
        </div>
      ))}
    </div>
  );
}

export function Section({ title, children }) {
  return (
    <section style={{ 
      marginTop: 32, 
      width: "100%", 
      maxWidth: "100%",
      boxSizing: "border-box"
    }}>
      <h3 style={{
        fontSize: 20,
        fontWeight: 700,
        color: "#111827",
        marginBottom: 16
      }}>{title}</h3>
      <div style={{
        padding: "24px",
        background: "#f9fafb",
        borderRadius: "12px",
        border: "1px solid #e5e7eb"
      }}>
        {children}
      </div>
    </section>
  );
}

export function LoadingCard() {
  return (
    <div style={{
      padding: "40px 20px",
      background: "#f8fafc",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      textAlign: "center",
      color: "#64748b"
    }}>
      Loading data…
    </div>
  );
}

export function ErrorCard({ error }) {
  return (
    <div style={{
      padding: "20px",
      background: "#fef2f2",
      borderRadius: "8px",
      border: "1px solid #fecaca",
      color: "#dc2626"
    }}>
      {error || "Failed to load data"}
    </div>
  );
}

export function AgeTable({ state }) {
  return (
    <div style={{ width: "100%", overflowX: "auto", marginTop: 16 }}>
      <table style={{
        width: "100%",
        minWidth: 500,
        borderCollapse: "collapse",
        background: "#fff",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        <thead>
          <tr style={{ background: "#f8fafc" }}>
            <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: 700, color: "#374151" }}>Age Group</th>
            <th style={{ padding: "16px 20px", textAlign: "right", fontWeight: 700, color: "#374151" }}>Enrolments</th>
            <th style={{ padding: "16px 20px", textAlign: "right", fontWeight: 700, color: "#374151" }}>Bio Updates</th>
            <th style={{ padding: "16px 20px", textAlign: "right", fontWeight: 700, color: "#374151" }}>Demo Updates</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ background: "#fff" }}>
            <td style={{ padding: "16px 20px", fontWeight: 600 }}>0–5 years</td>
            <td style={{ padding: "16px 20px", textAlign: "right", color: "#059669" }}>{(state.age_0_5 || 0).toLocaleString()}</td>
            <td style={{ padding: "16px 20px", textAlign: "right" }}>—</td>
            <td style={{ padding: "16px 20px", textAlign: "right" }}>—</td>
          </tr>
          <tr style={{ background: "#f9fafb" }}>
            <td style={{ padding: "16px 20px", fontWeight: 600 }}>5–17 years</td>
            <td style={{ padding: "16px 20px", textAlign: "right", color: "#059669" }}>{(state.age_5_17 || 0).toLocaleString()}</td>
            <td style={{ padding: "16px 20px", textAlign: "right", color: "#dc2626" }}>{(state.bio_age_5_17 || 0).toLocaleString()}</td>
            <td style={{ padding: "16px 20px", textAlign: "right", color: "#7c3aed" }}>{(state.demo_age_5_17 || 0).toLocaleString()}</td>
          </tr>
          <tr style={{ background: "#fff" }}>
            <td style={{ padding: "16px 20px", fontWeight: 600 }}>18+ years</td>
            <td style={{ padding: "16px 20px", textAlign: "right", color: "#059669" }}>{(state.age_18_greater || 0).toLocaleString()}</td>
            <td style={{ padding: "16px 20px", textAlign: "right", color: "#dc2626" }}>{(state.bio_age_17_ || 0).toLocaleString()}</td>
            <td style={{ padding: "16px 20px", textAlign: "right", color: "#7c3aed" }}>{(state.demo_age_17_ || 0).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
