🎯 Project Objective

Analyze Aadhaar enrolment, biometric update, and demographic update data

Aggregate data at:

National level

State level

District level

Identify high, medium, and low demand regions

Support data-backed planning of Aadhaar service delivery

⚠️ This project does not:

Assess UIDAI effectiveness

Recommend closing Aadhaar centres

It only highlights observed usage patterns.

🧠 Key Insights Enabled

Biometric updates (18+) act as a proxy for Aadhaar maintenance demand

Demographic updates + new enrolments indicate population movement signals

Aggregated data enables:

State-wise and district-wise comparisons

Demand ranking for better service prioritization

🏗️ Tech Stack
Backend

FastAPI

Pandas

Python

CSV-based UIDAI public datasets

Frontend

React

Vite

ESLint

Charting libraries (to be added)

📁 Project Structure
adhaar-pulse
├── backend
│   ├── app
│   │   ├── core            # App configuration
│   │   ├── main.py         # FastAPI entry point
│   │   ├── models          # Data schemas (future use)
│   │   ├── routers         # API routes
│   │   └── services        # Data loading & aggregation logic
│   │
│   ├── data                # Raw UIDAI datasets
│   │   ├── enrolment
│   │   ├── biometric_update
│   │   └── demographic_update
│   │
│   └── requirements.txt
│
├── src                     # React frontend
│   ├── App.jsx
│   ├── main.jsx
│   ├── pages
│   │   ├── home
│   │   ├── dashboard
│   │   │   ├── national
│   │   │   ├── state
│   │   │   └── map
│   │   ├── data-cleaning
│   │   └── insights
│   └── assets
│
├── public
├── package.json
├── vite.config.js
└── README.md

🚀 Backend Setup
1️⃣ Create & activate virtual environment
cd backend
python -m venv venv


Windows

venv\Scripts\activate


macOS / Linux

source venv/bin/activate

2️⃣ Install dependencies
pip install -r requirements.txt

3️⃣ Run FastAPI server
uvicorn app.main:app --reload


API will be available at:

http://127.0.0.1:8000

http://127.0.0.1:8000/docs
 (Swagger UI)

📊 Available API Endpoints
Aggregations

National overview

GET /aggregate/national


State-wise aggregation

GET /aggregate/state


District-wise aggregation

GET /aggregate/district?state=<State Name>


These endpoints return pre-aggregated data ready for charts and dashboards.

🎨 Frontend Setup
npm install
npm run dev


Frontend runs at:

http://localhost:5173

🔒 Data Privacy & Compliance

Uses only publicly available UIDAI datasets

No personal or sensitive Aadhaar data

All analysis is performed on aggregated data only

📌 Future Enhancements

PIN-code level aggregation

Time-series trend analysis

Demand ranking (high / medium / low)

Interactive maps & heatmaps

Data quality & cleaning transparency view

🏁 One-Line Summary

Aadhaar Pulse transforms UIDAI public datasets into actionable demand intelligence to support data-driven Aadhaar service planning.