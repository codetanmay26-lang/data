import os
import pandas as pd

BASE_DATA_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
    "data"
)

def load_csv_folder(folder_name: str) -> pd.DataFrame:
    """
    Reads all CSV files from a given data subfolder
    and concatenates them into a single DataFrame.
    """
    folder_path = os.path.join(BASE_DATA_PATH, folder_name)

    if not os.path.exists(folder_path):
        raise FileNotFoundError(f"Folder not found: {folder_name}")

    csv_files = [
        os.path.join(folder_path, f)
        for f in os.listdir(folder_path)
        if f.endswith(".csv")
    ]

    if not csv_files:
        raise ValueError(f"No CSV files found in {folder_name}")

    df_list = [pd.read_csv(file) for file in csv_files]
    combined_df = pd.concat(df_list, ignore_index=True)

    return combined_df


def load_clean_csv(dataset_name: str) -> pd.DataFrame:
    """
    Loads a cleaned CSV file from backend/data/cleaned/
    Example: enrolment_clean.csv
    """
    cleaned_path = os.path.join(
        BASE_DATA_PATH,
        "cleaned",
        f"{dataset_name}_clean.csv"
    )

    if not os.path.exists(cleaned_path):
        raise FileNotFoundError(
            f"Cleaned file not found: {cleaned_path}. "
            f"Run data cleaning first."
        )

    return pd.read_csv(cleaned_path)
