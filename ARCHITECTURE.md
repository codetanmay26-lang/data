# Aadhaar Pulse – Architecture

## Overview
Aadhaar Pulse is a two-tier application:
- FastAPI backend for data processing & aggregation
- React frontend for visualization

## Backend Architecture
- Raw UIDAI CSV datasets are stored in backend/data
- Data is processed using service modules
- Aggregated results are exposed via REST APIs

Flow:
CSV → Data Loader → Aggregation Service → API → Frontend

## Frontend Architecture
- Page-based React structure
- Each page consumes pre-aggregated APIs
- No direct data processing on frontend

## Design Principles
- Separation of concerns
- No mutation of raw UIDAI data
- Aggregation-first, visualization-second
