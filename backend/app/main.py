from fastapi import FastAPI

from app.routers import data_inspect
from app.routers import aggregations
from app.routers import stations  # <-- stations router import
from fastapi.middleware.cors import CORSMiddleware
from app.routers import data_cleaning
from app.routers import district_anomalies
 
app = FastAPI(
    title="Aadhaar Pulse API",
    description="UIDAI dataset inspection and analytics API",
    version="0.1.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(data_inspect.router)
app.include_router(aggregations.router)
app.include_router(stations.router)
app.include_router(data_cleaning.router)
app.include_router(district_anomalies.router)

@app.get("/")
def root():
    return {"status": "Aadhaar Pulse backend running"}
