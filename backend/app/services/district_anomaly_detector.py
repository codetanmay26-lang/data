import difflib
import os
import pandas as pd
from typing import List, Dict

# -----------------------------
# Paths
# -----------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
CLEANED_DATA_DIR = os.path.join(BASE_DIR, "data", "cleaned")


# -----------------------------
# Helper: pairwise similarities
# -----------------------------

def _pairwise_similarities(names: List[str], cutoff: float) -> List[Dict]:
    """
    Compute near-duplicate pairs among a list of names using difflib.
    Operates on UNIQUE district names only (fast).
    """
    results = []
    n = len(names)

    for i in range(n):
        a = names[i]
        matches = difflib.get_close_matches(
            a,
            names[i + 1 :],
            n=5,
            cutoff=cutoff
        )

        for b in matches:
            score = difflib.SequenceMatcher(None, a, b).ratio()
            results.append({
                "district_a": a,
                "district_b": b,
                "similarity": round(score, 3)
            })

    return results


# -----------------------------
# Main detector
# -----------------------------

def detect_district_anomalies(
    state: str,
    dataset: str = "enrolment",
    similarity_cutoff: float = 0.9,
    min_count_ratio: float = 5.0
):
    """
    Detect potential near-duplicate district names within a state.

    - dataset: enrolment | biometric_update | demographic_update
    - similarity_cutoff: string similarity threshold
    - min_count_ratio: flags when counts differ significantly
    """

    # -----------------------------
    # Load CLEANED CSV (NOT folder)
    # -----------------------------

    cleaned_file = os.path.join(
        CLEANED_DATA_DIR,
        f"{dataset}_clean.csv"
    )

    if not os.path.exists(cleaned_file):
        raise FileNotFoundError(
            f"Cleaned file not found: {cleaned_file}. "
            f"Run data cleaning first."
        )

    df = pd.read_csv(cleaned_file)

    # -----------------------------
    # Scope to state
    # -----------------------------

    if "state" not in df.columns or "district" not in df.columns:
        return {
            "state": state,
            "dataset": dataset,
            "potential_duplicates": []
        }

    df = df[df["state"] == state]

    if df.empty:
        return {
            "state": state,
            "dataset": dataset,
            "potential_duplicates": []
        }

    # -----------------------------
    # Frequency per district
    # -----------------------------

    counts = df["district"].value_counts().to_dict()
    districts = sorted(counts.keys())

    # -----------------------------
    # Detect near-duplicates
    # -----------------------------

    pairs = _pairwise_similarities(districts, similarity_cutoff)

    enriched = []
    for p in pairs:
        a = p["district_a"]
        b = p["district_b"]

        ca = counts.get(a, 0)
        cb = counts.get(b, 0)

        ratio = max(ca, cb) / max(1, min(ca, cb))

        enriched.append({
            **p,
            "rows_a": ca,
            "rows_b": cb,
            "count_ratio": round(ratio, 2),
            "recommendation": "review" if ratio >= min_count_ratio else "check"
        })

    # -----------------------------
    # Final response
    # -----------------------------

    return {
        "state": state,
        "dataset": dataset,
        "similarity_cutoff": similarity_cutoff,
        "min_count_ratio": min_count_ratio,
        "potential_duplicates": enriched
    }
