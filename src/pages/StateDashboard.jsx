// src/pages/StateDashboard.jsx - PERFECTLY ALIGNED (COMPLETE)
import React, { useEffect, useState } from "react";
import { LoadingCard, KPIGrid, AgeTable } from "../components/DashboardComponents";

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

export default function StateDashboard() {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch(`${API}/aggregate/state`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setStates(Array.isArray(data) ? data : []);
      } catch (e) {
        setError("Failed to load states");
        setStates([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stateOptions = Array.isArray(states)
    ? states
        .filter((s) => s && s.state && typeof s.state === "string")
        .map((s) => s.state.trim())
        .filter((name, idx, arr) => name && arr.indexOf(name) === idx)
        .sort((a, b) => a.localeCompare(b))
    : [];

  const computeStateServiceLoad = (d) => {
    if (!d) return 0;
    return (
      1.2 * (d.age_0_5 || 0) +
      1.1 * (d.age_5_17 || 0) +
      1.0 * (d.age_18_greater || 0) +
      0.8 * (d.bio_age_5_17 || 0) +
      1.0 * (d.bio_age_17_ || 0) +
      0.6 * (d.demo_age_5_17 || 0) +
      0.7 * (d.demo_age_17_ || 0)
    );
  };

  const handleStateChange = (e) => {
    const name = e.target.value;
    if (name) {
      const found = states.find((s) => s.state?.trim() === name);
      setSelectedState(found || null);
    } else {
      setSelectedState(null);
    }
  };

  if (loading) return <LoadingCard />;

  const getSelectStyle = (isActive) => ({
    width: '100%',
    height: '56px',
    padding: '0 20px',
    borderRadius: designTokens.radius.lg,
    border: `2px solid ${isActive ? designTokens.colors.blue500 : designTokens.colors.slate200}`,
    background: '#ffffff',
    fontSize: '16px',
    fontWeight: 500,
    color: designTokens.colors.slate900,
    outline: 'none',
    boxShadow: isActive ? designTokens.shadows.md : designTokens.shadows.sm,
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 12px center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '20px',
    paddingRight: '48px'
  });

  // State metrics
  const stateData = selectedState;
  const stateLoad = Math.round(computeStateServiceLoad(stateData));
  const totalEnrol = (stateData?.age_0_5 || 0) + (stateData?.age_5_17 || 0) + (stateData?.age_18_greater || 0);
  const biometricUpdates = (stateData?.bio_age_5_17 || 0) + (stateData?.bio_age_17_ || 0);
  const demographicUpdates = (stateData?.demo_age_5_17 || 0) + (stateData?.demo_age_17_ || 0);
  const totalServices = totalEnrol + biometricUpdates + demographicUpdates;
  const enrolPercent = totalServices > 0 ? Math.round((totalEnrol / totalServices) * 100) : 0;
  const biometricPercent = totalServices > 0 ? Math.round((biometricUpdates / totalServices) * 100) : 0;
  const demographicPercent = totalServices > 0 ? Math.round((demographicUpdates / totalServices) * 100) : 0;

  return (
    <div style={{
      // ✅ PERFECT ALIGNMENT - SAME AS NATIONAL/DISTRICT DASHBOARDS
      padding: '8px 0 0 0',
      width: '100%',
      background: '#f8fafc',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* ✅ STATE DROPDOWN - Uses parent 32px padding */}
      <section style={{ marginBottom: designTokens.spacing[8] }}>
        <div style={{
          background: '#ffffff',
          borderRadius: designTokens.radius.lg,
          border: `1px solid ${designTokens.colors.slate200}`,
          padding: designTokens.spacing[8],
          boxShadow: designTokens.shadows.sm,
          maxWidth: '500px'
        }}>
          <select
            value={selectedState?.state || ''}
            onChange={handleStateChange}
            style={getSelectStyle(!!selectedState)}
          >
            <option value="">Select state…</option>
            {stateOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* STATE DASHBOARD CONTENT */}
      {selectedState ? (
        <>
          {/* CONTEXT HEADER */}
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
                  {selectedState.state} Overview
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: designTokens.colors.slate700,
                  lineHeight: 1.7,
                  margin: '0 0 24px 0'
                }}>
                  State-level Aadhaar enrolment and update activity, weighted by service complexity.
                </p>

                {/* SERVICE BREAKDOWN */}
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

          {/* KPI SUMMARY */}
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
                State Key Metrics
              </h3>
              <KPIGrid 
                items={[
                  ["Service Load (Observed)", stateLoad.toLocaleString()],
                  ["Total Enrolments", totalEnrol.toLocaleString()],
                  ["Biometric Updates", biometricUpdates.toLocaleString()],
                  ["Demographic Updates", demographicUpdates.toLocaleString()]
                ]} 
              />
            </div>
          </section>

          {/* NARRATIVE SUMMARY */}
          <section style={{
            background: designTokens.colors.slate50,
            borderRadius: designTokens.radius.lg,
            border: `1px solid ${designTokens.colors.slate200}`,
            padding: designTokens.spacing[8],
            boxShadow: designTokens.shadows.sm,
            marginBottom: designTokens.spacing[8]
          }}>
            <h4 style={{
              fontSize: '15px',
              fontWeight: 600,
              color: designTokens.colors.slate800,
              margin: '0 0 8px 0'
            }}>
              About This Summary
            </h4>
            <p style={{
              fontSize: '14px',
              color: designTokens.colors.slate700,
              lineHeight: 1.6,
              margin: 0
            }}>
              This summary reflects Aadhaar service demand across <strong>{selectedState.state}</strong>, aggregated by enrolment and update activity and weighted by service complexity (age-based factors).
            </p>
          </section>

          {/* AGE BREAKDOWN */}
          <section>
            <div style={{
              background: '#ffffff',
              borderRadius: designTokens.radius.lg,
              border: `1px solid ${designTokens.colors.slate200}`,
              padding: designTokens.spacing[12],
              boxShadow: designTokens.shadows.md,
              borderTop: `3px solid ${designTokens.colors.green500}`
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: designTokens.colors.slate900,
                margin: '0 0 24px 0'
              }}>
                Age-wise Breakdown
              </h3>
              <AgeTable state={selectedState} />
            </div>
          </section>
        </>
      ) : (
        /* EMPTY STATE */
        <section style={{
          textAlign: 'center',
          padding: `${designTokens.spacing[12]} 0`
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: designTokens.radius.lg,
            border: `1px solid ${designTokens.colors.slate200}`,
            padding: designTokens.spacing[12],
            boxShadow: designTokens.shadows.md,
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: designTokens.colors.slate900,
              margin: '0 0 16px 0'
            }}>
              Select a State
            </h3>
            <p style={{
              fontSize: '16px',
              color: designTokens.colors.slate500,
              lineHeight: 1.7,
              margin: 0
            }}>
              Choose a state from the dropdown above to explore detailed Aadhaar enrolment and update activity.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
