// Home.jsx - Professional analytics platform landing
import { useState, useEffect } from 'react';

const styles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  .hero-animate { animation: fadeInUp 0.8s ease-out; }
  .stat-animate { animation: scaleIn 0.6s ease-out; opacity: 0; animation-fill-mode: forwards; }
  .card-animate { animation: fadeInUp 0.7s ease-out; opacity: 0; animation-fill-mode: forwards; }
  .feature-animate { animation: fadeInUp 0.8s ease-out; opacity: 0; animation-fill-mode: forwards; }
  .illustration-float { animation: float 3s ease-in-out infinite; }
`;

const FeatureIllustration = ({ type }) => {
  const illustrations = {
    overview: (
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="60" width="60" height="60" rx="8" fill="#3b82f6" opacity="0.2"/>
        <rect x="90" y="60" width="60" height="60" rx="8" fill="#3b82f6" opacity="0.4"/>
        <rect x="160" y="60" width="20" height="60" rx="4" fill="#3b82f6"/>
        <circle cx="50" cy="140" r="8" fill="#3b82f6"/>
        <circle cx="120" cy="140" r="8" fill="#3b82f6"/>
        <circle cx="180" cy="140" r="8" fill="#3b82f6"/>
        <path d="M50 140L120 140L180 140" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4"/>
      </svg>
    ),
    cleaning: (
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="100" r="40" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="3"/>
        <path d="M40 100L50 110L80 80" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round"/>
        <rect x="120" y="60" width="60" height="80" rx="8" fill="#0ea5e9" opacity="0.2"/>
        <line x1="130" y1="80" x2="170" y2="80" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round"/>
        <line x1="130" y1="100" x2="170" y2="100" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round"/>
        <line x1="130" y1="120" x2="160" y2="120" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    map: (
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="70" fill="#d1fae5" stroke="#10b981" strokeWidth="2"/>
        <path d="M100 40 L100 160 M40 100 L160 100" stroke="#10b981" strokeWidth="2" opacity="0.3"/>
        <circle cx="80" cy="80" r="12" fill="#10b981"/>
        <circle cx="130" cy="90" r="10" fill="#10b981" opacity="0.7"/>
        <circle cx="110" cy="120" r="8" fill="#10b981" opacity="0.5"/>
        <path d="M100 30 L110 50 L90 50 Z" fill="#10b981"/>
      </svg>
    ),
    planning: (
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="120" width="30" height="60" rx="4" fill="#fed7aa"/>
        <rect x="70" y="90" width="30" height="90" rx="4" fill="#fb923c"/>
        <rect x="110" y="60" width="30" height="120" rx="4" fill="#f59e0b"/>
        <rect x="150" y="40" width="30" height="140" rx="4" fill="#ea580c"/>
        <path d="M40 120 L85 90 L125 60 L165 40" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    insights: (
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="60" fill="#fce7f3" stroke="#e11d48" strokeWidth="2"/>
        <path d="M100 60 L100 100 L130 100" stroke="#e11d48" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="100" cy="100" r="8" fill="#e11d48"/>
        <path d="M140 60 L150 70 M140 140 L150 130 M60 60 L50 70 M60 140 L50 130" stroke="#e11d48" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    migration: (
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="100" r="35" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2"/>
        <circle cx="140" cy="100" r="35" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2"/>
        <path d="M95 100 L125 100" stroke="#6366f1" strokeWidth="3"/>
        <path d="M115 90 L125 100 L115 110" fill="#6366f1"/>
        <circle cx="60" cy="100" r="8" fill="#6366f1"/>
        <circle cx="140" cy="100" r="8" fill="#6366f1"/>
      </svg>
    )
  };
  return <div className="illustration-float" style={{ width: '100%', height: '100%' }}>{illustrations[type]}</div>;
};

export default function Home() {
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setStatsVisible(true), 300);
  }, []);

  const features = [
    {
      icon: 'planning',
      title: 'Centre Capacity Planning',
      desc: 'Predictive decision support system that translates service volumes into infrastructure needs using weighted load models—forecasts center requirements before capacity gaps occur.',
      color: '#f59e0b'
    },
    {
      icon: 'insights',
      title: 'National Insights Engine',
      desc: 'Anomaly detection & trend analysis system that automatically identifies outliers, concentration risks, and capacity alerts—surfaces hidden patterns for strategic planning.',
      color: '#e11d48'
    },
    {
      icon: 'migration',
      title: 'Migration Forecasting',
      desc: 'ML-powered prediction system using Prophet, ARIMA, and ensemble methods to forecast population movement trends—provides 7-180 day projections with confidence intervals.',
      color: '#6366f1'
    }
  ];

  const cards = [
    { href: '/dashboard', icon: 'overview', title: 'National Overview', color: '#3b82f6', desc: 'Live enrolment, biometric, and demographic demand.' },
    { href: '/data-cleaning', icon: 'cleaning', title: 'Data Cleaning', color: '#0ea5e9', desc: 'Messy vs cleaned Aadhaar data comparison.' },
    { href: '/map', icon: 'map', title: 'Map & State Insights', color: '#10b981', desc: 'State-level distribution with geographic views.' },
    { href: '/demand', icon: 'planning', title: 'Centre Capacity Planning', color: '#f59e0b', desc: 'Service volumes into centers-needed per district.' },
    { href: '/insights', icon: 'insights', title: 'National Insights', color: '#e11d48', desc: 'Capacity risk and concentration alerts.' },
    { href: '/migration', icon: 'migration', title: 'Migration Index', color: '#6366f1', desc: 'Population movement impact on demand.' }
  ];

  const stats = [
    { label: 'Data Points', value: '5M+', color: '#3b82f6' },
    { label: 'Districts', value: '750+', color: '#10b981' },
    { label: 'Insights', value: '1000+', color: '#f59e0b' }
  ];

  return (
    <>
      <style>{styles}</style>
      <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div className="hero-animate" style={{ padding: '80px 24px 60px', textAlign: 'center', background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', color: '#ffffff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '56px', fontWeight: '800', margin: '0 0 20px 0', letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AadhaarPulse</h1>
            <p style={{ fontSize: '20px', color: '#cbd5e1', margin: '0 0 40px 0', lineHeight: '1.6', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>Transform raw Aadhaar data into strategic insights with advanced analytics</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
              {stats.map((stat, index) => (
                <div key={stat.label} className="stat-animate" style={{ animationDelay: `${index * 0.15}s`, textAlign: 'center' }}>
                  <div style={{ fontSize: '36px', fontWeight: '800', color: stat.color, marginBottom: '8px' }}>{statsVisible ? stat.value : '---'}</div>
                  <div style={{ fontSize: '13px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '500' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#111827', margin: '0 0 16px 0', textAlign: 'center' }}>Our Key Solutions</h2>
          <p style={{ fontSize: '16px', color: '#6b7280', margin: '0 0 60px 0', textAlign: 'center', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>Identifying patterns, trends, and anomalies to unlock societal insights in Aadhaar enrolment and updates</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {features.map((feature, index) => (
              <div key={feature.title} className="feature-animate" style={{ animationDelay: `${index * 0.2}s`, padding: '32px', background: `linear-gradient(135deg, ${feature.color}15, ${feature.color}08)`, borderRadius: '16px', border: `2px solid ${feature.color}20`, transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = `0 12px 24px ${feature.color}30`; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ width: '80px', height: '80px', marginBottom: '20px' }}><FeatureIllustration type={feature.icon} /></div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: '0 0 12px 0' }}>{feature.title}</h3>
                <p style={{ fontSize: '15px', color: '#4b5563', margin: 0, lineHeight: '1.6' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '60px 24px 80px', background: '#ffffff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', margin: '0 0 48px 0', textAlign: 'center' }}>Explore Our Platform</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
              {cards.map((card, index) => (
                <a key={card.title} href={card.href} className="card-animate" style={{ animationDelay: `${index * 0.1}s`, textDecoration: 'none', display: 'flex', flexDirection: 'column', padding: '32px', background: '#ffffff', border: '2px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', transition: 'all 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = card.color; e.currentTarget.style.boxShadow = `0 8px 20px ${card.color}20`; e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div style={{ width: '80px', height: '80px', marginBottom: '20px' }}><FeatureIllustration type={card.icon} /></div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 12px 0' }}>{card.title}</h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: '1.6' }}>{card.desc}</p>
                  <div style={{ marginTop: '16px', fontSize: '14px', color: card.color, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>Explore </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: '32px 24px', background: '#1e293b', color: '#94a3b8', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', margin: '0 0 8px 0', letterSpacing: '0.05em', fontWeight: '500' }}>UIDAI Smart India Hackathon</p>
          <p style={{ fontSize: '12px', margin: 0, color: '#64748b' }}>Data-driven insights for strategic planning</p>
        </div>
      </div>
    </>
  );
}
