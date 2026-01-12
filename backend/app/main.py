from fastapi import FastAPI
from app.routers import data_inspect
from app.routers import aggregations
app = FastAPI(
    title="Aadhaar Pulse API",
    description="UIDAI dataset inspection and analytics API",
    version="0.1.0"
)

app.include_router(data_inspect.router)

@app.get("/")
def root():
    return {"status": "Aadhaar Pulse backend running"}

 

app.include_router(aggregations.router)
