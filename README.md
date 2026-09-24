# 🌍 TripSaathi AI — Intelligent Trip Planning & Autonomous Agent

[![Live Website](https://img.shields.io/badge/Live%20Website-tripsaathi--ai-black?style=for-the-badge&logo=vercel)](https://travelpilot-ai-three.vercel.app)
[![Vercel Deployment](https://img.shields.io/badge/Deployment-Ready-emerald?style=for-the-badge)](https://travelpilot-ai-three.vercel.app)

> ### 🚀 **Launch Live Application**: **[https://travelpilot-ai-three.vercel.app](https://travelpilot-ai-three.vercel.app)**
> **Click the link above to immediately run and use TripSaathi AI directly in your browser!**

---

TripSaathi AI is an agentic travel planner designed to create day-by-day itineraries grounded in real POI data, answer context-aware questions, and **dynamically rebuild affected parts of the itinerary when an activity changes or is cancelled — without regenerating unaffected days**.

## Key Features

1. **Grounded Multi-Day Generation (`POST /itinerary/generate`)**:
   - Uses real coordinates, opening hours, average costs, and durations.
   - Geographically clusters stops per day to minimize backtracking.
   - Injects realistic urban transit buffers between consecutive stops.
   - Powered by Claude tool-use (`search_places`, `estimate_travel_time`, `check_conflicts`) with a high-fidelity local grounded fallback.

2. **Isolated Disruption Rebuilding (`POST /itinerary/disrupt`)**:
   - When a stop is cancelled, only the affected day is re-evaluated.
   - Automatically searches for nearby matching POIs in the same time window.
   - Day 1 and Day 3 remain 100% untouched while Day 2 is healed.
   - Displays clear natural-language explanation of what changed and why.

3. **Grounded Conversational Copilot (`POST /itinerary/chat`)**:
   - Answers questions like *"What should I do tomorrow morning?"* or *"Which activities are close to each other?"*.
   - Intelligently recognizes cancellation requests in chat and triggers the rebuilder.

4. **Validator & Conflict Detection (`POST /itinerary/validate`)**:
   - Flags scheduling overlaps, out-of-hours visits, and insufficient transit buffers.

5. **Dynamic Constraint Updates (`POST /itinerary/update-constraints`)**:
   - Intelligently rebalances budget cuts by swapping the highest-cost stops for quality free/budget alternatives first.

6. **Light Theme & Inspiring Travel Quotes**:
   - Clean, modern light aesthetic with ivory, sky blue, and emerald accents.
   - Responsive layout for desktop, tablet, and mobile.
   - Integrated travel wisdom quotes from legendary explorers and authors.

---

## Architecture & Tech Stack

- **Backend**: Python 3.12 + FastAPI + Pydantic v2 + Uvicorn
- **Agent / LLM**: Claude API tool-use loop (`search_places`, `estimate_travel_time`, `check_conflicts`) with local grounded fallback
- **Frontend**: React 19 + Vite 8 + Tailwind CSS v4 + Lucide Icons
- **Data Engine**: Curated POI database (Paris, Tokyo, New York, Rome, London, etc.) + Haversine geospatial proximity engine

---

## Quick Start

### 1. Start Both Backend & Frontend (One Command)
```powershell
python travelpilot/run_travelpilot.py
```

### 2. Manual Start

**Backend**:
```powershell
cd travelpilot/backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
- API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

**Frontend**:
```powershell
cd travelpilot/frontend
npm run dev
```
- Frontend UI: [http://localhost:5173](http://localhost:5173)

---

## Running Automated Verification Tests

```powershell
cd travelpilot/backend
python test_travelpilot.py
```
This runs the full end-to-end demo scenario verifying:
1. Grounded generation for Paris
2. Itinerary validation
3. Grounded chat query ("what should I do tomorrow morning?")
4. Day 2 disruption with isolated rebuild (verifying Day 1 & Day 3 remain identical)
5. Dynamic budget reduction rebalancing
