from fastapi import APIRouter, Query
from app.services.aggregations import (
    aggregate_national,
    aggregate_state,
    aggregate_district
)

router = APIRouter(prefix="/aggregate", tags=["Aggregations"])


@router.get("/national")
def national_overview():
    return aggregate_national()


@router.get("/state")
def state_overview():
    return aggregate_state()


@router.get("/district")
def district_overview(
    state: str = Query(..., description="Exact state name as in dataset")
):
    return aggregate_district(state)

