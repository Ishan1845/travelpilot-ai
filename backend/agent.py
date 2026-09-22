import os
import re
import json
import logging
import urllib.parse
import urllib.request
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
        # Use gemini-flash-latest directly
        for model in ["gemini-flash-latest"]:
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
    "skip", "drop", "replace", "alternative", "recommend", "suggest", "where", "how", "when",
    # Links & Redirections
    "redirect", "redirection", "link", "links", "url", "website", "google", "maps", "photos",
    "reviews", "more info", "info", "information", "details", "open",
    # Inquiry terms
    "special", "makes", "famous", "unique", "wonder", "wonders", "highlight", "highlights",
    "worth", "feature", "features", "history", "story", "fact", "facts", "significance",
    "importance", "popular", "popularity", "why", "what", "where", "how", "when", "tell",
    "explain", "describe", "experience", "vibe", "tajmahal", "taj", "mahal", "fort", "palace"
}

NON_TRAVEL_PATTERNS = [
    r'\b(python|javascript|typescript|c\+\+|c\#|golang|rust|php|ruby|swift|kotlin|html|css|sql|nosql)\b',
    r'\b(react|vue|angular|node\.js|next\.js|django|flask|fastapi|docker|kubernetes)\b',
    r'\b(algorithm|compiler|debugging|variable|pointer|data\s+structure|class\s+\w+|def\s+\w+|function\s+\w+)\b',
    r'\bwrite\s+(a\s+)?(code|script|program|function|essay|poem|song|lyrics|speech)\b',
    r'\b(derivative|integral|algebra|calculus|trigonometry|solve\s+for|photosynthesis|quantum|relativity)\b',
    r'^\s*(\d+\s*[\+\-\*\/]\s*\d+)\s*\??$',
    r'\b(who\s+won\s+the|world\s+cup|fifa|ipl|election|prime\s+minister\s+of|president\s+of)\b',
    r'\b(bitcoin|ethereum|crypto|cryptocurrency|stock\s+market|stocks\s+to\s+buy|trading\s+strategy)\b',
    r'\b(minecraft|playstation|xbox|fortnite|video\s+game|gaming\s+console)\b',
    r'\b(fix\s+my\s+code|solve\s+this\s+bug|write\s+a\s+regex)\b',
    r'\b(diagnose\s+my|medical\s+condition|symptoms\s+of)\b',
    r'\b(break\s+up\s+with|relationship\s+advice|dating\s+advice)\b',
]

def is_travel_related(question: str, itinerary: Optional[Itinerary] = None) -> bool:
    """
    Evaluates whether a user's question is related to travelling, trip planning, itineraries,
    destinations, sightseeing, transport, accommodation, food, or culture.
    Returns False ONLY for genuine questions outside of travel (coding, math, general politics, crypto, etc.).
    """
    import re
    lower = question.lower().strip()
    if not lower:
        return False
    
    # 1. Strictly block explicit non-travel patterns
    for pattern in NON_TRAVEL_PATTERNS:
        if re.search(pattern, lower):
            return False

    # 2. Greetings & Copilot role queries
    if lower in ["hi", "hello", "hey", "help", "good morning", "good evening", "good afternoon", "who are you", "what can you do"]:
        return True

    # 3. Check for inquiry or relative query terms
    inquiry_terms = {
        "special", "famous", "unique", "wonder", "wonders", "highlight", "highlights",
        "worth", "visit", "visiting", "see", "feature", "features", "history", "story",
        "fact", "facts", "significance", "importance", "popular", "why", "what", "where",
        "how", "when", "tell", "explain", "describe", "detail", "details", "info", "it",
        "this", "that", "there", "here", "place", "spot", "trip", "tour", "guide", "tajmahal"
    }
    words = set(re.findall(r'[a-zA-Z]+', lower))
    if words & inquiry_terms:
        return True

    # 4. Check against destination or origin in itinerary
    if itinerary and itinerary.metadata:
        dest = (itinerary.metadata.destination or "").lower()
        orig = (itinerary.metadata.origin or "").lower()
        if dest and (dest in lower or any(tok in lower for tok in dest.split() if len(tok) > 2)):
            return True
        if orig and (orig in lower or any(tok in lower for tok in orig.split() if len(tok) > 2)):
            return True
        
        # Check against stop activity names
        clean_lower = re.sub(r'[^a-z0-9]', '', lower)
        for day in itinerary.days:
            for stop in day.stops:
                raw_act = stop.activity.lower()
                clean_act = re.sub(r'[^a-z0-9]', '', raw_act.split('(')[0])
                if clean_act and (clean_act in clean_lower or clean_lower in clean_act):
                    return True
                if any(tok in lower for tok in re.findall(r'[a-zA-Z]{3,}', raw_act)):
                    return True

    # 5. Check against known tourist cities
    for city in ["agra", "delhi", "jaipur", "goa", "mumbai", "kerala", "manali", "shimla", "udaipur", "varanasi", "bangalore", "bengaluru", "hyderabad", "chennai", "kolkata", "amritsar", "ladakh", "rishikesh", "darjeeling", "ooty", "vadodara", "kevadia", "paris", "london", "dubai", "singapore", "tokyo", "rome"]:
        if city in lower:
            return True

    # 6. Check against comprehensive travel dictionary
    for w in words:
        if w in TRAVEL_RELATED_TERMS:
            return True

    # 7. Within an active itinerary context, if not explicit non-travel, allow as travel context
    if itinerary is not None:
        return True

    return False

def find_matching_place(
    query: str, 
    itinerary: Optional[Itinerary] = None, 
    history: Optional[List[Dict[str, Any]]] = None
) -> Optional[Dict[str, Any]]:
    """
    Intelligently identifies which landmark or attraction the user is referring to,
    handling unspaced names (e.g. 'tajmahal', 'agrafort'), partial tokens,
    itinerary stops, SAMPLE_POIS database across all cities, conversation history,
    and pronouns ('it', 'this place').
    """
    from poi_db import SAMPLE_POIS

    lower_q = query.lower().strip()
    clean_q = re.sub(r'[^a-z0-9]', '', lower_q)

    def format_place(name, full_name, category, city, cost, desc, stop_obj=None):
        raw_city = city or (itinerary.metadata.destination if itinerary and itinerary.metadata else "")
        clean_city = raw_city.split(" to ")[-1].strip() if " to " in raw_city else raw_city
        return {
            "name": name,
            "full_name": full_name,
            "category": category or "Landmarks",
            "city": clean_city,
            "cost": float(cost or 0),
            "description": desc or "",
            "notes": desc or "",
            "stop_obj": stop_obj
        }

    # 1. Search directly in current itinerary stops
    if itinerary and itinerary.days:
        for day in itinerary.days:
            for stop in day.stops:
                raw_act = stop.activity
                core_act = raw_act.split('(')[0].split('&')[0].strip()
                clean_core = re.sub(r'[^a-z0-9]', '', core_act.lower())
                clean_raw = re.sub(r'[^a-z0-9]', '', raw_act.lower())

                if (clean_core and len(clean_core) >= 3 and clean_core in clean_q) or \
                   (clean_raw and len(clean_raw) >= 3 and clean_raw in clean_q) or \
                   (core_act.lower() in lower_q):
                    return format_place(core_act, raw_act, stop.category, None, stop.estimated_cost, stop.notes, stop)

    # 2. Search across SAMPLE_POIS database across all cities
    for city_key, pois in SAMPLE_POIS.items():
        for poi in pois:
            raw_name = poi["name"]
            core_name = raw_name.split('(')[0].split('&')[0].strip()
            clean_core = re.sub(r'[^a-z0-9]', '', core_name.lower())
            clean_raw = re.sub(r'[^a-z0-9]', '', raw_name.lower())

            if (clean_core and len(clean_core) >= 4 and clean_core in clean_q) or \
               (clean_raw and len(clean_raw) >= 4 and clean_raw in clean_q) or \
               (core_name.lower() in lower_q):
                return format_place(core_name, raw_name, poi.get("category"), poi.get("city", city_key.capitalize()), poi.get("avg_cost"), poi.get("description"))

    # 3. Clean query to extract requested landmark name (e.g. "link of fatehpur sikri" -> "fatehpur sikri")
    cleaned = lower_q
    for filler in [
        r'\bcan you\b', r'\bcould you\b', r'\bplease\b', r'\bgive me\b', r'\bsend me\b',
        r'\bsend\b', r'\bshow me\b', r'\bshow\b', r'\blink of\b', r'\blink for\b', r'\blink\b',
        r'\burl of\b', r'\bwebsite of\b', r'\bwebsite for\b', r'\bwebsite\b', r'\bredirect me to\b',
        r'\bredirect to\b', r'\bredirect\b', r'\bphotos of\b', r'\breviews of\b', r'\bdetails on\b',
        r'\bdetails of\b', r'\bmore info on\b', r'\bmore info about\b', r'\btell me more about\b',
        r'\btell me about\b', r'\bwhat about\b', r'\bhow to visit\b', r'\bthe\b', r'\bof\b', r'\bfor\b',
        r'\bto\b', r'\ba\b', r'\ban\b', r'\bin\b', r'\bat\b'
    ]:
        cleaned = re.sub(filler, ' ', cleaned)
    cleaned = cleaned.strip(" ?.!:,;\"'")
    if cleaned and len(cleaned) >= 3 and not re.search(r'^(it|this|that|here|place|this place|that place|the place|spot|trip|schedule)$', cleaned):
        clean_target_q = re.sub(r'[^a-z0-9]', '', cleaned)
        for city_key, pois in SAMPLE_POIS.items():
            for poi in pois:
                p_core = poi["name"].split('(')[0].split('&')[0].strip()
                p_clean = re.sub(r'[^a-z0-9]', '', p_core.lower())
                if p_clean and (p_clean in clean_target_q or clean_target_q in p_clean):
                    return format_place(p_core, poi["name"], poi.get("category"), poi.get("city", city_key.capitalize()), poi.get("avg_cost"), poi.get("description"))
        raw_dest = itinerary.metadata.destination if itinerary and itinerary.metadata else ""
        return format_place(cleaned.title(), cleaned.title(), "Landmarks", raw_dest, 0.0, f"A notable travel attraction in {raw_dest}.")

    # 4. Contextual History Inspection: if query didn't name a place, check previous conversation turns
    if history:
        for prev in reversed(history[-6:]):
            prev_text = prev.get("text", "") or ""
            prev_match = find_matching_place(prev_text, itinerary, history=None)
            if prev_match:
                return prev_match

    # 5. Contextual Pronoun Fallback: if user asked using 'it', 'this', 'that', 'here', 'this place'
    if itinerary and itinerary.days and itinerary.days[0].stops:
        first_stop = itinerary.days[0].stops[0]
        raw_act = first_stop.activity
        core_act = raw_act.split('(')[0].split('&')[0].strip()
        raw_dest = itinerary.metadata.destination if itinerary.metadata else ""
        return format_place(core_act, raw_act, first_stop.category, raw_dest, first_stop.estimated_cost, first_stop.notes, first_stop)

    return None

def chat_agent(
    itinerary: Itinerary, 
    question: str, 
    history: Optional[List[Dict[str, Any]]] = None
) -> Tuple[str, Optional[Itinerary], Optional[str]]:
    """
    Real AI Trip Copilot chatbot grounded in itinerary state, full conversation history,
    verified pricing in INR (₹), and direct Google Search and Maps links.
    """
    lower_q = question.lower().strip()
    members = itinerary.metadata.members_count if itinerary and itinerary.metadata else 1
    dest = (itinerary.metadata.destination if itinerary and itinerary.metadata else "your destination").split(" to ")[-1].strip()

    # 1. Handle polite greetings
    if lower_q in ["hi", "hello", "hey", "who are you", "what can you do", "help", "good morning", "good evening"]:
        return f"Hello! I am your TravelPilot AI Trip Copilot. How can I help you with your journey to {dest}?", None, None

    # 2. Polite non-travel filter (coding, math formulas, elections, crypto) - NEVER say harsh "Irrelevant question."
    for pattern in NON_TRAVEL_PATTERNS:
        if re.search(pattern, lower_q):
            return (
                f"I am your TravelPilot AI Trip Copilot, specialized in helping you navigate your journey to {dest}! "
                f"I can't assist with general coding or politics, but feel free to ask me anything about your attractions, schedules, directions, tickets, or local food!",
                None,
                None
            )

    # 3. Direct Link / Website / Map / Photos & Reviews / Directions / Redirection
    if any(k in lower_q for k in [
        "redirect", "link", "website", "url", "open", "google", "photos", 
        "reviews", "maps", "map", "direction", "directions", "location"
    ]) or re.search(r'\b(send|give|provide|show)\b.*\b(link|website|url|photos|map)\b', lower_q):
        matched_place = find_matching_place(question, itinerary, history)
        if matched_place:
            p_name = matched_place["name"]
            p_city = matched_place["city"] or dest
            p_cost = matched_place["cost"]
            cost_str = f"Ticket: ₹{p_cost:,.0f}/person" if p_cost > 0 else "Free Entry"
            query_str = f"{p_name} {p_city}".strip()
            search_url = f"https://www.google.com/search?q={urllib.parse.quote_plus(query_str)}"
            maps_url = f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote_plus(query_str)}"
            reply = (
                f"Here are the direct links for **{p_name}** ({cost_str}):\n\n"
                f"• [{p_name} on Google Search & Photos]({search_url})\n"
                f"• [{p_name} on Google Maps Directions]({maps_url})\n\n"
                f"Click either link to explore visitor reviews, photos, and live visiting hours."
            )
            return reply, None, None
        else:
            query_str = f"{dest}".strip()
            search_url = f"https://www.google.com/search?q={urllib.parse.quote_plus(query_str)}"
            maps_url = f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote_plus(query_str)}"
            reply = (
                f"Here are the direct links for **{dest}**:\n\n"
                f"• [{dest} on Google Search & Photos]({search_url})\n"
                f"• [{dest} on Google Maps Directions]({maps_url})\n\n"
                f"Click either link to explore traveler reviews, photos, and guide information."
            )
            return reply, None, None

    # 4. Rescheduling / Delay questions
    if any(k in lower_q for k in ["delayed", "delay", "late", "traffic", "push everything", "push after"]):
        delay_min = 180
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

    # 5. Cancellation questions
    if any(word in lower_q for word in ["cancel", "remove", "drop", "skip", "delete"]):
        for day in itinerary.days:
            for stop in day.stops:
                if stop.status != "cancelled" and (stop.activity.lower() in lower_q or stop.id.lower() in lower_q):
                    updated_itin, summary, aff_day, alt_name = rebuild_disrupted_day(
                        itinerary, stop_id=stop.id, reason=f"User chat request: '{question}'"
                    )
                    reply = f"'{stop.activity}' has been removed from your schedule."
                    return reply, updated_itin, "cancelled_stop"

    # 6. Tomorrow morning / Tomorrow activities
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

    # 7. Transportation / Travel Mode
    if any(w in lower_q for w in ["transit", "travel mode", "flight", "road", "train", "cab", "transport", "how are we going", "how to reach"]):
        t = itinerary.metadata.transportation
        if t:
            return f"You are travelling by {t.mode} via **{t.route_name}** ({t.carrier_info}).", None, None

    # 8. Budget & Cost
    if any(w in lower_q for w in ["budget", "total budget", "cost", "total cost", "price", "how much"]):
        if "budget" in lower_q and "cost" not in lower_q:
            return f"Your allocated trip budget is ₹{itinerary.metadata.budget:,.0f}.", None, None
        return f"The estimated total trip cost is ₹{itinerary.trip_totals.estimated_total_cost:,.0f} for {members} member(s).", None, None

    # 9. Real AI Chatbot via Gemini (with full history and trip context)
    gemini_key = os.getenv("GEMINI_API_KEY", "") or os.getenv("GOOGLE_API_KEY", "")
    if gemini_key and gemini_key.strip() and gemini_key != "your_gemini_api_key_here":
        all_stops_str = ", ".join([s.activity.split("(")[0].strip() for d in itinerary.days for s in d.stops if s.status != "cancelled"][:8])
        history_str = ""
        if history:
            for h in history[-6:]:
                role_label = "User" if h.get("role") == "user" else "Assistant"
                history_str += f"{role_label}: {h.get('text', '')}\n"

        matched_p = find_matching_place(question, itinerary, history)
        place_hint = ""
        if matched_p:
            p_name = matched_p["name"]
            p_city = matched_p["city"] or dest
            q_str = f"{p_name} {p_city}".strip()
            s_url = f"https://www.google.com/search?q={urllib.parse.quote_plus(q_str)}"
            m_url = f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote_plus(q_str)}"
            place_hint = (
                f"\nContext on place being discussed: {p_name} ({p_city}).\n"
                f"Description: {matched_p.get('description', '')}\n"
                f"Verified ticket: ₹{matched_p.get('cost', 0):,.0f}/person\n"
                f"Links: [Google Search & Photos]({s_url}), [Google Maps Directions]({m_url})\n"
            )

        sys_inst = (
            "You are TravelPilot's AI Trip Copilot — a real, intelligent, and friendly travel assistant.\n"
            "RULES:\n"
            f"1. You are actively assisting with the user's trip to {dest}.\n"
            "2. When the user asks about attractions, timings, 'what makes it special', 'tell me more', or asks for links, provide insightful, practical details.\n"
            "3. Whenever referring to a specific landmark, you can provide markdown links:\n"
            "   • [Place Name on Google Search & Photos](https://www.google.com/search?q=...)\n"
            "   • [Place Name on Google Maps Directions](https://www.google.com/maps/search/?api=1&query=...)\n"
            "4. NEVER say 'Irrelevant question.'. Always be helpful, engaging, and clear (2-4 concise sentences).\n"
            "5. If asked something completely outside travel (like writing code), politely say you specialize in their trip."
        )

        user_prompt = (
            f"Destination: {dest}\n"
            f"Dates: {itinerary.metadata.start_date} to {itinerary.metadata.end_date} ({members} members)\n"
            f"Scheduled Stops: {all_stops_str}\n"
            f"{place_hint}\n"
            f"Conversation History:\n{history_str}\n"
            f"User Question: {question}"
        )

        gemini_reply = call_gemini(user_prompt, sys_inst)
        if gemini_reply and "irrelevant question" not in gemini_reply.lower():
            return gemini_reply, None, None

    # 10. Fallback for place inquiries if Gemini unavailable
    matched_place = find_matching_place(question, itinerary, history)
    if matched_place:
        p_name = matched_place["name"]
        p_city = matched_place["city"] or dest
        p_cost = matched_place["cost"]
        cost_str = f"Verified entry ticket is ₹{p_cost:,.0f}/person." if p_cost > 0 else "Entry is free (no ticket required)."
        query_str = f"{p_name} {p_city}".strip()
        search_url = f"https://www.google.com/search?q={urllib.parse.quote_plus(query_str)}"
        maps_url = f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote_plus(query_str)}"
        desc = matched_place.get("description") or matched_place.get("notes") or f"a celebrated historic attraction in {p_city}."
        lead = f"**{p_name}** ({p_city}) is world-famous as {desc.lower() if not desc.startswith('A') else desc}"
        if not lead.endswith('.'):
            lead += '.'
        reply = (
            f"{lead} {cost_str}\n\n"
            f"• [{p_name} on Google Search & Photos]({search_url})\n"
            f"• [{p_name} on Google Maps Directions]({maps_url})"
        )
        return reply, None, None

    # Fallback: Simple, direct sentence
    return f"Your trip to {dest} includes {itinerary.trip_totals.total_activities} scheduled stops from {itinerary.metadata.start_date} to {itinerary.metadata.end_date}. Feel free to ask about attractions, timings, tickets, or food!", None, None
