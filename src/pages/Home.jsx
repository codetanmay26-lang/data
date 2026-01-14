export default function Home() {
  return (
    <div className="page">
      <h2 style={{ marginBottom: "8px" }}>Welcome to AadhaarPulse</h2>

      <p style={{ color: "#475569", maxWidth: "700px" }}>
        AadhaarPulse is a visual analytics dashboard built to explore Aadhaar
        enrolment, demographic updates, and biometric maintenance patterns using
        UIDAI-published datasets.
      </p>

      <div
        style={{
          marginTop: "30px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        <div className="card">
          <h4> National Overview</h4>
          <p style={{ color: "#64748b", fontSize: "14px" }}>
            High-level Aadhaar enrolment and update metrics across India.
          </p>
        </div>

        <div className="card">
          <h4> State-wise Analysis</h4>
          <p style={{ color: "#64748b", fontSize: "14px" }}>
            Comparative insights across states and UTs.
          </p>
        </div>

        <div className="card">
          <h4> Geographic View</h4>
          <p style={{ color: "#64748b", fontSize: "14px" }}>
            Visual map-based exploration of Aadhaar activity.
          </p>
        </div>
      </div>

      <p
        style={{
          marginTop: "30px",
          fontSize: "13px",
          color: "#94a3b8",
        }}
      >
        Built for the UIDAI Hackathon • UI Prototype
      </p>
    </div>
  );
}
