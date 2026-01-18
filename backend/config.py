"""Configuration settings for AadhaarPulse"""
import os
from dotenv import load_dotenv

load_dotenv()

# Database
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./aadhaar_pulse.db")

# API
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", 8000))

# Data paths
ENROLMENT_DATA_DIR = "data/enrolment"
DEMOGRAPHIC_DATA_DIR = "data/demographic_update"
BIOMETRIC_DATA_DIR = "data/biometric_update"
