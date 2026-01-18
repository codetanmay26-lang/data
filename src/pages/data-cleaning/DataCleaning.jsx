// src/pages/data-cleaning/DataCleaning.jsx - Enterprise Government Analytics (COMPLETE)
import React, { useState, useEffect } from "react";
import { Section, LoadingCard, ErrorCard } from "../../components/DashboardComponents";

const API = "http://127.0.0.1:8000";

export default function DataCleaning() {
  const [cleaningLogs, setCleaningLogs] = useState([]);
  const [districtAnomalies, setDistrictAnomalies] = useState(null);
  const [selectedState, setSelectedState] = useState("Uttar Pradesh");
  const [selectedDataset, setSelectedDataset] = useState("enrolment");
  const [loading, setLoading] = useState(true);
  const [anomalyLoading, setAnomalyLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedDataset, setExpandedDataset] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const states = [
    "Uttar Pradesh", "West Bengal", "Maharashtra", "Bihar", "Andhra Pradesh",
    "Tamil Nadu", "Madhya Pradesh", "Rajasthan", "Karnataka", "Gujarat",
    "Odisha", "Kerala", "Jharkhand", "Assam", "Punjab", "Chhattisgarh",
    "Haryana", "Delhi", "Jammu And Kashmir", "Uttarakhand", "Himachal Pradesh"
  ];

  // LOAD CLEANING LOGS
  useEffect(() => {
    async function loadCleaningLogs() {
      try {
        const res = await fetch(`${API}/data-cleaning/logs`);
        if (!res.ok) throw new Error("Failed to fetch cleaning logs");
        const data = await res.json();
        const formatted = data.map(d => ({
          dataset_name: d.dataset,
          rows_processed: d.rows_processed,
          corrections_count: d.corrections_count,
          timestamp: d.timestamp,
          sample_corrections: d.corrections_sample || []
        }));
        setCleaningLogs(formatted);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    loadCleaningLogs();
  }, []);

  // LOAD DISTRICT ANOMALIES
  useEffect(() => {
    async function loadDistrictAnomalies() {
      if (!selectedState) return;
      try {
        setAnomalyLoading(true);
        const params = new URLSearchParams({ state: selectedState, dataset: selectedDataset });
        const res = await fetch(`${API}/data-cleaning/district-anomalies?${params}`);
        if (!res.ok) throw new Error("Failed to fetch anomalies");
        const data = await res.json();
        setDistrictAnomalies(data);
      } catch (e) {
        setDistrictAnomalies(null);
      } finally {
        setAnomalyLoading(false);
      }
    }
    loadDistrictAnomalies();
  }, [selectedState, selectedDataset]);

  if (loading) return <LoadingCard />;

  const getRatioColor = (ratio) => {
    if (ratio > 50) return "#dc2626";
    if (ratio > 20) return "#f59e0b";
    return "#059669";
  };

  const getSimilarityWidth = (similarity) => Math.max(20, similarity * 100);

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding: "0",
      background: "#f8fafc",
      minHeight: "100%"
    }}>
      {/* SECTION HEADER - Enterprise Style */}
      <div style={{
        padding: "24px 32px 24px",
        background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
        marginBottom: "40px",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h1 style={{
            fontSize: "1.875rem",
            fontWeight: 600,
            margin: "0 0 4px 0",
            color: "#1e293b",
            letterSpacing: "-0.025em"
          }}>
            Data Quality Monitoring
          </h1>
          <p style={{
            fontSize: "1rem",
            color: "#64748b",
            margin: 0,
            fontWeight: 400,
            lineHeight: 1.5
          }}>
            State normalization complete. District anomalies ready for analyst review.
          </p>
        </div>
      </div>

      {/* STATE CORRECTIONS */}
      <Section title="State Normalization Summary">
        <div style={{
          padding: "20px 24px",
          background: "#f8fafc",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          marginBottom: "32px"
        }}>
          <p style={{
            margin: 0,
            fontSize: "0.95rem",
            color: "#374151",
            fontWeight: 500,
            lineHeight: 1.5
          }}>
            Deterministic fuzzy matching applied. Raw data preserved with audit trail.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "24px"
        }}>
          {cleaningLogs.map((dataset, idx) => (
            <DatasetCardEnterprise
              key={idx}
              dataset={dataset}
              isExpanded={expandedDataset === idx}
              onToggle={() => setExpandedDataset(expandedDataset === idx ? null : idx)}
              isHovered={hoveredCard === idx}
              onHover={() => setHoveredCard(idx)}
              onHoverLeave={() => setHoveredCard(null)}
            />
          ))}
        </div>
      </Section>

      {/* DISTRICT ANOMALIES */}
      <Section title="District Boundary Analysis">
        {/* Controls */}
        <div style={{
          display: "flex",
          gap: "24px",
          padding: "28px",
          background: "#f8fafc",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          marginBottom: "24px"
        }}>
          <div style={{ flex: 1 }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#374151"
            }}>
              Administrative State
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "0.95rem",
                background: "white",
                transition: "all 0.15s",
                cursor: "pointer"
              }}
            >
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#374151"
            }}>
              Dataset Type
            </label>
            <select
              value={selectedDataset}
              onChange={(e) => setSelectedDataset(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "0.95rem",
                background: "white",
                transition: "all 0.15s",
                cursor: "pointer"
              }}
            >
              <option value="enrolment">Resident Enrolment</option>
              <option value="biometric_update">Biometric Update</option>
              <option value="demographic_update">Demographic Update</option>
            </select>
          </div>
        </div>

        {/* Warning Banner */}
        <div style={{
          padding: "16px 20px",
          background: "#fef3cd",
          border: "1px solid #f8d180",
          borderRadius: "8px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "flex-start",
          gap: "12px"
        }}>
          <div style={{ 
            width: "4px", 
            height: "20px", 
            background: "#f59e0b",
            borderRadius: "2px",
            marginTop: "4px"
          }} />
          <div>
            <h4 style={{ 
              margin: "0 0 4px 0", 
              fontSize: "0.95rem", 
              fontWeight: 600, 
              color: "#92400e" 
            }}>
              Human Review Required
            </h4>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "#a16207" }}>
              District name variations reflect administrative evolution. No automated merging applied. Analyst review recommended.
            </p>
          </div>
        </div>

        {/* Enterprise Data Table */}
        <div style={{
          background: "white",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb"
        }}>
          {anomalyLoading ? (
            <div style={{
              padding: "60px 40px",
              textAlign: "center",
              color: "#6b7280",
              fontSize: "1.1rem"
            }}>
              Analyzing district boundaries for {selectedState}...
            </div>
          ) : districtAnomalies?.potential_duplicates?.length ? (
            <>
              <div style={{
                padding: "24px 28px",
                background: "#f8fafc",
                borderBottom: "1px solid #e5e7eb"
              }}>
                <div style={{ 
                  display: "flex", 
                  gap: "24px", 
                  alignItems: "center",
                  fontSize: "1rem"
                }}>
                  <div style={{ color: "#1e293b", fontWeight: 600 }}>
                    {districtAnomalies.potential_duplicates.length} potential matches
                  </div>
                  <div style={{ color: "#64748b" }}>
                    {selectedState} • {selectedDataset.replace(/_/g, " ").toUpperCase()}
                  </div>
                </div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: "0.875rem" }}>
                  <thead style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 20,
                    background: "#1e40af",
                    color: "white"
                  }}>
                    <tr>
                      <th style={{
                        padding: "16px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        whiteSpace: "nowrap"
                      }}>
                        Primary District
                      </th>
                      <th style={{
                        padding: "16px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        whiteSpace: "nowrap"
                      }}>
                        Variant Name
                      </th>
                      <th style={{
                        padding: "16px 20px",
                        textAlign: "center",
                        fontWeight: 600
                      }}>
                        Similarity
                      </th>
                      <th style={{
                        padding: "16px 20px",
                        textAlign: "right",
                        fontWeight: 600,
                        whiteSpace: "nowrap"
                      }}>
                        Primary Count
                      </th>
                      <th style={{
                        padding: "16px 20px",
                        textAlign: "right",
                        fontWeight: 600,
                        whiteSpace: "nowrap"
                      }}>
                        Variant Count
                      </th>
                      <th style={{
                        padding: "16px 20px",
                        textAlign: "center",
                        fontWeight: 600,
                        whiteSpace: "nowrap"
                      }}>
                        Dominance Ratio
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {districtAnomalies.potential_duplicates.map((anomaly, i) => (
                      <tr key={i} 
                        style={{
                          transition: "all 0.15s",
                          background: hoveredRow === i ? "rgba(30, 64, 175, 0.04)" : (i % 2 === 0 ? "white" : "#fafbfc")
                        }}
                        onMouseEnter={() => setHoveredRow(i)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <td style={{
                          padding: "16px 20px",
                          fontWeight: 600,
                          color: "#1e293b",
                          fontSize: "0.9rem"
                        }}>
                          {anomaly.district_a}
                        </td>
                        <td style={{
                          padding: "16px 20px",
                          color: "#475569",
                          fontWeight: 500
                        }}>
                          {anomaly.district_b}
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "center" }}>
                          <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            background: "rgba(59, 130, 246, 0.08)",
                            padding: "4px 12px",
                            borderRadius: "16px",
                            fontWeight: 600,
                            color: "#1e40af"
                          }}>
                            <div style={{
                              width: `${getSimilarityWidth(anomaly.similarity)}%`,
                              height: "4px",
                              background: "#3b82f6",
                              borderRadius: "2px",
                              transition: "width 0.2s"
                            }} />
                            {(anomaly.similarity * 100).toFixed(0)}%
                          </div>
                        </td>
                        <td style={{
                          padding: "16px 20px",
                          textAlign: "right",
                          fontWeight: 700,
                          color: "#1e293b",
                          fontSize: "0.95rem"
                        }}>
                          {anomaly.rows_a?.toLocaleString()}
                        </td>
                        <td style={{
                          padding: "16px 20px",
                          textAlign: "right",
                          color: "#64748b",
                          fontWeight: 500
                        }}>
                          {anomaly.rows_b?.toLocaleString()}
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "center" }}>
                          <span style={{
                            padding: "6px 12px",
                            background: `rgba(220, 38, 38, 0.08)`,
                            color: getRatioColor(anomaly.count_ratio),
                            borderRadius: "20px",
                            fontWeight: 600,
                            fontSize: "0.875rem"
                          }}>
                            {anomaly.count_ratio?.toFixed(1)}x
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div style={{
              padding: "80px 40px",
              textAlign: "center",
              background: "#f8fafc",
              borderRadius: "8px",
              color: "#374151"
            }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 600, margin: "0 0 8px 0" }}>
                Data Consistency Verified
              </h3>
              <p style={{ fontSize: "1rem", margin: 0 }}>
                No district name anomalies detected for <strong>{selectedState}</strong>
              </p>
            </div>
          )}
        </div>
      </Section>

      {error && <ErrorCard error={error} />}
    </div>
  );
}

// ENTERPRISE DATASET CARD - FULL FUNCTIONALITY
function DatasetCardEnterprise({ dataset, isExpanded, onToggle, isHovered, onHover, onHoverLeave }) {
  const datasetTitle = dataset.dataset_name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div 
      style={{
        height: "100%",
        background: "white",
        borderRadius: "12px",
        border: `1px solid ${isHovered ? "#3b82f6" : "#e5e7eb"}`,
        boxShadow: isHovered 
          ? "0 8px 25px rgba(59, 130, 246, 0.15)" 
          : "0 1px 3px rgba(0,0,0,0.05)",
        transition: "all 0.2s ease-in-out",
        cursor: "pointer",
        overflow: "hidden"
      }}
      onClick={onToggle}
      onMouseEnter={onHover}
      onMouseLeave={onHoverLeave}
    >
      {/* HEADER */}
      <div style={{
        padding: "24px 24px 16px",
        borderBottom: "1px solid #f1f5f9",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start"
      }}>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: "1.125rem",
            fontWeight: 600,
            margin: "0 0 8px 0",
            color: "#111827",
            lineHeight: 1.3
          }}>
            {datasetTitle}
          </h3>
          <div style={{
            display: "flex",
            gap: "16px",
            fontSize: "0.8125rem",
            color: "#6b7280",
            fontWeight: 400
          }}>
            <span>{dataset.rows_processed?.toLocaleString()} rows processed</span>
            <span>{dataset.corrections_count?.toLocaleString()} normalized</span>
          </div>
        </div>
        <div style={{
          padding: "6px",
          color: isHovered ? "#3b82f6" : "#9ca3af",
          transition: "all 0.15s",
          fontSize: "1rem",
          fontWeight: 200,
          lineHeight: 1
        }}>
          {isExpanded ? "−" : "+"}
        </div>
      </div>

      {/* METRICS */}
      <div style={{
        padding: "20px 24px 24px",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
        alignItems: "end"
      }}>
        <MetricBlockEnterprise
          value={dataset.rows_processed?.toLocaleString()}
          label="Total Rows"
          color="#3b82f6"
        />
        <MetricBlockEnterprise
          value={dataset.corrections_count?.toLocaleString()}
          label="Corrections"
          color="#10b981"
        />
        <MetricBlockEnterprise
          value={new Date(dataset.timestamp).toLocaleDateString("en-IN")}
          label="Processed"
          color="#64748b"
          smallValue
        />
      </div>

      {/* ✅ SAMPLE CORRECTIONS TABLE - FULLY VISIBLE */}
      {isExpanded && (
        <div style={{
          borderTop: "1px solid #f1f5f9",
          background: "#fafbfc"
        }}>
          <div style={{
            padding: "20px 24px",
            borderBottom: "1px solid #f1f5f9",
            color: "#374151",
            fontSize: "0.875rem",
            fontWeight: 500
          }}>
            Sample Corrections ({dataset.sample_corrections?.length || 0})
          </div>
          <div style={{ maxHeight: "280px", overflowY: "auto" }}>
            <table style={{ width: "100%", fontSize: "0.8125rem" }}>
              <thead style={{
                position: "sticky",
                top: 0,
                background: "white",
                zIndex: 5,
                borderBottom: "2px solid #e5e7eb"
              }}>
                <tr>
                  <th style={{ padding: "12px 16px 12px 24px", textAlign: "left", fontWeight: 600, color: "#374151" }}>
                    Type
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151" }}>
                    Original
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: "#374151" }}>
                    →
                  </th>
                  <th style={{ padding: "12px 16px 12px 24px", textAlign: "left", fontWeight: 600, color: "#374151" }}>
                    Standardized
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataset.sample_corrections?.slice(0, 8).map((c, i) => (
                  <tr key={i} style={{
                    background: i % 2 === 0 ? "#ffffff" : "#f8fafc"
                  }}>
                    <td style={{ padding: "12px 16px 12px 24px" }}>
                      <span style={{
                        padding: "4px 10px",
                        background: "#eff6ff",
                        color: "#1e40af",
                        borderRadius: "8px",
                        fontSize: "0.6875rem",
                        fontWeight: 600
                      }}>
                        {c.type?.toUpperCase()}
                      </span>
                    </td>
                    <td style={{
                      padding: "12px 16px",
                      color: "#dc2626",
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      fontWeight: 500,
                      fontSize: "0.8125rem"
                    }}>
                      {c.from}
                    </td>
                    <td style={{
                      padding: "12px 16px",
                      textAlign: "center",
                      color: "#10b981",
                      fontSize: "0.9375rem",
                      fontWeight: 700
                    }}>
                      →
                    </td>
                    <td style={{
                      padding: "12px 16px 12px 24px",
                      color: "#059669",
                      fontWeight: 600,
                      fontSize: "0.8125rem"
                    }}>
                      {c.to}
                    </td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan={4} style={{ padding: "24px", textAlign: "center", color: "#9ca3af" }}>
                      No sample corrections available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricBlockEnterprise({ value, label, color, smallValue = false }) {
  return (
    <div style={{
      textAlign: "center",
      padding: "12px 8px",
      background: "white",
      borderRadius: "8px",
      border: `1px solid ${color}20`,
      transition: "all 0.15s"
    }}>
      <div style={{
        fontSize: smallValue ? "0.9375rem" : "1.25rem",
        fontWeight: 600,
        color,
        marginBottom: "2px",
        lineHeight: 1.2
      }}>
        {value}
      </div>
      <div style={{
        fontSize: "0.6875rem",
        color: "#9ca3af",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.05em"
      }}>
        {label}
      </div>
    </div>
  );
}
