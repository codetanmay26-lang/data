// src/pages/MigrationForecast.jsx - ML-Powered Migration Forecasting
import React, { useState, useEffect } from 'react';

const API_BASE = 'http://127.0.0.1:8000';

const designTokens = {
  spacing: { xs: '8px', sm: '12px', md: '16px', lg: '20px', xl: '24px' },
  radius: { sm: '8px', md: '10px' },
  colors: {
    slate50: '#f8fafc', slate100: '#f1f5f9', slate200: '#e2e8f0',
    slate500: '#64748b', slate600: '#475569', slate700: '#334155',
    slate800: '#1e293b', slate900: '#0f172a',
    blue500: '#3b82f6', blue600: '#2563eb',
    green500: '#22c55e', yellow500: '#eab308', red500: '#ef4444'
  }
};

export default function MigrationForecast() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [forecastDays, setForecastDays] = useState(30);
  const [method, setMethod] = useState('prophet');
  const [forecast, setForecast] = useState(null);
  const [topGrowth, setTopGrowth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch available states on mount
  useEffect(() => {
    fetch(`${API_BASE}/migration/available-states`)
      .then(res => res.json())
      .then(data => setStates(data.states))
      .catch(err => console.error('Failed to load states:', err));
  }, []);

  // Fetch districts when state changes
  useEffect(() => {
    if (selectedState) {
      fetch(`${API_BASE}/migration/districts/${encodeURIComponent(selectedState)}`)
        .then(res => res.json())
        .then(data => {
          setDistricts(data.districts);
          setSelectedDistrict('');
        })
        .catch(err => console.error('Failed to load districts:', err));
    }
  }, [selectedState]);

  const handleForecast = async () => {
    if (!selectedState || !selectedDistrict) {
      setError('Please select both state and district');
      return;
    }

    setLoading(true);
    setError(null);
    setForecast(null);

    try {
      const res = await fetch(
        `${API_BASE}/migration/forecast/${encodeURIComponent(selectedState)}/${encodeURIComponent(selectedDistrict)}?days=${forecastDays}&method=${method}`
      );
      const data = await res.json();
      
      if (res.ok) {
        setForecast(data);
      } else {
        setError(data.detail || 'Forecast failed');
      }
    } catch (err) {
      setError('Failed to connect to API. Make sure backend is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const handleTopGrowth = async () => {
    if (!selectedState) {
      setError('Please select a state');
      return;
    }

    setLoading(true);
    setError(null);
    setTopGrowth(null);

    try {
      const res = await fetch(
        `${API_BASE}/migration/forecast/top-growth/${encodeURIComponent(selectedState)}?top_n=10`
      );
      const data = await res.json();
      
      if (res.ok) {
        setTopGrowth(data);
      } else {
        setError(data.detail || 'Failed to fetch top growth');
      }
    } catch (err) {
      setError('Failed to connect to API');
    } finally {
      setLoading(false);
    }
  };

  const getMigrationColor = (value) => {
    if (value > 3.0) return designTokens.colors.red500;
    if (value > 2.0) return '#f97316'; // orange
    if (value > 1.0) return designTokens.colors.yellow500;
    return designTokens.colors.green500;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${designTokens.colors.slate50} 0%, #f8fcff 100%)`,
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: designTokens.spacing.xl }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: designTokens.colors.slate900,
            margin: '0 0 8px 0'
          }}>
            🔮 Migration Forecasting
          </h1>
          <p style={{
            fontSize: '16px',
            color: designTokens.colors.slate600,
            margin: 0
          }}>
            ML-powered predictions using Prophet & ARIMA models
          </p>
        </div>

        {/* Controls */}
        <div style={{
          background: '#ffffff',
          borderRadius: designTokens.radius.md,
          padding: designTokens.spacing.xl,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: designTokens.spacing.xl
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: designTokens.spacing.md }}>
            
            {/* State Selector */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: designTokens.colors.slate700 }}>
                State
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${designTokens.colors.slate200}`,
                  borderRadius: designTokens.radius.sm,
                  fontSize: '14px',
                  backgroundColor: '#ffffff'
                }}
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* District Selector */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: designTokens.colors.slate700 }}>
                District
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedState}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${designTokens.colors.slate200}`,
                  borderRadius: designTokens.radius.sm,
                  fontSize: '14px',
                  backgroundColor: selectedState ? '#ffffff' : designTokens.colors.slate100
                }}
              >
                <option value="">Select District</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            {/* Forecast Days */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: designTokens.colors.slate700 }}>
                Forecast Days
              </label>
              <input
                type="number"
                min="7"
                max="180"
                value={forecastDays}
                onChange={(e) => setForecastDays(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${designTokens.colors.slate200}`,
                  borderRadius: designTokens.radius.sm,
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Method */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: designTokens.colors.slate700 }}>
                ML Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${designTokens.colors.slate200}`,
                  borderRadius: designTokens.radius.sm,
                  fontSize: '14px'
                }}
              >
                <option value="prophet">Prophet (Fast)</option>
                <option value="arima">ARIMA</option>
                <option value="ensemble">Ensemble (Best)</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: designTokens.spacing.md, marginTop: designTokens.spacing.lg }}>
            <button
              onClick={handleForecast}
              disabled={loading || !selectedState || !selectedDistrict}
              style={{
                padding: '12px 24px',
                background: loading ? designTokens.colors.slate300 : designTokens.colors.blue600,
                color: '#ffffff',
                border: 'none',
                borderRadius: designTokens.radius.sm,
                fontSize: '15px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {loading ? 'Forecasting...' : '🔮 Generate Forecast'}
            </button>

            <button
              onClick={handleTopGrowth}
              disabled={loading || !selectedState}
              style={{
                padding: '12px 24px',
                background: loading ? designTokens.colors.slate300 : designTokens.colors.green500,
                color: '#ffffff',
                border: 'none',
                borderRadius: designTokens.radius.sm,
                fontSize: '15px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {loading ? 'Loading...' : '🚀 Top Growing Districts'}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: designTokens.spacing.md,
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: designTokens.radius.sm,
            color: '#991b1b',
            marginBottom: designTokens.spacing.lg
          }}>
            ❌ {error}
          </div>
        )}

        {/* Forecast Results */}
        {forecast && (
          <div style={{
            background: '#ffffff',
            borderRadius: designTokens.radius.md,
            padding: designTokens.spacing.xl,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: designTokens.spacing.xl
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: designTokens.spacing.lg, color: designTokens.colors.slate900 }}>
              Forecast Results: {forecast.district}, {forecast.state}
            </h2>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: designTokens.spacing.md, marginBottom: designTokens.spacing.xl }}>
              <div style={{ padding: designTokens.spacing.md, background: designTokens.colors.slate50, borderRadius: designTokens.radius.sm, border: `1px solid ${designTokens.colors.slate200}` }}>
                <div style={{ fontSize: '13px', color: designTokens.colors.slate600, marginBottom: '4px' }}>Historical Avg</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: designTokens.colors.slate900 }}>
                  {forecast.historical_avg_index?.toFixed(2)}
                </div>
              </div>

              <div style={{ padding: designTokens.spacing.md, background: designTokens.colors.slate50, borderRadius: designTokens.radius.sm, border: `1px solid ${designTokens.colors.slate200}` }}>
                <div style={{ fontSize: '13px', color: designTokens.colors.slate600, marginBottom: '4px' }}>Predicted Avg</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: getMigrationColor(forecast.interpretation?.average_predicted_index) }}>
                  {forecast.interpretation?.average_predicted_index?.toFixed(2)}
                </div>
              </div>

              <div style={{ padding: designTokens.spacing.md, background: designTokens.colors.slate50, borderRadius: designTokens.radius.sm, border: `1px solid ${designTokens.colors.slate200}` }}>
                <div style={{ fontSize: '13px', color: designTokens.colors.slate600, marginBottom: '4px' }}>Trend</div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: designTokens.colors.slate900 }}>
                  {forecast.interpretation?.trend} ({forecast.interpretation?.change_percent?.toFixed(1)}%)
                </div>
              </div>

              <div style={{ padding: designTokens.spacing.md, background: designTokens.colors.slate50, borderRadius: designTokens.radius.sm, border: `1px solid ${designTokens.colors.slate200}` }}>
                <div style={{ fontSize: '13px', color: designTokens.colors.slate600, marginBottom: '4px' }}>Data Points</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: designTokens.colors.slate900 }}>
                  {forecast.historical_data_points}
                </div>
              </div>
            </div>

            {/* Interpretation */}
            <div style={{
              padding: designTokens.spacing.lg,
              background: getMigrationColor(forecast.interpretation?.average_predicted_index) + '15',
              borderLeft: `4px solid ${getMigrationColor(forecast.interpretation?.average_predicted_index)}`,
              borderRadius: designTokens.radius.sm,
              marginBottom: designTokens.spacing.lg
            }}>
              <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', color: designTokens.colors.slate900 }}>
                {forecast.interpretation?.migration_pressure}
              </div>
              <div style={{ fontSize: '14px', color: designTokens.colors.slate700 }}>
                {forecast.interpretation?.policy_impact}
              </div>
            </div>

            {/* Sample Predictions Table */}
            {forecast.forecast && forecast.forecast.length > 0 && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: designTokens.spacing.md, color: designTokens.colors.slate900 }}>
                  Sample Predictions (First 10 days)
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ background: designTokens.colors.slate100 }}>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: `2px solid ${designTokens.colors.slate300}`, fontWeight: '600' }}>Date</th>
                        <th style={{ padding: '12px', textAlign: 'right', borderBottom: `2px solid ${designTokens.colors.slate300}`, fontWeight: '600' }}>Predicted Index</th>
                        <th style={{ padding: '12px', textAlign: 'right', borderBottom: `2px solid ${designTokens.colors.slate300}`, fontWeight: '600' }}>Lower Bound</th>
                        <th style={{ padding: '12px', textAlign: 'right', borderBottom: `2px solid ${designTokens.colors.slate300}`, fontWeight: '600' }}>Upper Bound</th>
                      </tr>
                    </thead>
                    <tbody>
                      {forecast.forecast.slice(0, 10).map((pred, idx) => (
                        <tr key={idx} style={{ borderBottom: `1px solid ${designTokens.colors.slate200}` }}>
                          <td style={{ padding: '10px' }}>{new Date(pred.date).toLocaleDateString()}</td>
                          <td style={{ padding: '10px', textAlign: 'right', fontWeight: '600', color: getMigrationColor(pred.predicted_index) }}>
                            {pred.predicted_index?.toFixed(2)}
                          </td>
                          <td style={{ padding: '10px', textAlign: 'right', color: designTokens.colors.slate600 }}>
                            {pred.lower_bound?.toFixed(2)}
                          </td>
                          <td style={{ padding: '10px', textAlign: 'right', color: designTokens.colors.slate600 }}>
                            {pred.upper_bound?.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Top Growth Districts */}
        {topGrowth && (
          <div style={{
            background: '#ffffff',
            borderRadius: designTokens.radius.md,
            padding: designTokens.spacing.xl,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: designTokens.spacing.md, color: designTokens.colors.slate900 }}>
              🚀 Top 10 Growing Districts - {topGrowth.state}
            </h2>
            <p style={{ fontSize: '14px', color: designTokens.colors.slate600, marginBottom: designTokens.spacing.lg }}>
              Ranked by predicted 30-day average migration index
            </p>

            <div style={{ display: 'grid', gap: designTokens.spacing.sm }}>
              {topGrowth.top_districts?.map((dist, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: designTokens.spacing.md,
                    background: designTokens.colors.slate50,
                    borderRadius: designTokens.radius.sm,
                    border: `1px solid ${designTokens.colors.slate200}`,
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: idx < 3 ? designTokens.colors.blue500 : designTokens.colors.slate300,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    marginRight: designTokens.spacing.md
                  }}>
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: designTokens.colors.slate900 }}>
                      {dist.district}
                    </div>
                    <div style={{ fontSize: '13px', color: designTokens.colors.slate600 }}>
                      {dist.status}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: getMigrationColor(dist.predicted_avg_index)
                  }}>
                    {dist.predicted_avg_index?.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
