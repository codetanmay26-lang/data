from fastapi import APIRouter
from app.services.data_loader import load_csv_folder

router = APIRouter(prefix="/data", tags=["Data Inspection"])

@router.get("/columns/{dataset_name}")
def get_column_names(dataset_name: str):
    """
    Returns column names and basic info
    dataset_name:
      - enrolment
      - biometric_update
      - demographic_update
    """
    df = load_csv_folder(dataset_name)

    return {
        "dataset": dataset_name,
        "total_rows": len(df),
        "columns": list(df.columns)
    }

@router.get("/sample/{dataset_name}")
def get_sample_rows(dataset_name: str, limit: int = 5):
    """
    Returns sample rows to visually inspect data
    """
    df = load_csv_folder(dataset_name)

    return {
        "dataset": dataset_name,
        "sample_size": limit,
        "data": df.head(limit).to_dict(orient="records")
    }
