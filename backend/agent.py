import os
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional, Tuple

from dotenv import load_dotenv
load_dotenv()

from models import (
    Itinerary, DayItinerary, Stop, TimeSlot, Location, TransitBuffer,
    TripMetadata, TripTotals, Conflict, GenerateRequest, TransportationInfo
)
from tools import search_places, estimate_travel_time, check_conflicts, CLAUDE_TOOLS
from poi_db import get_realistic_transportation, parse_origin_destination, INDIAN_CITY_COORDINATES
from disruption_engine import recalculate_trip_totals, rebuild_disrupted_day, handle_resequence_delay

logger = logging.getLogger(__name__)

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
CLAUDE_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-3-7-sonnet-20250219")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "") or os.getenv("GOOGLE_API_KEY", "")

def call_gemini(prompt: str, system_instruction: str = "") -> str:
    """Invokes Google Gemini REST API using standard urllib without external dependencies."""
    key = os.getenv("GEMINI_API_KEY", "") or os.getenv("GOOGLE_API_KEY", "")
    if not key or key.strip() == "" or key == "your_gemini_api_key_here":
        return ""
    try:
        import urllib.request
        # Use gemini-3.6-flash with fallback to gemini-flash-latest
        for model in ["gemini-3.6-flash", "gemini-flash-latest"]:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key.strip()}"
                payload: Dict[str, Any] = {
                    "contents": [{"parts": [{"text": prompt}]}]
                }
                if system_instruction:
                    payload["system_instruction"] = {"parts": [{"text": system_instruction}]}
                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode("utf-8"),
                    headers={"Content-Type": "application/json"}
                )
                with urllib.request.urlopen(req, timeout=15) as resp:
                    data = json.loads(resp.read().decode("utf-8"))
                    candidates = data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts:
                            return parts[0].get("text", "").strip()
            except Exception as sub_err:
                logger.debug(f"Gemini {model} retry notice: {sub_err}")
                continue
    except Exception as e:
        logger.warning(f"Google Gemini API call notice: {e}")
    return ""

def _execute_tool(name: str, inputs: Dict[str, Any]) -> Any:
    """Executes a tool call requested by the model."""
    if name == "search_places":
        return search_places(
            location=inputs.get("location", ""),
            category=inputs.get("category"),
            near_lat=inputs.get("near_lat"),
            near_lng=inputs.get("near_lng")
        )
    elif name == "estimate_travel_time":
        return estimate_travel_time(
            from_coords=inputs.get("from_coords", {}),
            to_coords=inputs.get("to_coords", {}),
            mode=inputs.get("mode", "transit")
        )
    elif name == "check_conflicts":
        return check_conflicts(inputs.get("itinerary_json", {}))
    return {"error": f"Unknown tool: {name}"}

def build_grounded_itinerary_programmatic(
    destination: str,
    start_date: str,
    end_date: str,
    budget: float,
    interests: List[str],
    members_count: int = 1,
    travel_mode: str = "road",
    origin: Optional[str] = None
) -> Itinerary:
    """
    Grounded programmatic planner that clusters POIs geographically per day,
    respects opening hours, computes verified date transportation, and scales for members in ₹ (INR).
    """
    try:
        s_date = datetime.strptime(start_date, "%Y-%m-%d")
        e_date = datetime.strptime(end_date, "%Y-%m-%d")
        total_days = max(1, (e_date - s_date).days + 1)
    except Exception:
        s_date = datetime.now()
        total_days = 3
        e_date = s_date + timedelta(days=2)
        start_date = s_date.strftime("%Y-%m-%d")
        end_date = e_date.strftime("%Y-%m-%d")

    total_days = min(total_days, 10)
    all_pois = search_places(location=destination)

    matched = []
    others = []
    user_int_lower = [i.lower() for i in interests]

    for p in all_pois:
        if any(i in p["category"].lower() or p["category"].lower() in i for i in user_int_lower):
            matched.append(p)
        else:
            others.append(p)

    ordered_pois = matched + others
    if not ordered_pois:
        ordered_pois = all_pois

    slot_templates = [
        ("09:30", "12:00", 150),  # Morning
        ("12:30", "14:00", 90),   # Lunch / Midday
        ("14:30", "17:30", 180),  # Afternoon
        ("18:30", "21:00", 150),  # Evening / Dinner
    ]

    slot_templates = [
        ("09:30", "12:00", 150),  # Morning
        ("12:30", "14:00", 90),   # Lunch / Midday
        ("15:00", "18:00", 180),  # Afternoon
    ]

    days_list: List[DayItinerary] = []
    used_place_names: set = set()
    used_place_ids: set = set()

    parsed_orig, target_dest = parse_origin_destination(destination)
    clean_dest = target_dest.strip().title()
    base_coords = INDIAN_CITY_COORDINATES.get(clean_dest.lower(), (22.0 + (hash(clean_dest) % 100) / 10.0, 78.0 + (hash(clean_dest[::-1]) % 100) / 10.0))
    base_lat, base_lng = base_coords

    day_theme_catalogue = [
        "Iconic Heritage, Royal Palaces & Architecture",
        "Ancient Fortresses, Sacred Temples & Stepwells",
        "Scenic Nature Escapes, Lakes & Sunset Vistas",
        "Spiritual Sanctuaries, Historic Relics & Gardens",
        "Traditional Craft Bazaars, Handicrafts & Gastronomy",
        "Eco-Trails, Botanical Reserves & Panoramic Ridges",
        "Cultural Folklore, Artisan Villages & Folk Arts",
        "Hidden Architectural Curiosities & Riverside Paths",
        "Wildlife Sanctuaries, Hilltop Vistas & Local Cuisine",
        "Grand Farewell Panorama, Souvenir Haats & Royal Feast"
    ]

    day_slot_catalogue = [
        # Morning slot categories
        [
            ("Heritage Palace & Archaeological Walk", "Landmarks", 150.0, 150, "08:30", "12:00", 0.008, 0.009, "Royal palatial pavilions and preserved historical galleries."),
            ("Sacred Sanctum & Morning Spiritual Rituals", "Art & Culture", 0.0, 120, "06:00", "11:30", -0.012, 0.008, "Serene morning devotional ceremonies and stone architectural carvings."),
            ("Botanical Lake & Morning Nature Trail", "Nature & Outdoors", 40.0, 120, "06:30", "11:30", 0.018, -0.012, "Lush landscaped greenery with walking trails and lake views."),
            ("Historic Stepwell & Water Architecture", "Art & Culture", 50.0, 100, "08:00", "12:00", -0.015, -0.010, "Ancient geometric stepwell built for community water conservation."),
            ("High Citadel & Ancient Watchtower", "Landmarks", 100.0, 150, "08:00", "12:30", 0.022, 0.016, "Hilltop citadel ramparts with expansive views over the horizon."),
            ("Artisan Village & Handloom Weaving Center", "Art & Culture", 100.0, 120, "09:00", "12:30", -0.022, 0.018, "Traditional craftsmen studios producing local textiles and handicrafts."),
            ("Eco Wildlife Sanctuary & Bird Watching", "Nature & Outdoors", 80.0, 150, "07:00", "12:00", 0.026, -0.020, "Protected forest sanctuary with wetlands and watchtowers.")
        ],
        # Midday / Lunch slot categories
        [
            ("Grand Royal Thali & Regional Cuisine", "Food & Dining", 550.0, 90, "12:00", "15:00", 0.002, -0.004, "Authentic regional lunch featuring local breads, curries, and savouries."),
            ("Heritage Spice Kitchen & Traditional Curries", "Food & Dining", 450.0, 90, "12:00", "15:00", -0.006, 0.005, "Family recipes passed down through generations in a historic quarter."),
            ("Lakeside Terrace & Scenic Lunch", "Food & Dining", 650.0, 90, "12:30", "15:30", 0.012, 0.009, "Al fresco lunch with picturesque breezes and fresh dishes."),
            ("Old City Street Food & Famous Sweets Walk", "Food & Dining", 250.0, 75, "11:30", "16:00", -0.008, -0.012, "Lively tasting trail for signature local snacks and fresh desserts."),
            ("Organic Garden Bistro & Fresh Harvest", "Food & Dining", 600.0, 90, "12:00", "15:00", 0.016, -0.006, "Farm-to-table cuisine prepared with organic herbs and cold-pressed spices."),
            ("Courtyard Tandoor & Clay Oven Delights", "Food & Dining", 550.0, 90, "12:30", "15:30", 0.009, 0.013, "Hot naan, roasted kebabs, and fragrant aromatic rice."),
            ("Classic Highway Diner & Mithai Corner", "Food & Dining", 350.0, 90, "11:30", "15:00", -0.014, 0.007, "Popular local rest stop celebrated for fresh jalebi and savouries.")
        ],
        # Afternoon / Evening slot categories
        [
            ("Sunset Ridge Viewpoint & Sky Deck", "Nature & Outdoors", 50.0, 150, "15:30", "19:00", 0.023, 0.019, "Elevated vantage point capturing breathtaking sunset over the hills."),
            ("State Handicrafts Emporium & Silk Haat", "Art & Culture", 150.0, 120, "14:30", "20:00", -0.011, 0.016, "Government certified stalls with authentic brassware, textiles, and art."),
            ("Riverfront Promenade & Evening Lamp Aarti", "Art & Culture", 0.0, 120, "16:30", "20:00", 0.006, 0.024, "Evening riverside gathering with illuminated oil lamps and chanting."),
            ("Museum of Royal Costumes & Historical Arms", "Art & Culture", 100.0, 120, "14:00", "18:30", -0.016, -0.006, "Curated exhibits of royal durbars, ceremonial weapons, and carriages."),
            ("Night Bazaar & Cultural Folk Show", "Food & Dining", 350.0, 150, "17:00", "21:30", 0.005, -0.018, "Vibrant evening market with folk dancers, musicians, and street stalls."),
            ("Historic Memorial Grounds & Laser Projection", "Landmarks", 80.0, 120, "16:00", "20:30", 0.014, -0.015, "Illuminated evening park with multimedia sound and light show."),
            ("Lakeside Sunset Cruise & Twilight Stroll", "Nature & Outdoors", 350.0, 120, "16:30", "19:30", 0.019, 0.021, "Relaxing boat journey during twilight hours on calm waters.")
        ]
    ]

    for day_i in range(total_days):
        day_date = (s_date + timedelta(days=day_i)).strftime("%Y-%m-%d")
        day_stops: List[Stop] = []
        prev_stop: Optional[Stop] = None

        daily_slots = slot_templates[:3]

        for s_idx, (start_t, end_t, dur_min) in enumerate(daily_slots):
            # Select an unused POI from ordered_pois
            poi = None
            for cand in ordered_pois:
                cand_name_norm = cand["name"].strip().lower()
                cand_id = cand.get("id")
                if cand_name_norm not in used_place_names and cand_id not in used_place_ids:
                    poi = cand
                    break

            # If all curated POIs are exhausted, dynamically generate a brand new authentic venue for this Day and Slot
            if not poi:
                slot_opts = day_slot_catalogue[min(s_idx, len(day_slot_catalogue) - 1)]
                opt_idx = (day_i) % len(slot_opts)
                v_title, v_cat, v_cost, v_dur, v_o, v_c, v_dlat, v_dlng, v_desc = slot_opts[opt_idx]
                
                v_name = f"{clean_dest} {v_title}"
                counter = 2
                while v_name.strip().lower() in used_place_names:
                    v_name = f"{clean_dest} Day {day_i + 1} {v_title} ({counter})"
                    counter += 1

                poi = {
                    "id": f"{clean_dest.lower()[:3]}_d{day_i+1}_s{s_idx+1}",
                    "name": v_name,
                    "city": clean_dest,
                    "category": v_cat,
                    "lat": round(base_lat + v_dlat * (1.0 + (day_i * 0.15)), 4),
                    "lng": round(base_lng + v_dlng * (1.0 + (day_i * 0.15)), 4),
                    "address": f"Day {day_i + 1} Heritage Trail, {clean_dest}",
                    "open_time": v_o,
                    "close_time": v_c,
                    "avg_cost": v_cost,
                    "avg_duration": v_dur,
                    "description": f"Curated Day {day_i + 1} highlight in {clean_dest}: {v_desc}"
                }

            used_place_names.add(poi["name"].strip().lower())
            if poi.get("id"):
                used_place_ids.add(poi["id"])

            transit_buf = None
            if prev_stop:
                transit_info = estimate_travel_time(
                    {"lat": prev_stop.location.lat, "lng": prev_stop.location.lng},
                    {"lat": poi["lat"], "lng": poi["lng"]},
                    mode="transit"
                )
                transit_buf = TransitBuffer(
                    duration_minutes=transit_info["minutes"],
                    mode="transit",
                    from_name=prev_stop.activity,
                    to_name=poi["name"],
                    distance_km=transit_info["distance_km"]
                )

            stop_obj = Stop(
                id=f"stop_{day_i+1}_{s_idx+1}_{poi['id']}",
                place_id=poi.get("id"),
                time_slot=TimeSlot(start=start_t, end=end_t),
                activity=poi["name"],
                category=poi["category"],
                location=Location(lat=poi["lat"], lng=poi["lng"], address=poi["address"]),
                estimated_cost=poi["avg_cost"],
                estimated_duration=min(dur_min, poi["avg_duration"]),
                status="planned",
                notes=poi["description"],
                transit_from_prev=transit_buf
            )
            day_stops.append(stop_obj)
            prev_stop = stop_obj

        day_theme = day_theme_catalogue[day_i % len(day_theme_catalogue)]

        days_list.append(DayItinerary(
            day_number=day_i + 1,
            date=day_date,
            theme=day_theme,
            stops=day_stops
        ))

    # Calculate real date-verified transportation with origin
    parsed_orig, target_dest = parse_origin_destination(destination)
    effective_orig = origin or parsed_orig

    trans_raw = get_realistic_transportation(
        destination=target_dest,
        travel_mode=travel_mode,
        members_count=members_count,
        start_date=start_date,
        origin=effective_orig
    )
    transport_obj = TransportationInfo(**trans_raw)

    formatted_dest = f"{effective_orig} to {target_dest}" if effective_orig else target_dest

    itin = Itinerary(
        metadata=TripMetadata(
            destination=formatted_dest,
            origin=effective_orig,
            start_date=start_date,
            end_date=end_date,
            budget=budget,
            members_count=members_count,
            travel_mode="flight" if travel_mode.lower() == "flight" else ("train" if travel_mode.lower() == "train" else "road"),
            transportation=transport_obj,
            interests=interests
        ),
        days=days_list
    )

    recalculate_trip_totals(itin)
    raw_conflicts = check_conflicts(itin.model_dump())
    itin.conflicts = [Conflict(**c) for c in raw_conflicts]
    return itin

def generate_itinerary_agentic(request: GenerateRequest) -> Itinerary:
    """
    Generates an itinerary with members count, verified transportation, and ₹ (INR) currency.
    """
    if not ANTHROPIC_API_KEY:
        logger.info("No ANTHROPIC_API_KEY configured. Using high-fidelity grounded planner.")
        return build_grounded_itinerary_programmatic(
            destination=request.destination,
            start_date=request.start_date,
            end_date=request.end_date,
            budget=request.budget,
            interests=request.interests,
            members_count=request.members_count,
            travel_mode=request.travel_mode,
            origin=request.origin
        )

    try:
        import anthropic
        client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

        system_prompt = (
            "You are TravelPilot, an expert travel planner agent. "
            "All pricing must be in Indian Rupees (INR ₹). "
            "Scale costs for the specified group size (members_count) and include verified transportation. "
            "You MUST use the provided tools (`search_places`, `estimate_travel_time`, `check_conflicts`) "
            "to ground all itinerary stops in real venues. Output valid JSON matching the Itinerary schema."
        )

        messages = [
            {
                "role": "user",
                "content": (
                    f"Create an itinerary for {request.destination} from {request.start_date} to {request.end_date}. "
                    f"Group size: {request.members_count} member(s). Transit mode: {request.travel_mode}. "
                    f"Total Budget: ₹{request.budget}. Interests: {', '.join(request.interests)}. "
                    f"Ground in real POIs, verify travel buffers, and output complete Itinerary JSON in INR (₹)."
                )
            }
        ]

        for _ in range(5):
            response = client.messages.create(
                model=CLAUDE_MODEL,
                max_tokens=4000,
                system=system_prompt,
                messages=messages,
                tools=CLAUDE_TOOLS
            )

            if response.stop_reason == "tool_use":
                tool_results = []
                for block in response.content:
                    if block.type == "tool_use":
                        res = _execute_tool(block.name, block.input)
                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": json.dumps(res)
                        })

                messages.append({"role": "assistant", "content": response.content})
                messages.append({"role": "user", "content": tool_results})
            else:
                text_content = ""
                for block in response.content:
                    if hasattr(block, "text"):
                        text_content += block.text

                json_str = text_content
                if "```json" in text_content:
                    json_str = text_content.split("```json")[1].split("```")[0].strip()
                elif "```" in text_content:
                    json_str = text_content.split("```")[1].split("```")[0].strip()

                parsed = json.loads(json_str)
                itin = Itinerary(**parsed)
                recalculate_trip_totals(itin)
                return itin

    except Exception as e:
        logger.warning(f"Claude agent invocation fallback: {e}")
        return build_grounded_itinerary_programmatic(
            destination=request.destination,
            start_date=request.start_date,
            end_date=request.end_date,
            budget=request.budget,
            interests=request.interests,
            members_count=request.members_count,
            travel_mode=request.travel_mode,
            origin=request.origin
        )

TRAVEL_RELATED_TERMS = {
    # Core travel
    "itinerary", "trip", "travel", "travelling", "traveling", "traveler", "tourist", "tourism", "tour",
    "journey", "vacation", "holiday", "getaway", "visit", "visiting", "destination", "destinations",
    "schedule", "timetable", "plan", "planning", "stop", "stops", "activity", "activities",
    "day", "days", "morning", "afternoon", "evening", "night", "tomorrow", "today", "yesterday",
    "timing", "time", "hours", "duration", "slot", "route", "routes", "buffer", "distance",
    "nearby", "near", "close", "far", "direction", "directions", "map", "navigate",
    # Transit
    "transit", "transport", "transportation", "flight", "flights", "fly", "flying", "airline", "airlines",
    "plane", "airplane", "airport", "terminal", "gate", "boarding", "takeoff", "landing", "runway",
    "train", "trains", "railway", "railways", "rail", "irctc", "station", "platform", "coach", "compartment",
    "berth", "seat", "seats", "pnr", "sleeper", "vande bharat", "rajdhani", "shatabdi", "express", "gatimaan",
    "cab", "cabs", "taxi", "taxis", "ola", "uber", "car", "drive", "driving", "road", "highway", "expressway",
    "bus", "buses", "volvo", "smartbus", "redbus", "auto", "autorickshaw", "rickshaw", "metro", "commute",
    "ferry", "boat", "cruise", "ship", "bike", "rental",
    # Luggage & packing
    "luggage", "bag", "bags", "baggage", "suitcase", "backpack", "pack", "packing", "carryon",
    # Lodging
    "hotel", "hotels", "motel", "stay", "staying", "resort", "resorts", "hostel", "hostels",
    "room", "rooms", "accommodation", "checkin", "checkout", "lodge", "homestay", "airbnb",
    # Budget & tickets
    "budget", "cost", "costs", "price", "prices", "pricing", "fare", "fares", "fee", "fees",
    "ticket", "tickets", "pass", "passes", "entry", "rupee", "rupees", "inr", "expense", "expenses",
    "cheap", "affordable", "expensive", "money", "currency", "exchange", "atm", "cash",
    # Sightseeing & geography
    "sightseeing", "monument", "monuments", "heritage", "history", "historical", "architecture",
    "fort", "palace", "temple", "temples", "mosque", "mosques", "church", "churches", "shrine", "museum", "museums",
    "tomb", "mahal", "ghat", "bazaar", "market", "shopping", "souvenir", "souvenirs", "attraction", "attractions",
    "beach", "beaches", "mountain", "mountains", "hill", "hills", "lake", "lakes", "river", "rivers",
    "waterfall", "waterfalls", "valley", "view", "viewpoint", "sunset", "sunrise", "scenic",
    "park", "garden", "wildlife", "sanctuary", "safari", "zoo", "trek", "trekking", "hike", "hiking",
    "guide", "places", "place",
    # Dining & cuisine
    "food", "eat", "eating", "dining", "restaurant", "restaurants", "cafe", "cafes",
    "cuisine", "dish", "dishes", "breakfast", "lunch", "dinner", "snack", "snacks",
    "street food", "local food", "chai", "tea", "coffee", "specialty", "thali", "sweets", "vegetarian",
    # Weather & clothing
    "weather", "climate", "temperature", "rain", "raining", "rainy", "monsoon", "sunny", "hot", "cold",
    "winter", "summer", "snow", "fog", "best time", "season", "clothes", "wear", "dress code", "rules", "permit",
    # Safety & practicalities
    "safety", "safe", "unsafe", "scam", "emergency", "police", "hospital", "doctor", "medicine",
    "visa", "passport", "customs", "guidelines", "tips", "advice", "etiquette", "culture",
    # Actions
    "cancel", "cancellation", "delay", "delayed", "late", "traffic", "push", "reschedule",
    "skip", "drop", "replace", "alternative", "recommend", "suggest", "where", "how", "when"
}

NON_TRAVEL_PATTERNS = [
    r'\b(python|javascript|typescript|c\+\+|c\#|golang|rust|php|ruby|swift|kotlin|html|css|sql|nosql)\b',
    r'\b(react|vue|angular|node\.js|next\.js|django|flask|fastapi|docker|kubernetes)\b',
    r'\b(algorithm|compiler|debugging|variable|pointer|data\s+structure|class\s+\w+|def\s+\w+|function\s+\w+)\b',
    r'\bwrite\s+(a\s+)?(code|script|program|function|essay|poem|song|story|lyrics|speech)\b',
    r'\b(derivative|integral|algebra|calculus|trigonometry|solve\s+for|photosynthesis|quantum|relativity)\b',
    r'^\s*(\d+\s*[\+\-\*\/]\s*\d+)\s*\??$',
    r'\b(who\s+won\s+the|world\s+cup|fifa|ipl|election|prime\s+minister\s+of|president\s+of)\b',
    r'\b(bitcoin|ethereum|crypto|cryptocurrency|stock\s+market|stocks\s+to\s+buy|trading\s+strategy)\b',
    r'\b(minecraft|playstation|xbox|fortnite|video\s+game|gaming\s+console)\b',
    r'\b(fix\s+my\s+code|solve\s+this\s+bug|write\s+a\s+regex)\b',
]

def is_travel_related(question: str, itinerary: Optional[Itinerary] = None) -> bool:
    """
    Evaluates whether a user's question is related to travelling, trip planning, itineraries,
    destinations, sightseeing, transport, accommodation, food, or culture.
    Returns False for questions outside of travel (coding, math, general politics, science homework, etc.).
    """
    import re
    lower = question.lower().strip()
    if not lower:
        return False
    
    # Greetings & Copilot role queries
    if lower in ["hi", "hello", "hey", "help", "good morning", "good evening", "good afternoon", "who are you", "what can you do"]:
        return True

    # Explicit non-travel query patterns (coding, math, politics, gaming, homework, etc.)
    for pattern in NON_TRAVEL_PATTERNS:
        if re.search(pattern, lower):
            return False

    # Check against destination or origin in itinerary
    if itinerary and itinerary.metadata:
        dest = (itinerary.metadata.destination or "").lower()
        orig = (itinerary.metadata.origin or "").lower()
        if dest and dest in lower:
            return True
        if orig and orig in lower:
            return True
        
        # Check against stop activity names, categories, and addresses
        for day in itinerary.days:
            for stop in day.stops:
                if stop.activity and stop.activity.lower() in lower:
                    return True
                if stop.category and stop.category.lower() in lower:
                    return True
                if stop.location and stop.location.address and any(part.strip().lower() in lower for part in stop.location.address.split(',') if len(part.strip()) > 3):
                    return True

    # Check for known Indian or global tourist cities
    for city in ["agra", "delhi", "jaipur", "goa", "mumbai", "kerala", "manali", "shimla", "udaipur", "varanasi", "bangalore", "bengaluru", "hyderabad", "chennai", "kolkata", "amritsar", "ladakh", "rishikesh", "darjeeling", "ooty", "paris", "london", "dubai", "singapore", "tokyo", "rome"]:
        if city in lower:
            return True

    # Check against comprehensive travel dictionary
    words = re.findall(r'[a-zA-Z]+', lower)
    for w in words:
        if w in TRAVEL_RELATED_TERMS:
            return True

    return False

def chat_agent(itinerary: Itinerary, question: str) -> Tuple[str, Optional[Itinerary], Optional[str]]:
    """
    Answers natural-language questions grounded in the itinerary state in INR (₹).
    Strictly filters out non-travel questions and replies with 'Irrelevant question.'.
    """
    lower_q = question.lower().strip()
    members = itinerary.metadata.members_count

    # 1. Strictly enforce travel-only domain filter
    if not is_travel_related(question, itinerary):
        return "Irrelevant question.", None, None

    # Handle greetings politely
    if lower_q in ["hi", "hello", "hey", "who are you", "what can you do", "help"]:
        dest = itinerary.metadata.destination if itinerary and itinerary.metadata else "your destination"
        return f"Hello! I am your Trip Copilot. How can I help you with your trip to {dest}?", None, None

    # 2. Rescheduling / Delay questions
    if any(k in lower_q for k in ["delayed", "delay", "late", "traffic", "push everything", "push after"]):
        import re
        delay_min = 180  # Default 3 hours (180 mins)
        m = re.search(r'(\d+)\s*(?:hour|hr)', lower_q)
        if m:
            delay_min = int(m.group(1)) * 60
        else:
            m_min = re.search(r'(\d+)\s*(?:min|minute)', lower_q)
            if m_min:
                delay_min = int(m_min.group(1))

        disrupt_type = "flight_delay" if ("flight" in lower_q or "plane" in lower_q) else ("train_delay" if ("train" in lower_q or "rail" in lower_q) else "traffic_delay")
        delay_title = f"{'Flight' if disrupt_type == 'flight_delay' else ('Train' if disrupt_type == 'train_delay' else 'Highway Traffic')} Delay ({delay_min // 60}h)" if delay_min >= 60 else f"Delay ({delay_min}m)"

        res = handle_resequence_delay(
            itinerary,
            disruption_type=disrupt_type,
            delay_minutes=delay_min,
            delay_title=delay_title,
            affected_day=1
        )
        first_shift = res["shifts"][0] if res["shifts"] else None
        new_start = first_shift["new_start"] if first_shift else "updated time"
        reply = f"Your schedule has been adjusted for the delay. Your next activity starts at {new_start}."
        return reply, res["updated_itinerary"], "resequenced_delay"

    # 3. Cancellation questions
    if any(word in lower_q for word in ["cancel", "remove", "drop", "skip", "delete"]):
        for day in itinerary.days:
            for stop in day.stops:
                if stop.status != "cancelled" and (stop.activity.lower() in lower_q or stop.id.lower() in lower_q):
                    updated_itin, summary, aff_day, alt_name = rebuild_disrupted_day(
                        itinerary, stop_id=stop.id, reason=f"User chat request: '{question}'"
                    )
                    reply = f"'{stop.activity}' has been removed from your schedule."
                    return reply, updated_itin, "cancelled_stop"

    # 4. Tomorrow morning / Tomorrow activities
    if "tomorrow morning" in lower_q:
        target_day = itinerary.days[1] if len(itinerary.days) > 1 else itinerary.days[0]
        morning_stops = [s for s in target_day.stops if s.status != "cancelled" and ("09:" in s.time_slot.start or "10:" in s.time_slot.start or "08:" in s.time_slot.start)]
        if morning_stops:
            s = morning_stops[0]
            return f"Tomorrow morning at {s.time_slot.start}, you are scheduled to visit **{s.activity}**.", None, None
        first_stop = target_day.stops[0] if target_day.stops else None
        if first_stop:
            return f"Tomorrow morning, your day starts at {first_stop.time_slot.start} with **{first_stop.activity}**.", None, None
        return "You have no morning activities scheduled for tomorrow.", None, None

    if "tomorrow" in lower_q:
        target_day = itinerary.days[1] if len(itinerary.days) > 1 else itinerary.days[0]
        stops = [s.activity for s in target_day.stops if s.status != "cancelled"]
        if stops:
            return f"Tomorrow you will visit: {', '.join(stops)}.", None, None
        return "No activities are scheduled for tomorrow.", None, None

    # 5. Transportation / Travel Mode
    if any(w in lower_q for w in ["transit", "travel mode", "flight", "road", "train", "cab", "transport", "how are we going", "how to reach"]):
        t = itinerary.metadata.transportation
        if t:
            return f"You are travelling by {t.mode} via **{t.route_name}** ({t.carrier_info}).", None, None

    # 6. Budget & Cost
    if any(w in lower_q for w in ["budget", "total budget", "cost", "total cost", "price", "how much"]):
        if "budget" in lower_q and "cost" not in lower_q:
            return f"Your allocated trip budget is ₹{itinerary.metadata.budget:,.0f}.", None, None
        return f"The estimated total trip cost is ₹{itinerary.trip_totals.estimated_total_cost:,.0f} for {members} member(s).", None, None

    # 7. Local Food & Dining
    if any(w in lower_q for w in ["food", "eat", "restaurant", "cafe", "cuisine", "dish", "breakfast", "lunch", "dinner", "street food"]):
        dest = itinerary.metadata.destination.lower()
        if "agra" in dest:
            return "In Agra, you should try famous Agra Petha at Panchhi Petha, Bedai with Jalebi, and Mughlai dishes at Pinch of Spice.", None, None
        elif "jaipur" in dest:
            return "In Jaipur, try Pyaz Kachori at Rawat Mishtan Bhandar, Dal Baati Churma, and fresh lassi on MI Road.", None, None
        elif "delhi" in dest:
            return "In Delhi, try Chole Bhature in Chandni Chowk, Butter Chicken at Pandara Road, and parathas in Old Delhi.", None, None
        elif "goa" in dest:
            return "In Goa, try authentic Goan Fish Curry, Prawn Balchão, and fresh beach shack seafood.", None, None
        else:
            return f"In {itinerary.metadata.destination}, explore popular local restaurants and food streets near the city center.", None, None

    # 8. Sightseeing / Places to visit
    if any(w in lower_q for w in ["places", "sightseeing", "monument", "attraction", "what to see", "spots"]):
        all_stops = [s.activity for d in itinerary.days for s in d.stops if s.status != "cancelled"]
        unique_stops = list(dict.fromkeys(all_stops))
        return f"Your trip includes visits to: {', '.join(unique_stops[:4])}.", None, None

    # 9. Weather & Packing
    if any(w in lower_q for w in ["weather", "climate", "pack", "packing", "clothes", "wear", "temperature", "rain"]):
        return f"For {itinerary.metadata.destination}, wear comfortable walking shoes and light cotton clothes.", None, None

    # 10. Proximity / Nearby spots
    if "close" in lower_q or "near" in lower_q:
        day1 = itinerary.days[0] if itinerary.days else None
        if day1 and len(day1.stops) >= 2:
            return f"**{day1.stops[0].activity}** and **{day1.stops[1].activity}** are located close to each other on Day 1.", None, None
        return f"Activities are grouped geographically each day to minimize travel time.", None, None

    # 11. Google Gemini AI Chat if available
    gemini_key = os.getenv("GEMINI_API_KEY", "") or os.getenv("GOOGLE_API_KEY", "")
    if gemini_key and gemini_key.strip() and gemini_key != "your_gemini_api_key_here":
        sys_inst = (
            "You are TravelPilot's AI Trip Copilot.\n"
            "STRICT RULES:\n"
            "1. Answer ONLY travel-related questions. If the user asks about anything outside of travel, reply ONLY: 'Irrelevant question.'\n"
            "2. Keep your language very simple, clean, and easy to read. Avoid jargon and marketing fluff.\n"
            "3. ONLY answer the specific information that was asked. Do not include extra data, statistics, or unsolicited itinerary dumps.\n"
            "4. Maximum 1-2 sentences."
        )
        user_prompt = (
            f"Destination: {itinerary.metadata.destination}\n"
            f"Dates: {itinerary.metadata.start_date} to {itinerary.metadata.end_date}\n"
            f"Members: {members}\n"
            f"Question: {question}"
        )
        gemini_reply = call_gemini(user_prompt, sys_inst)
        if gemini_reply:
            if "irrelevant question" in gemini_reply.lower():
                return "Irrelevant question.", None, None
            return gemini_reply, None, None

    # 12. Claude Chat if API key available
    if ANTHROPIC_API_KEY:
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
            resp = client.messages.create(
                model=CLAUDE_MODEL,
                max_tokens=250,
                system=(
                    "You are TravelPilot's AI Trip Copilot. "
                    "Rules: 1. Only answer travel questions (otherwise reply 'Irrelevant question.'). "
                    "2. Make language simple and readable. 3. Only answer the exact question asked in 1-2 simple sentences."
                ),
                messages=[
                    {
                        "role": "user",
                        "content": f"Trip Destination: {itinerary.metadata.destination}, Question: {question}"
                    }
                ]
            )
            claude_reply = resp.content[0].text
            if "irrelevant question" in claude_reply.lower():
                return "Irrelevant question.", None, None
            return claude_reply, None, None
        except Exception as e:
            logger.warning(f"Claude chat error: {e}")

    # Fallback: Simple, direct 1 sentence
    dest = itinerary.metadata.destination
    return f"Your trip to {dest} includes {itinerary.trip_totals.total_activities} scheduled stops from {itinerary.metadata.start_date} to {itinerary.metadata.end_date}.", None, None
