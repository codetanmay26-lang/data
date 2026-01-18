# Integration Instructions for Aadhaar Pulse + Migration System

**Date:** January 19, 2026  
**From:** Tanmay  
**Repository:** https://github.com/codetanmay26-lang/data.git

---

## 📋 Overview

This document contains step-by-step instructions to merge the **Migration Index System** into the existing Aadhaar Pulse project. The integration adds:

- ✅ Migration Index Analysis page with comprehensive metrics
- ✅ Migration Forecast page with Prophet-based predictions
- ✅ 30+ pages of professional technical documentation
- ✅ All your existing UI improvements and API enhancements preserved

---

## 🚀 Step-by-Step Integration

### Step 1: Add Migration Repository as Remote

Open terminal in your `adhaar-pulse` directory and run:

```bash
git remote add migration https://github.com/codetanmay26-lang/data.git
git fetch migration
```

**What this does:** Adds Tanmay's repository as a remote source without affecting your existing code.

---

### Step 2: Pull and Merge Changes

```bash
git pull migration main --allow-unrelated-histories
```

**Expected outcome:** Git will merge the migration system with your codebase.

**If conflicts appear:**
1. Open conflicted files (likely `src/App.jsx` or `src/components/Sidebar.jsx`)
2. Keep both sets of changes (your UI + migration routes)
3. Run:
   ```bash
   git add .
   git commit -m "Merged migration system"
   ```

---

### Step 3: Push to Your Repository

```bash
git push origin main
```

**What this does:** Updates your GitHub repository with the complete integrated system.

---

### Step 4: Add Database File (Separate Transfer)

⚠️ **Important:** The database file is too large for GitHub (502 MB).

**Required file:** `backend/aadhaar_pulse.db`

**How to get it:**
- Tanmay will share via Google Drive / WeTransfer / Dropbox
- Download and place in `backend/` folder

---

### Step 5: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
```

**New packages added:**
- `lucide-react` (frontend icons)
- `sqlalchemy`, `prophet`, `statsmodels` (backend forecasting)

---

### Step 6: Start the Application

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Server will run on: http://localhost:5173

**Terminal 2 - Backend:**
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
API server will run on: http://localhost:8000

---

## 🔧 Troubleshooting

### Issue: "Module not found: lucide-react"
**Solution:**
```bash
npm install lucide-react
```

### Issue: "No module named 'sqlalchemy'"
**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

### Issue: Database connection error
**Solution:** 
- Ensure `backend/aadhaar_pulse.db` file is present
- Check file size is approximately 502 MB

### Issue: Port already in use
**Solution:**
```bash
# For frontend (if 5173 is busy)
npm run dev -- --port 5174

# For backend (if 8000 is busy)
uvicorn main:app --port 8001 --reload
```

---

## 📁 File Structure After Integration

```
adhaar-pulse/
├── src/
│   ├── App.jsx                      # Updated with migration routes
│   ├── components/
│   │   └── Sidebar.jsx              # Updated with migration nav items
│   └── pages/
│       ├── Home.jsx                 # Your work (preserved)
│       ├── Dashboard.jsx            # Your work (preserved)
│       ├── Map.jsx                  # Your work (preserved)
│       ├── DemandAnalysis.jsx       # Your work (preserved)
│       ├── MigrationAnalysis.jsx    # NEW - Migration Index
│       ├── MigrationForecast.jsx    # NEW - Forecasting
│       └── data-cleaning/
│           └── DataCleaning.jsx     # Your work (preserved)
├── backend/
│   ├── aadhaar_pulse.db            # Add this separately (502 MB)
│   ├── main.py
│   ├── requirements.txt             # Updated with new packages
│   └── app/
│       ├── routers/
│       │   ├── stations.py
│       │   ├── aggregations.py     # Your improvements (preserved)
│       │   └── ...
│       └── services/
│           ├── data_loader.py      # Your improvements (preserved)
│           ├── aggregations.py     # Your improvements (preserved)
│           └── ...
└── MIGRATION_INDEX_DOCUMENTATION.md # NEW - 30+ pages
```

---

## 🎯 Summary

**What's Preserved:**
- ✅ All your UI components and styling
- ✅ Your API improvements in `aggregations.py` and `data_loader.py`
- ✅ Your commit history
- ✅ All your data files and database structure

**What's Added:**
- ✅ Migration Index analysis system
- ✅ Forecasting capabilities with Prophet
- ✅ Professional technical documentation
- ✅ 2 new navigation pages

**Result:**
A complete, integrated system ready for hackathon presentation with both our contributions working seamlessly together!

---

## 📞 Contact

If you encounter any issues during integration:
- Check the troubleshooting section above
- Review error messages carefully
- Ensure all dependencies are installed
- Verify database file is in place

---

**Ready to integrate?** Follow the steps in order, and you'll have the complete system running in minutes! 🚀
