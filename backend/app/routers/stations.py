from fastapi import APIRouter, Query
from app.services.aggregations import aggregate_district_with_station_estimate
from app.services.station_estimator import WEIGHTS

router = APIRouter(
    prefix="/estimate",
    tags=["Demand Estimation"]
)

@router.get("/stations/district")
def estimate_stations_by_district(
    state: str = Query(..., description="Exact state name as in dataset")
):
    return {
        "assumption": {
            "capacity": "1 station ≈ 25,000 weighted service units / year",
            "weights": WEIGHTS
        },
        "state": state,
        "data": aggregate_district_with_station_estimate(state)
    }
