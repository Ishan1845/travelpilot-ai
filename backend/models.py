from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field
import uuid

class Location(BaseModel):
    lat: float
    lng: float
    address: str

class TimeSlot(BaseModel):
    start: str  # "09:00"
    end: str    # "11:30"

class TransitBuffer(BaseModel):
    duration_minutes: int
    mode: str = "transit"  # transit, walking, driving, cab
    from_name: str
    to_name: str
    distance_km: float

class Stop(BaseModel):
    id: str = Field(default_factory=lambda: f"stop_{uuid.uuid4().hex[:8]}")
    place_id: Optional[str] = None
    time_slot: TimeSlot
    activity: str
    category: str
    location: Location
    estimated_cost: float  # In INR (₹)
    estimated_duration: int  # minutes
    status: Literal["planned", "cancelled", "suggested_alternative"] = "planned"
    notes: Optional[str] = ""
    transit_from_prev: Optional[TransitBuffer] = None

class DayItinerary(BaseModel):
    day_number: int
    date: str  # YYYY-MM-DD
    theme: Optional[str] = "Exploration"
    stops: List[Stop] = Field(default_factory=list)

class TransportationInfo(BaseModel):
    mode: Literal["flight", "road", "train"] = "road"
    route_name: str
    distance_km: float
    estimated_duration_hours: float
    cost_per_person: float  # INR (₹)
    total_transit_cost: float  # INR (₹)
    carrier_info: str
    verified_schedule: str
    notes: Optional[str] = ""
    available_modes: Optional[Dict[str, Any]] = None

class TripMetadata(BaseModel):
    destination: str
    origin: Optional[str] = None
    start_date: str
    end_date: str
    budget: float  # INR (₹)
    members_count: int = 1
    travel_mode: Literal["flight", "road", "train"] = "road"
    transportation: Optional[TransportationInfo] = None
    interests: List[str] = Field(default_factory=list)

class TripTotals(BaseModel):
    estimated_total_cost: float = 0.0  # Total including members & transit
    activities_cost: float = 0.0
    transport_cost: float = 0.0
    cost_per_day: Dict[str, float] = Field(default_factory=dict)
    total_activities: int = 0
    members_count: int = 1
    currency: str = "INR"

class Conflict(BaseModel):
    type: Literal["overlap", "outside_hours", "unrealistic_travel", "budget_exceeded"]
    day_number: int
    stop_id: Optional[str] = None
    activity_name: Optional[str] = None
    description: str
    severity: Literal["error", "warning"] = "warning"

class Itinerary(BaseModel):
    trip_id: str = Field(default_factory=lambda: f"trip_{uuid.uuid4().hex[:8]}")
    metadata: TripMetadata
    days: List[DayItinerary] = Field(default_factory=list)
    trip_totals: TripTotals = Field(default_factory=TripTotals)
    conflicts: List[Conflict] = Field(default_factory=list)
    disruption_notes: Optional[str] = None

# API Request / Response schemas

class GenerateRequest(BaseModel):
    destination: str
    origin: Optional[str] = None
    start_date: str
    end_date: str
    budget: float  # INR (₹)
    members_count: int = 1
    travel_mode: Literal["flight", "road", "train"] = "road"
    interests: List[str] = Field(default_factory=list)

class ValidateRequest(BaseModel):
    itinerary: Itinerary

class ValidateResponse(BaseModel):
    is_valid: bool
    conflicts: List[Conflict]
    summary: str

class ChatRequest(BaseModel):
    itinerary: Itinerary
    message: str
    history: Optional[List[Dict[str, Any]]] = None

class ChatResponse(BaseModel):
    reply: str
    updated_itinerary: Optional[Itinerary] = None
    action_taken: Optional[str] = None

class DisruptRequest(BaseModel):
    itinerary: Itinerary
    stop_id: str
    reason: Optional[str] = "User requested cancellation"

class DisruptResponse(BaseModel):
    updated_itinerary: Itinerary
    summary: str
    affected_day: int
    alternative_suggested: Optional[str] = None

class UpdateConstraintsRequest(BaseModel):
    itinerary: Itinerary
    new_budget: Optional[float] = None
    new_members_count: Optional[int] = None
    new_travel_mode: Optional[Literal["flight", "road", "train"]] = None
    new_start_date: Optional[str] = None
    new_end_date: Optional[str] = None
    new_interests: Optional[List[str]] = None

class UpdateConstraintsResponse(BaseModel):
    updated_itinerary: Itinerary
    summary: str
    changes_made: List[str]

class ShiftDetail(BaseModel):
    stop_id: str
    activity: str
    original_start: str
    original_end: str
    new_start: str
    new_end: str
    notes: Optional[str] = None

class ResequenceDelayRequest(BaseModel):
    itinerary: Itinerary
    disruption_type: str = "flight_delay"
    delay_minutes: int = 180
    delay_title: str = "Flight delayed by 3 hours"
    affected_day: int = 1

class ResequenceDelayResponse(BaseModel):
    updated_itinerary: Itinerary
    proactive_question: str
    ripple_summary: str
    affected_day: int
    delay_minutes: int
    shifts: List[ShiftDetail] = Field(default_factory=list)
    auto_resolved: bool = True

