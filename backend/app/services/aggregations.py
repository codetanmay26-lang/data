import pandas as pd
from app.services.data_loader import load_csv_folder


def aggregate_national():
    enrol = load_csv_folder("enrolment")
    bio = load_csv_folder("biometric_update")
    demo = load_csv_folder("demographic_update")

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
    enrol = load_csv_folder("enrolment")
    bio = load_csv_folder("biometric_update")
    demo = load_csv_folder("demographic_update")

    enrol_g = enrol.groupby("state").sum(numeric_only=True).reset_index()
    bio_g = bio.groupby("state").sum(numeric_only=True).reset_index()
    demo_g = demo.groupby("state").sum(numeric_only=True).reset_index()

    merged = enrol_g.merge(bio_g, on="state", how="outer") \
                     .merge(demo_g, on="state", how="outer") \
                     .fillna(0)

    return merged.to_dict(orient="records")


def aggregate_district(state_name: str):
    enrol = load_csv_folder("enrolment")
    bio = load_csv_folder("biometric_update")
    demo = load_csv_folder("demographic_update")

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
