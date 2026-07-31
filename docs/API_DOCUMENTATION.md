# FitCore AI – API Documentation

## Base URLs
- Express Runtime: `http://localhost:3000/api/v1`
- FastAPI Engine: `http://localhost:8000/api/v1`
- Swagger UI Docs: `http://localhost:8000/docs`

---

## 1. Authentication
### `POST /api/v1/auth/login`
Authenticates a user and returns JWT token & user object.
**Request Body:**
```json
{
  "email": "admin@fitcore.ai",
  "role": "admin"
}
```
**Response:**
```json
{
  "token": "fitcore_jwt_u1_1722384000",
  "user": {
    "id": "u-admin",
    "name": "Alexander Stone (Admin)",
    "role": "admin"
  }
}
```

---

## 2. Dashboard KPIs
### `GET /api/v1/dashboard/kpi`
Returns real-time occupancy, revenue summaries, and low-stock alerts.

---

## 3. Members Management
### `GET /api/v1/members`
List all members.

### `POST /api/v1/members`
Create a new member.

---

## 4. AI Insights Engine (Gemini 3.6 Flash)
### `POST /api/v1/ai-insights/generate`
Generates real-time gym retention or workout advice using Google Gemini API.
**Request Body:**
```json
{
  "prompt": "Recommend off-peak gym floor occupancy strategy",
  "topic": "business"
}
```
