// Home.jsx - FIXED TIGHT LAYOUT + IMPROVED CARDS
export default function Home() {
  return (
    <div 
      style={{
        // ✅ ZERO TOP SPACE - Perfectly flush
        padding: '8px 32px 40px 32px', 
        width: '100%',
        background: '#f8fafc',
        minHeight: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* 🎯 TIGHT HERO - NO WASTED SPACE */}
      <div style={{ 
        marginBottom: '32px',
        paddingBottom: '20px',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <h1 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '32px', 
          fontWeight: '700',
          color: '#0f172a',
          lineHeight: '1.2',
          letterSpacing: '-0.015em'
        }}>
          AadhaarPulse Control Center
        </h1>
        
        <div style={{ 
          color: "#334155", 
          fontSize: '16px',
          lineHeight: '1.55',
          marginBottom: '4px',
          fontWeight: '500',
          maxWidth: '480px'
        }}>
          UIDAI Aadhaar service analytics platform
        </div>

        <div style={{ 
          color: "#64748b", 
          fontSize: '14px',
          lineHeight: '1.55',
          maxWidth: '480px'
        }}>
          Real-time insights for enrolment demand, biometric verification, 
          and demographic update patterns across India.
        </div>
      </div>

      {/* 📊 CLEANER CARDS - BETTER FUNCTIONALITY */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
        gap: '20px',
        maxWidth: '1100px'
      }}>
        {/* NATIONAL OVERVIEW */}
        <a href="/dashboard" style={{
          textDecoration: 'none',
          display: 'block',
          padding: '24px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
          transition: 'all 0.15s ease',
          height: '160px',
          display: 'flex',
          flexDirection: 'column'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          e.currentTarget.style.borderColor = '#3b82f6';
          e.currentTarget.style.background = '#fafbff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.06)';
          e.currentTarget.style.borderColor = '#e2e8f0';
          e.currentTarget.style.background = '#ffffff';
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: '700',
              flexShrink: 0
            }}>
              N
            </div>
            <h3 style={{
              margin: 0,
              fontSize: '17px',
              fontWeight: '600',
              color: '#0f172a',
              lineHeight: '1.3'
            }}>
              National Overview
            </h3>
          </div>

          <div style={{ 
            margin: '0 0 2px 0',
            color: "#374151", 
            fontSize: "15px",
            lineHeight: '1.45',
            fontWeight: '500'
          }}>
            Aggregate enrolment and verification metrics
          </div>
          <div style={{ 
            color: "#64748b", 
            fontSize: "14px",
            lineHeight: '1.4'
          }}>
            Track national service demand patterns
          </div>
        </a>

        {/* STATE ANALYSIS */}
        <a href="/map" style={{
          textDecoration: 'none',
          display: 'block',
          padding: '24px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
          transition: 'all 0.15s ease',
          height: '160px',
          display: 'flex',
          flexDirection: 'column'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          e.currentTarget.style.borderColor = '#10b981';
          e.currentTarget.style.background = '#fafffc';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.06)';
          e.currentTarget.style.borderColor = '#e2e8f0';
          e.currentTarget.style.background = '#ffffff';
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: '700',
              flexShrink: 0
            }}>
              S
            </div>
            <h3 style={{
              margin: 0,
              fontSize: '17px',
              fontWeight: '600',
              color: '#0f172a',
              lineHeight: '1.3'
            }}>
              State Analysis
            </h3>
          </div>

          <div style={{ 
            margin: '0 0 2px 0',
            color: "#374151", 
            fontSize: "15px",
            lineHeight: '1.45',
            fontWeight: '500'
          }}>
            Comparative regional metrics
          </div>
          <div style={{ 
            color: "#64748b", 
            fontSize: "14px",
            lineHeight: '1.4'
          }}>
            Identify disparities and priorities
          </div>
        </a>

        {/* GEOGRAPHIC VIEW */}
        <a href="/demand" style={{
          textDecoration: 'none',
          display: 'block',
          padding: '24px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
          transition: 'all 0.15s ease',
          height: '160px',
          display: 'flex',
          flexDirection: 'column'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          e.currentTarget.style.borderColor = '#f59e0b';
          e.currentTarget.style.background = '#fffaf5';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.06)';
          e.currentTarget.style.borderColor = '#e2e8f0';
          e.currentTarget.style.background = '#ffffff';
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: '700',
              flexShrink: 0
            }}>
              G
            </div>
            <h3 style={{
              margin: 0,
              fontSize: '17px',
              fontWeight: '600',
              color: '#0f172a',
              lineHeight: '1.3'
            }}>
              Geographic View
            </h3>
          </div>

          <div style={{ 
            margin: '0 0 2px 0',
            color: "#374151", 
            fontSize: "15px",
            lineHeight: '1.45',
            fontWeight: '500'
          }}>
            District-level spatial analysis
          </div>
          <div style={{ 
            color: "#64748b", 
            fontSize: "14px",
            lineHeight: '1.4'
          }}>
            Location-specific planning tools
          </div>
        </a>
      </div>

      {/* 📈 TIGHT FOOTER */}
      <div style={{
        marginTop: '32px',
        paddingTop: '20px',
        borderTop: '1px solid #e2e8f0',
        textAlign: 'left',
        paddingLeft: '2px'
      }}>
        <p style={{
          fontSize: "12px",
          color: "#6b7280",
          margin: 0,
          letterSpacing: '0.025em',
          fontWeight: '500'
        }}>
          UIDAI Smart India Hackathon • Analytics Platform
        </p>
      </div>
    </div>
  );
}
