// src/pages/DemandAnalysis.jsx - STATE → DISTRICT DROPDOWN SELECTION
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Section, LoadingCard, ErrorCard, KPIGrid } from "../components/DashboardComponents";

const API = "http://127.0.0.1:8000";

export default function DemandAnalysis() {
  const [states, setStates] = useState([]);
  const [stationsData, setStationsData] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [stateSearch, setStateSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  
  const stateDropdownRef = useRef(null);
  const districtDropdownRef = useRef(null);

  // Load states on mount
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

  // Load stations when state selected
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

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(event) {
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target)) {
        setIsStateDropdownOpen(false);
      }
      if (districtDropdownRef.current && !districtDropdownRef.current.contains(event.target)) {
        setIsDistrictDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ GET SELECTED DISTRICT DATA
  const getSelectedDistrictData = () => {
    if (!selectedDistrict || !stationsData?.data) return null;
    return stationsData.data.find(d => 
      d.district.replace(/ \*$/, '').trim() === selectedDistrict.trim()
    );
  };

  // ✅ ALL DISTRICT OPTIONS
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

  const filteredStateOptions = stateOptions.filter((name) =>
    name.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const districtData = getSelectedDistrictData();
  const sortedDistricts = (stationsData?.data || []).sort((a, b) => 
    (b.estimated_stations_needed || 0) - (a.estimated_stations_needed || 0)
  );

  const handleSelectState = useCallback((name) => {
    setStateSearch(name);
    const found = states.find((s) => s.state?.trim() === name);
    setSelectedState(found || null);
    setSelectedDistrict(null); // Reset district
    setIsStateDropdownOpen(false);
  }, [states]);

  const handleSelectDistrict = useCallback((name) => {
    setSelectedDistrict(name);
    setIsDistrictDropdownOpen(false);
  }, []);

  if (loading) return <LoadingCard />;

  return (
    <>
      {/* ✅ STATE + DISTRICT SELECTION */}
      <Section title="Aadhaar Station Demand Analysis">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 800, width: "100%" }}>
          
          {/* STATE DROPDOWN */}
          <div ref={stateDropdownRef} style={{ position: "relative" }}>
            <input
              type="text"
              value={stateSearch}
              onChange={(e) => {
                setStateSearch(e.target.value);
                setSelectedState(null);
                setSelectedDistrict(null);
                setStationsData(null);
                setError(null);
                setIsStateDropdownOpen(e.target.value.length > 0);
              }}
              onFocus={() => stateSearch && setIsStateDropdownOpen(true)}
              placeholder="Select state (e.g., Uttar Pradesh)…"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 8,
                border: selectedState ? "2px solid #10b981" : "2px solid #3b82f6",
                fontSize: 15,
                boxSizing: "border-box",
                background: "#fff",
                boxShadow: "0 4px 12px rgba(59,130,246,0.15)"
              }}
            />
            {isStateDropdownOpen && filteredStateOptions.length > 0 && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "#fff",
                border: "2px solid #3b82f6",
                borderTop: "none",
                borderRadius: "0 0 8px 8px",
                maxHeight: 240,
                overflowY: "auto",
                zIndex: 1000,
                boxShadow: "0 20px 40px rgba(59,130,246,0.2)"
              }}>
                {filteredStateOptions.map((name) => (
                  <div
                    key={name}
                    onClick={() => handleSelectState(name)}
                    style={{
                      padding: "12px 16px",
                      fontSize: 15,
                      cursor: "pointer",
                      background: selectedState?.state?.trim() === name ? "#dbeafe" : "#fff",
                      borderBottom: "1px solid #f3f4f6",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      transition: "all 0.2s"
                    }}
                  >
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ✅ DISTRICT DROPDOWN - ONLY AFTER STATE */}
          {selectedState && stationsData && (
            <div ref={districtDropdownRef} style={{ position: "relative" }}>
              <input
                type="text"
                value={selectedDistrict || ""}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                onFocus={() => setIsDistrictDropdownOpen(true)}
                placeholder="Select district (e.g., Lucknow)…"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 8,
                  border: selectedDistrict ? "2px solid #059669" : "2px solid #6b7280",
                  fontSize: 15,
                  boxSizing: "border-box",
                  background: "#fff",
                  boxShadow: selectedDistrict ? "0 4px 12px rgba(5,150,105,0.15)" : "0 4px 12px rgba(107,114,128,0.15)"
                }}
              />
              {isDistrictDropdownOpen && districtOptions.length > 0 && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  border: "2px solid #059669",
                  borderTop: "none",
                  borderRadius: "0 0 8px 8px",
                  maxHeight: 240,
                  overflowY: "auto",
                  zIndex: 1000,
                  boxShadow: "0 20px 40px rgba(5,150,105,0.2)"
                }}>
                  {districtOptions.map((name) => (
                    <div
                      key={name}
                      onClick={() => handleSelectDistrict(name)}
                      style={{
                        padding: "12px 16px",
                        fontSize: 15,
                        cursor: "pointer",
                        background: selectedDistrict === name ? "#d1fae5" : "#fff",
                        borderBottom: "1px solid #f3f4f6",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        transition: "all 0.2s"
                      }}
                    >
                      {name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Section>

      {error && <ErrorCard error={error} />}

      {/* ✅ SELECTED DISTRICT RESULTS */}
      {selectedState && selectedDistrict && districtData && (
        <Section title={`Station Requirements: ${selectedDistrict}`}>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
            gap: 20, 
            marginBottom: 24 
          }}>
            <div style={{
              padding: "24px",
              background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
              color: "white",
              borderRadius: "12px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>
                {districtData.estimated_stations_needed || 0}
              </div>
              <div style={{ fontSize: 14, opacity: 0.9 }}>Stations Needed</div>
            </div>
            <div style={{
              padding: "24px",
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              color: "white",
              borderRadius: "12px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
                {Math.round(districtData.service_load_annualised || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: 14, opacity: 0.9 }}>Annual Load</div>
            </div>
            <div style={{
              padding: "24px",
              background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
              color: "white",
              borderRadius: "12px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                {districtData.time_window_days} days
              </div>
              <div style={{ fontSize: 14, opacity: 0.9 }}>Time Window</div>
            </div>
          </div>

          <div style={{
            background: "#f0fdf4",
            padding: "20px",
            borderRadius: "8px",
            borderLeft: "4px solid #10b981"
          }}>
            <h4 style={{ margin: "0 0 12px 0", color: "#065f46", fontSize: 16 }}>
              📊 Calculation Details
            </h4>
            <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
              Annualized from {districtData.time_window_days} days data × {districtData.annualisation_factor?.toFixed(2)}x factor<br/>
              1 station = 25,000 weighted service units/year (age-based weights applied)
            </div>
          </div>
        </Section>
      )}

      {/* ✅ STATE-LEVEL OVERVIEW (when district not selected) */}
      {selectedState && stationsData && !selectedDistrict && (
        <>
          <Section title={`Station Requirements - ${selectedState.state}`}>
            <KPIGrid
              items={[
                ["Total Districts", stationsData.data?.length || 0],
                ["Total Stations Needed", sortedDistricts.reduce((sum, d) => sum + (d.estimated_stations_needed || 0), 0)],
                ["Total Annual Load", Math.round(sortedDistricts.reduce((sum, d) => sum + (d.service_load_annualised || 0), 0)).toLocaleString()],
                ["Avg Stations/District", Math.round((sortedDistricts.reduce((sum, d) => sum + (d.estimated_stations_needed || 0), 0) / (stationsData.data?.length || 1)))],
                ["Highest Demand", Math.max(...sortedDistricts.map(d => d.estimated_stations_needed || 0))]
              ]}
            />
          </Section>

          <Section title="Top 10 Districts">
            <div style={{ width: "100%", overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: 600, borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)", color: "white" }}>
                    <th style={{ padding: "16px 20px", textAlign: "left" }}>District</th>
                    <th style={{ padding: "16px 20px", textAlign: "right" }}>Stations</th>
                    <th style={{ padding: "16px 20px", textAlign: "right" }}>Load</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDistricts.slice(0, 10).map((district, idx) => (
                    <tr key={idx} style={{ background: idx % 2 === 0 ? "#fff" : "#f9fafb" }}>
                      <td style={{ padding: "16px 20px", fontWeight: 600 }}>
                        {district.district.replace(/ \*$/, '')}
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "right", color: "#059669", fontWeight: 700 }}>
                        {district.estimated_stations_needed}
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "right", color: "#3b82f6" }}>
                        {Math.round(district.service_load_annualised).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </>
      )}

      {/* Empty states */}
      {!selectedState && !loading && (
        <Section title="Station Demand Analysis">
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <h3 style={{ color: "#1f2937", marginBottom: 16 }}>📈 AadhaarPulse Station Optimizer</h3>
            <p style={{ color: "#6b7280", fontSize: 16, maxWidth: "500px", margin: "0 auto" }}>
              Select state → district to see detailed station requirements.
            </p>
          </div>
        </Section>
      )}
    </>
  );
}
