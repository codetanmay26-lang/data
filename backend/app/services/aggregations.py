import math
import pandas as pd
from app.services.data_loader import load_clean_csv
from app.services.time_utils import get_time_span_days
from app.services.station_estimator import (
    calculate_service_load,
    estimate_stations,
    ANNUAL_SERVICE_CAPACITY
)

# ------------------------
# BASIC AGGREGATIONS
# ------------------------

def aggregate_national():
    enrol = load_clean_csv("enrolment")
    bio = load_clean_csv("biometric_update")
    demo = load_clean_csv("demographic_update")

    return {
        "enrolment": {
            "age_0_5": int(enrol["age_0_5"].sum()),
            "age_5_17": int(enrol["age_5_17"].sum()),
            "age_18_greater": int(enrol["age_18_greater"].sum())
        },
        "biometric_update": {
            "bio_age_5_17": int(bio["bio_age_5_17"].sum()),
            "bio_age_17_": int(bio["bio_age_17_"].sum())
        },
        "demographic_update": {
            "demo_age_5_17": int(demo["demo_age_5_17"].sum()),
            "demo_age_17_": int(demo["demo_age_17_"].sum())
        }
    }


def aggregate_state():
    enrol = load_clean_csv("enrolment")
    bio = load_clean_csv("biometric_update")
    demo = load_clean_csv("demographic_update")

    enrol_g = enrol.groupby("state").sum(numeric_only=True).reset_index()
    bio_g = bio.groupby("state").sum(numeric_only=True).reset_index()
    demo_g = demo.groupby("state").sum(numeric_only=True).reset_index()

    merged = (
        enrol_g
        .merge(bio_g, on="state", how="outer")
        .merge(demo_g, on="state", how="outer")
        .fillna(0)
    )

    return merged.to_dict(orient="records")


def aggregate_district(state_name: str):
    enrol = load_clean_csv("enrolment")
    bio = load_clean_csv("biometric_update")
    demo = load_clean_csv("demographic_update")

    enrol = enrol[enrol["state"] == state_name].drop(columns=["pincode"])
    bio = bio[bio["state"] == state_name].drop(columns=["pincode"])
    demo = demo[demo["state"] == state_name].drop(columns=["pincode"])

    enrol_g = enrol.groupby("district").sum(numeric_only=True).reset_index()
    bio_g = bio.groupby("district").sum(numeric_only=True).reset_index()
    demo_g = demo.groupby("district").sum(numeric_only=True).reset_index()

    merged = (
        enrol_g
        .merge(bio_g, on="district", how="outer")
        .merge(demo_g, on="district", how="outer")
        .fillna(0)
    )

    return merged.to_dict(orient="records")

# ------------------------
# TIME UTILS
# ------------------------

def get_common_time_span_days(enrol, bio, demo) -> int:
    enrol_days = get_time_span_days(enrol)
    bio_days = get_time_span_days(bio)
    demo_days = get_time_span_days(demo)

    valid_days = [d for d in [enrol_days, bio_days, demo_days] if d > 0]
    return min(valid_days) if valid_days else 0

# ------------------------
# DISTRICT + STATION ESTIMATE (ANNUALISED)
# ------------------------

def aggregate_district_with_station_estimate(state_name: str):
    enrol = load_clean_csv("enrolment")
    bio = load_clean_csv("biometric_update")
    demo = load_clean_csv("demographic_update")

    enrol = enrol[enrol["state"] == state_name]
    bio = bio[bio["state"] == state_name]
    demo = demo[demo["state"] == state_name]

    results = []

    districts = set(enrol["district"]).union(
        bio["district"]
    ).union(
        demo["district"]
    )

    for district in districts:
        enrol_d = enrol[enrol["district"] == district].drop(columns=["pincode"])
        bio_d = bio[bio["district"] == district].drop(columns=["pincode"])
        demo_d = demo[demo["district"] == district].drop(columns=["pincode"])

        days = get_common_time_span_days(enrol_d, bio_d, demo_d)
        annual_factor = 365 / days if days > 0 else 1

        enrol_g = enrol_d.sum(numeric_only=True)
        bio_g = bio_d.sum(numeric_only=True)
        demo_g = demo_d.sum(numeric_only=True)

        row = {
            "district": district,
            **enrol_g.to_dict(),
            **bio_g.to_dict(),
            **demo_g.to_dict()
        }

        service_load_obs = calculate_service_load(row)
        service_load_ann = service_load_obs * annual_factor

        stations = math.ceil(
            service_load_ann / ANNUAL_SERVICE_CAPACITY
        )

        row.update({
            "time_window_days": days,
            "annualisation_factor": round(annual_factor, 2),
            "service_load_observed": service_load_obs,
            "service_load_annualised": service_load_ann,
            "estimated_stations_needed": stations
        })

        results.append(row)

    return results
