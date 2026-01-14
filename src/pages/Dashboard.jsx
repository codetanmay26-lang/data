export default function Dashboard() {
  return (
    <div className="page">
      <h2 style={{ marginBottom: "8px" }}>National Dashboard</h2>
      <p style={{ color: "#475569", marginBottom: "24px" }}>
        Overview of Aadhaar enrolment and update activity across India
      </p>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        <Card title="Total Enrolments" value="132 Cr+" />
        <Card title="Biometric Updates" value="28 Cr+" />
        <Card title="Demographic Updates" value="41 Cr+" />
      </div>

      {/* Insights */}
      <section className="card section">
        <h3 className="section-title">Insights</h3>
        <p style={{ color: "#64748b" }}>
          Charts and analytics will be displayed here.
        </p>
      </section>

      {/* State-wise Section */}
      <section className="card section">
        <h3 className="section-title">State-wise Aadhaar Activity</h3>

        <table className="table">
          <thead>
            <tr>
              <th>State</th>
              <th>Enrolments</th>
              <th>Biometric Updates</th>
              <th>Demographic Updates</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Uttar Pradesh</td>
              <td>18 Cr+</td>
              <td>4.2 Cr+</td>
              <td>5.1 Cr+</td>
            </tr>
            <tr>
              <td>Maharashtra</td>
              <td>11 Cr+</td>
              <td>3.1 Cr+</td>
              <td>3.8 Cr+</td>
            </tr>
            <tr>
              <td>Tamil Nadu</td>
              <td>7.6 Cr+</td>
              <td>2.4 Cr+</td>
              <td>2.9 Cr+</td>
            </tr>
            <tr>
              <td>Karnataka</td>
              <td>6.8 Cr+</td>
              <td>2.1 Cr+</td>
              <td>2.6 Cr+</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="card">
      <p style={{ color: "#64748b", marginBottom: "8px" }}>{title}</p>
      <h2
  style={{
    margin: 0,
    fontSize: "28px",
    color: "#0f172a" ,
    letterSpacing: "-0.5px",
  }}
>
  {value}
</h2>

    </div>
  );
}
