import copy
import uuid
from typing import Tuple, Optional, List, Dict, Any
from models import Itinerary, Stop, TimeSlot, Location, TransitBuffer, Conflict, TransportationInfo
from tools import search_places, estimate_travel_time, check_conflicts
from poi_db import get_realistic_transportation

def recalculate_trip_totals(itinerary: Itinerary) -> None:
    """Updates activities_cost, transport_cost, estimated_total_cost, cost_per_day, and total_activities in INR (₹)."""
    members = max(1, itinerary.metadata.members_count)
    activities_subtotal = 0.0
    cost_per_day: Dict[str, float] = {}
    active_count = 0

    for day in itinerary.days:
        day_cost = 0.0
        for stop in day.stops:
            if stop.status != "cancelled":
                # Cost per person scaled by members count
                stop_total = stop.estimated_cost * members
                day_cost += stop_total
                active_count += 1
        cost_per_day[day.date] = round(day_cost, 2)
        activities_subtotal += day_cost

    # Transportation cost
    trans_cost = 0.0
    if itinerary.metadata.transportation:
        trans_cost = itinerary.metadata.transportation.total_transit_cost
    else:
        # Fallback realistic compute
        trans_info = get_realistic_transportation(
            itinerary.metadata.destination,
            itinerary.metadata.travel_mode,
            members,
            itinerary.metadata.start_date
        )
        itinerary.metadata.transportation = TransportationInfo(**trans_info)
        trans_cost = trans_info["total_transit_cost"]

    itinerary.trip_totals.activities_cost = round(activities_subtotal, 2)
    itinerary.trip_totals.transport_cost = round(trans_cost, 2)
    itinerary.trip_totals.estimated_total_cost = round(activities_subtotal + trans_cost, 2)
    itinerary.trip_totals.cost_per_day = cost_per_day
    itinerary.trip_totals.total_activities = active_count
    itinerary.trip_totals.members_count = members
    itinerary.trip_totals.currency = "INR"

def rebuild_disrupted_day(
    itinerary: Itinerary,
    stop_id: str,
    reason: Optional[str] = "User requested cancellation"
) -> Tuple[Itinerary, str, int, Optional[str]]:
    """
    Dynamically rebuilds only the affected day when a stop is cancelled:
    1. Marks the target stop as 'cancelled'
    2. Suggests a concrete alternative near the same location/category/time slot
    3. Leaves other days completely intact
    4. Updates travel buffers, re-validates, and recalculates totals in ₹ (INR).
    """
    updated_itin = itinerary.model_copy(deep=True)
    affected_day_idx = -1
    affected_stop = None
    affected_stop_idx = -1

    for d_idx, day in enumerate(updated_itin.days):
        for s_idx, stop in enumerate(day.stops):
            if stop.id == stop_id:
                affected_day_idx = d_idx
                affected_stop = stop
                affected_stop_idx = s_idx
                break
        if affected_day_idx != -1:
            break

    if affected_day_idx == -1 or affected_stop is None:
        return updated_itin, f"Stop with id '{stop_id}' not found in itinerary.", 0, None

    affected_day = updated_itin.days[affected_day_idx]
    affected_stop.status = "cancelled"
    affected_stop.notes = f"Cancelled: {reason}"

    dest = updated_itin.metadata.destination
    candidates = search_places(
        location=dest,
        near_lat=affected_stop.location.lat,
        near_lng=affected_stop.location.lng
    )

    # Look for candidates not already active on this day and not the cancelled activity
    day_active_names = set(s.activity.lower() for s in affected_day.stops if s.status != "cancelled")
    
    fresh_candidates = [
        c for c in candidates 
        if c["name"].lower() not in day_active_names and c["name"].lower() != affected_stop.activity.lower()
    ]

    # If all city POIs are scheduled on this day, synthesize or pick closest alternative not identical to cancelled stop
    if not fresh_candidates:
        fresh_candidates = [c for c in candidates if c["name"].lower() != affected_stop.activity.lower()]
        
    if not fresh_candidates:
        # Synthesize guaranteed cultural or scenic alternative
        fresh_candidates = [{
            "id": f"{dest.lower()[:3]}_alt",
            "name": f"{dest} Heritage Artisan Walk & Local Market",
            "category": "Art & Culture",
            "lat": affected_stop.location.lat + 0.005,
            "lng": affected_stop.location.lng + 0.005,
            "address": f"Old Quarter, {dest}",
            "open_time": "09:00",
            "close_time": "21:00",
            "avg_cost": 50.0,
            "avg_duration": 90,
            "description": f"Enchanting walking tour exploring traditional artisans, crafts, and heritage courtyards in {dest}."
        }]

    best_candidate = None
    for cand in fresh_candidates:
        if cand["category"].lower() == affected_stop.category.lower():
            best_candidate = cand
            break
    if not best_candidate and fresh_candidates:
        best_candidate = fresh_candidates[0]

    summary_text = ""
    alternative_name = None

    if best_candidate:
        alternative_name = best_candidate["name"]
        prev_stop = None
        for i in range(affected_stop_idx - 1, -1, -1):
            if affected_day.stops[i].status != "cancelled":
                prev_stop = affected_day.stops[i]
                break

        transit_buf = None
        if prev_stop:
            transit_info = estimate_travel_time(
                {"lat": prev_stop.location.lat, "lng": prev_stop.location.lng},
                {"lat": best_candidate["lat"], "lng": best_candidate["lng"]},
                mode="transit"
            )
            transit_buf = TransitBuffer(
                duration_minutes=transit_info["minutes"],
                mode=transit_info["mode"],
                from_name=prev_stop.activity,
                to_name=best_candidate["name"],
                distance_km=transit_info["distance_km"]
            )

        alt_stop = Stop(
            id=f"alt_{uuid.uuid4().hex[:8]}",
            place_id=best_candidate.get("id"),
            time_slot=TimeSlot(
                start=affected_stop.time_slot.start,
                end=affected_stop.time_slot.end
            ),
            activity=best_candidate["name"],
            category=best_candidate["category"],
            location=Location(
                lat=best_candidate["lat"],
                lng=best_candidate["lng"],
                address=best_candidate["address"]
            ),
            estimated_cost=best_candidate["avg_cost"],
            estimated_duration=min(best_candidate["avg_duration"], affected_stop.estimated_duration),
            status="suggested_alternative",
            notes=f"Recommended alternative replacing {affected_stop.activity} ({best_candidate['description']})",
            transit_from_prev=transit_buf
        )

        affected_day.stops.insert(affected_stop_idx + 1, alt_stop)

        summary_text = (
            f"Your {affected_stop.time_slot.start} activity '{affected_stop.activity}' was cancelled. "
            f"We dynamically replaced it with '{best_candidate['name']}' ({best_candidate['category']}, "
            f"₹{best_candidate['avg_cost']} per person) on Day {affected_day.day_number}. "
            f"All other days remain untouched."
        )
    else:
        summary_text = (
            f"Your {affected_stop.time_slot.start} activity '{affected_stop.activity}' was marked as cancelled. "
            f"No immediate nearby POI was found, leaving free leisure time on Day {affected_day.day_number}."
        )

    recalculate_trip_totals(updated_itin)
    raw_conflicts = check_conflicts(updated_itin.model_dump())
    updated_itin.conflicts = [Conflict(**c) for c in raw_conflicts]
    updated_itin.disruption_notes = summary_text

    return updated_itin, summary_text, affected_day.day_number, alternative_name

def handle_update_constraints(
    itinerary: Itinerary,
    new_budget: Optional[float] = None,
    new_members_count: Optional[int] = None,
    new_travel_mode: Optional[str] = None,
    new_start_date: Optional[str] = None,
    new_end_date: Optional[str] = None,
    new_interests: Optional[List[str]] = None
) -> Tuple[Itinerary, str, List[str]]:
    """
    Recomputes only parts of the itinerary impacted by changed constraints in ₹ (INR).
    """
    updated_itin = itinerary.model_copy(deep=True)
    changes: List[str] = []

    if new_members_count is not None and new_members_count != updated_itin.metadata.members_count:
        old_m = updated_itin.metadata.members_count
        updated_itin.metadata.members_count = new_members_count
        # Recalculate transit for new members count
        trans = get_realistic_transportation(
            updated_itin.metadata.destination,
            updated_itin.metadata.travel_mode,
            new_members_count,
            updated_itin.metadata.start_date
        )
        updated_itin.metadata.transportation = TransportationInfo(**trans)
        changes.append(f"Updated group size from {old_m} to {new_members_count} member(s)")

    if new_travel_mode and new_travel_mode != updated_itin.metadata.travel_mode:
        old_mode = updated_itin.metadata.travel_mode
        updated_itin.metadata.travel_mode = new_travel_mode
        trans = get_realistic_transportation(
            updated_itin.metadata.destination,
            new_travel_mode,
            updated_itin.metadata.members_count,
            updated_itin.metadata.start_date
        )
        updated_itin.metadata.transportation = TransportationInfo(**trans)
        changes.append(f"Switched transit from {old_mode.title()} to {new_travel_mode.title()} ({trans['route_name']})")

    if new_budget is not None:
        updated_itin.metadata.budget = new_budget
        recalculate_trip_totals(updated_itin)

        if new_budget < updated_itin.trip_totals.estimated_total_cost:
            all_active = []
            for d_idx, day in enumerate(updated_itin.days):
                for s_idx, stop in enumerate(day.stops):
                    if stop.status != "cancelled" and stop.estimated_cost > 0:
                        all_active.append((stop.estimated_cost, d_idx, s_idx, stop))

            all_active.sort(key=lambda x: x[0], reverse=True)

            cheaper_pois = search_places(location=updated_itin.metadata.destination)
            cheaper_pois.sort(key=lambda x: x["avg_cost"])

            for cost, d_idx, s_idx, target_stop in all_active:
                if updated_itin.trip_totals.estimated_total_cost <= new_budget:
                    break
                cand = next((p for p in cheaper_pois if p["avg_cost"] < cost and p["name"].lower() != target_stop.activity.lower()), None)
                if cand:
                    diff = (cost - cand["avg_cost"]) * updated_itin.metadata.members_count
                    target_stop.place_id = cand.get("id")
                    target_stop.activity = cand["name"]
                    target_stop.category = cand["category"]
                    target_stop.estimated_cost = cand["avg_cost"]
                    target_stop.location = Location(lat=cand["lat"], lng=cand["lng"], address=cand["address"])
                    target_stop.status = "suggested_alternative"
                    target_stop.notes = f"Replaced higher cost activity to respect revised budget of ₹{new_budget:,.0f}"
                    changes.append(f"Swapped activity on Day {updated_itin.days[d_idx].day_number} for {cand['name']} (saved ₹{diff:,.0f})")
                    recalculate_trip_totals(updated_itin)

    if new_interests:
        updated_itin.metadata.interests = new_interests
        changes.append(f"Updated preferences to: {', '.join(new_interests)}")

    recalculate_trip_totals(updated_itin)
    raw_conflicts = check_conflicts(updated_itin.model_dump())
    updated_itin.conflicts = [Conflict(**c) for c in raw_conflicts]

    summary = "; ".join(changes) if changes else "Itinerary synchronized with updated constraints."
    return updated_itin, summary, changes

def add_minutes_to_time(time_str: str, minutes_to_add: int) -> str:
    """Calculates new HH:MM by adding minutes, capped at 23:59."""
    try:
        parts = time_str.strip().split(":")
        h = int(parts[0])
        m = int(parts[1])
        total_m = h * 60 + m + minutes_to_add
        total_m = min(total_m, 23 * 60 + 59)
        new_h = total_m // 60
        new_m = total_m % 60
        return f"{new_h:02d}:{new_m:02d}"
    except Exception:
        return time_str

def handle_resequence_delay(
    itinerary: Itinerary,
    disruption_type: str = "flight_delay",
    delay_minutes: int = 180,
    delay_title: str = "Flight delayed by 3 hours",
    affected_day: int = 1
) -> Dict[str, Any]:
    """
    Living Itinerary Real-Time Ripple Disruption Engine:
    Detects when a flight, train, or highway transport gets delayed (e.g. by 3 hours).
    Instead of a static booking display like MMT, TravelPilot asks:
    'Your flight got delayed by 3 hours — should I push everything after it?'
    and re-sequences the downstream schedule automatically.
    """
    updated_itin = itinerary.model_copy(deep=True)
    target_day_idx = max(0, min(affected_day - 1, len(updated_itin.days) - 1))
    target_day = updated_itin.days[target_day_idx]
    
    shifts = []
    prev_stop = None

    delay_h = delay_minutes / 60.0
    delay_label = f"{delay_h:.1f}".rstrip('0').rstrip('.') + " hours" if delay_h >= 1 else f"{delay_minutes} minutes"

    for idx, stop in enumerate(target_day.stops):
        if stop.status == "cancelled":
            continue

        orig_start = stop.time_slot.start
        orig_end = stop.time_slot.end

        new_start = add_minutes_to_time(orig_start, delay_minutes)
        new_end = add_minutes_to_time(orig_end, delay_minutes)

        stop.time_slot.start = new_start
        stop.time_slot.end = new_end
        
        note_suffix = f"[⚡ Living Itinerary: Shifted +{delay_label} due to {delay_title}]"
        stop.notes = f"{stop.notes or ''} {note_suffix}".strip()
        stop.status = "planned"

        if prev_stop:
            transit_info = estimate_travel_time(
                {"lat": prev_stop.location.lat, "lng": prev_stop.location.lng},
                {"lat": stop.location.lat, "lng": stop.location.lng},
                mode="transit"
            )
            stop.transit_from_prev = TransitBuffer(
                duration_minutes=transit_info["minutes"],
                mode=transit_info.get("mode", "transit"),
                from_name=prev_stop.activity,
                to_name=stop.activity,
                distance_km=transit_info["distance_km"]
            )

        shifts.append({
            "stop_id": stop.id,
            "activity": stop.activity,
            "original_start": orig_start,
            "original_end": orig_end,
            "new_start": new_start,
            "new_end": new_end,
            "notes": f"Shifted by {delay_label} to absorb {delay_title}"
        })
        prev_stop = stop

    if updated_itin.metadata.transportation:
        trans = updated_itin.metadata.transportation
        trans.verified_schedule = f"{trans.verified_schedule} • [⚡ Delayed +{delay_label}: Living Itinerary Re-sequenced]"

    recalculate_trip_totals(updated_itin)
    raw_conflicts = check_conflicts(updated_itin.model_dump())
    updated_itin.conflicts = [Conflict(**c) for c in raw_conflicts]

    transport_word = disruption_type.replace('_delay', '').replace('_', ' ')
    proactive_question = (
        f"Your {transport_word} got delayed by {delay_label} — "
        f"TravelPilot detected the ripple effect across {len(shifts)} remaining activities on Day {target_day.day_number}. "
        f"Should I push everything after it? The living itinerary has been re-sequenced automatically."
    )

    shifted_strs = [f"{s['activity']} ({s['original_start']} ➔ {s['new_start']})" for s in shifts]
    shifted_details_str = ", ".join(shifted_strs)

    ripple_summary = (
        f"TravelPilot Living Itinerary Engine detected a {delay_label} delay on {delay_title}. "
        f"Automatically absorbed the delay and re-sequenced {len(shifts)} activities on Day {target_day.day_number}: "
        f"{shifted_details_str}. "
        f"All transit buffers and arrival windows synchronized in real time."
    )

    updated_itin.disruption_notes = ripple_summary

    return {
        "updated_itinerary": updated_itin,
        "proactive_question": proactive_question,
        "ripple_summary": ripple_summary,
        "affected_day": target_day.day_number,
        "delay_minutes": delay_minutes,
        "shifts": shifts,
        "auto_resolved": True
    }

