// src/pages/MapView.jsx - SVG INDIA MAP (NO API NEEDED!)
import React, { useState, useCallback } from "react";

export default function MapView({ stationsData, selectedDistrict, onDistrictSelect }) {
  const [activeDistrict, setActiveDistrict] = useState(null);

  // ✅ MATCH YOUR DATA DISTRICTS
  const districtStations = stationsData?.data?.reduce((acc, d) => {
    const name = d.district.replace(/ \*$/, '').trim();
    acc[name] = d.estimated_stations_needed || 0;
    return acc;
  }, {}) || {};

  const getColor = (districtName) => {
    const stations = districtStations[districtName] || 0;
    if (stations >= 15) return "#ef4444";
    if (stations >= 10) return "#f59e0b";
    if (stations >= 5) return "#10b981";
    if (stations > 0) return "#3b82f6";
    return "#e5e7eb";
  };

  const handleDistrictClick = (districtName) => {
    setActiveDistrict(districtName);
    onDistrictSelect?.(districtName);
  };

  return (
    <div className="page">
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ marginBottom: "4px" }}>Geographic Distribution</h2>
        <p style={{ color: "#475569", margin: 0 }}>
          District-wise Aadhaar station demand across {stationsData?.state || "India"}
        </p>
        <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "6px" }}>
          Click districts to view station requirements • Jan 2026 data
        </p>
      </div>

      {/* Interactive SVG Map */}
      <section className="card section">
        <div style={{ 
          display: 'flex', 
          gap: 20, 
          alignItems: 'center', 
          marginBottom: 16 
        }}>
          <h3 style={{ margin: 0, fontSize: 18 }}>Uttar Pradesh Station Demand</h3>
          <div style={{ fontSize: 14, color: '#64748b' }}>
            {Object.keys(districtStations).length} districts analyzed
          </div>
        </div>

        <div style={{ 
          position: 'relative', 
          height: '500px', 
          borderRadius: '12px', 
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          border: '2px solid #e2e8f0'
        }}>
          {/* SVG Uttar Pradesh Map */}
          <svg 
            viewBox="0 0 800 1000" 
            style={{ width: '100%', height: '100%', cursor: 'pointer' }}
            onMouseLeave={() => setActiveDistrict(null)}
          >
            {/* Uttar Pradesh Outline */}
            <path 
              d="M100,50 L200,30 L300,80 L350,120 L380,150 L400,140 L420,160 L450,170 L470,190 L500,180 L520,200 L550,220 L580,210 L600,230 L620,250 L650,270 L680,290 L700,310 L720,330 L740,350 L760,370 L780,390 L800,410 L790,430 L770,450 L750,470 L730,490 L710,510 L690,530 L670,550 L650,570 L630,590 L610,610 L590,630 L570,650 L550,670 L530,690 L510,710 L490,730 L470,750 L450,770 L430,790 L410,810 L390,830 L370,850 L350,870 L330,890 L310,910 L290,930 L270,950 L250,970 L230,990 L210,970 L190,950 L170,930 L150,910 L130,890 L110,870 L90,850 L70,830 L50,810 L30,790 L10,770 L5,750 L15,730 L35,710 L55,690 L75,670 L95,650 L115,630 L135,610 L155,590 L175,570 L195,550 L215,530 L235,510 L255,490 L275,470 L295,450 L315,430 L335,410 L355,390 L375,370 L395,350 L415,330 L435,310 L455,290 L475,270 L495,250 L515,230 L535,210 L555,190 L575,170 L595,150 L615,130 L635,110 L655,90 L675,70 L695,50 L715,30 Z" 
              fill="#f1f5f9" 
              stroke="#1e293b" 
              strokeWidth="2"
            />

            {/* Key Districts as Clickable Regions */}
            <g id="districts">
              {/* Lucknow */}
              <path 
                d="M380,180 Q400,160 420,170 440,185 430,205 420,220 400,210 380,200 Z" 
                fill={getColor("Lucknow")}
                stroke={activeDistrict === "Lucknow" ? "#000" : "#94a3b8"}
                strokeWidth={activeDistrict === "Lucknow" ? "3" : "1.5"}
                onClick={() => handleDistrictClick("Lucknow")}
              />
              
              {/* Ghaziabad */}
              <path 
                d="M480,120 Q500,100 520,110 540,130 530,150 510,140 490,130 Z" 
                fill={getColor("Ghaziabad")}
                stroke={activeDistrict === "Ghaziabad" ? "#000" : "#94a3b8"}
                strokeWidth={activeDistrict === "Ghaziabad" ? "3" : "1.5"}
                onClick={() => handleDistrictClick("Ghaziabad")}
              />

              {/* Kanpur Nagar */}
              <path 
                d="M350,250 Q370,230 390,240 410,260 400,280 380,270 360,260 Z" 
                fill={getColor("Kanpur Nagar")}
                stroke={activeDistrict === "Kanpur Nagar" ? "#000" : "#94a3b8"}
                strokeWidth={activeDistrict === "Kanpur Nagar" ? "3" : "1.5"}
                onClick={() => handleDistrictClick("Kanpur Nagar")}
              />

              {/* Varanasi */}
              <path 
                d="M580,380 Q600,360 620,370 640,390 630,410 610,400 590,390 Z" 
                fill={getColor("Varanasi")}
                stroke={activeDistrict === "Varanasi" ? "#000" : "#94a3b8"}
                strokeWidth={activeDistrict === "Varanasi" ? "3" : "1.5"}
                onClick={() => handleDistrictClick("Varanasi")}
              />

              {/* Agra */}
              <path 
                d="M450,300 Q470,280 490,290 510,310 500,330 480,320 460,310 Z" 
                fill={getColor("Agra")}
                stroke={activeDistrict === "Agra" ? "#000" : "#94a3b8"}
                strokeWidth={activeDistrict === "Agra" ? "3" : "1.5"}
                onClick={() => handleDistrictClick("Agra")}
              />

              {/* Meerut */}
              <path 
                d="M520,90 Q540,70 560,80 580,100 570,120 550,110 530,100 Z" 
                fill={getColor("Meerut")}
                stroke={activeDistrict === "Meerut" ? "#000" : "#94a3b8"}
                strokeWidth={activeDistrict === "Meerut" ? "3" : "1.5"}
                onClick={() => handleDistrictClick("Meerut")}
              />

              {/* Gorakhpur */}
              <path 
                d="M650,320 Q670,300 690,310 710,330 700,350 680,340 660,330 Z" 
                fill={getColor("Gorakhpur")}
                stroke={activeDistrict === "Gorakhpur" ? "#000" : "#94a3b8"}
                strokeWidth={activeDistrict === "Gorakhpur" ? "3" : "1.5"}
                onClick={() => handleDistrictClick("Gorakhpur")}
              />

              {/* Add more districts as needed */}
            </g>

            {/* District Labels */}
            <g fontSize="12" fontWeight="600" fill="#1e2937" textAnchor="middle">
              <text x="400" y="195" style={{ pointerEvents: 'none' }}>Lucknow</text>
              <text x="510" y="125" style={{ pointerEvents: 'none' }}>Ghaziabad</text>
              <text x="385" y="265" style={{ pointerEvents: 'none' }}>Kanpur</text>
              <text x="610" y="385" style={{ pointerEvents: 'none' }}>Varanasi</text>
              <text x="475" y="305" style={{ pointerEvents: 'none' }}>Agra</text>
              <text x="550" y="105" style={{ pointerEvents: 'none' }}>Meerut</text>
              <text x="685" y="335" style={{ pointerEvents: 'none' }}>Gorakhpur</text>
            </g>
          </svg>

          {/* Active District Info */}
          {activeDistrict && (
            <div style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'white',
              padding: '12px 16px',
              borderRadius: 8,
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              border: `2px solid ${getColor(activeDistrict)}`,
              minWidth: 200
            }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 15, color: '#1e2937' }}>
                {activeDistrict}
              </h4>
              <div style={{ fontSize: 14, color: '#059669', fontWeight: 600 }}>
                {districtStations[activeDistrict] || 0} stations needed
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div style={{
          marginTop: 20,
          padding: 16,
          background: '#f8fafc',
          borderRadius: 8,
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: 14 }}>Station Requirements</h4>
          <div style={{ display: 'flex', gap: 16, fontSize: 13, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 20, height: 20, background: '#ef4444', borderRadius: 4 }}></div>
              <span>15+ stations (High)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 20, height: 20, background: '#f59e0b', borderRadius: 4 }}></div>
              <span>10-14 stations (Med)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 20, height: 20, background: '#10b981', borderRadius: 4 }}></div>
              <span>5-9 stations</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 20, height: 20, background: '#3b82f6', borderRadius: 4 }}></div>
              <span>1-4 stations</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
