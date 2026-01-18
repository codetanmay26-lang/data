# app/routers/aggregations.py - ENTERPRISE GRADE NATIONAL DASHBOARD SUPPORT
from fastapi import APIRouter, Query
from app.services.aggregations import (
    aggregate_national,
    aggregate_state, 
    aggregate_district
)

router = APIRouter(prefix="/aggregate", tags=["Aggregations"])

@router.get("/national")
def national_overview():
    """National Aadhaar service demand overview - All states aggregated"""
    return aggregate_national()

@router.get("/state")
def state_overview():
    """State-wise Aadhaar service distribution - For national map visualization"""
    return aggregate_state()

@router.get("/district")
def district_overview(
    state: str = Query(..., description="Exact state name as in dataset")
):
    """District-level breakdown for selected state"""
    return aggregate_district(state)
