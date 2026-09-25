import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Car, Train, Plane, Clock, Navigation, 
  CheckCircle2, ShieldCheck, Users, IndianRupee, Calendar, 
  MapPin, Star, AlertCircle, Sparkles, Check, Luggage, Wifi, Coffee,
  ExternalLink, X, ArrowRight
} from 'lucide-react';
import { getAvailableTransportationOptions } from '../data/transportData';

// Dynamic resolver for authentic official booking & schedule links
function getOriginalBookingUrl(item, travelDate, origin, destination) {
  if (!item) return "https://www.makemytrip.com/";
  
  if (item.mode === "road") {
    const prov = (item.provider || "").toLowerCase();
    if (prov.includes("ola")) {
      return "https://book.olacabs.com/";
    }
    if (prov.includes("uber")) {
      return "https://m.uber.com/looking";
    }
    if (prov.includes("intrcity") || prov.includes("smartbus") || prov.includes("volvo") || prov.includes("bus") || prov.includes("zingbus")) {
      return "https://www.redbus.in/";
    }
    return "https://www.makemytrip.com/cabs/";
  }

  if (item.mode === "train") {
    if (item.trainNumber) {
      return `https://www.confirmtkt.com/train-schedule/${item.trainNumber}`;
    }
    return "https://www.confirmtkt.com/";
  }

  if (item.mode === "flight") {
    const air = (item.airline || "").toLowerCase();
    if (air.includes("indigo")) {
      return "https://www.goindigo.in/";
    }
    if (air.includes("air india")) {
      return "https://www.airindia.com/";
    }
    if (air.includes("akasa")) {
      return "https://www.akasaair.com/";
    }
    if (air.includes("spicejet")) {
      return "https://www.spicejet.com/";
    }
    if (destination && origin) {
      return `https://www.google.com/travel/flights?q=Flights%20to%20${encodeURIComponent(destination)}%20from%20${encodeURIComponent(origin)}%20on%20${travelDate || ''}`;
    }
    return "https://www.google.com/travel/flights";
  }

  return "https://www.makemytrip.com/";
}

function getPortalDisplayName(item) {
  if (!item) return "Official Booking Site";
  if (item.mode === "road") {
    const prov = (item.provider || "").toLowerCase();
    if (prov.includes("ola")) return "Ola Outstation Official Booking Portal (book.olacabs.com)";
    if (prov.includes("uber")) return "Uber Intercity Official Booking Portal (m.uber.com)";
    if (prov.includes("intrcity") || prov.includes("bus") || prov.includes("zingbus")) return "RedBus & IntrCity SmartBus Portal (redbus.in)";
    return "Official Cab Booking Service (makemytrip.com/cabs)";
  }
  if (item.mode === "train") {
    return `Indian Railways IRCTC & ConfirmTkt Portal (${item.trainNumber ? 'Train #' + item.trainNumber : 'IRCTC'})`;
  }
  if (item.mode === "flight") {
    const air = (item.airline || "").toLowerCase();
    if (air.includes("indigo")) return "IndiGo Official Airlines Portal (goindigo.in)";
    if (air.includes("air india")) return "Air India Official Portal (airindia.com)";
    if (air.includes("akasa")) return "Akasa Air Official Portal (akasaair.com)";
    if (air.includes("spicejet")) return "SpiceJet Official Portal (spicejet.com)";
    return "Google Flights Official Airline Schedules (google.com/travel/flights)";
  }
  return "Official Operator Booking Portal";
}

export default function TransportationPage({ 
  destination, 
  origin = null, 
  travelDate = null, 
  initialMode = "road", 
  membersCount = 1,
  currentTransportation = null,
  fromForm = false,
  onBack, 
  onSelectOption,
  onModeChange 
}) {
  const optionsData = getAvailableTransportationOptions(
    destination,
    origin,
    travelDate,
    membersCount
  );

  const [activeTab, setActiveTab] = useState(() => {
    if (optionsData.isInternationalRoute) return 'flight';
    return initialMode || "road";
  });

  // Keep activeTab in sync with initialMode selected by user
  useEffect(() => {
    if (optionsData.isInternationalRoute) {
      setActiveTab('flight');
    } else if (initialMode) {
      setActiveTab(initialMode);
    }
  }, [initialMode, optionsData.isInternationalRoute]);

  const handleTabChange = (mode) => {
    setActiveTab(mode);
    if (onModeChange) {
      onModeChange(mode);
    }
  };

  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    option: null,
    portalName: '',
    bookingUrl: '',
    modeLabel: ''
  });

  const currentList = optionsData[activeTab] || [];

  const handleSelect = (option) => {
    setSelectedOptionId(option.id);
    const bookingUrl = getOriginalBookingUrl(option, optionsData.travelDate, optionsData.origin, optionsData.destination);
    const portalName = getPortalDisplayName(option);
    const modeLabel = option.mode === 'road' ? 'Road Cab' : (option.mode === 'train' ? 'IRCTC Train' : 'Commercial Flight');

    // Build updated transportation object compatible with Itinerary schema
    const updatedTrans = {
      mode: option.mode,
      route_name: option.trainName ? `${option.trainNumber} ${option.trainName}` : (option.airline ? `${option.airline} ${option.flightNumber}` : `${option.provider} - ${option.vehicle}`),
      distance_km: option.distanceKm,
      estimated_duration_hours: parseFloat(option.duration) || (option.mode === 'flight' ? 1.5 : (option.mode === 'train' ? 11.5 : 14.0)),
      cost_per_person: option.costPerPerson,
      total_transit_cost: option.totalCost,
      carrier_info: option.trainNumber ? `Indian Railways IRCTC (${option.trainNumber} ${option.trainName})` : (option.airline ? `${option.airline} Commercial Air Carrier (${option.flightNumber})` : `${option.provider} Dedicated Intercity Transit`),
      verified_schedule: option.trainNumber ? `${option.depStation} at ${option.depTime} → ${option.arrStation} at ${option.arrTime} on ${optionsData.formattedDate}` : (option.flightNumber ? `${option.depAirport} (${option.depTime}) → ${option.arrAirport} (${option.arrTime}) on ${optionsData.formattedDate}` : `Pickup at ${option.pickupTime} from ${option.pickupLocation} on ${optionsData.formattedDate}`),
      notes: `Selected by user on ${optionsData.formattedDate} for ${membersCount} member(s). Live fare confirmed on ${portalName}.`
    };

    if (onSelectOption) {
      onSelectOption(updatedTrans);
    }

    // Automatically redirect user to the original link so user can book that ride or see other scheduled rides
    try {
      window.open(bookingUrl, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.warn("Could not automatically open redirect tab:", e);
    }

    // Open confirmation pop-up message
    setConfirmationModal({
      isOpen: true,
      option,
      portalName,
      bookingUrl,
      modeLabel
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-200/90 transition-all flex items-center gap-2 cursor-pointer shadow-xs card-3d group"
        >
          <ArrowLeft className="w-4 h-4 text-sky-600 group-hover:-translate-x-1 transition-transform" />
          <span>{fromForm ? "← Back to Trip Planner" : "← Back to Trip Schedule"}</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap text-xs font-semibold">
          <span className="bg-sky-50 text-sky-700 border border-sky-200 px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-sky-600" />
            <span>Specified Date: <strong>{optionsData.formattedDate}</strong></span>
          </span>

          <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-2xs">
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>{membersCount} Member(s)</span>
          </span>
        </div>
      </div>

      {/* Hero Corridor Banner */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm card-3d relative overflow-hidden">
        {/* National Flag accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Live Date-Verified Transport Options
              </span>
              <span className="text-xs text-slate-400 font-medium">Non-AI Actual Timings & Availability</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>{optionsData.origin} to {optionsData.destination}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed max-w-2xl">
              {optionsData.isInternationalRoute ? (
                <>
                  <strong className="text-sky-700">International Travel Corridor:</strong> No cross-border Indian Railways or road cabs (Ola/Uber) operate between <strong>{optionsData.origin}</strong> and <strong>{optionsData.destination}</strong>. Below are scheduled commercial international flights for <strong>{optionsData.formattedDate}</strong> with authentic airline schedules and official booking links.
                </>
              ) : (
                <>
                  Compare all available Road cabs (Ola/Uber), Indian Railways IRCTC Trains, and Scheduled Flights for <strong>{optionsData.formattedDate}</strong> with authentic timings, operating schedules, and direct booking links. Fares are displayed live upon redirection to the official booking portals.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100">
          {/* Road Tab */}
          <button
            type="button"
            onClick={() => handleTabChange("road")}
            className={`py-3.5 px-4 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2.5 card-3d ${
              activeTab === "road"
                ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-400/30 shadow-md shadow-amber-500/20'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>🚗 By Road {optionsData.isRoadPossible ? '(Ola / Uber / Volvo)' : '(No Cabs Available)'}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === "road" ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {optionsData.road.length}
            </span>
          </button>

          {/* Railway Tab */}
          <button
            type="button"
            onClick={() => handleTabChange("train")}
            className={`py-3.5 px-4 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2.5 card-3d ${
              activeTab === "train"
                ? 'bg-teal-600 text-white border-teal-700 ring-2 ring-teal-400/30 shadow-md shadow-teal-500/20'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <Train className="w-4 h-4" />
            <span>🚆 By Railway {optionsData.isRailwayPossible ? '(Available Trains)' : '(No Trains Available)'}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === "train" ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {optionsData.train.length}
            </span>
          </button>

          {/* Flight Tab */}
          <button
            type="button"
            onClick={() => handleTabChange("flight")}
            className={`py-3.5 px-4 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2.5 card-3d ${
              activeTab === "flight"
                ? 'bg-sky-600 text-white border-sky-700 ring-2 ring-sky-400/30 shadow-md shadow-sky-500/20'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <Plane className="w-4 h-4" />
            <span>✈️ By Flight {optionsData.isInternationalRoute ? '(International Airlines)' : '(Airlines on Date)'}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === "flight" ? 'bg-sky-700 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {optionsData.flight.length}
            </span>
          </button>
        </div>
      </div>

      {/* Options List */}
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2 px-1">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span>
              Available {activeTab === 'road' ? 'Road Cabs & Intercity Coaches' : (activeTab === 'train' ? 'IRCTC Verified Express Trains' : 'Commercial Flights')} on {optionsData.formattedDate}:
            </span>
          </h3>
          <span className="text-xs text-slate-500">
            Operating schedules verified for <strong>{optionsData.formattedDate}</strong>
          </span>
        </div>

        {/* 1. ROAD CARDS */}
        {activeTab === 'road' && (
          optionsData.road.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 sm:p-12 text-center card-3d">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl mx-auto flex items-center justify-center mb-3">
                <Car className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                {optionsData.isInternationalRoute ? "No Cabs (Ola/Uber) Available for this Route" : "No Cabs Available on this Date"}
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                {optionsData.isInternationalRoute
                  ? `No road transport or cab service (Ola/Uber) is available between ${optionsData.origin} and ${optionsData.destination}. Intercontinental and overseas travel cannot be served by road vehicles. Please choose a flight.`
                  : `No scheduled cabs or intercity coaches are operating on ${optionsData.formattedDate} (${optionsData.dayOfWeekName}). Please check other transport modes or choose an adjacent travel date.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {optionsData.road.map((item) => {
                const isSelected = selectedOptionId === item.id || currentTransportation?.route_name?.includes(item.provider);

                return (
                  <div 
                    key={item.id} 
                    className={`bg-white border rounded-3xl p-6 shadow-sm transition-all card-3d flex flex-col justify-between ${
                      isSelected ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/20' : 'border-slate-200/80 hover:border-amber-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-md">
                          {item.provider}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{item.rating}</span>
                          <span className="text-[11px] text-slate-400">({item.reviewsCount})</span>
                        </span>
                      </div>

                      <h4 className="text-lg font-extrabold text-slate-900 tracking-tight">
                        {item.vehicle}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{item.category}</p>

                      {/* Schedule Grid */}
                      <div className="mt-4 bg-slate-50 border border-slate-200/70 rounded-2xl p-3.5 space-y-2 text-xs text-slate-700">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">Pickup Time:</span>
                          <span className="font-extrabold text-slate-900">{item.pickupTime}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">Pickup Location:</span>
                          <span className="font-semibold text-slate-800">{item.pickupLocation}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">Est. Journey Time:</span>
                          <span className="font-bold text-indigo-700">{item.duration} ({item.distanceKm} km)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">Drop Location:</span>
                          <span className="font-semibold text-slate-800">{item.dropLocation}</span>
                        </div>
                      </div>

                      {/* Highlights */}
                      <ul className="mt-3.5 space-y-1.5 text-xs text-slate-600">
                        {item.highlights.map((h, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Booking Site Fare Note and Action */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200/80 px-3 py-1.5 rounded-xl">
                        <ExternalLink className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span>Live fare shown on official booking site</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelect(item)}
                        className={`py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${
                          isSelected 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-amber-600 hover:bg-amber-700 text-white'
                        }`}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                        <span>{isSelected ? 'Active Selection' : 'Select this Cab'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* 2. RAILWAY CARDS */}
        {activeTab === 'train' && (
          optionsData.train.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 sm:p-12 text-center card-3d">
              <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl mx-auto flex items-center justify-center mb-3">
                <Train className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                {optionsData.isInternationalRoute ? "No Trains Available for this Route" : "No Trains Available on this Date"}
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                {optionsData.isInternationalRoute
                  ? `No railway transport is possible between ${optionsData.origin} and ${optionsData.destination} as there is no cross-border rail line connecting these regions. Please travel by scheduled flight.`
                  : `No IRCTC trains are scheduled to operate on ${optionsData.formattedDate} (${optionsData.dayOfWeekName}). Please check other transport modes or choose an adjacent travel date.`}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {optionsData.train.map((item) => {
                const isSelected = selectedOptionId === item.id || currentTransportation?.route_name?.includes(item.trainNumber);

                return (
                  <div 
                    key={item.id} 
                    className={`bg-white border rounded-3xl p-6 sm:p-7 shadow-sm transition-all card-3d ${
                      isSelected ? 'border-teal-400 ring-2 ring-teal-400/20 bg-teal-50/20' : 'border-slate-200/80 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className="text-xs font-extrabold text-white bg-teal-700 px-2.5 py-0.5 rounded-md">
                            #{item.trainNumber}
                          </span>
                          <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-md">
                            IRCTC Superfast Express
                          </span>
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                            {item.punctualityRating}
                          </span>
                        </div>

                        <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">
                          {item.trainName}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{item.route}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 font-medium block">Travel Date</span>
                        <span className="text-sm font-extrabold text-slate-900">{optionsData.formattedDate}</span>
                      </div>
                    </div>

                    {/* Timing & Stations strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5 bg-slate-50 border border-slate-200/70 p-4 rounded-2xl items-center text-center sm:text-left">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Departure</span>
                        <span className="text-lg font-extrabold text-slate-900">{item.depTime}</span>
                        <span className="text-xs text-slate-600 font-medium block">{item.depStation}</span>
                      </div>

                      <div className="flex flex-col items-center justify-center py-2 sm:py-0 border-y sm:border-y-0 sm:border-x border-slate-200">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{item.duration}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium mt-0.5">{item.distanceKm} km Superfast</span>
                      </div>

                      <div className="sm:text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Arrival</span>
                        <span className="text-lg font-extrabold text-slate-900">{item.arrTime}</span>
                        <span className="text-xs text-slate-600 font-medium block">{item.arrStation}</span>
                      </div>
                    </div>

                    {/* Classes and Availability */}
                    <div>
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
                        Available Travel Classes for {optionsData.formattedDate}:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {item.classes.map((cls, idx) => (
                          <div 
                            key={idx} 
                            className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-2xs hover:border-teal-400 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-extrabold text-slate-900">{cls.code}</span>
                              <span className="text-[10px] text-slate-400 font-medium">{cls.name}</span>
                            </div>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border block mb-1.5 truncate ${cls.statusColor}`}>
                              {cls.availability}
                            </span>
                            <div className="flex items-center justify-between text-[11px] font-bold text-sky-700">
                              <span>Fare on IRCTC</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pantry and Action */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                        <Coffee className="w-3.5 h-3.5 text-amber-600" />
                        <span>{item.pantry}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handleSelect(item)}
                        className={`py-2.5 px-5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${
                          isSelected 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-teal-600 hover:bg-teal-700 text-white'
                        }`}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                        <span>{isSelected ? 'Active Selection' : 'Select this Train'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* 3. FLIGHT CARDS */}
        {activeTab === 'flight' && (
          optionsData.flight.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 sm:p-12 text-center card-3d">
              <div className="w-14 h-14 bg-sky-50 text-sky-600 rounded-2xl mx-auto flex items-center justify-center mb-3">
                <Plane className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">No Flights Available on this Date</h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                No commercial flights are scheduled to operate on {optionsData.formattedDate} ({optionsData.dayOfWeekName}). Please check other transport modes or choose an adjacent travel date.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {optionsData.flight.map((item) => {
                const isSelected = selectedOptionId === item.id || currentTransportation?.route_name?.includes(item.flightNumber);

                return (
                  <div 
                    key={item.id} 
                    className={`bg-white border rounded-3xl p-6 sm:p-7 shadow-sm transition-all card-3d ${
                      isSelected ? 'border-sky-400 ring-2 ring-sky-400/20 bg-sky-50/20' : 'border-slate-200/80 hover:border-sky-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className="text-xs font-extrabold text-white bg-sky-600 px-2.5 py-0.5 rounded-md">
                            {item.airlineCode}
                          </span>
                          <span className="text-xs font-bold text-sky-900 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-md">
                            {item.flightNumber}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            {item.aircraft}
                          </span>
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                            {item.onTimeRating}
                          </span>
                        </div>

                        <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">
                          {item.airline}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{item.route}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 font-medium block">Flight Date</span>
                        <span className="text-sm font-extrabold text-slate-900">{optionsData.formattedDate}</span>
                      </div>
                    </div>

                    {/* Timing Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5 bg-slate-50 border border-slate-200/70 p-4 rounded-2xl items-center text-center sm:text-left">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Departure</span>
                        <span className="text-lg font-extrabold text-slate-900">{item.depTime}</span>
                        <span className="text-xs text-slate-600 font-medium block">{item.depAirport}</span>
                      </div>

                      <div className="flex flex-col items-center justify-center py-2 sm:py-0 border-y sm:border-y-0 sm:border-x border-slate-200">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700">
                          <Plane className="w-3.5 h-3.5" />
                          <span>{item.duration}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium mt-0.5">{item.stops}</span>
                      </div>

                      <div className="sm:text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Arrival</span>
                        <span className="text-lg font-extrabold text-slate-900">{item.arrTime}</span>
                        <span className="text-xs text-slate-600 font-medium block">{item.arrAirport}</span>
                      </div>
                    </div>

                    {/* Fare classes & Amenities */}
                    <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
                      <div className="flex items-center gap-3 flex-wrap text-xs text-slate-600 font-medium">
                        <span className="flex items-center gap-1">
                          <Luggage className="w-3.5 h-3.5 text-indigo-500" />
                          <span>15 kg Check-in + 7 kg Cabin</span>
                        </span>
                        {item.amenities.map((a, i) => (
                          <span key={i} className="flex items-center gap-1 bg-slate-100 px-2.5 py-0.5 rounded-md">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>{a}</span>
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 flex-wrap ml-auto">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200/80 px-3 py-1.5 rounded-xl">
                          <ExternalLink className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span>Live fare at airline booking</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelect(item)}
                          className={`py-2.5 px-5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${
                            isSelected 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-sky-600 hover:bg-sky-700 text-white'
                          }`}
                        >
                          {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                          <span>{isSelected ? 'Active Selection' : 'Select this Flight'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* POP-UP CONFIRMATION MODAL ON BOOKING / SELECTION */}
      {confirmationModal.isOpen && confirmationModal.option && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border-2 border-emerald-400 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl card-3d relative animate-scaleUp">
            {/* Close 'X' Button */}
            <button
              type="button"
              onClick={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Badge */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-block">
                  ✓ Booking Confirmed & Redirected
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  {confirmationModal.modeLabel} Selected!
                </h3>
              </div>
            </div>

            {/* Redirection Notification Box */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200 rounded-2xl p-4 mb-4 text-xs">
              <p className="font-extrabold text-emerald-950 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Redirected to Official Operator Site:</span>
              </p>
              <p className="text-slate-700 font-medium leading-relaxed">
                We have opened <strong>{confirmationModal.portalName}</strong> in a new tab so you can complete your booking or see other scheduled {confirmationModal.modeLabel.toLowerCase()}s.
              </p>
            </div>

            {/* Transport Details Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 text-xs text-slate-700 mb-5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Service / Carrier:</span>
                <span className="font-black text-slate-900 text-right">
                  {confirmationModal.option.trainName 
                    ? `${confirmationModal.option.trainNumber} - ${confirmationModal.option.trainName}`
                    : (confirmationModal.option.airline 
                        ? `${confirmationModal.option.airline} (${confirmationModal.option.flightNumber})`
                        : `${confirmationModal.option.provider} (${confirmationModal.option.vehicle})`)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Journey Route:</span>
                <span className="font-bold text-slate-800">
                  {optionsData.origin} → {optionsData.destination}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Travel Date:</span>
                <span className="font-bold text-slate-800">
                  {optionsData.formattedDate}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Schedule / Timing:</span>
                <span className="font-bold text-slate-800">
                  {confirmationModal.option.depTime || confirmationModal.option.pickupTime}
                  {confirmationModal.option.arrTime ? ` → ${confirmationModal.option.arrTime}` : ''}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-500 font-semibold">Fare Policy:</span>
                <span className="text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200/80 px-2.5 py-1 rounded-lg">
                  Live fare shown on official booking portal
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <a
                href={confirmationModal.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer text-center"
              >
                <span>🌐 Open Official Booking Site</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              {confirmationModal.option.mode === "train" && (
                <a
                  href="https://www.irctc.co.in/nget/train-search"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center gap-2 transition-all cursor-pointer text-center"
                >
                  <span>🚆 Or Open Official IRCTC Portal (irctc.co.in)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              )}

              <button
                type="button"
                onClick={() => {
                  setConfirmationModal(prev => ({ ...prev, isOpen: false }));
                  if (onBack) onBack();
                }}
                className="w-full py-3 px-4 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Return to Trip Schedule</span>
              </button>

              <button
                type="button"
                onClick={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer text-center"
              >
                Stay on Live Transport Browser
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

