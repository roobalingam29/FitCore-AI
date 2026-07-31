# FitCore AI – Local Setup & Deployment Guide

## 1. Quick Start (Web Application)
The primary React + Express application is ready to run out of the box on port 3000.

### Installation
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 2. Python FastAPI Backend Setup (Optional Microservice)
To run the standalone Python backend:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Swagger UI will be available at `http://localhost:8000/docs`.

---

## 3. Database Initialization (MySQL)
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed_data.sql
```
