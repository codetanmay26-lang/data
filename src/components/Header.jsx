export default function Header() {
  return (
    <header
      style={{
        backgroundColor: "#ffffff",
        padding: "16px 24px",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "20px", color: "#0f172a" }}>
        AadhaarPulse Dashboard
      </h1>
      <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#475569" }}>
        UIDAI Aadhaar Enrolment, Demographic & Biometric Analytics
      </p>
    </header>
  );
}
