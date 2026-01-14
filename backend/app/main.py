from fastapi import FastAPI

from app.routers import data_inspect
from app.routers import aggregations
from app.routers import stations  # <-- stations router import

app = FastAPI(
    title="Aadhaar Pulse API",
    description="UIDAI dataset inspection and analytics API",
    version="0.1.0"
)

# Register routers
app.include_router(data_inspect.router)
app.include_router(aggregations.router)
app.include_router(stations.router)

@app.get("/")
def root():
    return {"status": "Aadhaar Pulse backend running"}
