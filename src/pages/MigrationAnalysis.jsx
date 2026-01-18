// src/pages/MigrationAnalysis.jsx - Complete Migration Analysis Dashboard
import React, { useState, useEffect } from 'react';

const API = "http://127.0.0.1:8000";

const designTokens = {
  spacing: { sm: '12px', md: '16px', lg: '24px', xl: '32px' },
  radius: { sm: '8px', md: '12px', lg: '16px' },
  colors: {
    slate50: '#f8fafc',
    slate100: '#f1f5f9',
    slate200: '#e2e8f0',
    slate500: '#64748b',
    slate600: '#475569',
    slate700: '#334155',
    slate800: '#1e293b',
    slate900: '#0f172a',
    blue500: '#3b82f6',
    blue600: '#2563eb',
    green500: '#10b981',
    orange500: '#f59e0b',
    red500: '#ef4444'
  }
};

const TAB_BUTTONS = [
  { id: 'state', label: 'State Index' },
  { id: 'district', label: 'District Index' },
  { id: 'pincode', label: 'Pincode Index' },
  { id: 'trends', label: 'Trends' },
  { id: 'forecast', label: 'Forecast' },
  { id: 'compare', label: 'Compare' }
];

const Container = ({ children }) => (
  <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
    {children}
  </div>
);

const Card = ({ children, style = {} }) => (
  <div style={{
    background: '#ffffff',
    borderRadius: designTokens.radius.lg,
    border: `1px solid ${designTokens.colors.slate200}`,
    padding: designTokens.spacing.lg,
    boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
    marginBottom: designTokens.spacing.lg,
    ...style
  }}>
    {children}
  </div>
);

const Button = ({ children, onClick, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: `${designTokens.spacing.sm} ${designTokens.spacing.lg}`,
      background: disabled ? designTokens.colors.slate300 : designTokens.colors.blue500,
      color: '#fff',
      border: 'none',
      borderRadius: designTokens.radius.md,
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'background 0.2s'
    }}
    onMouseEnter={(e) => !disabled && (e.target.style.background = designTokens.colors.blue600)}
    onMouseLeave={(e) => !disabled && (e.target.style.background = designTokens.colors.blue500)}
  >
    {children}
  </button>
);

const Input = ({ label, value, onChange, placeholder, style = {} }) => (
  <div style={{ marginBottom: designTokens.spacing.md }}>
    {label && <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '13px', color: designTokens.colors.slate700 }}>{label}</label>}
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '10px 12px',
        border: `1px solid ${designTokens.colors.slate200}`,
        borderRadius: designTokens.radius.sm,
        fontSize: '14px',
        boxSizing: 'border-box',
        ...style
      }}
    />
  </div>
);

const Select = ({ label, value, onChange, options, style = {} }) => (
  <div style={{ marginBottom: designTokens.spacing.md }}>
    {label && <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '13px', color: designTokens.colors.slate700 }}>{label}</label>}
    <select
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        padding: '10px 12px',
        border: `1px solid ${designTokens.colors.slate200}`,
        borderRadius: designTokens.radius.sm,
        fontSize: '14px',
        boxSizing: 'border-box',
        ...style
      }}
    >
      <option value="">Select {label || 'Option'}</option>
      {options && options.length > 0 && options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const LoadingSpinner = () => (
  <div style={{ textAlign: 'center', padding: designTokens.spacing.lg }}>
    <div style={{ fontSize: '18px', color: designTokens.colors.slate600 }}>Loading...</div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div style={{
    background: '#fee2e2',
    color: '#991b1b',
    padding: designTokens.spacing.md,
    borderRadius: designTokens.radius.md,
    marginBottom: designTokens.spacing.lg,
    border: `1px solid #fca5a5`,
    fontSize: '14px'
  }}>
    {message}
  </div>
);

const DataGrid = ({ data }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: designTokens.spacing.md, marginTop: designTokens.spacing.lg }}>
    {data.map((item, i) => (
      <div key={i} style={{
        background: designTokens.colors.slate50,
        padding: designTokens.spacing.md,
        borderRadius: designTokens.radius.md,
        border: `1px solid ${designTokens.colors.slate200}`
      }}>
        <div style={{ fontSize: '12px', color: designTokens.colors.slate600, fontWeight: '600', marginBottom: '6px' }}>{item.label}</div>
        <div style={{ fontSize: '24px', fontWeight: '700', color: designTokens.colors.blue600 }}>{item.value}</div>
      </div>
    ))}
  </div>
);

// STATE INDEX TAB
function StateIndexTab({ states }) {
  const [state, setState] = useState('');
  const [year, setYear] = useState('2025');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!state) { setError('Please select a state'); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/migration/state/${state}?year=${year}`);
      if (!res.ok) throw new Error('Failed to fetch');
      setData(await res.json());
    } catch (e) {
      setError('Failed to load state data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 style={{ marginTop: 0, color: designTokens.colors.slate800, fontSize: '20px' }}>State Migration Index</h2>
      {error && <ErrorMessage message={error} />}
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: designTokens.spacing.md, marginBottom: designTokens.spacing.lg }}>
        <Select label="State" value={state} onChange={(e) => setState(e.target.value)} options={states} />
        <Input label="Year" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2025" />
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button onClick={handleSubmit}>Analyze</Button>
        </div>
      </div>
      
      {loading && <LoadingSpinner />}
      {data && !loading && (
        <>
          <DataGrid data={[
            { label: 'Child Enrolments', value: (data.total_child_enrolments || 0).toLocaleString() },
            { label: 'Adult Updates', value: (data.total_adult_updates || 0).toLocaleString() },
            { label: 'Migration Index', value: (data.average_migration_index || 0).toFixed(2) }
          ]} />
          {data.top_districts && data.top_districts.length > 0 && (
            <div style={{ marginTop: designTokens.spacing.lg }}>
              <h3 style={{ color: designTokens.colors.slate800, fontSize: '16px', marginBottom: designTokens.spacing.md }}>Top Districts</h3>
              {data.top_districts.slice(0, 5).map((d, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: designTokens.colors.slate50, borderRadius: designTokens.radius.sm, marginBottom: '4px', fontSize: '14px' }}>
                  <span>{i+1}. {d.district}</span>
                  <span style={{ fontWeight: '600', color: designTokens.colors.blue600 }}>{d.migration_index?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Card>
  );
}

// DISTRICT INDEX TAB
function DistrictIndexTab({ states }) {
  const [state, setState] = useState('');
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState('');
  const [year, setYear] = useState('2025');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!state) {
      setDistricts([]);
      setDistrict('');
      return;
    }
    const fetchDistricts = async () => {
      try {
        const res = await fetch(`${API}/migration/districts/${state}`);
        if (res.ok) {
          const data = await res.json();
          // Filter to clean district names only
          const districtSet = new Set();
          (data.districts || []).forEach(d => {
            if (d && typeof d === 'string') {
              const trimmed = d.trim().replace(/\*/g, ''); // Remove all asterisks
              const lower = trimmed.toLowerCase();
              // Skip invalid entries and "Siddharth Nagar"
              if (trimmed.length > 2 && lower !== 'null' && lower !== 'na' && lower !== 'n/a' && lower !== 'siddharth nagar') {
                districtSet.add(trimmed);
              }
            }
          });
          setDistricts(Array.from(districtSet).sort());
        }
      } catch (e) {
        console.error('Failed to load districts');
      }
    };
    fetchDistricts();
  }, [state]);

  const handleSubmit = async () => {
    if (!state || !district) { setError('Please select state and district'); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/migration/district/${state}/${district}?year=${year}`);
      if (!res.ok) throw new Error('Failed to fetch');
      setData(await res.json());
    } catch (e) {
      setError('Failed to load district data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 style={{ marginTop: 0, color: designTokens.colors.slate800, fontSize: '20px' }}>District Migration Index</h2>
      {error && <ErrorMessage message={error} />}
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: designTokens.spacing.md, marginBottom: designTokens.spacing.lg }}>
        <Select label="State" value={state} onChange={(e) => setState(e.target.value)} options={states} />
        <Select label="District" value={district} onChange={(e) => setDistrict(e.target.value)} options={districts} />
        <Input label="Year" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2025" />
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button onClick={handleSubmit}>Analyze</Button>
        </div>
      </div>
      
      {loading && <LoadingSpinner />}
      {data && !loading && (
        <DataGrid data={[
          { label: 'Child Enrolments', value: (data.total_child_enrolments || 0).toLocaleString() },
          { label: 'Adult Updates', value: (data.total_adult_updates || 0).toLocaleString() },
          { label: 'Migration Index', value: (data.average_migration_index || 0).toFixed(2) }
        ]} />
      )}
    </Card>
  );
}

// PINCODE INDEX TAB
function PincodeIndexTab() {
  const [pincode, setPincode] = useState('');
  const [year, setYear] = useState('2025');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!pincode) { setError('Please enter a pincode'); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/migration/pincode/${pincode}?year=${year}`);
      if (!res.ok) throw new Error('Failed to fetch');
      setData(await res.json());
    } catch (e) {
      setError('Failed to load pincode data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 style={{ marginTop: 0, color: designTokens.colors.slate800, fontSize: '20px' }}>Pincode Migration Index</h2>
      {error && <ErrorMessage message={error} />}
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: designTokens.spacing.md, marginBottom: designTokens.spacing.lg }}>
        <Input label="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="e.g., 560043" />
        <Input label="Year" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2025" />
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button onClick={handleSubmit}>Analyze</Button>
        </div>
      </div>
      
      {loading && <LoadingSpinner />}
      {data && !loading && (
        <>
          <div style={{ background: designTokens.colors.slate50, padding: designTokens.spacing.md, borderRadius: designTokens.radius.md, marginBottom: designTokens.spacing.lg }}>
            <div style={{ fontSize: '13px', color: designTokens.colors.slate600 }}>Location</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: designTokens.colors.slate800 }}>{data.district}, {data.state}</div>
          </div>
          <DataGrid data={[
            { label: 'Child Enrolments', value: (data.total_child_enrolments || 0).toLocaleString() },
            { label: 'Adult Updates', value: (data.total_adult_updates || 0).toLocaleString() },
            { label: 'Migration Index', value: (data.average_migration_index || 0).toFixed(2) }
          ]} />
        </>
      )}
    </Card>
  );
}

// TRENDS TAB
function TrendsTab({ states }) {
  const [state, setState] = useState('');
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!state) {
      setDistricts([]);
      setDistrict('');
      return;
    }
    const fetchDistricts = async () => {
      try {
        const res = await fetch(`${API}/migration/districts/${state}`);
        if (res.ok) {
          const data = await res.json();
          // Filter to clean district names only
          const districtSet = new Set();
          (data.districts || []).forEach(d => {
            if (d && typeof d === 'string') {
              const trimmed = d.trim().replace(/\*/g, ''); // Remove all asterisks
              const lower = trimmed.toLowerCase();
              // Skip invalid entries and "Siddharth Nagar"
              if (trimmed.length > 2 && lower !== 'null' && lower !== 'na' && lower !== 'n/a' && lower !== 'siddharth nagar') {
                districtSet.add(trimmed);
              }
            }
          });
          setDistricts(Array.from(districtSet).sort());
        }
      } catch (e) {
        console.error('Failed to load districts');
      }
    };
    fetchDistricts();
  }, [state]);

  const handleSubmit = async () => {
    if (!state || !district) { setError('Please select state and district'); return; }
    setLoading(true);
    setError(null);
    try {
      let url = `${API}/migration/trend/${state}/${district}`;
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      if (params.toString()) url += '?' + params.toString();
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch');
      setData(await res.json());
    } catch (e) {
      setError('Failed to load trend data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 style={{ marginTop: 0, color: designTokens.colors.slate800, fontSize: '20px' }}>Migration Trends</h2>
      {error && <ErrorMessage message={error} />}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: designTokens.spacing.md, marginBottom: designTokens.spacing.lg }}>
        <Select label="State" value={state} onChange={(e) => setState(e.target.value)} options={states} />
        <Select label="District" value={district} onChange={(e) => setDistrict(e.target.value)} options={districts} />
        <Input label="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="DD-MM-YYYY" />
        <Input label="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="DD-MM-YYYY" />
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button onClick={handleSubmit}>View</Button>
        </div>
      </div>
      
      {loading && <LoadingSpinner />}
      {data && !loading && (
        <>
          <DataGrid data={[
            { label: 'Data Points', value: data.data_points?.length || 0 },
            { label: 'Avg Index', value: (data.average_index || 0).toFixed(2) },
            { label: 'Trend', value: data.trend || '-' }
          ]} />
          {data.data_points && data.data_points.length > 0 && (
            <div style={{ marginTop: designTokens.spacing.lg }}>
              <h3 style={{ color: designTokens.colors.slate800, fontSize: '16px', marginBottom: designTokens.spacing.md }}>Recent Data Points</h3>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {data.data_points.slice(-10).reverse().map((p, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: designTokens.colors.slate50, borderRadius: designTokens.radius.sm, marginBottom: '4px', fontSize: '13px' }}>
                    <span>{p.date}</span>
                    <span style={{ fontWeight: '600', color: designTokens.colors.blue600 }}>{(p.migration_index || 0).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}

// FORECAST TAB
function ForecastTab({ states }) {
  const [state, setState] = useState('');
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState('');
  const [days, setDays] = useState('30');
  const [method, setMethod] = useState('prophet');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!state) {
      setDistricts([]);
      setDistrict('');
      return;
    }
    const fetchDistricts = async () => {
      try {
        const res = await fetch(`${API}/migration/districts/${state}`);
        if (res.ok) {
          const data = await res.json();
          // Filter to clean district names only
          const districtSet = new Set();
          (data.districts || []).forEach(d => {
            if (d && typeof d === 'string') {
              const trimmed = d.trim().replace(/\*/g, ''); // Remove all asterisks
              const lower = trimmed.toLowerCase();
              // Skip invalid entries and "Siddharth Nagar"
              if (trimmed.length > 2 && lower !== 'null' && lower !== 'na' && lower !== 'n/a' && lower !== 'siddharth nagar') {
                districtSet.add(trimmed);
              }
            }
          });
          setDistricts(Array.from(districtSet).sort());
        }
      } catch (e) {
        console.error('Failed to load districts');
      }
    };
    fetchDistricts();
  }, [state]);

  const handleSubmit = async () => {
    if (!state || !district) { setError('Please select state and district'); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/migration/forecast/${state}/${district}?days=${days}&method=${method}`);
      if (!res.ok) throw new Error('Failed to fetch');
      setData(await res.json());
    } catch (e) {
      setError('Failed to generate forecast');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 style={{ marginTop: 0, color: designTokens.colors.slate800, fontSize: '20px' }}>Migration Forecast</h2>
      {error && <ErrorMessage message={error} />}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: designTokens.spacing.md, marginBottom: designTokens.spacing.lg }}>
        <Select label="State" value={state} onChange={(e) => setState(e.target.value)} options={states} />
        <Select label="District" value={district} onChange={(e) => setDistrict(e.target.value)} options={districts} />
        <Input label="Days" value={days} onChange={(e) => setDays(e.target.value)} placeholder="30" />
        <Select label="Method" value={method} onChange={(e) => setMethod(e.target.value)} options={['prophet', 'arima', 'ensemble']} />
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button onClick={handleSubmit}>Generate</Button>
        </div>
      </div>
      
      {loading && <LoadingSpinner />}
      {data && !loading && (
        <>
          {data.interpretation && (
            <div style={{ background: designTokens.colors.slate50, padding: designTokens.spacing.md, borderRadius: designTokens.radius.md, marginBottom: designTokens.spacing.lg }}>
              <div style={{ fontSize: '13px', color: designTokens.colors.slate600, marginBottom: '8px' }}>Migration Pressure</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: designTokens.colors.blue600, marginBottom: designTokens.spacing.md }}>
                {data.interpretation.migration_pressure}
              </div>
              <div style={{ fontSize: '13px', color: designTokens.colors.slate700, lineHeight: '1.5' }}>
                {data.interpretation.policy_impact}
              </div>
            </div>
          )}
          <DataGrid data={[
            { label: 'Avg Predicted', value: (data.interpretation?.average_predicted_index || 0).toFixed(2) },
            { label: 'Trend', value: data.interpretation?.trend || '-' },
            { label: 'Change %', value: (data.interpretation?.change_percent || 0).toFixed(1) + '%' }
          ]} />
          {data.forecast && data.forecast.length > 0 && (
            <div style={{ marginTop: designTokens.spacing.lg }}>
              <h3 style={{ color: designTokens.colors.slate800, fontSize: '16px', marginBottom: designTokens.spacing.md }}>Forecast (First 10 Days)</h3>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {data.forecast.slice(0, 10).map((p, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: designTokens.colors.slate50, borderRadius: designTokens.radius.sm, marginBottom: '4px', fontSize: '13px' }}>
                    <span>{typeof p.date === 'string' ? p.date.slice(0, 10) : p.date}</span>
                    <span style={{ fontWeight: '600', color: designTokens.colors.blue600 }}>{(p.predicted_index || 0).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}

// TOP GROWTH TAB
// COMPARE TAB
function CompareTab({ states }) {
  const [state, setState] = useState('');
  const [districts, setDistricts] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [year, setYear] = useState('2025');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!state) {
      setDistricts([]);
      setSelectedDistricts([]);
      return;
    }
    const fetchDistricts = async () => {
      try {
        const res = await fetch(`${API}/migration/districts/${state}`);
        if (res.ok) {
          const data = await res.json();
          // Filter to clean district names only
          const districtSet = new Set();
          (data.districts || []).forEach(d => {
            if (d && typeof d === 'string') {
              const trimmed = d.trim().replace(/\*/g, ''); // Remove all asterisks
              const lower = trimmed.toLowerCase();
              // Skip invalid entries and "Siddharth Nagar"
              if (trimmed.length > 2 && lower !== 'null' && lower !== 'na' && lower !== 'n/a' && lower !== 'siddharth nagar') {
                districtSet.add(trimmed);
              }
            }
          });
          setDistricts(Array.from(districtSet).sort());
        }
      } catch (e) {
        console.error('Failed to load districts');
      }
    };
    fetchDistricts();
  }, [state]);

  const handleSubmit = async () => {
    if (!state || selectedDistricts.length < 2) { setError('Please select at least 2 districts'); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await Promise.all(
        selectedDistricts.map(d =>
          fetch(`${API}/migration/district/${state}/${d}?year=${year}`)
            .then(r => r.ok ? r.json() : null)
        )
      );
      setResults(res.filter(r => r !== null).sort((a, b) => (b.average_migration_index || 0) - (a.average_migration_index || 0)));
    } catch (e) {
      setError('Failed to compare districts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 style={{ marginTop: 0, color: designTokens.colors.slate800, fontSize: '20px' }}>Compare Districts</h2>
      {error && <ErrorMessage message={error} />}
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', gap: designTokens.spacing.md, marginBottom: designTokens.spacing.lg }}>
        <Select label="State" value={state} onChange={(e) => setState(e.target.value)} options={states} />
        <div style={{ marginBottom: designTokens.spacing.md }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '13px', color: designTokens.colors.slate700 }}>Select Districts (Hold Ctrl/Cmd)</label>
          <select
            multiple
            value={selectedDistricts}
            onChange={(e) => setSelectedDistricts(Array.from(e.target.selectedOptions, option => option.value))}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${designTokens.colors.slate200}`,
              borderRadius: designTokens.radius.sm,
              fontSize: '14px',
              boxSizing: 'border-box',
              minHeight: '100px'
            }}
          >
            {districts && districts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <Input label="Year" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2025" />
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button onClick={handleSubmit}>Compare</Button>
        </div>
      </div>
      
      {loading && <LoadingSpinner />}
      {results && results.length > 0 && !loading && (
        <div>
          {results.map((r, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: designTokens.spacing.md,
              background: designTokens.colors.slate50,
              borderRadius: designTokens.radius.md,
              marginBottom: '8px'
            }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: designTokens.colors.slate800 }}>{r.district}</div>
                <div style={{ fontSize: '12px', color: designTokens.colors.slate600 }}>Children: {(r.total_child_enrolments || 0).toLocaleString()} | Adults: {(r.total_adult_updates || 0).toLocaleString()}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: designTokens.colors.blue600 }}>
                  {(r.average_migration_index || 0).toFixed(2)}
                </div>
                <div style={{ fontSize: '12px', color: designTokens.colors.slate600 }}>{r.status}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// MAIN COMPONENT
export default function MigrationAnalysis() {
  const [activeTab, setActiveTab] = useState('state');
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await fetch(`${API}/migration/available-states`);
        if (res.ok) {
          const data = await res.json();
          
          // Mapping of all state variations to canonical names
          const stateMapping = {
            'andhra pradesh': 'Andhra Pradesh',
            'arunachal pradesh': 'Arunachal Pradesh',
            'assam': 'Assam',
            'bihar': 'Bihar',
            'chhattisgarh': 'Chhattisgarh',
            'chhatisgarh': 'Chhattisgarh',
            'dadra and nagar haveli': 'Dadra and Nagar Haveli and Daman and Diu',
            'dadra & nagar haveli': 'Dadra and Nagar Haveli and Daman and Diu',
            'daman and diu': 'Daman and Diu',
            'daman & diu': 'Daman and Diu',
            'delhi': 'Delhi',
            'goa': 'Goa',
            'gujarat': 'Gujarat',
            'haryana': 'Haryana',
            'himachal pradesh': 'Himachal Pradesh',
            'jammu and kashmir': 'Jammu and Kashmir',
            'jammu & kashmir': 'Jammu and Kashmir',
            'jharkhand': 'Jharkhand',
            'karnataka': 'Karnataka',
            'kerala': 'Kerala',
            'ladakh': 'Ladakh',
            'lakshadweep': 'Lakshadweep',
            'madhya pradesh': 'Madhya Pradesh',
            'maharashtra': 'Maharashtra',
            'manipur': 'Manipur',
            'meghalaya': 'Meghalaya',
            'mizoram': 'Mizoram',
            'nagaland': 'Nagaland',
            'odisha': 'Odisha',
            'orissa': 'Odisha',
            'puducherry': 'Puducherry',
            'pondicherry': 'Puducherry',
            'punjab': 'Punjab',
            'rajasthan': 'Rajasthan',
            'sikkim': 'Sikkim',
            'tamil nadu': 'Tamil Nadu',
            'telangana': 'Telangana',
            'tripura': 'Tripura',
            'uttar pradesh': 'Uttar Pradesh',
            'uttarakhand': 'Uttarakhand',
            'uttaranchal': 'Uttarakhand',
            'west bengal': 'West Bengal',
            'west bangal': 'West Bengal',
            'west bengli': 'West Bengal',
            'west  bengal': 'West Bengal',
            'westbengal': 'West Bengal',
            'andaman & nicobar islands': 'Andaman and Nicobar Islands',
            'andaman and nicobar islands': 'Andaman and Nicobar Islands',
            'chandigarh': 'Chandigarh',
            'the dadra and nagar haveli and daman and diu': 'Dadra and Nagar Haveli and Daman and Diu',
          };
          
          // Filter and normalize states
          const cleanedStates = new Set();
          (data.states || []).forEach(state => {
            if (state && typeof state === 'string') {
              const normalized = stateMapping[state.toLowerCase().trim()];
              if (normalized) {
                cleanedStates.add(normalized);
              }
            }
          });
          
          setStates(Array.from(cleanedStates).sort());
        }
      } catch (e) {
        console.error('Failed to load states:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStates();
  }, []);

  return (
    <div style={{ background: designTokens.colors.slate50, minHeight: '100vh', paddingBottom: designTokens.spacing.lg }}>
      <Container>
        <h1 style={{ color: designTokens.colors.slate800, marginBottom: designTokens.spacing.lg, fontSize: '28px', fontWeight: '700' }}>
          Migration Analysis
        </h1>
        
        {/* TAB NAVIGATION */}
        <div style={{
          display: 'flex',
          gap: '4px',
          overflowX: 'auto',
          marginBottom: designTokens.spacing.lg,
          padding: designTokens.spacing.md,
          background: '#ffffff',
          borderRadius: designTokens.radius.lg,
          border: `1px solid ${designTokens.colors.slate200}`
        }}>
          {TAB_BUTTONS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
                background: activeTab === tab.id ? designTokens.colors.blue500 : 'transparent',
                color: activeTab === tab.id ? '#fff' : designTokens.colors.slate700,
                border: 'none',
                borderRadius: designTokens.radius.sm,
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: activeTab === tab.id ? '600' : '500',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) e.target.style.background = designTokens.colors.slate100;
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) e.target.style.background = 'transparent';
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* TAB CONTENT */}
        {loading ? (
          <Card><LoadingSpinner /></Card>
        ) : (
          <>
            {activeTab === 'state' && <StateIndexTab states={states} />}
            {activeTab === 'district' && <DistrictIndexTab states={states} />}
            {activeTab === 'pincode' && <PincodeIndexTab />}
            {activeTab === 'trends' && <TrendsTab states={states} />}
            {activeTab === 'forecast' && <ForecastTab states={states} />}
            {activeTab === 'compare' && <CompareTab states={states} />}
          </>
        )}
      </Container>
    </div>
  );
}
