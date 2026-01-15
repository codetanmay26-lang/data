export default function Home() {
  return (
    <div 
      className="page"
      style={{
        marginLeft: '260px',  // Sidebar width
        marginTop: '92px',    // Header height
        padding: '32px 40px 32px 40px',  // Reduced side padding
        maxWidth: 'calc(100vw - 300px)', // Fits screen width perfectly
        width: '100%'
      }}
    >
      <h2 style={{ 
        margin: '0 0 16px 0', 
        fontSize: '32px', 
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: '-0.02em'
      }}>
        Welcome to AadhaarPulse
      </h2>

      <p style={{ 
        color: "#475569", 
        maxWidth: "600px",  // Slightly narrower for better fit
        fontSize: '16px',
        lineHeight: '1.7',
        marginBottom: '48px'
      }}>
        AadhaarPulse is a visual analytics dashboard built to explore Aadhaar
        enrolment, demographic updates, and biometric maintenance patterns using
        UIDAI-published datasets.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
          marginBottom: '48px',
          maxWidth: '100%'
        }}
      >
        {/* National Overview Card */}
        <div className="card-hover" style={{
          padding: '28px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '120px'
        }}>
          <div style={{
            position: 'absolute',
            left: '28px',
            top: '28px',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px',
            fontWeight: '600'
          }}>
            ▣
          </div>
          
          <div style={{ marginLeft: '72px', marginTop: '8px' }}>
            <h4 style={{
              margin: '0 0 12px 0',
              fontSize: '20px',
              fontWeight: '700',
              color: '#0f172a'
            }}>
              National Overview
            </h4>
            <p style={{ 
              color: "#64748b", 
              fontSize: "15px",
              lineHeight: '1.6',
              margin: 0
            }}>
              High-level Aadhaar enrolment and update metrics across India.
            </p>
          </div>
        </div>

        {/* State-wise Analysis Card */}
        <div className="card-hover" style={{
          padding: '28px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '120px'
        }}>
          <div style={{
            position: 'absolute',
            left: '28px',
            top: '28px',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px',
            fontWeight: '600'
          }}>
            ▥
          </div>
          
          <div style={{ marginLeft: '72px', marginTop: '8px' }}>
            <h4 style={{
              margin: '0 0 12px 0',
              fontSize: '20px',
              fontWeight: '700',
              color: '#0f172a'
            }}>
              State-wise Analysis
            </h4>
            <p style={{ 
              color: "#64748b", 
              fontSize: "15px",
              lineHeight: '1.6',
              margin: 0
            }}>
              Comparative insights across states and UTs.
            </p>
          </div>
        </div>

        {/* Geographic View Card */}
        <div className="card-hover" style={{
          padding: '28px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '120px'
        }}>
          <div style={{
            position: 'absolute',
            left: '28px',
            top: '28px',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px',
            fontWeight: '600'
          }}>
            ◈
          </div>
          
          <div style={{ marginLeft: '72px', marginTop: '8px' }}>
            <h4 style={{
              margin: '0 0 12px 0',
              fontSize: '20px',
              fontWeight: '700',
              color: '#0f172a'
            }}>
              Geographic View
            </h4>
            <p style={{ 
              color: "#64748b", 
              fontSize: "15px",
              lineHeight: '1.6',
              margin: 0
            }}>
              Visual map-based exploration of Aadhaar activity.
            </p>
          </div>
        </div>
      </div>

      <p
        style={{
          fontSize: "13px",
          color: "#94a3b8",
          textAlign: 'center',
          margin: 0
        }}
      >
        Built for the UIDAI Hackathon • UI Prototype
      </p>
    </div>
  );
}
