// src/pages/DistrictDashboard.jsx - PERFECTLY ALIGNED (COMPLETE)
import React, { useEffect, useState, useRef, useCallback } from "react";
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

export default function DistrictDashboard() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const stateDropdownRef = useRef(null);
  const districtDropdownRef = useRef(null);

  // Load states first
  useEffect(() => {
    async function loadStates() {
      try {
        setLoading(true);
        const res = await fetch(`${API}/aggregate/state`);
        if (!res.ok) throw new Error("Failed to fetch states");
        const data = await res.json();
        setStates(Array.isArray(data) ? data : []);
      } catch (e) {
        setError("Failed to load states");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStates();
  }, []);

  // Load districts when state is selected
  useEffect(() => {
    async function loadDistricts() {
      if (!selectedState) {
        setDistricts([]);
        return;
      }
      try {
        setLoading(true);
        const stateName = encodeURIComponent(selectedState.state);
        const res = await fetch(`${API}/aggregate/district?state=${stateName}`);
        if (!res.ok) throw new Error("Failed to fetch districts");
        const data = await res.json();
        setDistricts(Array.isArray(data) ? data : []);
        setSelectedDistrict(null);
      } catch (e) {
        setError(`Failed to load districts for ${selectedState.state}`);
        setDistricts([]);
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadDistricts();
  }, [selectedState]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target)) {
        setStateDropdownOpen(false);
      }
      if (districtDropdownRef.current && !districtDropdownRef.current.contains(event.target)) {
        setDistrictDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const stateOptions = Array.isArray(states)
    ? states
        .filter((s) => s && s.state && typeof s.state === "string")
        .map((s) => s.state.trim())
        .filter((name, idx, arr) => name && arr.indexOf(name) === idx)
        .sort((a, b) => a.localeCompare(b))
    : [];

  const districtOptions = Array.isArray(districts)
    ? districts
        .filter((d) => d && d.district && typeof d.district === "string")
        .map((d) => d.district.trim())
        .filter((name, idx, arr) => name && arr.indexOf(name) === idx)
        .sort((a, b) => a.localeCompare(b))
    : [];

  const computeServiceLoad = (d) => {
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

  const handleSelectState = useCallback((name) => {
    const found = states.find((s) => s.state?.trim() === name);
    setSelectedState(found || null);
    setStateDropdownOpen(false);
  }, [states]);

  const handleSelectDistrict = useCallback((name) => {
    const found = districts.find((d) => d.district?.trim() === name);
    setSelectedDistrict(found || null);
    setDistrictDropdownOpen(false);
  }, [districts]);

  if (loading) return <LoadingCard />;

  const getSelectStyle = (isActive, accentColor) => ({
    width: '100%',
    height: '56px',
    padding: '0 20px',
    borderRadius: designTokens.radius.lg,
    border: `2px solid ${isActive ? accentColor : designTokens.colors.slate200}`,
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

  // District metrics
  const districtData = selectedDistrict;
  const districtLoad = Math.round(computeServiceLoad(districtData));
  const totalEnrol = (districtData?.age_0_5 || 0) + (districtData?.age_5_17 || 0) + (districtData?.age_18_greater || 0);
  const biometricUpdates = (districtData?.bio_age_5_17 || 0) + (districtData?.bio_age_17_ || 0);
  const demographicUpdates = (districtData?.demo_age_5_17 || 0) + (districtData?.demo_age_17_ || 0);
  const totalServices = totalEnrol + biometricUpdates + demographicUpdates;
  const enrolPercent = totalServices > 0 ? Math.round((totalEnrol / totalServices) * 100) : 0;
  const biometricPercent = totalServices > 0 ? Math.round((biometricUpdates / totalServices) * 100) : 0;
  const demographicPercent = totalServices > 0 ? Math.round((demographicUpdates / totalServices) * 100) : 0;

  return (
    <div style={{
      // ✅ PERFECT ALIGNMENT - SAME AS NATIONAL/STATE DASHBOARDS
      padding: '8px 0 0 0',
      width: '100%',
      background: '#f8fafc',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* ✅ DROPDOWNS SECTION - Uses parent 32px padding */}
      <section style={{ marginBottom: designTokens.spacing[8] }}>
        <div style={{
          background: '#ffffff',
          borderRadius: designTokens.radius.lg,
          border: `1px solid ${designTokens.colors.slate200}`,
          padding: designTokens.spacing[8],
          boxShadow: designTokens.shadows.sm
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
            alignItems: 'end'
          }}>
            {/* STATE DROPDOWN */}
            <div style={{ position: 'relative' }} ref={stateDropdownRef}>
              <select
                value={selectedState?.state || ''}
                onChange={(e) => {
                  const name = e.target.value;
                  if (name) {
                    const found = states.find((s) => s.state?.trim() === name);
                    setSelectedState(found || null);
                  } else {
                    setSelectedState(null);
                    setSelectedDistrict(null);
                  }
                }}
                onFocus={() => setStateDropdownOpen(true)}
                style={getSelectStyle(!!selectedState, designTokens.colors.blue500)}
              >
                <option value="">Select state first…</option>
                {stateOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* DISTRICT DROPDOWN */}
            {selectedState && (
              <div style={{ position: 'relative' }} ref={districtDropdownRef}>
                <select
                  value={selectedDistrict?.district || ''}
                  onChange={(e) => {
                    const name = e.target.value;
                    if (name) {
                      const found = districts.find((d) => d.district?.trim() === name);
                      setSelectedDistrict(found || null);
                    } else {
                      setSelectedDistrict(null);
                    }
                  }}
                  onFocus={() => setDistrictDropdownOpen(true)}
                  style={getSelectStyle(!!selectedDistrict, designTokens.colors.green500)}
                >
                  <option value="">Select district…</option>
                  {districtOptions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* DASHBOARD CONTENT */}
      {selectedDistrict ? (
        <>
          {/* CONTEXT HEADER */}
          <section style={{
            background: '#ffffff',
            borderRadius: designTokens.radius.lg,
            border: `1px solid ${designTokens.colors.slate200}`,
            padding: designTokens.spacing[12],
            boxShadow: designTokens.shadows.md,
            marginBottom: designTokens.spacing[8],
            borderLeft: `4px solid ${designTokens.colors.green500}`
          }}>
            <div style={{ display: 'flex', gap: designTokens.spacing[6], alignItems: 'flex-start' }}>
              <div style={{
                flexShrink: 0,
                width: '4px',
                height: '24px',
                background: designTokens.colors.green500,
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
                  {selectedDistrict.district} Overview
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: designTokens.colors.slate700,
                  lineHeight: 1.7,
                  margin: '0 0 24px 0'
                }}>
                  District-level Aadhaar activity in <strong>{selectedState.state}</strong>, weighted by service complexity.
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
              borderTop: `3px solid ${designTokens.colors.green500}`
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: designTokens.colors.slate900,
                margin: '0 0 24px 0'
              }}>
                District Key Metrics
              </h3>
              <KPIGrid 
                items={[
                  ["Service Load (Observed)", districtLoad.toLocaleString()],
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
              District-level Aadhaar service demand within <strong>{selectedState.state}</strong>, calculated using age-based complexity weighting.
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
              borderTop: `3px solid ${designTokens.colors.orange500}`
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: designTokens.colors.slate900,
                margin: '0 0 24px 0'
              }}>
                Age-wise Breakdown
              </h3>
              <AgeTable state={selectedDistrict} />
            </div>
          </section>
        </>
      ) : selectedState ? (
        <section style={{ textAlign: 'center', padding: `${designTokens.spacing[12]} 0` }}>
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
              {districts.length} Districts in {selectedState.state}
            </h3>
            <p style={{
              fontSize: '16px',
              color: designTokens.colors.slate500,
              lineHeight: 1.7,
              margin: 0
            }}>
              Select a district from the dropdown above to view detailed Aadhaar service metrics.
            </p>
          </div>
        </section>
      ) : (
        <section style={{ textAlign: 'center', padding: `${designTokens.spacing[12]} 0` }}>
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
              Select State & District
            </h3>
            <p style={{
              fontSize: '16px',
              color: designTokens.colors.slate500,
              lineHeight: 1.7,
              margin: 0
            }}>
              Choose a state first, then a district to explore granular Aadhaar activity data.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
