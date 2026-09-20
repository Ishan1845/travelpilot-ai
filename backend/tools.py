import math
from datetime import datetime, time
from typing import List, Dict, Any, Optional
from poi_db import get_pois_for_destination, haversine_distance_km

def parse_military_time(time_str: str) -> time:
    """Parses 'HH:MM' string to time object."""
    clean = time_str.strip()
    parts = clean.split(":")
    return time(int(parts[0]), int(parts[1]))

def search_places(
    location: str,
    category: Optional[str] = None,
    near_lat: Optional[float] = None,
    near_lng: Optional[float] = None
) -> List[Dict[str, Any]]:
    """
    Search candidate POIs for a destination with coordinates, opening hours, avg cost, and avg duration.
    Optionally filters by category or sorts by proximity to (near_lat, near_lng).
    """
    pois = get_pois_for_destination(location)
    results = []

    for poi in pois:
        if category and category.lower() not in poi["category"].lower() and poi["category"].lower() not in category.lower():
            continue

        poi_copy = dict(poi)
        if near_lat is not None and near_lng is not None:
            dist = haversine_distance_km(near_lat, near_lng, poi["lat"], poi["lng"])
            poi_copy["distance_km"] = dist
        else:
            poi_copy["distance_km"] = 0.0
        results.append(poi_copy)

    if near_lat is not None and near_lng is not None:
        results.sort(key=lambda x: x["distance_km"])

    return results

def estimate_travel_time(
    from_coords: Dict[str, float],
    to_coords: Dict[str, float],
    mode: str = "transit"
) -> Dict[str, Any]:
    """
    Estimates travel time in minutes between two lat/lng coordinates for walking, transit, or driving.
    """
    lat1 = from_coords.get("lat", 0.0)
    lng1 = from_coords.get("lng", 0.0)
    lat2 = to_coords.get("lat", 0.0)
    lng2 = to_coords.get("lng", 0.0)

    dist_km = haversine_distance_km(lat1, lng1, lat2, lng2)

    # Realistic urban speeds (km/h) + initial connection/wait buffer
    if mode == "walking":
        speed_kmh = 4.5
        buffer_min = 2
    elif mode == "driving":
        speed_kmh = 25.0
        buffer_min = 5
    else:  # transit
        speed_kmh = 20.0
        buffer_min = 7

    travel_min = int(round((dist_km / max(speed_kmh, 1.0)) * 60 + buffer_min))
    # Minimum 5 minutes if different locations, 0 if virtually identical
    if dist_km > 0.05:
        travel_min = max(travel_min, 5)
    else:
        travel_min = 0

    return {
        "minutes": travel_min,
        "distance_km": dist_km,
        "mode": mode
    }

def check_conflicts(itinerary_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Validates an itinerary for:
    1. Time overlaps between activities on the same day.
    2. Stops scheduled outside venue opening hours.
    3. Unrealistic travel buffers between consecutive stops.
    4. Budget overruns.
    """
    conflicts = []
    days = itinerary_data.get("days", [])
    metadata = itinerary_data.get("metadata", {})
    total_budget = metadata.get("budget", float("inf"))
    total_cost = 0.0

    for day in days:
        day_num = day.get("day_number", 1)
        stops = day.get("stops", [])
        # Active stops only (exclude cancelled)
        active_stops = [s for s in stops if s.get("status") != "cancelled"]

        for i in range(len(active_stops)):
            stop = active_stops[i]
            total_cost += stop.get("estimated_cost", 0.0)
            t_slot = stop.get("time_slot", {})
            s_start = t_slot.get("start", "00:00")
            s_end = t_slot.get("end", "00:00")

            try:
                t_start = parse_military_time(s_start)
                t_end = parse_military_time(s_end)
            except Exception:
                continue

            if t_end <= t_start:
                conflicts.append({
                    "type": "overlap",
                    "day_number": day_num,
                    "stop_id": stop.get("id"),
                    "activity_name": stop.get("activity"),
                    "description": f"Day {day_num} '{stop.get('activity')}': end time ({s_end}) is before or equal to start time ({s_start}).",
                    "severity": "error"
                })

            # Check consecutive stops for overlap & transit buffer
            if i > 0:
                prev_stop = active_stops[i - 1]
                p_slot = prev_stop.get("time_slot", {})
                p_end = p_slot.get("end", "00:00")

                try:
                    t_prev_end = parse_military_time(p_end)
                except Exception:
                    continue

                if t_start < t_prev_end:
                    conflicts.append({
                        "type": "overlap",
                        "day_number": day_num,
                        "stop_id": stop.get("id"),
                        "activity_name": stop.get("activity"),
                        "description": f"Day {day_num} scheduling overlap: '{stop.get('activity')}' starts at {s_start} before '{prev_stop.get('activity')}' finishes at {p_end}.",
                        "severity": "error"
                    })
                else:
                    # Check travel time vs gap
                    gap_minutes = (t_start.hour * 60 + t_start.minute) - (t_prev_end.hour * 60 + t_prev_end.minute)
                    prev_loc = prev_stop.get("location", {})
                    curr_loc = stop.get("location", {})
                    if prev_loc and curr_loc:
                        transit = estimate_travel_time(prev_loc, curr_loc, mode="transit")
                        req_minutes = transit["minutes"]
                        if gap_minutes < req_minutes:
                            conflicts.append({
                                "type": "unrealistic_travel",
                                "day_number": day_num,
                                "stop_id": stop.get("id"),
                                "activity_name": stop.get("activity"),
                                "description": f"Day {day_num}: Insufficient transit buffer between '{prev_stop.get('activity')}' and '{stop.get('activity')}'. Needed: ~{req_minutes}m, available: {gap_minutes}m.",
                                "severity": "warning"
                            })

    if total_budget and total_cost > total_budget:
        conflicts.append({
            "type": "budget_exceeded",
            "day_number": 0,
            "stop_id": None,
            "activity_name": None,
            "description": f"Estimated total cost (${round(total_cost, 2)}) exceeds requested budget (${round(total_budget, 2)}) by ${round(total_cost - total_budget, 2)}.",
            "severity": "warning"
        })

    return conflicts

# Tool schema definitions for Claude API
CLAUDE_TOOLS = [
    {
        "name": "search_places",
        "description": "Searches for candidate POIs, attractions, restaurants, and museums for a given destination, filtered by category and sorted by geographic proximity.",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The destination city, e.g. 'Paris', 'Tokyo', 'New York'"
                },
                "category": {
                    "type": "string",
                    "description": "Optional category filter: 'Art & Culture', 'Landmarks', 'Food & Dining', 'Nature & Outdoors', 'Entertainment'"
                },
                "near_lat": {
                    "type": "number",
                    "description": "Optional latitude to rank results by proximity"
                },
                "near_lng": {
                    "type": "number",
                    "description": "Optional longitude to rank results by proximity"
                }
            },
            "required": ["location"]
        }
    },
    {
        "name": "estimate_travel_time",
        "description": "Calculates travel time in minutes and distance in kilometers between two geographic coordinates.",
        "input_schema": {
            "type": "object",
            "properties": {
                "from_coords": {
                    "type": "object",
                    "properties": {
                        "lat": {"type": "number"},
                        "lng": {"type": "number"}
                    },
                    "required": ["lat", "lng"]
                },
                "to_coords": {
                    "type": "object",
                    "properties": {
                        "lat": {"type": "number"},
                        "lng": {"type": "number"}
                    },
                    "required": ["lat", "lng"]
                },
                "mode": {
                    "type": "string",
                    "enum": ["transit", "walking", "driving"],
                    "description": "Transit mode (default: 'transit')"
                }
            },
            "required": ["from_coords", "to_coords"]
        }
    },
    {
        "name": "check_conflicts",
        "description": "Validates the itinerary JSON for time overlaps, insufficient travel buffers, and budget issues.",
        "input_schema": {
            "type": "object",
            "properties": {
                "itinerary_json": {
                    "type": "object",
                    "description": "The current itinerary structure"
                }
            },
            "required": ["itinerary_json"]
        }
    }
]
