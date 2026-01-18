from fastapi import APIRouter
from app.services.data_cleaner import clean_dataset, load_logs

router = APIRouter(
    prefix="/data-cleaning",
    tags=["Data Cleaning"]
)

@router.post("/run/{dataset_name}")
def run_cleaning(dataset_name: str):
    """
    dataset_name:
    - enrolment
    - biometric_update
    - demographic_update
    """
    return clean_dataset(dataset_name)


@router.get("/logs")
def get_cleaning_logs():
    """
    Returns history of cleaning operations
    """
    return load_logs()
