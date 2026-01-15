export default function Header() {
  return (
    <header
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        padding: '24px 32px',
        color: '#0f172a',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        marginLeft: '260px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100
      }}
    >
      <div>
        <h1
          style={{
            margin: '0 0 8px 0',
            fontSize: '28px',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            color: '#0f172a',
            lineHeight: '1.2'
          }}
        >
          AadhaarPulse Dashboard
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: '14px',
            opacity: 0.8,
            fontWeight: '500',
            color: '#475569'
          }}
        >
          <span style={{ marginRight: '10px' }}>▸</span>
          UIDAI Aadhaar Enrolment & Biometric Analytics
        </p>
      </div>
    </header>
  );
}
