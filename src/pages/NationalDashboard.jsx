// NationalDashboard.jsx - ALIGNMENT FIXED ONLY
import React, { useEffect, useState } from "react";
import { KPIGrid, LoadingCard, ErrorCard } from "../components/DashboardComponents";

const API = "http://127.0.0.1:8000";

const designTokens = {
  spacing: { 6: '24px', 8: '32px', 12: '48px' },
  radius: { lg: '16px', md: '12px' },
  shadows: {
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
  },
  colors: {
    slate50: '#f8fafc', slate100: '#f1f5f9', slate200: '#e2e8f0', 
    slate500: '#64748b', slate600: '#475569', slate700: '#334155', 
    slate800: '#1e293b', slate900: '#0f172a',
    blue500: '#3b82f6', green500: '#10b981', orange500: '#f59e0b'
  }
};

export default function NationalDashboard() {
  const [national, setNational] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch(`${API}/aggregate/national`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setNational(data);
      } catch (e) {
        setError("Failed to load national data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const computeServiceLoad = (d) => {
    if (!d) return 0;
    const e = d.enrolment || {};
    const b = d.biometric_update || {};
    const dm = d.demographic_update || {};
    return (
      1.2 * (e.age_0_5 || 0) +
      1.1 * (e.age_5_17 || 0) +
      1.0 * (e.age_18_greater || 0) +
      0.8 * (b.bio_age_5_17 || 0) +
      1.0 * (b.bio_age_17_ || 0) +
      0.6 * (dm.demo_age_5_17 || 0) +
      0.7 * (dm.demo_age_17_ || 0)
    );
  };

  if (loading) return <LoadingCard />;
  if (error || !national) return <ErrorCard error={error} />;

  const nationalLoad = Math.round(computeServiceLoad(national));
  const totalEnrol = (national.enrolment?.age_0_5 || 0) + (national.enrolment?.age_5_17 || 0) + (national.enrolment?.age_18_greater || 0);
  const biometricUpdates = (national.biometric_update?.bio_age_5_17 || 0) + (national.biometric_update?.bio_age_17_ || 0);
  const demographicUpdates = (national.demographic_update?.demo_age_5_17 || 0) + (national.demographic_update?.demo_age_17_ || 0);

  const totalServices = totalEnrol + biometricUpdates + demographicUpdates;
  const enrolPercent = totalServices > 0 ? Math.round((totalEnrol / totalServices) * 100) : 0;
  const biometricPercent = totalServices > 0 ? Math.round((biometricUpdates / totalServices) * 100) : 0;
  const demographicPercent = totalServices > 0 ? Math.round((demographicUpdates / totalServices) * 100) : 0;

  return (
    <div style={{
      // ✅ SAME ALIGNMENT AS HOME/DASHBOARD
      padding: '8px 0 0 0', 
      width: '100%',
      background: '#f8fafc',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* ✅ NO EXTRA CONTAINER - Uses parent 32px padding */}
      {/* NATIONAL SERVICE CONTEXT - STARTS DIRECTLY */}
      <section style={{
        background: '#ffffff',
        borderRadius: designTokens.radius.lg,
        border: `1px solid ${designTokens.colors.slate200}`,
        padding: designTokens.spacing[12],
        boxShadow: designTokens.shadows.md,
        marginBottom: designTokens.spacing[8],
        borderLeft: `4px solid ${designTokens.colors.blue500}`
      }}>
        <div style={{ display: 'flex', gap: designTokens.spacing[6], alignItems: 'flex-start' }}>
          <div style={{
            flexShrink: 0,
            width: '4px',
            height: '24px',
            background: designTokens.colors.blue500,
            borderRadius: '2px',
            marginTop: '4px'
          }} />
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 600,
              color: designTokens.colors.slate900,
              margin: '0 0 16px 0'
            }}>
              National Service Load Breakdown
            </h2>
            <p style={{
              fontSize: '16px',
              color: designTokens.colors.slate700,
              lineHeight: 1.7,
              margin: '0 0 24px 0'
            }}>
              Aggregated Aadhaar activity across India, weighted by service complexity.
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: designTokens.spacing[6]
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: `${designTokens.spacing[6]} ${designTokens.spacing[8]}`,
                background: designTokens.colors.slate50,
                borderRadius: designTokens.radius.md,
                borderRight: `3px solid ${designTokens.colors.green500}`
              }}>
                <div style={{
                  flex: '0 0 60px',
                  height: '12px',
                  background: `linear-gradient(90deg, ${designTokens.colors.green500} 0%, ${designTokens.colors.green500} ${enrolPercent}%, transparent ${enrolPercent}%)`,
                  borderRadius: '6px'
                }} />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: designTokens.colors.slate900, marginBottom: '4px' }}>
                    Enrolments ({enrolPercent}%)
                  </div>
                  <div style={{ fontSize: '14px', color: designTokens.colors.slate600, fontWeight: 500 }}>
                    {totalEnrol.toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: `${designTokens.spacing[6]} ${designTokens.spacing[8]}`,
                background: designTokens.colors.slate50,
                borderRadius: designTokens.radius.md,
                borderRight: `3px solid ${designTokens.colors.blue500}`
              }}>
                <div style={{
                  flex: '0 0 60px',
                  height: '12px',
                  background: `linear-gradient(90deg, ${designTokens.colors.blue500} 0%, ${designTokens.colors.blue500} ${biometricPercent}%, transparent ${biometricPercent}%)`,
                  borderRadius: '6px'
                }} />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: designTokens.colors.slate900, marginBottom: '4px' }}>
                    Biometric Updates ({biometricPercent}%)
                  </div>
                  <div style={{ fontSize: '14px', color: designTokens.colors.slate600, fontWeight: 500 }}>
                    {biometricUpdates.toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: `${designTokens.spacing[6]} ${designTokens.spacing[8]}`,
                background: designTokens.colors.slate50,
                borderRadius: designTokens.radius.md,
                borderRight: `3px solid ${designTokens.colors.orange500}`
              }}>
                <div style={{
                  flex: '0 0 60px',
                  height: '12px',
                  background: `linear-gradient(90deg, ${designTokens.colors.orange500} 0%, ${designTokens.colors.orange500} ${demographicPercent}%, transparent ${demographicPercent}%)`,
                  borderRadius: '6px'
                }} />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: designTokens.colors.slate900, marginBottom: '4px' }}>
                    Demographic Updates ({demographicPercent}%)
                  </div>
                  <div style={{ fontSize: '14px', color: designTokens.colors.slate600, fontWeight: 500 }}>
                    {demographicUpdates.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KPI SECTION */}
      <section style={{ marginBottom: designTokens.spacing[8] }}>
        <div style={{
          background: '#ffffff',
          borderRadius: designTokens.radius.lg,
          border: `1px solid ${designTokens.colors.slate200}`,
          padding: designTokens.spacing[12],
          boxShadow: designTokens.shadows.md,
          borderTop: `3px solid ${designTokens.colors.blue500}`
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: designTokens.colors.slate900,
            margin: '0 0 24px 0'
          }}>
            National Key Metrics
          </h3>
          <KPIGrid 
            items={[
              ["Service Load", nationalLoad.toLocaleString()],
              ["Total Enrolments", totalEnrol.toLocaleString()],
              ["Biometric Updates", biometricUpdates.toLocaleString()],
              ["Demographic Updates", demographicUpdates.toLocaleString()]
            ]} 
          />
        </div>
      </section>

      {/* METHODOLOGY */}
      <section style={{
        background: designTokens.colors.slate50,
        borderRadius: designTokens.radius.lg,
        border: `1px solid ${designTokens.colors.slate200}`,
        padding: designTokens.spacing[8],
        boxShadow: designTokens.shadows.sm
      }}>
        <h4 style={{
          fontSize: '15px',
          fontWeight: 600,
          color: designTokens.colors.slate800,
          margin: '0 0 8px 0'
        }}>
          Methodology
        </h4>
        <p style={{
          fontSize: '14px',
          color: designTokens.colors.slate700,
          lineHeight: 1.6,
          margin: 0
        }}>
          Age-based complexity factors applied to service load calculation.
        </p>
      </section>
    </div>
  );
}
