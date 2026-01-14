export default function Map() {
  return (
    <div className="page">
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ marginBottom: "4px" }}>Geographic Distribution</h2>
        <p style={{ color: "#475569", margin: 0 }}>
          State-wise Aadhaar enrolment and update activity across India
        </p>
        <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "6px" }}>
          Last updated: Jan 2026 (UIDAI published datasets)
        </p>
      </div>

      {/* Map Section */}
      <section className="card section">
        <SectionHeader title="India Map Overview" />

        <div
          style={{
            height: "420px",
            borderRadius: "10px",
            border: "2px dashed #cbd5f5",
            background:
              "linear-gradient(135deg, #e2e8f0 0%, #f8fafc 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            color: "#334155",
            fontWeight: "600",
          }}
        >
           Geographic Visualization of Aadhaar Activity (Placeholder)

        </div>

        <p style={{ color: "#64748b", marginTop: "12px", fontSize: "13px" }}>
          This view will highlight state-wise intensity using color gradients
          based on enrolments and updates.
        </p>
      </section>

      {/* Legend / Notes */}
      <section
        className="section"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        <InfoCard
          title="High Activity"
          desc="States with high enrolment and frequent updates"
        />
        <InfoCard
          title="Medium Activity"
          desc="States with steady Aadhaar operations"
        />
        <InfoCard
          title="Low Activity"
          desc="Regions with lower population density or outreach"
        />
      </section>
    </div>
  );
}

/* ---------- Reusable UI bits ---------- */

function SectionHeader({ title }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <h3 className="section-title" style={{ marginBottom: "2px" }}>
        {title}
      </h3>
      <div
        style={{
          height: "2px",
          width: "48px",
          backgroundColor: "#0f172a",
        }}
      />
    </div>
  );
}

function InfoCard({ title, desc }) {
  return (
    <div className="card">
      <h4 style={{ marginBottom: "6px" }}>{title}</h4>
      <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
        {desc}
      </p>
    </div>
  );
}
