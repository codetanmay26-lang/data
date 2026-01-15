// src/pages/StateDashboard.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Section, LoadingCard, ErrorCard, KPIGrid, AgeTable } from "../components/DashboardComponents";

const API = "http://127.0.0.1:8000";

export default function StateDashboard() {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [stateSearch, setStateSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
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

  const handleSelectStateByName = useCallback((name) => {
    setStateSearch(name);
    const found = states.find((s) => s.state?.trim() === name);
    setSelectedState(found || null);
    setIsDropdownOpen(false);
  }, [states]);

  if (loading) return <LoadingCard />;

  return (
    <>
      <Section title="Select State">
        <div 
          ref={dropdownRef}
          style={{ 
            position: "relative", 
            maxWidth: 400,
            width: "100%",
            boxSizing: "border-box"
          }}
        >
          <input
            type="text"
            value={stateSearch}
            onChange={(e) => {
              setStateSearch(e.target.value);
              setSelectedState(null);
              setIsDropdownOpen(e.target.value.length > 0);
            }}
            onFocus={() => stateSearch && setIsDropdownOpen(true)}
            placeholder="Type to search state (e.g., Uttar Pradesh)…"
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
          {isDropdownOpen && filteredStateOptions.length > 0 && (
            <div
              style={{
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
                zIndex: 1000,
                boxShadow: "0 10px 20px rgba(0,0,0,0.15)"
              }}
            >
              {filteredStateOptions.map((name) => (
                <div
                  key={name}
                  onClick={() => handleSelectStateByName(name)}
                  style={{
                    padding: "12px 16px",
                    fontSize: 15,
                    cursor: "pointer",
                    background: selectedState?.state?.trim() === name ? "#f3f4f6" : "#fff",
                    borderBottom: "1px solid #f9fafb",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    transition: "background 0.2s"
                  }}
                >
                  {name}
                </div>
              ))}
            </div>
          )}
          {isDropdownOpen && stateSearch && filteredStateOptions.length === 0 && (
            <div
              style={{
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
                zIndex: 1000
              }}
            >
              No matching states found
            </div>
          )}
        </div>
      </Section>

      {selectedState ? (
        <>
          <Section title={`${selectedState.state} Summary`}>
            <KPIGrid
              items={[
                ["Service Load", Math.round(computeStateServiceLoad(selectedState))],
                ["Total Enrolments", (selectedState.age_0_5 || 0) + (selectedState.age_5_17 || 0) + (selectedState.age_18_greater || 0)],
                ["Biometric Updates", (selectedState.bio_age_5_17 || 0) + (selectedState.bio_age_17_ || 0)],
                ["Demographic Updates", (selectedState.demo_age_5_17 || 0) + (selectedState.demo_age_17_ || 0)],
              ]}
            />
          </Section>

          <Section title="Age-wise Breakdown">
            <AgeTable state={selectedState} />
          </Section>
        </>
      ) : (
        !loading && <Section title="State View">
          <p style={{ color: "#6b7280", fontSize: 15 }}>Select a state from the dropdown above to explore detailed Aadhaar activity metrics.</p>
        </Section>
      )}
    </>
  );
}
