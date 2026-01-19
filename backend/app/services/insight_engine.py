"""
Insight Engine for AadhaarPulse
--------------------------------
Deterministic, explainable insight generation over aggregated Aadhaar datasets.

Constraints:
- No ML / No AI APIs
- Pure Python logic
- Low memory footprint (Render free tier safe)
- Auditable & policy-grade explanations
"""

from typing import Dict, List
from datetime import datetime


# -----------------------------
# Helper utilities
# -----------------------------

def _safe_div(numerator: float, denominator: float) -> float:
    """Division helper that avoids ZeroDivisionError."""
    return (numerator / denominator) if denominator else 0.0


def _round(val: float, digits: int = 2) -> float:
    """Consistent rounding for numeric outputs."""
    return round(val, digits)


def _calculate_state_service_load(state: dict) -> float:
    """
    Deterministic service load calculation.
    Mirrors logic used elsewhere in backend.
    """
    return (
        1.2 * state.get("age_0_5", 0)
        + 1.1 * state.get("age_5_17", 0)
        + 1.0 * state.get("age_18_greater", 0)
        + 0.8 * state.get("bio_age_5_17", 0)
        + 1.0 * state.get("bio_age_17_", 0)
        + 0.6 * state.get("demo_age_5_17", 0)
        + 0.7 * state.get("demo_age_17_", 0)
    )


def _bucket_by_month(records: List[Dict], date_key: str = "date") -> Dict[str, float]:
    """
    Groups service load by YYYY-MM buckets for time-aware analysis.
    """
    buckets = {}

    for r in records:
        if date_key not in r:
            continue

        try:
            dt = datetime.fromisoformat(str(r[date_key]))
        except Exception:
            continue

        key = f"{dt.year}-{dt.month:02d}"
        buckets[key] = buckets.get(key, 0) + _calculate_state_service_load(r)

    return buckets


# -----------------------------
# Main Insight Engine
# -----------------------------

def generate_national_insights(
    national_data: Dict,
    state_data: List[Dict]
) -> Dict:
    """
    Generates national-level analytical insights from aggregated Aadhaar datasets.
    """

    # -----------------------------
    # A. Service Composition
    # -----------------------------
    enrol_total = (
        national_data.get("enrolment", {}).get("age_0_5", 0)
        + national_data.get("enrolment", {}).get("age_5_17", 0)
        + national_data.get("enrolment", {}).get("age_18_greater", 0)
    )

    bio_total = (
        national_data.get("biometric_update", {}).get("bio_age_5_17", 0)
        + national_data.get("biometric_update", {}).get("bio_age_17_", 0)
    )

    demo_total = (
        national_data.get("demographic_update", {}).get("demo_age_5_17", 0)
        + national_data.get("demographic_update", {}).get("demo_age_17_", 0)
    )

    grand_total = enrol_total + bio_total + demo_total

    service_shares = {
        "Enrolment": _round(_safe_div(enrol_total, grand_total) * 100),
        "Biometric Update": _round(_safe_div(bio_total, grand_total) * 100),
        "Demographic Update": _round(_safe_div(demo_total, grand_total) * 100),
    }

    dominant_service = max(service_shares, key=service_shares.get)

    service_composition = {
        "dominant_service": dominant_service,
        "share_percent": service_shares[dominant_service],
        "commentary": (
            f"{dominant_service} accounts for {service_shares[dominant_service]}% "
            f"of national Aadhaar activity, indicating that current operational "
            f"demand is driven primarily by {dominant_service.lower()} workflows "
            f"rather than new enrolments."
        )
    }

    # -----------------------------
    # B. Demand Concentration
    # -----------------------------
    state_loads = [
        {
            "state": s.get("state"),
            "load": _calculate_state_service_load(s)
        }
        for s in state_data
    ]

    national_load = sum(s["load"] for s in state_loads)

    state_loads.sort(key=lambda x: x["load"], reverse=True)

    top_3 = state_loads[:3]
    top_3_share = _round(
        _safe_div(sum(s["load"] for s in top_3), national_load) * 100
    )

    concentration_analysis = {
        "top_3_states": [s["state"] for s in top_3],
        "top_3_share_percent": top_3_share,
        "risk_flag": "HIGH_CONCENTRATION" if top_3_share > 45 else "BALANCED",
        "commentary": (
            f"The top three states contribute {top_3_share}% of total national "
            f"service demand, indicating "
            f"{'regional concentration risk' if top_3_share > 45 else 'balanced demand distribution'}."
        )
    }

    # -----------------------------
    # C. State Activity Spread
    # -----------------------------
    avg_load = _safe_div(national_load, len(state_loads))
    active_states = [s for s in state_loads if s["load"] >= 0.5 * avg_load]

    active_ratio = _safe_div(len(active_states), len(state_loads))

    if active_ratio >= 0.7:
        spread_label = "Broad"
    elif active_ratio >= 0.4:
        spread_label = "Moderate"
    else:
        spread_label = "Narrow"

    state_spread = {
        "active_states": len(active_states),
        "total_states": len(state_loads),
        "spread_classification": spread_label,
        "commentary": (
            f"Aadhaar service demand shows a {spread_label.lower()} spread across states, "
            f"with {len(active_states)} states contributing materially to national activity."
        )
    }

    # -----------------------------
    # D. Capacity Planning Signal
    # -----------------------------
    service_load_index = _round(national_load)

    if service_load_index < 5e7:
        capacity_hint = "Stable"
    elif service_load_index < 1e8:
        capacity_hint = "Expansion Required"
    else:
        capacity_hint = "Urgent Scaling Needed"

    capacity_signal = {
        "national_service_load_index": service_load_index,
        "planning_signal": capacity_hint,
        "commentary": (
            f"Based on the current national service load index, "
            f"the system indicates '{capacity_hint}' for Aadhaar service infrastructure."
        )
    }

    # -----------------------------
    # E. Time-Aware Trend Insight
    # -----------------------------
    trend_insight = {
        "trend_type": "INSUFFICIENT_DATA",
        "trend_strength": "NA",
        "time_window": "NA",
        "commentary": "Insufficient temporal granularity to derive demand trends."
    }

    if state_data and "date" in state_data[0]:
        monthly = _bucket_by_month(state_data)
        months = sorted(monthly.keys())
        values = [monthly[m] for m in months]

        if len(values) >= 6:
            recent_avg = sum(values[-3:]) / 3
            past_avg = sum(values[-6:-3]) / 3
            delta_pct = _safe_div(recent_avg - past_avg, past_avg) * 100

            if delta_pct > 10:
                trend_type = "INCREASING"
                strength = "STRONG" if delta_pct > 20 else "MODERATE"
            elif delta_pct < -10:
                trend_type = "DECREASING"
                strength = "STRONG" if delta_pct < -20 else "MODERATE"
            else:
                trend_type = "STABLE"
                strength = "WEAK"

            trend_insight = {
                "trend_type": trend_type,
                "trend_strength": strength,
                "time_window": f"Last {len(months)} months",
                "commentary": (
                    f"Aadhaar service demand exhibits a {trend_type.lower()} trend "
                    f"over the recent period, with an approximate "
                    f"{abs(_round(delta_pct))}% quarter-over-quarter change."
                )
            }

    # -----------------------------
    # Risk Flags
    # -----------------------------
    risk_flags = []

    if top_3_share > 45:
        risk_flags.append("HIGH_REGIONAL_CONCENTRATION")

    if dominant_service == "Biometric Update" and service_shares[dominant_service] > 50:
        risk_flags.append("BIO_REVERIFICATION_SURGE")

    if capacity_hint != "Stable":
        risk_flags.append("CAPACITY_STRETCH_RISK")

    # -----------------------------
    # Methodology Notes
    # -----------------------------
    methodology_notes = {
        "analysis_type": "Deterministic rule-based analytics",
        "time_analysis": "Rolling quarterly comparison (no forecasting)",
        "capacity_basis": "Annualized service load vs fixed service capacity",
        "auditability": "Fully reproducible from aggregated datasets"
    }

    # -----------------------------
    # Summary
    # -----------------------------
    summary = {
        "national_activity_volume": _round(grand_total),
        "dominant_service": dominant_service,
        "top_state_concentration_percent": top_3_share,
        "capacity_signal": capacity_hint
    }

    return {
        "summary": summary,
        "service_composition": service_composition,
        "concentration_analysis": concentration_analysis,
        "state_spread": state_spread,
        "capacity_signal": capacity_signal,
        "trend_insight": trend_insight,
        "risk_flags": risk_flags,
        "methodology_notes": methodology_notes
    }
