// src/pages/NationalDashboard.jsx - FIXED MAP RENDERING v6.2 (STABLE)
import React, { useEffect, useRef, useState, useCallback } from "react";
import { LoadingCard } from "../components/DashboardComponents";
import { useNavigate } from "react-router-dom";

const API = "http://127.0.0.1:8000";

const SPACING_6 = '24px';
const SPACING_8 = '32px';
const SPACING_12 = '48px';
const RADIUS_LG = '16px';
const RADIUS_MD = '12px';

export default function NationalDashboard() {
  const [nationalData, setNationalData] = useState(null);
  const [stateData, setStateData] = useState([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const mapReadyRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadNationalData() {
      try {
        setLoading(true);
        const nationalRes = await fetch(`${API}/aggregate/national`);
        const national = await nationalRes.json();
        const stateRes = await fetch(`${API}/aggregate/state`);
        const states = await stateRes.json();
        setNationalData(national);
        setStateData(Array.isArray(states) ? states : []);
      } catch (e) {
        console.error("Failed to load data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadNationalData();
  }, []);

  const computeRawServiceLoad = useCallback((state) => {
    if (!state) return 0;
    return (
      1.2 * (state.age_0_5 || 0) +
      1.1 * (state.age_5_17 || 0) +
      1.0 * (state.age_18_greater || 0) +
      0.8 * (state.bio_age_5_17 || 0) +
      1.0 * (state.bio_age_17_ || 0) +
      0.6 * (state.demo_age_5_17 || 0) +
      0.7 * (state.demo_age_17_ || 0)
    );
  }, []);

  const stateLoads = stateData.map(computeRawServiceLoad);
  const maxLoad = Math.max(...stateLoads, 1);
  
  const getChoroplethIntensity = useCallback((rawLoad) => {
    const logValue = Math.log10(Math.max(rawLoad, 1));
    const normalized = (logValue - Math.log10(1)) / (Math.log10(maxLoad) - Math.log10(1));
    return Math.max(0.2, Math.min(1.0, normalized));
  }, [maxLoad]);

  const getStateColor = useCallback((intensity) => {
    const r = Math.round(230 + (intensity * (29 - 230)));
    const g = Math.round(245 + (intensity * (78 - 245)));
    const b = Math.round(255 + (intensity * (216 - 255)));
    return `rgb(${r}, ${g}, ${b})`;
  }, []);

  // ✅ FIXED MAP INITIALIZATION (PROPER TIMING + SIZE)
  useEffect(() => {
    if (loading || !mapRef.current || mapInstanceRef.current || stateData.length === 0) return;

    let timeoutId;

    const initMap = async () => {
      try {
        // ✅ CRITICAL: Wait for container to have proper dimensions
        if (mapRef.current && mapRef.current.clientHeight === 0) {
          timeoutId = setTimeout(initMap, 100);
          return;
        }

        const L = (await import("leaflet")).default;
        
        // ✅ Map container with EXPLICIT dimensions
        const map = L.map(mapRef.current, {
          center: [23, 78],
          zoom: 5,
          minZoom: 4,
          maxZoom: 10,
          zoomControl: true,
          attributionControl: false,
          preferCanvas: true
        });

        // ✅ Clean basemap
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          {
            attribution: '© OpenStreetMap © CARTO',
            subdomains: 'abcd',
            maxZoom: 19
          }
        ).addTo(map);

        mapInstanceRef.current = map;

        // ✅ Add state markers with REAL India coordinates
        const stateCenters = [
          [26.85, 80.95],  // UP
          [19.07, 72.88],  // MH
          [25.59, 85.13],  // Bihar
          [22.57, 88.36],  // WB
          [15.91, 79.74],  // AP
          [11.12, 78.65],  // TN
          [23.02, 72.57],  // Gujarat
          [12.97, 77.59],  // Karnataka
          [22.27, 78.47],  // MP
          [27.02, 74.21],  // Rajasthan
          [28.70, 77.10],  // Delhi
          [31.10, 77.17],  // HP
          [20.95, 85.09],  // Odisha
          [34.08, 77.57]   // J&K
        ];

        stateData.slice(0, 14).forEach((state, idx) => {
          const rawLoad = computeRawServiceLoad(state);
          const intensity = getChoroplethIntensity(rawLoad);
          
          const [lat, lng] = stateCenters[idx] || [23 + idx * 0.5, 78 + idx * 0.3];
          
          const circle = L.circleMarker([lat, lng], {
            radius: 18 + intensity * 22,
            fillColor: getStateColor(intensity),
            color: '#ffffff',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.85
          }).addTo(map);

          circle.bindPopup(`
            <div style="min-width: 240px; font-family: system-ui, sans-serif; padding: 16px">
              <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: #1e293b">${state.state}</h3>
              <div style="font-size: 32px; font-weight: 800; color: #2563eb; margin-bottom: 12px">
                ${Math.round(rawLoad).toLocaleString()}
              </div>
              <div style="font-size: 14px; color: #64748b; background: #f1f5f9; padding: 8px 12px; border-radius: 8px; font-weight: 500">
                Raw service demand • Log-normalized visualization
              </div>
            </div>
          `);

          circle.on({
            mouseover: (e) => {
              const layer = e.target;
              layer.setStyle({ fillOpacity: 1, weight: 5 });
              layer.bringToFront();
            },
            mouseout: (e) => {
              const layer = e.target;
              layer.setStyle({ fillOpacity: 0.85, weight: 3 });
            },
            click: () => {
              navigate(`/state/${encodeURIComponent(state.state)}`);
            }
          });
        });

        // ✅ CRITICAL: Fix size + bounds AFTER render
        requestAnimationFrame(() => {
          setTimeout(() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.invalidateSize();
              mapInstanceRef.current.fitBounds([
                [6.46, 68.10],   // SW India
                [37.62, 97.50]   // NE India
              ], { padding: [20, 20] });
              mapReadyRef.current = true;
            }
          }, 350); // ✅ 350ms delay for full layout
        });

      } catch (error) {
        console.error("Map init failed:", error);
      }
    };

    initMap();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        mapReadyRef.current = false;
      }
    };
  }, [stateData, loading, navigate, computeRawServiceLoad, getChoroplethIntensity, getStateColor]);

  // ✅ Resize handler
  useEffect(() => {
    let resizeTimeout;
    const handleResize = () => {
      if (mapInstanceRef.current && mapReadyRef.current) {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          mapInstanceRef.current.invalidateSize();
        }, 250);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, []);

  if (loading) return <LoadingCard />;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f8fcff 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '32px 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        {/* HEADER */}
        <section style={{
          background: '#ffffff',
          borderRadius: RADIUS_LG,
          border: '1px solid #e2e8f0',
          padding: SPACING_12,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
          marginBottom: SPACING_12,
          borderTop: '4px solid #1d4ed8'
        }}>
          <h1 style={{
            fontSize: '28px', fontWeight: 700, color: '#1e293b',
            margin: '0 0 12px 0', lineHeight: 1.2
          }}>
            National Demand Overview
          </h1>
          <p style={{
            fontSize: '18px', color: '#64748b', lineHeight: 1.7,
            margin: '0 0 24px 0', maxWidth: '600px'
          }}>
            Interactive India map showing Aadhaar service demand by state
          </p>
          <p style={{
            fontSize: '15px', color: '#475569',
            lineHeight: 1.6, margin: 0
          }}>
            Click state markers for district analysis. {stateData.length} states loaded.
          </p>
        </section>

        {/* MAP CONTAINER - NO OVERFLOW ISSUES */}
        <section style={{ marginBottom: SPACING_12 }}>
          <div style={{
            background: '#ffffff',
            borderRadius: RADIUS_LG,
            border: '1px solid #e2e8f0',
            padding: SPACING_12,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
            borderTop: '4px solid #2563eb'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: SPACING_8 
            }}>
              <div>
                <h2 style={{
                  fontSize: '20px', fontWeight: 600, color: '#1e293b',
                  margin: '0 0 8px 0'
                }}>
                  Service Demand Heatmap
                </h2>
                <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>
                  Log-normalized state demand (hover markers for details)
                </p>
              </div>
              <div style={{ fontSize: '14px', color: '#475569' }}>
                Real-time • {stateData.length} states
              </div>
            </div>

            {/* ✅ PERFECT MAP CONTAINER */}
            <div 
              ref={mapRef}
              style={{
                position: 'relative',
                width: '100%',
                height: '600px',  // ✅ EXPLICIT HEIGHT
                borderRadius: RADIUS_MD,
                border: '2px solid #e2e8f0',
                overflow: 'visible',  // ✅ NO CROPPING
                background: '#eff6ff',
                marginBottom: SPACING_8
              }}
            />

            {/* LEGEND */}
            <div style={{
              display: 'flex',
              gap: '24px',
              justifyContent: 'center',
              padding: '16px',
              background: '#f1f5f9',
              borderRadius: RADIUS_MD,
              border: '1px solid #e2e8f0'
            }}>
              {[0.25, 0.5, 0.75, 1.0].map((intensity, idx) => (
                <div key={idx} style={{ textAlign: 'center', minWidth: '80px' }}>
                  <div style={{
                    width: '32px',
                    height: '24px',
                    background: getStateColor(intensity),
                    borderRadius: '6px',
                    border: '1px solid rgba(0,0,0,0.1)',
                    margin: '0 auto 8px'
                  }} />
                  <span style={{ fontSize: '13px', color: '#475569' }}>
                    {['Low', 'Medium', 'High', 'Highest'][idx]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{
          background: '#f1f5f9',
          borderRadius: RADIUS_LG,
          border: '1px solid #e2e8f0',
          padding: SPACING_12,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.08)',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 600, 
            color: '#1e293b', 
            margin: '0 0 16px 0' 
          }}>
            Ready to Explore?
          </h3>
          <p style={{ 
            fontSize: '16px', 
            color: '#475569', 
            lineHeight: 1.7, 
            maxWidth: '600px', 
            margin: '0 auto' 
          }}>
            Click any state marker above to dive into district-level Aadhaar service metrics.
          </p>
        </section>
      </div>
    </div>
  );
}
