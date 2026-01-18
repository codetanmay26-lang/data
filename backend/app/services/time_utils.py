import pandas as pd

def get_time_span_days(df: pd.DataFrame) -> int:
    """
    Returns number of days covered by the dataframe.
    """
    df = df.copy()
    df["date"] = pd.to_datetime(df["date"], errors="coerce")

    min_date = df["date"].min()
    max_date = df["date"].max()

    if pd.isna(min_date) or pd.isna(max_date):
        return 0

    return (max_date - min_date).days + 1
