import os
import json
import difflib
import pandas as pd
from datetime import datetime
from app.services.data_loader import load_csv_folder

# -----------------------------
# CONFIG
# -----------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
CLEAN_DATA_DIR = os.path.join(BASE_DIR, "data", "cleaned")
LOG_FILE = os.path.join(CLEAN_DATA_DIR, "cleaning_log.json")

os.makedirs(CLEAN_DATA_DIR, exist_ok=True)

# Canonical list (ground truth)
CANONICAL_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal",
    # UTs
    "Delhi", "Jammu And Kashmir", "Ladakh", "Puducherry", "Chandigarh",
    "Dadra And Nagar Haveli And Daman And Diu",
    "Andaman And Nicobar Islands", "Lakshadweep"
]

STATE_ALIASES = {
    "Pondicherry": "Puducherry",
    "Jammu & Kashmir": "Jammu And Kashmir",
    "Daman & Diu": "Daman And Diu",
    "Dadra & Nagar Haveli": "Dadra And Nagar Haveli",
    "Dadra And Nagar Haveli": "Dadra And Nagar Haveli And Daman And Diu",
    "Daman And Diu": "Dadra And Nagar Haveli And Daman And Diu"
}


# -----------------------------
# LOGGING HELPERS
# -----------------------------

def load_logs():
    if not os.path.exists(LOG_FILE):
        return []

    try:
        with open(LOG_FILE, "r") as f:
            content = f.read().strip()
            if not content:
                return []
            return json.loads(content)
    except json.JSONDecodeError:
        # corrupted or partial file
        return []



def save_log(entry):
    logs = load_logs()
    logs.append(entry)
    with open(LOG_FILE, "w") as f:
        json.dump(logs, f, indent=2)


# -----------------------------
# NORMALISATION LOGIC
# -----------------------------
def normalize_state_name(state, corrections, cutoff=0.9):
    if not isinstance(state, str):
        return None

    original = state.strip()

    # ❌ Remove numeric garbage
    if original.isdigit():
        corrections.append({
            "type": "invalid_state",
            "from": original,
            "to": None
        })
        return None

    cleaned = original.title()

    # Alias resolution first
    if cleaned in STATE_ALIASES:
        corrections.append({
            "type": "state_alias",
            "from": cleaned,
            "to": STATE_ALIASES[cleaned]
        })
        cleaned = STATE_ALIASES[cleaned]

    # Fuzzy match for typos
    match = difflib.get_close_matches(
        cleaned,
        CANONICAL_STATES,
        n=1,
        cutoff=cutoff
    )

    if match and match[0] != cleaned:
        corrections.append({
            "type": "state_fuzzy",
            "from": original,
            "to": match[0]
        })
        return match[0]

    return cleaned



def clean_common(df, corrections):
    df = df.copy()

    # Column name normalisation
    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
    )

    # State cleaning (alias + fuzzy)
    if "state" in df.columns:
        df["state"] = df["state"].astype(str).apply(
            lambda x: normalize_state_name(x, corrections)
        )

        # 🔥 Drop invalid / garbage states
        df = df.dropna(subset=["state"])

    # District cleanup
    if "district" in df.columns:
        df["district"] = (
            df["district"]
            .astype(str)
            .str.strip()
            .str.title()
        )

    # Pincode cleanup
    if "pincode" in df.columns:
        df["pincode"] = (
            df["pincode"]
            .astype(str)
            .str.replace(".0", "", regex=False)
            .str.zfill(6)
        )

    return df



# -----------------------------
# MAIN CLEAN FUNCTION
# -----------------------------

def clean_dataset(dataset_name: str):
    corrections = []

    df_raw = load_csv_folder(dataset_name)
    df_clean = clean_common(df_raw, corrections)

    output_file = os.path.join(
        CLEAN_DATA_DIR,
        f"{dataset_name}_clean.csv"
    )
    df_clean.to_csv(output_file, index=False)

    # Save log entry
    log_entry = {
        "dataset": dataset_name,
        "timestamp": datetime.utcnow().isoformat(),
        "rows_processed": len(df_clean),
        "corrections_count": len(corrections),
        "corrections_sample": corrections[:100]

    }
    save_log(log_entry)

    return {
        "dataset": dataset_name,
        "rows": len(df_clean),
        "output_file": output_file,
        "corrections_count": len(corrections)
    }
