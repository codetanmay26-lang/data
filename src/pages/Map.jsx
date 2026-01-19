// src/pages/Map.jsx - PRODUCT-GRADE NATIONAL ANALYTICS (DISTRICT REMOVED)
import React, { useEffect, useState } from "react";
import { LoadingCard } from "../components/DashboardComponents";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const API = "http://127.0.0.1:8000";

const SPACING_6 = '24px';
const SPACING_8 = '32px';
const SPACING_12 = '48px';
const RADIUS_LG = '16px';
const RADIUS_MD = '12px';

// Government-grade color palette
const COLORS = {
  primary: '#1e40af',
  secondary: '#0891b2', 
  tertiary: '#059669',
  neutral: '#64748b',
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate700: '#334155',
  slate900: '#0f172a'
};

const CHART_COLORS = ['#1e40af', '#0891b2', '#059669'];

export default function Map() {
  const [nationalData, setNationalData] = useState(null);
  const [stateData, setStateData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FIXED: NO DISTRICT API CALL
  useEffect(() => {
    async function loadAllData() {
      try {
        setLoading(true);
        const [nationalRes, stateRes] = await Promise.all([
          fetch(`${API}/aggregate/national`),
          fetch(`${API}/aggregate/state`)
          // ✅ REMOVED: fetch(`${API}/aggregate/district`)
        ]);
        
        const national = await nationalRes.json();
        const states = await stateRes.json();
        
        setNationalData(national);
        setStateData(Array.isArray(states) ? states : []);
      } catch (e) {
        console.error("Failed to load data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadAllData();
  }, []);

  // COMPUTATION: Service load with correct nested structure
  const computeServiceLoad = (data) => {
    if (!data) return 0;
    
    // Handle nested structure (national) vs flat structure (state)
    const e = data.enrolment || data;
    const b = data.biometric_update || data;
    const dm = data.demographic_update || data;
    
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

  // COMPUTATION: National KPIs (correct nested structure)
  const enrol = nationalData?.enrolment || {};
  const bio = nationalData?.biometric_update || {};
  const demo = nationalData?.demographic_update || {};
  
  const totalEnrolments = (enrol.age_0_5 || 0) + (enrol.age_5_17 || 0) + (enrol.age_18_greater || 0);
  const totalBiometric = (bio.bio_age_5_17 || 0) + (bio.bio_age_17_ || 0);
  const totalDemographic = (demo.demo_age_5_17 || 0) + (demo.demo_age_17_ || 0);
  const serviceLoadIndex = Math.round(computeServiceLoad(nationalData));

  // COMPUTATION: Service composition
  const serviceComposition = [
    { name: 'Enrolments', value: totalEnrolments },
    { name: 'Biometric Updates', value: totalBiometric },
    { name: 'Demographic Updates', value: totalDemographic }
  ];

  // COMPUTATION: Top 10 states by service load
  const statesWithLoad = stateData
    .map(state => ({
      state: state.state,
      load: Math.round(computeServiceLoad(state))
    }))
    .sort((a, b) => b.load - a.load)
    .slice(0, 10);

  // COMPUTATION: Demand distribution (Low/Medium/High) - STATES ONLY
  const allStateLoads = stateData.map(s => computeServiceLoad(s)).filter(l => l > 0).sort((a, b) => a - b);
  const median = allStateLoads[Math.floor(allStateLoads.length / 2)] || 0;
  const q3 = allStateLoads[Math.floor(allStateLoads.length * 0.75)] || 0;
  
  const demandDistribution = [
    { category: 'Low Demand', count: stateData.filter(s => computeServiceLoad(s) < median).length },
    { category: 'Medium Demand', count: stateData.filter(s => computeServiceLoad(s) >= median && computeServiceLoad(s) < q3).length },
    { category: 'High Demand', count: stateData.filter(s => computeServiceLoad(s) >= q3).length }
  ];

  // ✅ REMOVED: All district-related computations and state

  // COMPUTATION: Insights
  const top3StatesLoad = statesWithLoad.slice(0, 3).reduce((sum, s) => sum + s.load, 0);
  const totalStateLoad = statesWithLoad.reduce((sum, s) => sum + s.load, 0);
  const top3Percentage = totalStateLoad > 0 ? Math.round((top3StatesLoad / totalStateLoad) * 100) : 0;
  
  const totalServices = totalEnrolments + totalBiometric + totalDemographic;
  const biometricPercentage = totalServices > 0 ? Math.round((totalBiometric / totalServices) * 100) : 0;

  return (
    <div style={{
      padding: '8px 32px 40px 32px',
      width: '100%',
      background: '#f8fafc',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      
      {/* SECTION 1: Page Header */}
      <header style={{
        padding: `${SPACING_8} 0 ${SPACING_6}`,
        borderBottom: `1px solid ${COLORS.slate200}`,
        marginBottom: SPACING_6
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 700,
          color: COLORS.slate900,
          margin: '0 0 8px 0',
          lineHeight: 1.1
        }}>
          National Demand Analytics
        </h1>
        <p style={{
          fontSize: '16px',
          color: COLORS.neutral,
          margin: 0,
          fontWeight: 400
        }}>
          Data-driven insights into Aadhaar enrolment, biometric, and demographic service demand
        </p>
      </header>

      {/* SECTION 2: KPI Cards */}
      <section style={{ marginBottom: SPACING_12 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: SPACING_8
        }}>
          {[
            { label: 'Total Enrolments', value: totalEnrolments.toLocaleString(), color: COLORS.primary },
            { label: 'Total Biometric Updates', value: totalBiometric.toLocaleString(), color: COLORS.secondary },
            { label: 'Total Demographic Updates', value: totalDemographic.toLocaleString(), color: COLORS.tertiary },
            { label: 'Service Load Index', value: serviceLoadIndex.toLocaleString(), color: COLORS.neutral }
          ].map((kpi, idx) => (
            <div key={idx} style={{
              background: '#ffffff',
              borderRadius: RADIUS_LG,
              border: `1px solid ${COLORS.slate200}`,
              padding: SPACING_8,
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.08)',
              borderTop: `3px solid ${kpi.color}`
            }}>
              <div style={{
                fontSize: '14px',
                color: COLORS.neutral,
                fontWeight: 500,
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {kpi.label}
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: 700,
                color: kpi.color,
                lineHeight: 1
              }}>
                {kpi.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Service Composition */}
      <section style={{ marginBottom: SPACING_12 }}>
        <div style={{
          background: '#ffffff',
          borderRadius: RADIUS_LG,
          border: `1px solid ${COLORS.slate200}`,
          padding: SPACING_12,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          borderTop: `3px solid ${COLORS.primary}`
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 600,
            color: COLORS.slate900,
            margin: '0 0 24px 0'
          }}>
            National Service Composition
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceComposition}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {serviceComposition.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* SECTION 4: State Comparison */}
      <section style={{ marginBottom: SPACING_12 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: SPACING_8
        }}>
          {/* Top 10 States */}
          <div style={{
            background: '#ffffff',
            borderRadius: RADIUS_LG,
            border: `1px solid ${COLORS.slate200}`,
            padding: SPACING_12,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            borderTop: `3px solid ${COLORS.secondary}`
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 600,
              color: COLORS.slate900,
              margin: '0 0 24px 0'
            }}>
              Top 10 States by Service Load
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={statesWithLoad} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.slate200} />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="state" type="category" tick={{ fontSize: 12 }} width={80} />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Bar dataKey="load" fill={COLORS.secondary} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Demand Distribution */}
          <div style={{
            background: '#ffffff',
            borderRadius: RADIUS_LG,
            border: `1px solid ${COLORS.slate200}`,
            padding: SPACING_12,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            borderTop: `3px solid ${COLORS.tertiary}`
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 600,
              color: COLORS.slate900,
              margin: '0 0 24px 0'
            }}>
              State Demand Distribution
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={demandDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.slate200} />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill={COLORS.tertiary} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* ✅ REMOVED: SECTION 5: District Snapshot */}

      {/* SECTION 6: Insights */}
      <section style={{ marginBottom: SPACING_12 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: SPACING_8
        }}>
          <div style={{
            background: COLORS.slate50,
            borderRadius: RADIUS_LG,
            border: `1px solid ${COLORS.slate200}`,
            borderLeft: `4px solid ${COLORS.primary}`,
            padding: SPACING_8,
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.08)'
          }}>
            <p style={{
              fontSize: '15px',
              color: COLORS.slate700,
              lineHeight: 1.7,
              margin: 0
            }}>
              Top 3 states contribute <strong>{top3Percentage}%</strong> of total service load among top 10 states
            </p>
          </div>

          <div style={{
            background: COLORS.slate50,
            borderRadius: RADIUS_LG,
            border: `1px solid ${COLORS.slate200}`,
            borderLeft: `4px solid ${COLORS.secondary}`,
            padding: SPACING_8,
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.08)'
          }}>
            <p style={{
              fontSize: '15px',
              color: COLORS.slate700,
              lineHeight: 1.7,
              margin: 0
            }}>
              Biometric updates represent <strong>{biometricPercentage}%</strong> of total service demand
            </p>
          </div>

          <div style={{
            background: COLORS.slate50,
            borderRadius: RADIUS_LG,
            border: `1px solid ${COLORS.slate200}`,
            borderLeft: `4px solid ${COLORS.tertiary}`,
            padding: SPACING_8,
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.08)'
          }}>
            <p style={{
              fontSize: '15px',
              color: COLORS.slate700,
              lineHeight: 1.7,
              margin: 0
            }}>
              <strong>{demandDistribution[2]?.count || 0}</strong> states in high-demand category (Q3+)
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
