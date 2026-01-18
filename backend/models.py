"""Database models for AadhaarPulse"""
from sqlalchemy import Column, Integer, String, Float, Date, Index
from database import Base

class MigrationIndex(Base):
    """Migration Index aggregated by district and date"""
    __tablename__ = "migration_index"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False, index=True)
    state = Column(String, nullable=False, index=True)
    district = Column(String, nullable=False, index=True)
    pincode = Column(String, nullable=True, index=True)
    
    # Raw counts
    child_enrolments = Column(Integer, default=0)  # age_0_5
    adult_updates = Column(Integer, default=0)     # demo_age_17_plus
    
    # Calculated index
    migration_index = Column(Float, nullable=True)
    
    # Metadata
    year = Column(Integer, nullable=False, index=True)
    month = Column(Integer, nullable=False)
    
    # Composite indexes for faster queries
    __table_args__ = (
        Index('idx_state_district_date', 'state', 'district', 'date'),
        Index('idx_pincode_date', 'pincode', 'date'),
        Index('idx_state_year', 'state', 'year'),
    )
    
    def __repr__(self):
        return f"<MigrationIndex(state={self.state}, district={self.district}, date={self.date}, index={self.migration_index})>"


class EnrolmentData(Base):
    """Raw enrolment data (optional, for audit trail)"""
    __tablename__ = "enrolment_data"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    state = Column(String, nullable=False)
    district = Column(String, nullable=False)
    pincode = Column(String, nullable=False)
    age_0_5 = Column(Integer, default=0)
    age_5_17 = Column(Integer, default=0)
    age_18_greater = Column(Integer, default=0)


class DemographicUpdateData(Base):
    """Raw demographic update data (optional, for audit trail)"""
    __tablename__ = "demographic_update_data"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    state = Column(String, nullable=False)
    district = Column(String, nullable=False)
    pincode = Column(String, nullable=False)
    demo_age_5_17 = Column(Integer, default=0)
    demo_age_17_plus = Column(Integer, default=0)
