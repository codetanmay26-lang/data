# Aadhaar Pulse - Migration Index Documentation

## Executive Summary

The **Migration Index** is a quantitative metric designed to measure population movement activity in Indian states and districts using Aadhaar enrollment and update data as a proxy indicator. This system provides real-time insights into demographic shifts, enabling data-driven decision-making for resource allocation, infrastructure planning, and policy formulation.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Methodology](#2-methodology)
3. [Data Sources](#3-data-sources)
4. [Migration Index Formula](#4-migration-index-formula)
5. [System Architecture](#5-system-architecture)
6. [Features & Capabilities](#6-features--capabilities)
7. [Forecasting Models](#7-forecasting-models)
8. [API Endpoints](#8-api-endpoints)
9. [Use Cases](#9-use-cases)
10. [Limitations & Assumptions](#10-limitations--assumptions)
11. [Technical Specifications](#11-technical-specifications)

---

## 1. Introduction

### 1.1 Purpose
The Migration Index system leverages India's Aadhaar enrollment database to track and predict population movement patterns across geographical boundaries. By analyzing enrollment and update patterns, the system identifies areas experiencing demographic changes.

### 1.2 Scope
- **Geographical Coverage**: All Indian States and Union Territories (36 entities)
- **Granularity**: State, District, and Pincode levels
- **Time Range**: Historical data from Aadhaar enrollment dates
- **Forecast Horizon**: 7 to 180 days ahead

### 1.3 Key Stakeholders
- Government policy makers
- Urban planners
- Infrastructure development authorities
- NGOs and social welfare organizations
- Researchers and academics

---

## 2. Methodology

### 2.1 Conceptual Framework

The Migration Index is built on the premise that **Aadhaar enrollment and update activities serve as reliable proxies for population movement**:

1. **Child Enrolments (Age 0-5)**: When families migrate, they typically register their children first for accessing education and welfare schemes.
2. **Adult Updates (Age 17+)**: Demographic and biometric updates reflect address changes when individuals relocate.

### 2.2 Data Processing Pipeline

```
Raw Aadhaar Data → Data Cleaning → Aggregation by Geography & Date → 
Migration Index Calculation → Storage in Database → API Exposure → 
Forecasting Models → Visualization
```

### 2.3 Assumptions

1. Aadhaar enrollment/update activity correlates with actual migration
2. High activity indicates population movement (both in-migration and out-migration)
3. Child enrolments are weighted more heavily as families typically enroll children first
4. Time-series patterns are consistent enough for forecasting
5. Data quality from UIDAI is reliable and complete

---

## 3. Data Sources

### 3.1 Primary Dataset: Aadhaar Enrollment Data

**Source**: Unique Identification Authority of India (UIDAI)

**Available Fields**:
- `date`: Transaction date
- `state`: State name
- `district`: District name
- `pincode`: Postal code (6 digits)
- `age_0_5`: Child enrolments (0-5 years)
- `age_5_17`: Youth enrolments (5-17 years)
- `age_18_greater`: Adult enrolments/updates (18+ years)

### 3.2 Data Categories

#### 3.2.1 Enrolment Data
Records of new Aadhaar card registrations categorized by age groups.

**Files**:
- `api_data_aadhar_enrolment_0_500000.csv`
- `api_data_aadhar_enrolment_500000_1000000.csv`
- `api_data_aadhar_enrolment_1000000_1006029.csv`

**Sample Size**: ~1,006,029 records

#### 3.2.2 Demographic Update Data
Records of demographic information updates (address, name, DOB, etc.)

**Files**:
- `api_data_aadhar_demographic_0_500000.csv`
- `api_data_aadhar_demographic_500000_1000000.csv`
- `api_data_aadhar_demographic_1000000_1500000.csv`
- `api_data_aadhar_demographic_1500000_2000000.csv`
- `api_data_aadhar_demographic_2000000_2071700.csv`

**Sample Size**: ~2,071,700 records

#### 3.2.3 Biometric Update Data
Records of biometric data updates (fingerprints, iris scans, photographs)

**Files**:
- `api_data_aadhar_biometric_0_500000.csv`
- `api_data_aadhar_biometric_500000_1000000.csv`
- `api_data_aadhar_biometric_1000000_1500000.csv`
- `api_data_aadhar_biometric_1500000_1861108.csv`

**Sample Size**: ~1,861,108 records

### 3.3 Data Cleaning Process

The system implements a comprehensive data cleaning pipeline:

1. **Duplicate Removal**: Remove duplicate entries by (date, state, district, pincode)
2. **Invalid Entry Filtering**:
   - Remove rows with null/NA state or district values
   - Filter out malformed entries (numeric codes, test data)
   - Exclude entries with asterisks (*) indicating incomplete data
3. **State Name Normalization**: Map variations (e.g., "Orissa" → "Odisha")
4. **Date Validation**: Ensure valid date formats and ranges
5. **Negative Value Handling**: Remove or flag negative enrollment counts

**Cleaned Data Output**: `cleaned/enrolment_clean.csv`, `cleaned/demographic_update_clean.csv`, `cleaned/biometric_update_clean.csv`

---

## 4. Migration Index Formula

### 4.1 Core Formula

The Migration Index is calculated using a **weighted combination** of child enrolments and adult updates:

```
Migration Index = (α × Child_Enrolments + β × Adult_Updates) / Population_Scale_Factor

Where:
  α (alpha) = Weight for child enrolments = 2.0 (higher weight)
  β (beta)  = Weight for adult updates = 1.0 (base weight)
  Population_Scale_Factor = 1000 (for normalization)
```

### 4.2 Simplified Formula (Current Implementation)

```python
migration_index = (child_enrolments * 2.0 + adult_updates) / 1000
```

**Rationale for Weighting**:
- Child enrolments receive **2x weight** because families enrolling children signal fresh migration
- Adult updates receive **1x weight** as they may include routine updates unrelated to migration

### 4.3 Aggregation Methods

#### 4.3.1 District-Level Aggregation
```sql
SELECT 
    date,
    state,
    district,
    SUM(child_enrolments) AS total_child_enrolments,
    SUM(adult_updates) AS total_adult_updates,
    (SUM(child_enrolments) * 2.0 + SUM(adult_updates)) / 1000 AS migration_index
FROM raw_data
WHERE pincode IS NULL OR pincode = ''
GROUP BY date, state, district
```

#### 4.3.2 State-Level Aggregation
```sql
SELECT 
    date,
    state,
    SUM(child_enrolments) AS total_child_enrolments,
    SUM(adult_updates) AS total_adult_updates,
    (SUM(child_enrolments) * 2.0 + SUM(adult_updates)) / 1000 AS migration_index,
    COUNT(DISTINCT district) AS num_districts
FROM migration_index
WHERE pincode IS NULL
GROUP BY date, state
```

### 4.4 Index Interpretation Scale

The calculated index value is mapped to migration activity levels:

| Index Range | Status | Interpretation |
|-------------|--------|----------------|
| < 1.0 | **Low Migration** | Minimal population movement; stable demographics |
| 1.0 - 1.99 | **Moderate Migration** | Normal level of movement; routine relocations |
| 2.0 - 2.99 | **High Migration** | Significant population influx or outflow |
| ≥ 3.0 | **Very High Migration** | Exceptional movement; major demographic shift |

**Implementation**:
```python
def interpret_index(index_value):
    if index_value is None:
        return "No Data"
    elif index_value < 1.0:
        return "Low Migration"
    elif index_value < 2.0:
        return "Moderate Migration"
    elif index_value < 3.0:
        return "High Migration"
    else:
        return "Very High Migration"
```

---

## 5. System Architecture

### 5.1 Technology Stack

**Backend**:
- **Framework**: FastAPI (Python 3.9+)
- **Database**: SQLite with SQLAlchemy ORM
- **ML Libraries**: Prophet (Meta), Statsmodels (ARIMA), Scikit-learn
- **Data Processing**: Pandas, NumPy

**Frontend**:
- **Framework**: React.js 18+ with Vite
- **Routing**: React Router v6
- **Styling**: Inline CSS with Design Tokens
- **Charts**: Plotly.js (for visualizations)

### 5.2 Database Schema

#### Migration Index Table
```sql
CREATE TABLE migration_index (
    id INTEGER PRIMARY KEY,
    date DATE NOT NULL,
    state VARCHAR NOT NULL,
    district VARCHAR NOT NULL,
    pincode VARCHAR,
    
    -- Raw Counts
    child_enrolments INTEGER DEFAULT 0,
    adult_updates INTEGER DEFAULT 0,
    
    -- Calculated Metrics
    migration_index FLOAT,
    
    -- Temporal Metadata
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    
    -- Indexes
    INDEX idx_state_district_date (state, district, date),
    INDEX idx_pincode_date (pincode, date),
    INDEX idx_state_year (state, year)
);
```

### 5.3 API Architecture

```
Client (React) ←→ FastAPI Backend ←→ SQLite Database
                      ↓
              Forecasting Module (Prophet/ARIMA)
```

**CORS Configuration**:
- Allowed origins: `http://localhost:5173`, `http://127.0.0.1:5173`, `http://localhost:3000`
- Methods: All (GET, POST, PUT, DELETE)
- Headers: All

---

## 6. Features & Capabilities

### 6.1 Core Features

#### 6.1.1 State Index
- **Purpose**: View state-level migration aggregates
- **Inputs**: State name, Year (optional)
- **Outputs**: 
  - Total child enrolments
  - Total adult updates
  - Average migration index (weighted)
  - Top 5 districts by migration index
  - Migration status classification

#### 6.1.2 District Index
- **Purpose**: Drill down to district-specific data
- **Inputs**: State, District, Year (optional)
- **Outputs**:
  - District-level enrolment counts
  - Migration index
  - Historical averages
  - Status classification

#### 6.1.3 Pincode Index
- **Purpose**: Hyper-local analysis at postal code level
- **Inputs**: 6-digit pincode, Year (optional)
- **Outputs**:
  - Pincode-level migration metrics
  - Associated state and district
  - Enrolment breakdown

#### 6.1.4 Trends Analysis
- **Purpose**: Visualize migration patterns over time
- **Inputs**: State, District, Date Range (optional)
- **Outputs**:
  - Time-series line chart
  - Month-over-month changes
  - Seasonal patterns
  - Trend direction (increasing/decreasing/stable)

#### 6.1.5 Forecasting
- **Purpose**: Predict future migration using ML models
- **Inputs**: State, District, Forecast Days (7-180), Method (Prophet/ARIMA/Ensemble)
- **Outputs**:
  - Predicted migration index for each day
  - Confidence intervals (upper/lower bounds)
  - Model performance metrics
  - Visualization of forecast vs. historical

#### 6.1.6 District Comparison
- **Purpose**: Compare multiple districts within a state
- **Inputs**: State, List of Districts (2+), Year
- **Outputs**:
  - Side-by-side comparison table
  - Ranked by migration index
  - Comparative visualization

### 6.2 Data Quality Features

- **Asterisk Filtering**: Automatically removes districts with `*` suffix (incomplete data)
- **Name Normalization**: Handles state name variations (e.g., Odisha/Orissa)
- **Duplicate Detection**: Identifies and flags duplicate entries in cleaning logs
- **Outlier Detection**: Statistical methods to identify anomalous values

---

## 7. Forecasting Models

### 7.1 Model Overview

The system supports three forecasting approaches:

1. **Prophet** (Facebook/Meta) - Recommended
2. **ARIMA** (Auto-Regressive Integrated Moving Average)
3. **Ensemble** - Weighted combination of Prophet + ARIMA

### 7.2 Prophet Model

**Algorithm**: Additive time-series forecasting model

**Formula**:
```
y(t) = g(t) + s(t) + h(t) + εₜ

Where:
  g(t) = Trend component (piecewise linear or logistic growth)
  s(t) = Seasonal component (Fourier series)
  h(t) = Holiday/event effects
  εₜ  = Error term (normally distributed)
```

**Configuration**:
```python
Prophet(
    daily_seasonality=False,    # Migration patterns not daily
    weekly_seasonality=True,     # Weekly patterns enabled
    yearly_seasonality=False,    # Insufficient data for yearly
    interval_width=0.95          # 95% confidence intervals
)
```

**Advantages**:
- Handles missing data gracefully
- Robust to outliers
- Intuitive parameters
- Fast computation

**Limitations**:
- Requires at least 5 historical data points
- Assumes consistent patterns
- May overfit on sparse data

### 7.3 ARIMA Model

**Algorithm**: Auto-Regressive Integrated Moving Average

**Formula**:
```
yₜ = c + φ₁yₜ₋₁ + ... + φₚyₜ₋ₚ + θ₁εₜ₋₁ + ... + θᵩεₜ₋ᵩ + εₜ

Where:
  p = Auto-regressive order (past values)
  d = Degree of differencing (stationarity)
  q = Moving average order (past errors)
```

**Configuration**:
```python
ARIMA(order=(1, 1, 1))  # Simple ARIMA(1,1,1) model

Where:
  p = 1 (one lag of dependent variable)
  d = 1 (first-order differencing)
  q = 1 (one lag of forecast errors)
```

**Advantages**:
- Well-established statistical method
- Works well with stationary data
- Provides confidence intervals

**Limitations**:
- Requires at least 10 data points
- Sensitive to parameter selection
- Assumes linear relationships
- Computationally expensive for large datasets

### 7.4 Ensemble Model

**Method**: Weighted average of Prophet and ARIMA predictions

**Formula**:
```
Ensemble_Prediction = (w₁ × Prophet_Prediction + w₂ × ARIMA_Prediction) / (w₁ + w₂)

Where:
  w₁ = Weight for Prophet = 0.6 (preferred)
  w₂ = Weight for ARIMA = 0.4
```

**Confidence Intervals**:
```
Lower_Bound = min(Prophet_Lower, ARIMA_Lower)
Upper_Bound = max(Prophet_Upper, ARIMA_Upper)
```

**Advantages**:
- Combines strengths of both models
- More robust predictions
- Reduces individual model bias

**Limitations**:
- Both models must succeed
- Increased computation time
- Complexity in interpretation

### 7.5 Model Selection Guidelines

| Scenario | Recommended Model | Reason |
|----------|-------------------|--------|
| 5-10 data points | **Prophet** | Handles sparse data better |
| 10+ data points | **Ensemble** | Best overall performance |
| Strong trends | **ARIMA** | Captures trend dynamics |
| Irregular patterns | **Prophet** | Robust to anomalies |
| Production use | **Prophet** | Faster, more reliable |

### 7.6 Forecast Validation

**Metrics**:
- **MAE** (Mean Absolute Error): Average prediction error
- **RMSE** (Root Mean Square Error): Penalizes large errors
- **MAPE** (Mean Absolute Percentage Error): Relative error percentage

**Calculation** (for historical validation):
```python
MAE = Σ|yₜ - ŷₜ| / n
RMSE = √(Σ(yₜ - ŷₜ)² / n)
MAPE = (Σ|yₜ - ŷₜ| / yₜ) / n × 100%
```

---

## 8. API Endpoints

### 8.1 Base URL
```
http://127.0.0.1:8000
```

### 8.2 Endpoint Reference

#### 8.2.1 Root Endpoint
```http
GET /
```
**Response**: API information and available endpoints

---

#### 8.2.2 Available States
```http
GET /migration/available-states
```
**Description**: Get list of all valid states with data

**Response**:
```json
{
  "total_states": 36,
  "states": [
    "Andhra Pradesh",
    "Bihar",
    "Delhi",
    ...
  ]
}
```

---

#### 8.2.3 Districts for State
```http
GET /migration/districts/{state}
```
**Parameters**:
- `state` (path): State name

**Response**:
```json
{
  "state": "Uttar Pradesh",
  "total_districts": 75,
  "districts": [
    "Agra",
    "Allahabad",
    "Lucknow",
    ...
  ]
}
```

---

#### 8.2.4 State Migration Index
```http
GET /migration/state/{state}?year={year}
```
**Parameters**:
- `state` (path): State name
- `year` (query, optional): Year filter (default: latest)

**Response**:
```json
{
  "state": "Maharashtra",
  "year": 2025,
  "total_child_enrolments": 125000,
  "total_adult_updates": 450000,
  "average_migration_index": 2.15,
  "status": "High Migration",
  "top_districts": [
    {
      "district": "Mumbai",
      "migration_index": 4.5
    },
    ...
  ]
}
```

---

#### 8.2.5 District Migration Index
```http
GET /migration/district/{state}/{district}?year={year}
```
**Parameters**:
- `state` (path): State name
- `district` (path): District name
- `year` (query, optional): Year filter

**Response**:
```json
{
  "state": "Karnataka",
  "district": "Bangalore Urban",
  "year": 2025,
  "total_child_enrolments": 15000,
  "total_adult_updates": 55000,
  "average_migration_index": 3.75,
  "status": "Very High Migration"
}
```

---

#### 8.2.6 Pincode Migration Index
```http
GET /migration/pincode/{pincode}?year={year}
```
**Parameters**:
- `pincode` (path): 6-digit postal code
- `year` (query, optional): Year filter

**Response**:
```json
{
  "pincode": "110001",
  "state": "Delhi",
  "district": "Central Delhi",
  "year": 2025,
  "total_child_enrolments": 450,
  "total_adult_updates": 2100,
  "average_migration_index": 2.55,
  "status": "High Migration"
}
```

---

#### 8.2.7 Trend Analysis
```http
GET /migration/trend/{state}/{district}?start_date={date}&end_date={date}
```
**Parameters**:
- `state` (path): State name
- `district` (path): District name
- `start_date` (query, optional): Start date (YYYY-MM-DD)
- `end_date` (query, optional): End date (YYYY-MM-DD)

**Response**:
```json
{
  "state": "Tamil Nadu",
  "district": "Chennai",
  "date_range": {
    "start": "2024-01-01",
    "end": "2025-01-01"
  },
  "data_points": 12,
  "trend": [
    {
      "date": "2024-01-01",
      "migration_index": 2.1,
      "child_enrolments": 800,
      "adult_updates": 3200
    },
    ...
  ],
  "statistics": {
    "average_index": 2.35,
    "max_index": 3.2,
    "min_index": 1.8,
    "trend_direction": "increasing"
  }
}
```

---

#### 8.2.8 Forecast
```http
GET /migration/forecast/{state}/{district}?days={n}&method={model}
```
**Parameters**:
- `state` (path): State name
- `district` (path): District name
- `days` (query): Forecast period (7-180 days, default: 30)
- `method` (query): Model selection ('prophet', 'arima', 'ensemble', default: 'prophet')

**Response**:
```json
{
  "state": "Gujarat",
  "district": "Ahmedabad",
  "historical_data_points": 24,
  "forecast_period_days": 30,
  "method": "prophet",
  "historical_avg_index": 2.8,
  "historical_trend": "stable",
  "forecast": [
    {
      "date": "2026-01-19",
      "predicted_index": 2.85,
      "lower_bound": 2.3,
      "upper_bound": 3.4,
      "confidence": 0.95
    },
    ...
  ],
  "prediction_summary": {
    "avg_predicted_index": 2.9,
    "predicted_trend": "slightly_increasing",
    "confidence_level": 0.95
  }
}
```

---

#### 8.2.9 Compare Districts
```http
POST /migration/compare
Content-Type: application/json

{
  "state": "Rajasthan",
  "districts": ["Jaipur", "Jodhpur", "Udaipur"],
  "year": 2025
}
```

**Response**:
```json
{
  "state": "Rajasthan",
  "year": 2025,
  "comparison": [
    {
      "rank": 1,
      "district": "Jaipur",
      "migration_index": 3.2,
      "child_enrolments": 12000,
      "adult_updates": 45000,
      "status": "Very High Migration"
    },
    {
      "rank": 2,
      "district": "Udaipur",
      "migration_index": 2.1,
      "child_enrolments": 5000,
      "adult_updates": 18000,
      "status": "High Migration"
    },
    {
      "rank": 3,
      "district": "Jodhpur",
      "migration_index": 1.8,
      "child_enrolments": 4000,
      "adult_updates": 15000,
      "status": "Moderate Migration"
    }
  ]
}
```

---

## 9. Use Cases

### 9.1 Government & Policy

#### Urban Planning
- **Scenario**: Identify districts requiring new schools, hospitals, roads
- **Approach**: Query districts with "Very High Migration" status
- **Outcome**: Data-driven infrastructure budget allocation

#### Resource Distribution
- **Scenario**: Allocate welfare scheme quotas to high-migration areas
- **Approach**: Compare district migration indices statewide
- **Outcome**: Equitable distribution aligned with actual demand

#### Election Planning
- **Scenario**: Update voter rolls in areas with population shifts
- **Approach**: Monitor trend analysis for sudden spikes
- **Outcome**: Accurate electoral roll maintenance

### 9.2 Business & Economics

#### Retail Expansion
- **Scenario**: Identify locations for new store openings
- **Approach**: Target districts with increasing migration trends
- **Outcome**: Optimized market entry strategies

#### Real Estate Development
- **Scenario**: Forecast housing demand in growing areas
- **Approach**: Use 180-day forecasts for high-migration districts
- **Outcome**: Informed construction planning

### 9.3 Social Welfare

#### NGO Operations
- **Scenario**: Deploy aid programs where displaced populations settle
- **Approach**: Real-time monitoring of migration hotspots
- **Outcome**: Rapid response to humanitarian needs

#### Education Planning
- **Scenario**: Predict school enrollment surges
- **Approach**: Analyze child enrolment trends
- **Outcome**: Adequate teacher hiring and classroom allocation

---

## 10. Limitations & Assumptions

### 10.1 Data Limitations

1. **Proxy Indicator**: Aadhaar updates are a proxy, not direct migration measurement
2. **Coverage Gaps**: Areas with low Aadhaar penetration may be underrepresented
3. **Temporal Lag**: Enrollment happens after migration, not simultaneously
4. **Data Quality**: Depends on UIDAI data accuracy and completeness

### 10.2 Methodological Limitations

1. **Direction Ambiguity**: Cannot definitively distinguish in-migration from out-migration
2. **Causation**: High index doesn't explain WHY migration occurs
3. **Short-term Forecasts**: Models work best for 30-90 day horizons
4. **Seasonality**: Agricultural cycles, festivals may cause false positives

### 10.3 Technical Constraints

1. **Model Accuracy**: Prophet/ARIMA require sufficient historical data (5+ points)
2. **Computational Cost**: Real-time forecasting for all districts is resource-intensive
3. **Static Weights**: Current formula uses fixed weights (2.0 for children, 1.0 for adults)
4. **Scalability**: SQLite may need upgrade for production-scale deployment

### 10.4 Ethical Considerations

1. **Privacy**: Aggregated data only; no individual identification
2. **Bias**: May reflect enrollment behavior, not true migration
3. **Misinterpretation**: High migration ≠ always positive economic indicator

---

## 11. Technical Specifications

### 11.1 System Requirements

**Server**:
- OS: Linux/Windows/macOS
- Python: 3.9 or higher
- RAM: Minimum 2 GB, Recommended 4 GB
- Storage: 500 MB for database, 1 GB for dependencies

**Client**:
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+)
- JavaScript enabled
- Internet connection for API calls

### 11.2 Dependencies

**Backend** (`requirements.txt`):
```
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
pandas==2.1.3
numpy==1.26.2
prophet==1.1.5
statsmodels==0.14.0
scikit-learn==1.3.2
python-multipart==0.0.6
```

**Frontend** (`package.json`):
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "plotly.js": "^2.27.0",
    "react-plotly.js": "^2.6.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0"
  }
}
```

### 11.3 Performance Benchmarks

| Operation | Average Response Time | Max Load |
|-----------|----------------------|----------|
| State Index Query | 50-100 ms | 1000 req/min |
| District Index Query | 30-70 ms | 1500 req/min |
| Trend Analysis | 100-200 ms | 500 req/min |
| Prophet Forecast | 2-5 seconds | 100 req/min |
| ARIMA Forecast | 5-10 seconds | 50 req/min |
| Ensemble Forecast | 7-15 seconds | 30 req/min |

### 11.4 Security

- **CORS**: Whitelisted origins only
- **Input Validation**: All parameters sanitized against SQL injection
- **Rate Limiting**: (Recommended for production) 100 requests/minute per IP
- **HTTPS**: (Recommended for production) SSL/TLS encryption
- **Authentication**: (Future) OAuth 2.0 for enterprise deployments

### 11.5 Deployment

#### Development
```bash
# Backend
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Frontend
cd adhaar-pulse-main
npm install
npm run dev
```

#### Production
```bash
# Backend
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# Frontend
npm run build
# Serve dist/ folder with Nginx/Apache
```

---

## 12. Future Enhancements

### 12.1 Planned Features

1. **Real-time Dashboard**: Live updates with WebSocket integration
2. **Heatmap Visualization**: Geographic visualization of migration patterns
3. **Alerts System**: Notifications for sudden migration spikes
4. **Comparative Analytics**: Year-over-year, state-vs-state comparisons
5. **Export Functionality**: Download reports as PDF/Excel

### 12.2 Model Improvements

1. **Deep Learning**: LSTM/GRU models for longer-term forecasts
2. **Causal Analysis**: Incorporate economic indicators (GDP, employment)
3. **Dynamic Weights**: Machine learning to optimize formula weights
4. **Spatial Models**: Account for neighboring district effects

### 12.3 Data Expansion

1. **Additional Sources**: Census data, voter roll changes, school enrollment
2. **Granular Pincodes**: Full pincode-level analysis (currently limited)
3. **Real-time Feeds**: Direct integration with UIDAI APIs

---

## 13. References & Citations

1. **Unique Identification Authority of India (UIDAI)**: https://uidai.gov.in
2. **Prophet Documentation**: https://facebook.github.io/prophet/
3. **ARIMA Theory**: Box, G. E. P., & Jenkins, G. M. (1976). Time Series Analysis: Forecasting and Control.
4. **FastAPI Framework**: https://fastapi.tiangolo.com
5. **React.js Documentation**: https://react.dev
6. **Census of India**: https://censusindia.gov.in

---

## 14. Contact & Support

**Project**: Aadhaar Pulse - Migration Index System  
**Version**: 1.0.0  
**Last Updated**: January 18, 2026  

**For Technical Support**:
- Email: support@aadhaar-pulse.gov.in (example)
- Documentation: https://github.com/aadhaar-pulse/docs

**For Data Inquiries**:
- UIDAI Official Website: https://uidai.gov.in
- Data Portal: https://data.gov.in

---

## Appendix A: Sample Queries

### A.1 Get Migration Index for Delhi
```bash
curl -X GET "http://127.0.0.1:8000/migration/state/Delhi?year=2025"
```

### A.2 Forecast Bangalore Urban for 60 Days
```bash
curl -X GET "http://127.0.0.1:8000/migration/forecast/Karnataka/Bangalore%20Urban?days=60&method=ensemble"
```

### A.3 Compare Top 3 Mumbai Districts
```bash
curl -X POST "http://127.0.0.1:8000/migration/compare" \
  -H "Content-Type: application/json" \
  -d '{
    "state": "Maharashtra",
    "districts": ["Mumbai", "Mumbai Suburban", "Thane"],
    "year": 2025
  }'
```

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| **Aadhaar** | 12-digit unique identity number issued by UIDAI to Indian residents |
| **Migration Index** | Quantitative measure of population movement activity |
| **Child Enrolment** | New Aadhaar registration for individuals aged 0-5 years |
| **Adult Update** | Modification of demographic/biometric data for 17+ age group |
| **Prophet** | Facebook's time-series forecasting algorithm |
| **ARIMA** | Auto-Regressive Integrated Moving Average statistical model |
| **Ensemble** | Combined prediction from multiple models |
| **Confidence Interval** | Range of plausible forecast values (95% probability) |
| **UIDAI** | Unique Identification Authority of India (Aadhaar issuing body) |

---

**END OF DOCUMENTATION**
