from fastapi import APIRouter, Query
from app.services.district_anomaly_detector import detect_district_anomalies

router = APIRouter(
    prefix="/data-cleaning",
    tags=["Data Cleaning"]
)

@router.get("/district-anomalies")
def district_anomalies(
    state: str = Query(..., description="Exact state name"),
    dataset: str = Query("enrolment", description="enrolment | biometric_update | demographic_update"),
    similarity_cutoff: float = Query(0.9, ge=0.8, le=1.0),
    min_count_ratio: float = Query(5.0, ge=1.0)
):
    """
    Report potential near-duplicate district names within a state.
    Does NOT modify data.
    """
    return detect_district_anomalies(
        state=state,
        dataset=dataset,
        similarity_cutoff=similarity_cutoff,
        min_count_ratio=min_count_ratio
    )
