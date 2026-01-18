# 🚀 AadhaarPulse - Quick Start Guide

## ✅ Integration Complete!

Your ML forecasting backend has been integrated into the React website.

---

## 🏃 How to Run

### 1️⃣ Start Backend API (Terminal 1)
```powershell
cd "C:\Users\Dell\Desktop\New folder\Data hackthon\adhaar-pulse-main\backend"

# Activate venv (located in parent folder)
& "..\..\..venv\Scripts\Activate.ps1"

# Start server
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Wait for: `Application startup complete`

### 2️⃣ Start React Frontend (Terminal 2)
```powershell
cd "C:\Users\Dell\Desktop\New folder\Data hackthon\adhaar-pulse-main"
npm install  # First time only
npm run dev
```

Open browser: **http://localhost:5173**

---

## 🎯 Features Available

### In the Web UI:
1. **Dashboard** - Analytics overview
2. **Map View** - Geographic visualization
3. **Demand Analysis** - Service demand patterns
4. **🔮 Migration Forecast** ⭐ NEW!
   - Select state & district from dropdowns
   - Choose forecast period (7-180 days)
   - Pick ML method (Prophet/ARIMA/Ensemble)
   - View predictions with confidence intervals
   - See top 10 growing districts per state

### API Endpoints (http://localhost:8000/docs):
- `GET /migration/available-states` - List all states
- `GET /migration/districts/{state}` - Districts per state
- `GET /migration/forecast/{state}/{district}` - Generate forecast
- `GET /migration/forecast/top-growth/{state}` - Top growing districts
- All existing endpoints (state/district/pincode/trend)

---

## 🔧 Troubleshooting

### Backend won't start:
```powershell
cd backend
& "..\..\..venv\Scripts\Activate.ps1"
pip install -r requirements.txt
```

### Frontend shows API errors:
- ✅ Check backend is running on port 8000
- ✅ Check browser console for CORS errors
- ✅ Verify `API_BASE` in MigrationForecast.jsx = `http://localhost:8000`

### No data in dropdowns:
- ✅ Check database exists: `backend/aadhaar_pulse.db`
- ✅ Visit: http://localhost:8000/migration/available-states
- ✅ Check backend terminal for errors

### Import errors in backend:
- ✅ Make sure you're in `backend/` folder when running uvicorn
- ✅ All Python files import relatively (no absolute paths)

---

## 📊 Data Coverage

- **2,025,505** migration records
- **65+ states** (including name variations)
- **1000+ districts**
- Date range: 2025 data

---

## 🎨 Tech Stack

**Backend:**
- FastAPI (Python 3.13)
- Prophet & ARIMA (ML forecasting)
- SQLAlchemy + SQLite
- Pandas, NumPy, Scikit-learn

**Frontend:**
- React 19 + Vite
- React Router
- Leaflet (maps)
- Anime.js (animations)

---

## 📁 Project Structure

```
adhaar-pulse-main/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── forecasting.py       # ML models
│   ├── database.py          # DB connection
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── config.py            # Configuration
│   ├── aadhaar_pulse.db     # SQLite database
│   ├── .env                 # Environment variables
│   ├── requirements.txt     # Python dependencies
│   └── data/                # CSV datasets
│       ├── enrolment/
│       ├── demographic_update/
│       └── biometric_update/
├── src/
│   ├── pages/
│   │   ├── MigrationForecast.jsx  # NEW forecasting UI
│   │   ├── Dashboard.jsx
│   │   ├── Map.jsx
│   │   └── ...
│   ├── components/
│   │   ├── Header.jsx
│   │   └── Sidebar.jsx
│   └── App.jsx
├── package.json
└── vite.config.js
```

---

## 📝 Next Steps

1. ✅ Activate venv and start backend (port 8000)
2. ✅ Start frontend (port 5173)
3. 🎯 Click "🔮 Migration Forecast" in sidebar
4. 🚀 Select state → district → Generate forecast!

---

**Need help?**
- API docs: http://localhost:8000/docs
- React dev tools in browser
- Backend logs in Terminal 1
