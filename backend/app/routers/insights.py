from fastapi import APIRouter, HTTPException

from app.services.aggregations import (
    aggregate_national,
    aggregate_state
)
from app.services.insight_engine import generate_national_insights

router = APIRouter(
    prefix="/insights",
    tags=["Insights"]
)


@router.get("/national")
def get_national_insights():
    """
    Generate deterministic national-level insights from Aadhaar datasets.

    Uses:
    - /aggregate/national
    - /aggregate/state

    Returns:
    - Explainable, policy-grade insights (NO ML)
    """
    try:
        national_data = aggregate_national()
        state_data = aggregate_state()

        insights = generate_national_insights(
            national_data=national_data,
            state_data=state_data
        )

        return insights

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Insight generation failed: {str(e)}"
        )
