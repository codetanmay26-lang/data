// NationalInsights.jsx - REFINED with Insight Readiness Panel + Spacing Fix
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './NationalInsights.css';

const NationalInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:8000/insights/national');

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        setInsights(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading national insights...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          Error loading insights: {error}
        </div>
      </div>
    );
  }

  const { summary, service_composition, concentration_analysis, capacity_signal, trend_insight, risk_flags } = insights;

  const getSubtitle = () => {
    return `${service_composition?.dominant_service || 'Services'} drives national demand at ${Math.round(capacity_signal?.national_service_load_index || 0).toLocaleString()} service load.`;
  };

  const getRiskExplanation = (flag) => {
    const explanations = {
      'BIO_REVERIFICATION_SURGE': 'Elevated biometric re-verification demand exceeds historical averages.',
      'CAPACITY_STRETCH_RISK': 'National service load index reflects significantly elevated operational demand.',
      'HIGH_REGIONAL_CONCENTRATION': 'Demand heavily concentrated in few states creates operational vulnerability.',
      'CRITICAL_CAPACITY_GAP': 'Immediate infrastructure expansion required to meet service demand.'
    };
    return explanations[flag] || 'Operational risk indicator triggered.';
  };

  const getCapacityBgClass = () => {
    const loadIndex = capacity_signal?.national_service_load_index || 0;
    if (loadIndex > 100000000) return 'capacity-elevated';
    if (loadIndex > 50000000) return 'capacity-high';
    if (loadIndex > 10000000) return 'capacity-moderate';
    return 'capacity-low';
  };

  const getCapacityLabel = (loadIndex) => {
    if (loadIndex > 100000000) return 'Elevated Observed Load';
    if (loadIndex > 50000000) return 'High Observed Load';
    if (loadIndex > 10000000) return 'Moderate Observed Load';
    return 'Low Observed Load';
  };

  const getConcentrationBgClass = () => {
    const risk = concentration_analysis?.risk_flag;
    if (risk === 'HIGH_CONCENTRATION') {
      return 'concentration-high';
    }
    return 'concentration-low';
  };

  return (
    <div className="page-container">
      {/* Header Section - FIXED SPACING */}
      <div className="content-wrapper">
        <div className="header-section">
          <h1 className="page-title">National Aadhaar Service Insights</h1>
          <p className="page-subtitle">{getSubtitle()}</p>
        </div>

        {/* Key Signals - 3 Insight Cards */}
        <div className="cards-grid">
          {/* Card 1: Service Dominance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="insight-card service-card"
          >
            <div className="card-header">
              <div className="icon-container service-icon">
                <svg className="icon" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="header-text">
                <h3>Dominant Service</h3>
                <p>Current composition</p>
              </div>
            </div>
            <div className="card-content">
              <div className="share-percent">{service_composition?.share_percent?.toFixed(1) || 0}%</div>
              <h2 className="service-name">{service_composition?.dominant_service}</h2>
              <p className="card-commentary">{service_composition?.commentary}</p>
            </div>
          </motion.div>

          {/* Card 2: National Service Load */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`insight-card ${getCapacityBgClass()}`}
          >
            <div className="card-header">
              <div className={`icon-container load-icon-${getCapacityBgClass().replace('capacity-', '')}`}>
                <svg className="icon" viewBox="0 0 24 24">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="header-text">
                <h3>National Service Load</h3>
                <p>Observed demand indicator</p>
              </div>
            </div>
            <div className="card-content">
              <div className="load-index">
                {Math.round(capacity_signal?.national_service_load_index || 0).toLocaleString()}
              </div>
              <div className="load-label">
                {getCapacityLabel(capacity_signal?.national_service_load_index || 0)}
              </div>
              <p className="card-commentary">
                National service load index reflects aggregated Aadhaar service activity volume. 
                This is a demand magnitude indicator only.
              </p>
              <div className="load-disclaimer">
                Service demand only. Infrastructure capacity not modeled.
              </div>
            </div>
          </motion.div>

          {/* Card 3: Concentration Risk */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`insight-card ${getConcentrationBgClass()}`}
          >
            <div className="card-header">
              <div className={`icon-container concentration-icon-${getConcentrationBgClass().replace('concentration-', '')}`}>
                <svg className="icon" viewBox="0 0 24 24">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a1 1 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="header-text">
                <h3>Regional Concentration</h3>
                <p>Geographic demand distribution</p>
              </div>
            </div>
            <div className="card-content">
              <div className="risk-level">{concentration_analysis?.risk_flag || 'Unknown'} Distribution</div>
              <div className="states-section">
                <div className="states-label">Top 3 States:</div>
                <div className="states-list">
                  {concentration_analysis?.top_3_states?.map((state, i) => (
                    <div key={i} className="state-name">{state}</div>
                  )) || <div className="no-data">Data unavailable</div>}
                </div>
              </div>
              <div className="concentration-percent">{concentration_analysis?.top_3_share_percent?.toFixed(1) || 0}%</div>
              <p className="card-commentary">{concentration_analysis?.commentary}</p>
            </div>
          </motion.div>
        </div>

        {/* Risk Flags Section */}
        <AnimatePresence>
          {risk_flags?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="risk-panel"
            >
              <h3 className="risk-title">
                <svg className="risk-icon" viewBox="0 0 24 24">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Operational Risk Indicators
              </h3>
              <div className="risk-grid">
                {risk_flags.map((flag) => (
                  <div key={flag} className="risk-item">
                    <div className="risk-badge">{flag.replace(/_/g, ' ').toUpperCase()}</div>
                    <p>{getRiskExplanation(flag)}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ✅ NEW: Insight Readiness Panel (Replaces Trend Section) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="insight-readiness-panel"
        >
          <div className="readiness-header">
            <div className="icon-container readiness-icon">
              <svg className="icon" viewBox="0 0 24 24">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3>Trend Analysis Readiness</h3>
              <p>Analytical scope summary</p>
            </div>
          </div>
          <div className="readiness-content">
            <p className="readiness-primary">
              This view presents high-confidence snapshot insights of current national Aadhaar service demand. 
              Longitudinal trend analysis will be enabled with consistent time-indexed datasets.
            </p>
            <p className="readiness-secondary">
              Platform prioritizes verified aggregates over speculative trend inference.
            </p>
          </div>
        </motion.div>

        {/* Methodology Footer */}
        <div className="methodology-footer">
          <div className="footer-content">
            <h4>Analysis Methodology</h4>
            <p>
              Deterministic, explainable insights derived from official UIDAI datasets. 
              Service load reflects observed demand magnitude only. No capacity modeling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NationalInsights;
