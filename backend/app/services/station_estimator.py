import math

ANNUAL_SERVICE_CAPACITY = 25000

WEIGHTS = {
    "age_0_5": 1.2,
    "age_5_17": 1.1,
    "age_18_greater": 1.0,
    "bio_age_5_17": 0.8,
    "bio_age_17_": 1.0,
    "demo_age_5_17": 0.6,
    "demo_age_17_": 0.7,
}

def calculate_service_load(row: dict) -> float:
    load = 0
    for col, weight in WEIGHTS.items():
        load += row.get(col, 0) * weight
    return load


def estimate_stations(service_load: float) -> int:
    if service_load <= 0:
        return 0
    return math.ceil(service_load / ANNUAL_SERVICE_CAPACITY)
