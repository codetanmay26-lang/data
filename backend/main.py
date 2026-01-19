"""FastAPI application with migration index endpoints"""
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, desc
from typing import List, Optional
from datetime import datetime, date

# Auto-combine database chunks on startup
from combine_chunks import combine_chunks
combine_chunks()

from database import get_db, init_db
from models import MigrationIndex
from schemas import (
    MigrationIndexResponse, 
    StateSummaryResponse, 
    DistrictSummaryResponse,
    PincodeSummaryResponse,
    TrendResponse,
    TrendDataPoint
)
from forecasting import MigrationForecaster
from app.routers import data_inspect, aggregations, stations, data_cleaning, district_anomalies,insights
import config

# Initialize FastAPI app
app = FastAPI(
    title="AadhaarPulse API",
    description="Real-time migration indicators from Aadhaar enrolment and update data",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount teammate dashboards/services so everything is served from the same app
app.include_router(data_inspect.router)
app.include_router(aggregations.router)
app.include_router(stations.router)
app.include_router(data_cleaning.router)
app.include_router(district_anomalies.router)
app.include_router(insights.router)
# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()
    print("✅ Database initialized")


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "name": "AadhaarPulse API",
        "version": "1.0.0",
        "description": "Migration Index API based on Aadhaar data",
        "endpoints": {
            "state": "/migration/state/{state}",
            "district": "/migration/district/{state}/{district}",
            "pincode": "/migration/pincode/{pincode}",
            "trend": "/migration/trend/{state}/{district}",
            "forecast": "/migration/forecast/{state}/{district}",
            "top_growth": "/migration/forecast/top-growth/{state}",
            "available_states": "/migration/available-states",
            "districts_for_state": "/migration/districts/{state}",
            "aggregate_national": "/aggregate/national",
            "aggregate_state": "/aggregate/state",
            "aggregate_district": "/aggregate/district",
            "station_estimate": "/estimate/stations/district",
            "data_cleaning": "/data-cleaning/run/{dataset}",
            "data_cleaning_logs": "/data-cleaning/logs",
            "district_anomalies": "/data-cleaning/district-anomalies"
        }
    }


@app.get("/migration/available-states")
async def get_available_states(db: Session = Depends(get_db)):
    """Get list of all available states"""
    forecaster = MigrationForecaster(db)
    states = forecaster.get_available_states()
    return {
        "total_states": len(states),
        "states": states
    }


@app.get("/migration/districts/{state}")
async def get_districts_for_state(state: str, db: Session = Depends(get_db)):
    """Get list of all districts for a state"""
    forecaster = MigrationForecaster(db)
    districts = forecaster.get_districts_for_state(state)
    
    if not districts:
        raise HTTPException(
            status_code=404,
            detail=f"No districts found for state: {state}"
        )
    
    return {
        "state": state,
        "total_districts": len(districts),
        "districts": districts
    }


@app.get("/migration/state/{state}", response_model=StateSummaryResponse)
async def get_state_migration(
    state: str,
    year: Optional[int] = Query(None, description="Year to filter by (default: latest)"),
    db: Session = Depends(get_db)
):
    """
    Get migration index for a state
    
    - **state**: State name
    - **year**: Optional year filter (defaults to latest available year)
    """
    # If no year specified, get the latest year
    if year is None:
        latest = db.query(func.max(MigrationIndex.year)).filter(
            MigrationIndex.state == state
        ).scalar()
        if not latest:
            raise HTTPException(status_code=404, detail=f"No data found for state: {state}")
        year = latest
    
    # Query data for the state
    results = db.query(MigrationIndex).filter(
        and_(
            MigrationIndex.state == state,
            MigrationIndex.year == year,
            MigrationIndex.pincode.is_(None)  # District-level only
        )
    ).all()
    
    if not results:
        raise HTTPException(
            status_code=404, 
            detail=f"No data found for state: {state} in year {year}"
        )
    
    # Aggregate metrics
    total_child = sum(r.child_enrolments for r in results)
    total_adult = sum(r.adult_updates for r in results)
    
    # Calculate weighted average migration index
    valid_indices = [(r.migration_index, r.child_enrolments) for r in results if r.migration_index is not None]
    if valid_indices:
        avg_index = sum(idx * weight for idx, weight in valid_indices) / sum(weight for _, weight in valid_indices)
    else:
        avg_index = None
    
    # Determine status
    status = interpret_index(avg_index)
    
    # Get top 5 districts by migration index
    top_districts = sorted(
        [{"district": r.district, "migration_index": r.migration_index} 
         for r in results if r.migration_index is not None],
        key=lambda x: x["migration_index"],
        reverse=True
    )[:5]
    
    return StateSummaryResponse(
        state=state,
        year=year,
        total_child_enrolments=total_child,
        total_adult_updates=total_adult,
        average_migration_index=avg_index,
        status=status,
        top_districts=top_districts
    )


@app.get("/migration/district/{state}/{district}", response_model=DistrictSummaryResponse)
async def get_district_migration(
    state: str,
    district: str,
    year: Optional[int] = Query(None, description="Year to filter by (default: latest)"),
    db: Session = Depends(get_db)
):
    """
    Get migration index for a specific district
    
    - **state**: State name
    - **district**: District name
    - **year**: Optional year filter (defaults to latest available year)
    """
    # If no year specified, get the latest year
    if year is None:
        latest = db.query(func.max(MigrationIndex.year)).filter(
            and_(
                MigrationIndex.state == state,
                MigrationIndex.district == district
            )
        ).scalar()
        if not latest:
            raise HTTPException(
                status_code=404, 
                detail=f"No data found for {district}, {state}"
            )
        year = latest
    
    # Query data for the district
    results = db.query(MigrationIndex).filter(
        and_(
            MigrationIndex.state == state,
            MigrationIndex.district == district,
            MigrationIndex.year == year,
            MigrationIndex.pincode.is_(None)  # District-level only
        )
    ).all()
    
    if not results:
        raise HTTPException(
            status_code=404,
            detail=f"No data found for {district}, {state} in year {year}"
        )
    
    # Aggregate metrics
    total_child = sum(r.child_enrolments for r in results)
    total_adult = sum(r.adult_updates for r in results)
    
    # Calculate average migration index
    valid_indices = [r.migration_index for r in results if r.migration_index is not None]
    avg_index = sum(valid_indices) / len(valid_indices) if valid_indices else None
    
    status = interpret_index(avg_index)
    
    return DistrictSummaryResponse(
        state=state,
        district=district,
        year=year,
        total_child_enrolments=total_child,
        total_adult_updates=total_adult,
        average_migration_index=avg_index,
        status=status
    )


@app.get("/migration/pincode/{pincode}", response_model=PincodeSummaryResponse)
async def get_pincode_migration(
    pincode: str,
    year: Optional[int] = Query(None, description="Year to filter by (default: latest)"),
    db: Session = Depends(get_db)
):
    """
    Get migration index for a specific pincode
    
    - **pincode**: PIN code
    - **year**: Optional year filter (defaults to latest available year)
    """
    # If no year specified, get the latest year
    if year is None:
        latest = db.query(func.max(MigrationIndex.year)).filter(
            MigrationIndex.pincode == pincode
        ).scalar()
        if not latest:
            raise HTTPException(status_code=404, detail=f"No data found for pincode: {pincode}")
        year = latest
    
    # Query data for the pincode
    results = db.query(MigrationIndex).filter(
        and_(
            MigrationIndex.pincode == pincode,
            MigrationIndex.year == year
        )
    ).all()
    
    if not results:
        raise HTTPException(
            status_code=404,
            detail=f"No data found for pincode: {pincode} in year {year}"
        )
    
    # Aggregate metrics
    total_child = sum(r.child_enrolments for r in results)
    total_adult = sum(r.adult_updates for r in results)
    
    valid_indices = [r.migration_index for r in results if r.migration_index is not None]
    avg_index = sum(valid_indices) / len(valid_indices) if valid_indices else None
    
    status = interpret_index(avg_index)
    
    # Get state and district from first result
    first_result = results[0]
    
    return PincodeSummaryResponse(
        state=first_result.state,
        district=first_result.district,
        pincode=pincode,
        year=year,
        total_child_enrolments=total_child,
        total_adult_updates=total_adult,
        average_migration_index=avg_index,
        status=status
    )


@app.get("/migration/trend/{state}/{district}", response_model=TrendResponse)
async def get_migration_trend(
    state: str,
    district: str,
    start_date: Optional[str] = Query(None, description="Start date (DD-MM-YYYY)"),
    end_date: Optional[str] = Query(None, description="End date (DD-MM-YYYY)"),
    db: Session = Depends(get_db)
):
    """
    Get migration index trend over time for a district
    
    - **state**: State name
    - **district**: District name
    - **start_date**: Optional start date (format: DD-MM-YYYY)
    - **end_date**: Optional end date (format: DD-MM-YYYY)
    """
    # Build query
    query = db.query(MigrationIndex).filter(
        and_(
            MigrationIndex.state == state,
            MigrationIndex.district == district,
            MigrationIndex.pincode.is_(None)
        )
    )
    
    # Apply date filters if provided
    if start_date:
        start = datetime.strptime(start_date, "%d-%m-%Y").date()
        query = query.filter(MigrationIndex.date >= start)
    
    if end_date:
        end = datetime.strptime(end_date, "%d-%m-%Y").date()
        query = query.filter(MigrationIndex.date <= end)
    
    # Order by date
    results = query.order_by(MigrationIndex.date).all()
    
    if not results:
        raise HTTPException(
            status_code=404,
            detail=f"No data found for {district}, {state}"
        )
    
    # Prepare data points
    data_points = [
        TrendDataPoint(
            date=r.date,
            migration_index=r.migration_index,
            child_enrolments=r.child_enrolments,
            adult_updates=r.adult_updates
        )
        for r in results
    ]
    
    # Calculate trend
    valid_indices = [r.migration_index for r in results if r.migration_index is not None]
    if len(valid_indices) >= 2:
        # Simple linear trend: compare first half vs second half
        mid = len(valid_indices) // 2
        first_half_avg = sum(valid_indices[:mid]) / mid
        second_half_avg = sum(valid_indices[mid:]) / (len(valid_indices) - mid)
        
        if second_half_avg > first_half_avg * 1.1:
            trend = "Rising"
        elif second_half_avg < first_half_avg * 0.9:
            trend = "Falling"
        else:
            trend = "Stable"
    else:
        trend = "Insufficient Data"
    
    avg_index = sum(valid_indices) / len(valid_indices) if valid_indices else None
    
    return TrendResponse(
        state=state,
        district=district,
        start_date=results[0].date,
        end_date=results[-1].date,
        data_points=data_points,
        trend=trend,
        average_index=avg_index
    )


@app.get("/migration/raw", response_model=List[MigrationIndexResponse])
async def get_raw_migration_data(
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    limit: int = Query(100, le=1000, description="Max records to return"),
    db: Session = Depends(get_db)
):
    """
    Get raw migration index records (for debugging/exploration)
    
    - **state**: Optional state filter
    - **district**: Optional district filter
    - **limit**: Maximum records to return (max 1000)
    """
    query = db.query(MigrationIndex)
    
    if state:
        query = query.filter(MigrationIndex.state == state)
    if district:
        query = query.filter(MigrationIndex.district == district)
    
    results = query.order_by(desc(MigrationIndex.date)).limit(limit).all()
    
    return [
        MigrationIndexResponse(
            state=r.state,
            district=r.district,
            pincode=r.pincode,
            date=r.date,
            year=r.year,
            month=r.month,
            child_enrolments=r.child_enrolments,
            adult_updates=r.adult_updates,
            migration_index=r.migration_index,
            status=interpret_index(r.migration_index)
        )
        for r in results
    ]


def interpret_index(index_value):
    """Interpret migration index value"""
    if index_value is None:
        return "No Data"
    elif index_value < 1.0:
        return "Low Migration"
    elif index_value < 2.0:
        return "Moderate Migration"
    elif index_value < 3.0:
        return "High Migration"
    else:
        return "Very High Migration"


@app.get("/migration/forecast/{state}/{district}")
async def forecast_migration(
    state: str,
    district: str,
    days: int = Query(30, ge=7, le=180, description="Number of days to forecast (7-180)"),
    method: str = Query("prophet", description="Forecasting method: 'prophet', 'arima', or 'ensemble'"),
    db: Session = Depends(get_db)
):
    """
    🔮 Forecast future migration index for a district using ML models
    
    - **state**: State name
    - **district**: District name
    - **days**: Number of days to forecast (default: 30, max: 180)
    - **method**: Forecasting method - 'prophet' (recommended), 'arima', or 'ensemble'
    
    **Returns:**
    - Historical trend analysis
    - Future predictions with confidence intervals
    - Migration pressure interpretation
    - Policy recommendations
    
    **Example:**
    ```
    GET /migration/forecast/Karnataka/Bengaluru%20Urban?days=60&method=prophet
    ```
    """
    if method not in ['prophet', 'arima', 'ensemble']:
        raise HTTPException(
            status_code=400, 
            detail="Invalid method. Choose 'prophet', 'arima', or 'ensemble'"
        )
    
    # Create forecaster
    forecaster = MigrationForecaster(db)
    
    # Generate forecast
    result = forecaster.ensemble_forecast(state, district, periods=days, method=method)
    
    if 'error' in result:
        raise HTTPException(status_code=404, detail=result['message'])
    
    return result


@app.get("/migration/forecast/top-growth/{state}")
async def forecast_top_growth(
    state: str,
    top_n: int = Query(10, ge=1, le=20, description="Number of top districts to return"),
    db: Session = Depends(get_db)
):
    """
    🚀 Get top districts predicted to have highest migration growth
    
    - **state**: State name
    - **top_n**: Number of top districts to return (default: 10, max: 20)
    
    **Returns:**
    - List of districts ranked by predicted migration pressure
    - Average predicted migration index for next 30 days
    - Status classification
    
    **Use Case:**
    Identify which cities in a state will experience highest population growth,
    helping prioritize infrastructure and service expansion.
    
    **Example:**
    ```
    GET /migration/forecast/top-growth/Karnataka?top_n=5
    ```
    """
    forecaster = MigrationForecaster(db)
    
    try:
        predictions = forecaster.get_top_growth_predictions(state, top_n)
        
        if not predictions:
            raise HTTPException(
                status_code=404,
                detail=f"No forecast data available for state: {state}"
            )
        
        return {
            "state": state,
            "forecast_period": "30 days",
            "top_districts": predictions,
            "summary": f"Top {len(predictions)} districts by predicted migration pressure"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=config.API_HOST, port=config.API_PORT)
