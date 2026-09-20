import sys
import os

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app
from tools import search_places, estimate_travel_time, check_conflicts

client = TestClient(app)

def test_indian_destinations_and_transit():
    print("Testing search_places for Agra (Taj Mahal)...")
    agra_pois = search_places("Agra", category="Landmarks")
    assert len(agra_pois) > 0, "Should return landmarks in Agra"
    assert any("Taj Mahal" in p["name"] for p in agra_pois)
    print("Found Taj Mahal:", agra_pois[0]["name"], "Cost: ₹", agra_pois[0]["avg_cost"])

def test_end_to_end_scenario():
    print("1. Generating 3-day Agra trip for 2 members via Road transit...")
    gen_payload = {
        "destination": "Agra",
        "start_date": "2026-10-01",
        "end_date": "2026-10-03",
        "budget": 20000.0,
        "members_count": 2,
        "travel_mode": "road",
        "interests": ["Landmarks", "Art & Culture", "Food & Dining"]
    }
    resp = client.post("/itinerary/generate", json=gen_payload)
    assert resp.status_code == 200, f"Generate failed: {resp.text}"
    itin = resp.json()
    assert len(itin["days"]) == 3
    assert itin["trip_totals"]["currency"] == "INR"
    assert itin["metadata"]["members_count"] == 2
    assert itin["metadata"]["transportation"] is not None
    print(f"Generated itinerary for {itin['metadata']['destination']} for {itin['metadata']['members_count']} members.")
    print(f"Transit: {itin['metadata']['transportation']['route_name']} (Total ₹{itin['trip_totals']['transport_cost']})")
    print(f"Total trip cost: ₹{itin['trip_totals']['estimated_total_cost']}")

    day1_stops_before = [s["activity"] for s in itin["days"][0]["stops"]]
    day2_stops_before = [s["activity"] for s in itin["days"][1]["stops"]]
    day3_stops_before = [s["activity"] for s in itin["days"][2]["stops"]]

    print("2. Validating itinerary...")
    val_resp = client.post("/itinerary/validate", json={"itinerary": itin})
    assert val_resp.status_code == 200
    val_data = val_resp.json()
    print(f"Validation summary: {val_data['summary']}")

    print("3. Asking chat: 'what should I do tomorrow morning?'...")
    chat_resp = client.post("/itinerary/chat", json={
        "itinerary": itin,
        "message": "what should I do tomorrow morning?"
    })
    assert chat_resp.status_code == 200
    print(f"Chat reply: {chat_resp.json()['reply']}")

    print("4. Disrupting Day 2 activity...")
    target_stop = itin["days"][1]["stops"][0]
    target_stop_id = target_stop["id"]
    print(f"Cancelling Day 2 stop: {target_stop['activity']} (ID: {target_stop_id})")

    disrupt_resp = client.post("/itinerary/disrupt", json={
        "itinerary": itin,
        "stop_id": target_stop_id,
        "reason": "Monuments VIP high-security protocol"
    })
    assert disrupt_resp.status_code == 200
    disrupt_data = disrupt_resp.json()
    print(f"Disruption summary: {disrupt_data['summary']}")
    assert disrupt_data["affected_day"] == 2

    updated_itin = disrupt_data["updated_itinerary"]
    day1_stops_after = [s["activity"] for s in updated_itin["days"][0]["stops"] if s["status"] != "cancelled"]
    day3_stops_after = [s["activity"] for s in updated_itin["days"][2]["stops"] if s["status"] != "cancelled"]

    # Verify Day 1 and Day 3 remain untouched!
    assert day1_stops_before == day1_stops_after, "Day 1 stops must be identical before and after Day 2 disruption!"
    assert day3_stops_before == day3_stops_after, "Day 3 stops must be identical before and after Day 2 disruption!"
    print("SUCCESS: Day 1 and Day 3 are completely untouched!")

    # Verify Day 2 has the alternative
    cancelled_found = any(s["status"] == "cancelled" for s in updated_itin["days"][1]["stops"])
    alt_found = any(s["status"] == "suggested_alternative" for s in updated_itin["days"][1]["stops"])
    assert cancelled_found, "Cancelled stop should be present and marked as cancelled"
    assert alt_found, "Alternative stop should be suggested"
    print("SUCCESS: Disrupted activity replaced with dynamic alternative on Day 2 in INR!")

    print("5. Testing constraint update (switching to Train / Railway)...")
    train_resp = client.post("/itinerary/update-constraints", json={
        "itinerary": updated_itin,
        "new_travel_mode": "train"
    })
    assert train_resp.status_code == 200
    train_data = train_resp.json()
    assert train_data["updated_itinerary"]["metadata"]["travel_mode"] == "train"
    assert "Vande Bharat" in train_data["updated_itinerary"]["metadata"]["transportation"]["route_name"] or "IRCTC" in train_data["updated_itinerary"]["metadata"]["transportation"]["carrier_info"]
    print(f"Railway update summary: {train_data['summary']}")
    print(f"Railway Route: {train_data['updated_itinerary']['metadata']['transportation']['route_name']}")
    print(f"Railway Carrier: {train_data['updated_itinerary']['metadata']['transportation']['carrier_info']}")

    print("6. Testing constraint update (switching to Flight)...")
    flight_resp = client.post("/itinerary/update-constraints", json={
        "itinerary": train_data["updated_itinerary"],
        "new_travel_mode": "flight"
    })
    assert flight_resp.status_code == 200
    print(f"Flight constraint update summary: {flight_resp.json()['summary']}")

if __name__ == "__main__":
    test_indian_destinations_and_transit()
    test_end_to_end_scenario()
    print("\nALL BACKEND TESTS INCLUDING RAILWAY PASSED WITH FLYING COLORS!")
