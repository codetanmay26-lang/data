// src/pages/DemandAnalysis.jsx - STRICT ALIGNMENT + DROPDOWN ONLY (COMPLETE)
import React, { useEffect, useState } from "react";
import { Section, LoadingCard, ErrorCard, KPIGrid } from "../components/DashboardComponents";

const API = "http://127.0.0.1:8000";

const designTokens = {
  spacing: { 4: '16px', 6: '24px', 8: '32px', 12: '48px' },
  radius: { md: '12px', lg: '16px' },
  shadows: {
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
  },
  colors: {
    slate50: '#f8fafc', slate100: '#f1f5f9', slate200: '#e2e8f0', slate500: '#64748b',
    slate700: '#334155', slate800: '#1e293b', slate900: '#0f172a',
    blue500: '#3b82f6', green500: '#10b981', orange500: '#f59e0b'
  }
};

export default function DemandAnalysis() {
  const [states, setStates] = useState([]);
  const [stationsData, setStationsData] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStates() {
      try {
        const res = await fetch(`${API}/aggregate/state`);
        if (!res.ok) throw new Error("Failed to fetch states");
        const data = await res.json();
        setStates(Array.isArray(data) ? data : []);
      } catch (e) {
        setError("Failed to load states");
      } finally {
        setLoading(false);
      }
    }
    loadStates();
  }, []);

  useEffect(() => {
    async function loadStations() {
      if (!selectedState) {
        setStationsData(null);
        setSelectedDistrict(null);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const stateName = encodeURIComponent(selectedState.state);
        const res = await fetch(`${API}/estimate/stations/district?state=${stateName}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const response = await res.json();
        setStationsData(response);
      } catch (e) {
        setError(`Failed to load stations for ${selectedState.state}`);
        setStationsData(null);
      } finally {
        setLoading(false);
      }
    }
    loadStations();
  }, [selectedState]);

  const getSelectedDistrictData = () => {
    if (!selectedDistrict || !stationsData?.data) return null;
    return stationsData.data.find(d => 
      d.district.replace(/ \*$/, '').trim() === selectedDistrict.trim()
    );
  };

  const districtOptions = stationsData?.data?.map(district => 
    district.district.replace(/ \*$/, '').trim()
  ) || [];

  const stateOptions = Array.isArray(states)
    ? states
        .filter((s) => s && s.state && typeof s.state === "string")
        .map((s) => s.state.trim())
        .filter((name, idx, arr) => name && arr.indexOf(name) === idx)
        .sort((a, b) => a.localeCompare(b))
    : [];

  const districtData = getSelectedDistrictData();
  const sortedDistricts = (stationsData?.data || []).sort((a, b) => 
    (b.estimated_stations_needed || 0) - (a.estimated_stations_needed || 0)
  );

  const handleStateChange = (e) => {
    const name = e.target.value;
    if (name) {
      const found = states.find((s) => s.state?.trim() === name);
      setSelectedState(found || null);
      setSelectedDistrict(null);
    } else {
      setSelectedState(null);
    }
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

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

  return (
    <div style={{
      // ✅ STRICT DASHBOARD ALIGNMENT: 8px top, 32px sides
      padding: '8px 32px 40px 32px',
      width: '100%',
      background: '#f8fafc',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {error && <ErrorCard error={error} />}

      {/* ✅ PAGE HEADER */}
      <header style={{
        padding: `${designTokens.spacing[8]} 0 ${designTokens.spacing[6]}`,
        borderBottom: `1px solid ${designTokens.colors.slate200}`,
        marginBottom: designTokens.spacing[6]
      }}>
        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 36px)',
          fontWeight: 700,
          color: designTokens.colors.slate900,
          margin: '0 0 8px 0',
          lineHeight: 1.1
        }}>
          Aadhaar Station Demand Analysis
        </h1>
        <p style={{
          fontSize: '16px',
          color: designTokens.colors.slate500,
          margin: 0,
          fontWeight: 400
        }}>
          State and district-level station capacity requirements
        </p>
      </header>

      {/* ✅ DROPDOWNS ONLY - NO SEARCH */}
      <section style={{ marginBottom: designTokens.spacing[12] }}>
        <div style={{
          background: '#ffffff',
          borderRadius: designTokens.radius.lg,
          border: `1px solid ${designTokens.colors.slate200}`,
          padding: designTokens.spacing[8],
          boxShadow: designTokens.shadows.md
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
            alignItems: 'end'
          }}>
            {/* ✅ STATE SELECT - NO SEARCH */}
            <select
              value={selectedState?.state || ''}
              onChange={handleStateChange}
              style={getSelectStyle(!!selectedState, designTokens.colors.blue500)}
            >
              <option value="">Select state…</option>
              {stateOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            {/* ✅ DISTRICT SELECT - NO SEARCH */}
            {selectedState && stationsData && (
              <select
                value={selectedDistrict || ''}
                onChange={handleDistrictChange}
                style={getSelectStyle(!!selectedDistrict, designTokens.colors.green500)}
              >
                <option value="">Select district…</option>
                {districtOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </section>

      {/* ✅ DISTRICT DETAIL */}
      {selectedState && selectedDistrict && districtData && (
        <section style={{ marginBottom: designTokens.spacing[12] }}>
          <div style={{ 
            marginBottom: designTokens.spacing[8], 
            paddingBottom: designTokens.spacing[6],
            borderBottom: `1px solid ${designTokens.colors.slate200}`
          }}>
            <h2 style={{
              fontSize: 'clamp(24px, 4vw, 28px)',
              fontWeight: 600,
              color: designTokens.colors.slate900,
              margin: 0
            }}>
              Station Requirements: {selectedDistrict}
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            marginBottom: designTokens.spacing[12]
          }}>
            {[
              { value: districtData.estimated_stations_needed || 0, label: 'Stations Needed', color: designTokens.colors.green500 },
              { value: Math.round(districtData.service_load_annualised || 0).toLocaleString(), label: 'Annual Load', color: designTokens.colors.blue500 },
              { value: `${districtData.time_window_days} days`, label: 'Time Window', color: designTokens.colors.orange500 }
            ].map((card, idx) => (
              <div key={idx} style={{
                height: '140px',
                padding: '32px 24px',
                background: '#ffffff',
                border: `1px solid ${designTokens.colors.slate200}`,
                borderRadius: designTokens.radius.lg,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                boxShadow: designTokens.shadows.md
              }}>
                <div style={{
                  fontSize: idx === 0 ? 'clamp(28px, 8vw, 36px)' : 'clamp(24px, 6vw, 32px)',
                  fontWeight: 700,
                  color: card.color,
                  marginBottom: '8px',
                  lineHeight: 1
                }}>
                  {card.value}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: designTokens.colors.slate700,
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {card.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: designTokens.colors.slate50,
            border: `1px solid ${designTokens.colors.slate200}`,
            borderLeft: `4px solid ${designTokens.colors.green500}`,
            borderRadius: designTokens.radius.lg,
            padding: '32px 40px',
            boxShadow: designTokens.shadows.sm
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: designTokens.colors.slate800,
              margin: '0 0 16px 0'
            }}>
              Calculation Details
            </h3>
            <div style={{
              fontSize: '15px',
              color: designTokens.colors.slate700,
              lineHeight: 1.7
            }}>
              Annualized from {districtData.time_window_days} days data × {districtData.annualisation_factor?.toFixed(2)}x factor<br/>
              1 station = 25,000 weighted service units/year (age-based weights applied)
            </div>
          </div>
        </section>
      )}

      {/* ✅ STATE OVERVIEW */}
      {selectedState && stationsData && !selectedDistrict && (
        <section style={{ marginBottom: designTokens.spacing[12] }}>
          <div style={{ 
            marginBottom: designTokens.spacing[8], 
            paddingBottom: designTokens.spacing[6],
            borderBottom: `1px solid ${designTokens.colors.slate200}`
          }}>
            <h2 style={{
              fontSize: 'clamp(24px, 4vw, 28px)',
              fontWeight: 600,
              color: designTokens.colors.slate900,
              margin: 0
            }}>
              Station Requirements - {selectedState.state}
            </h2>
          </div>

          <div style={{ marginBottom: designTokens.spacing[12] }}>
            <KPIGrid
              items={[
                ["Total Districts", stationsData.data?.length || 0],
                ["Total Stations Needed", sortedDistricts.reduce((sum, d) => sum + (d.estimated_stations_needed || 0), 0)],
                ["Total Annual Load", Math.round(sortedDistricts.reduce((sum, d) => sum + (d.service_load_annualised || 0), 0)).toLocaleString()],
                ["Avg Stations/District", Math.round((sortedDistricts.reduce((sum, d) => sum + (d.estimated_stations_needed || 0), 0) / (stationsData.data?.length || 1)))],
                ["Highest Demand", Math.max(...sortedDistricts.map(d => d.estimated_stations_needed || 0))]
              ]}
            />
          </div>

          <div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 600,
              color: designTokens.colors.slate900,
              margin: '0 0 24px 0'
            }}>
              Top 10 Districts
            </h3>
            <div style={{
              background: '#ffffff',
              borderRadius: designTokens.radius.lg,
              border: `1px solid ${designTokens.colors.slate200}`,
              boxShadow: designTokens.shadows.md,
              overflow: 'hidden'
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '15px'
              }}>
                <thead>
                  <tr style={{ background: designTokens.colors.slate50 }}>
                    <th style={{
                      padding: '20px 24px',
                      textAlign: 'left',
                      fontWeight: 600,
                      color: designTokens.colors.slate800
                    }}>
                      District
                    </th>
                    <th style={{
                      padding: '20px 24px',
                      textAlign: 'right',
                      fontWeight: 600,
                      color: designTokens.colors.slate800
                    }}>
                      Stations
                    </th>
                    <th style={{
                      padding: '20px 24px',
                      textAlign: 'right',
                      fontWeight: 600,
                      color: designTokens.colors.slate800
                    }}>
                      Load
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDistricts.slice(0, 10).map((district, idx) => (
                    <tr key={idx} style={{
                      background: idx % 2 === 0 ? '#ffffff' : designTokens.colors.slate50,
                      borderBottom: `1px solid ${designTokens.colors.slate200}`
                    }}>
                      <td style={{
                        padding: '20px 24px',
                        fontWeight: 500,
                        color: designTokens.colors.slate900
                      }}>
                        {district.district.replace(/ \*$/, '')}
                      </td>
                      <td style={{
                        padding: '20px 24px',
                        textAlign: 'right',
                        color: designTokens.colors.green500,
                        fontWeight: 600
                      }}>
                        {district.estimated_stations_needed}
                      </td>
                      <td style={{
                        padding: '20px 24px',
                        textAlign: 'right',
                        color: designTokens.colors.blue500
                      }}>
                        {Math.round(district.service_load_annualised).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ✅ EMPTY STATE */}
      {!selectedState && !loading && (
        <section style={{
          textAlign: 'center',
          padding: `${designTokens.spacing[12]} 0`
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: designTokens.radius.lg,
            border: `1px solid ${designTokens.colors.slate200}`,
            padding: designTokens.spacing[12],
            boxShadow: designTokens.shadows.md
          }}>
            <p style={{
              fontSize: '16px',
              color: designTokens.colors.slate500,
              lineHeight: 1.7,
              margin: 0,
              maxWidth: '500px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              Select a state and district to view detailed station requirements and capacity analysis.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
