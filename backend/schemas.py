"""Pydantic schemas for API request/response models"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class MigrationIndexResponse(BaseModel):
    """Response model for migration index queries"""
    state: str
    district: str
    pincode: Optional[str] = None
    date: date
    year: int
    month: int
    child_enrolments: int
    adult_updates: int
    migration_index: Optional[float]
    status: str
    
    class Config:
        from_attributes = True


class StateSummaryResponse(BaseModel):
    """Aggregated response for state-level queries"""
    state: str
    year: int
    total_child_enrolments: int
    total_adult_updates: int
    average_migration_index: Optional[float]
    status: str
    top_districts: List[dict]


class DistrictSummaryResponse(BaseModel):
    """Aggregated response for district-level queries"""
    state: str
    district: str
    year: int
    total_child_enrolments: int
    total_adult_updates: int
    average_migration_index: Optional[float]
    status: str


class PincodeSummaryResponse(BaseModel):
    """Response for pincode-level queries"""
    state: str
    district: str
    pincode: str
    year: int
    total_child_enrolments: int
    total_adult_updates: int
    average_migration_index: Optional[float]
    status: str


class TrendDataPoint(BaseModel):
    """Single data point in trend analysis"""
    date: date
    migration_index: Optional[float]
    child_enrolments: int
    adult_updates: int


class TrendResponse(BaseModel):
    """Response for trend analysis"""
    state: str
    district: str
    start_date: date
    end_date: date
    data_points: List[TrendDataPoint]
    trend: str  # Rising, Falling, Stable
    average_index: Optional[float]
