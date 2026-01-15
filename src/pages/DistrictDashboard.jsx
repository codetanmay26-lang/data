// src/pages/DistrictDashboard.jsx - FIXED for state parameter
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Section, LoadingCard, ErrorCard, KPIGrid, AgeTable } from "../components/DashboardComponents";

const API = "http://127.0.0.1:8000";

export default function DistrictDashboard() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [stateSearch, setStateSearch] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const stateDropdownRef = useRef(null);
  const districtDropdownRef = useRef(null);

  // Load states first (same as StateDashboard)
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
        // ✅ Uses state parameter: /aggregate/district?state={state_name}
        const stateName = encodeURIComponent(selectedState.state);
        const res = await fetch(`${API}/aggregate/district?state=${stateName}`);
        if (!res.ok) throw new Error("Failed to fetch districts");
        const data = await res.json();
        setDistricts(Array.isArray(data) ? data : []);
        setSelectedDistrict(null); // Reset district selection
        setDistrictSearch("");
      } catch (e) {
        setError(`Failed to load districts for ${selectedState.state}`);
        setDistricts([]);
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

  const filteredStateOptions = stateOptions.filter((name) =>
    name.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const districtOptions = Array.isArray(districts)
    ? districts
        .filter((d) => d && d.district && typeof d.district === "string") // ✅ Assuming district field
        .map((d) => d.district.trim())
        .filter((name, idx, arr) => name && arr.indexOf(name) === idx)
        .sort((a, b) => a.localeCompare(b))
    : [];

  const filteredDistrictOptions = districtOptions.filter((name) =>
    name.toLowerCase().includes(districtSearch.toLowerCase())
  );

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
    setStateSearch(name);
    const found = states.find((s) => s.state?.trim() === name);
    setSelectedState(found || null);
    setStateDropdownOpen(false);
  }, [states]);

  const handleSelectDistrict = useCallback((name) => {
    setDistrictSearch(name);
    const found = districts.find((d) => d.district?.trim() === name);
    setSelectedDistrict(found || null);
    setDistrictDropdownOpen(false);
  }, [districts]);

  if (loading) return <LoadingCard />;

  return (
    <>
      {/* Step 1: Select State */}
      <Section title="Select State First">
        <div ref={stateDropdownRef} style={{ position: "relative", maxWidth: 400, width: "100%" }}>
          <input
            type="text"
            value={stateSearch}
            onChange={(e) => {
              setStateSearch(e.target.value);
              setSelectedState(null);
              setStateDropdownOpen(e.target.value.length > 0);
            }}
            onFocus={() => stateSearch && setStateDropdownOpen(true)}
            placeholder="Search state (e.g., Uttar Pradesh)…"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              fontSize: 15,
              boxSizing: "border-box",
              background: "#fff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          />
          {stateDropdownOpen && filteredStateOptions.length > 0 && (
            <div style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "#fff",
              border: "1px solid #d1d5db",
              borderTop: "none",
              borderRadius: "0 0 8px 8px",
              maxHeight: 200,
              overflowY: "auto",
              zIndex: 1000,
              boxShadow: "0 10px 20px rgba(0,0,0,0.15)"
            }}>
              {filteredStateOptions.map((name) => (
                <div
                  key={name}
                  onClick={() => handleSelectState(name)}
                  style={{
                    padding: "12px 16px",
                    fontSize: 15,
                    cursor: "pointer",
                    background: selectedState?.state?.trim() === name ? "#f3f4f6" : "#fff",
                    borderBottom: "1px solid #f9fafb",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  {name}
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Step 2: Select District (only if state selected) */}
      {selectedState && (
        <Section title={`Select District in ${selectedState.state}`}>
          <div ref={districtDropdownRef} style={{ position: "relative", maxWidth: 400, width: "100%" }}>
            <input
              type="text"
              value={districtSearch}
              onChange={(e) => {
                setDistrictSearch(e.target.value);
                setSelectedDistrict(null);
                setDistrictDropdownOpen(e.target.value.length > 0);
              }}
              onFocus={() => districtSearch && setDistrictDropdownOpen(true)}
              placeholder="Search district in this state…"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 8,
                borderColor: selectedState ? "#10b981" : "#d1d5db",
                fontSize: 15,
                boxSizing: "border-box",
                background: "#fff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
              }}
            />
            {districtDropdownOpen && filteredDistrictOptions.length > 0 && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "#fff",
                border: "1px solid #d1d5db",
                borderTop: "none",
                borderRadius: "0 0 8px 8px",
                maxHeight: 240,
                overflowY: "auto",
                zIndex: 1001,
                boxShadow: "0 10px 20px rgba(0,0,0,0.15)"
              }}>
                {filteredDistrictOptions.map((name) => (
                  <div
                    key={name}
                    onClick={() => handleSelectDistrict(name)}
                    style={{
                      padding: "12px 16px",
                      fontSize: 15,
                      cursor: "pointer",
                      background: selectedDistrict?.district?.trim() === name ? "#f3f4f6" : "#fff",
                      borderBottom: "1px solid #f9fafb",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  >
                    {name}
                  </div>
                ))}
              </div>
            )}
            {districtDropdownOpen && districtSearch && filteredDistrictOptions.length === 0 && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "#fff",
                border: "1px solid #d1d5db",
                borderTop: "none",
                borderRadius: "0 0 8px 8px",
                padding: "12px 16px",
                fontSize: 14,
                color: "#6b7280",
                zIndex: 1001
              }}>
                No districts found
              </div>
            )}
          </div>
        </Section>
      )}

      {/* District Details */}
      {selectedDistrict ? (
        <>
          <Section title={`${selectedDistrict.district} District Summary (${selectedState.state})`}>
            <KPIGrid
              items={[
                ["Service Load", Math.round(computeServiceLoad(selectedDistrict))],
                ["Total Enrolments", (selectedDistrict.age_0_5 || 0) + (selectedDistrict.age_5_17 || 0) + (selectedDistrict.age_18_greater || 0)],
                ["Biometric Updates", (selectedDistrict.bio_age_5_17 || 0) + (selectedDistrict.bio_age_17_ || 0)],
                ["Demographic Updates", (selectedDistrict.demo_age_5_17 || 0) + (selectedDistrict.demo_age_17_ || 0)]
              ]}
            />
          </Section>
          <Section title="Age-wise Breakdown">
            <AgeTable state={selectedDistrict} />
          </Section>
        </>
      ) : (
        selectedState && !loading && (
          <Section title={`Districts in ${selectedState.state}`}>
            <p style={{ color: "#6b7280", fontSize: 15 }}>
              {districts.length} districts loaded. Search above to select one.
            </p>
          </Section>
        )
      )}
    </>
  );
}
