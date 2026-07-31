# FitCore AI – System Architecture Documentation

## Architecture Overview
FitCore AI employs a decoupled enterprise full-stack architecture combining a high-performance React + TypeScript frontend with dual API execution adapters (Express + Vite for container development & Node deployment; FastAPI + SQLAlchemy for Python enterprise microservices).

```
   ┌────────────────────────────────────────────────────────┐
   │             React 19 + Vite + Tailwind CSS             │
   │               (Browser / Mobile Web OS)                │
   └───────────────────────────┬────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               │                               │
   ┌───────────▼────────────┐     ┌────────────▼───────────┐
   │ Express + Vite Server  │     │  FastAPI Python Engine │
   │  (Port 3000 Node.js)   │     │   (Port 8000 Python)   │
   └───────────┬────────────┘     └────────────┬───────────┘
               │                               │
               ├───────────────────────────────┤
               │ Google Gemini 3.6 Flash AI    │
               │ MySQL / Relational Database   │
               └───────────────────────────────┘
```

## Security & Access Control
- Role-Based Access Control (RBAC) across 3 distinct personas:
  1. **Admin**: Full access to financial ledgers, inventory, staff, settings.
  2. **Trainer**: Access to assigned client rosters, attendance, and fitness goals.
  3. **Member**: Access to personal QR badge, plan details, and workout logs.
