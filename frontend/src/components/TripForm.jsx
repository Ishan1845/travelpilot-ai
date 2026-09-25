import React, { useState, useEffect } from 'react';
import { 
  MapPin, Calendar, IndianRupee, Heart, Sparkles, 
  Loader2, Users, Plane, Car, Train, ShieldCheck, Clock, Ban, AlertCircle
} from 'lucide-react';
import PlaceSearchInput from './PlaceSearchInput';
import { isInternationalTransit } from '../data/transportData';

const INTEREST_OPTIONS = [
  "Landmarks",
  "Art & Culture",
  "Food & Dining",
  "Nature & Outdoors",
  "Spiritual & Heritage",
  "Entertainment",
  "Traditional Bazaars"
];

export default function TripForm({ onGenerate, isLoading, initialDestination, initialOrigin, initialMembers, onOpenTransportPage }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultEnd = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [origin, setOrigin] = useState(initialOrigin || "");
  const [destination, setDestination] = useState(initialDestination || "");
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [budget, setBudget] = useState(15000);
  const [membersCount, setMembersCount] = useState(initialMembers || 2);
  const [travelMode, setTravelMode] = useState("road"); // 'road' | 'train' | 'flight'
  const [selectedInterests, setSelectedInterests] = useState(["Landmarks", "Art & Culture", "Food & Dining"]);

  const isInternational = isInternationalTransit(origin, destination);
  const [budgetError, setBudgetError] = useState("");

  // Calculate minimum budget required for the trip
  const calculateMinRequiredBudget = () => {
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    const diffTime = Math.abs(eDate - sDate);
    const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
    const members = Number(membersCount) || 1;

    if (isInternational) {
      // International round trip flights minimum + international accommodation and meals
      return members * (28000 + days * 4000);
    }
    // Domestic transit + hotel + meals + local transport
    const transitBase = travelMode === 'flight' ? 3000 : travelMode === 'train' ? 1000 : 700;
    return members * (transitBase + days * 1200);
  };

  const minRequiredBudget = calculateMinRequiredBudget();
  const isBudgetIrrelevant = Number(budget) > 0 && Number(budget) < minRequiredBudget;

  // If international route, railway and road are impossible — default to flight!
  useEffect(() => {
    if (isInternational && travelMode !== "flight") {
      setTravelMode("flight");
    }
  }, [isInternational, travelMode]);

  // Selecting transportation mode redirects to the Open Live Transport Browser directly
  const handleSelectMode = (mode) => {
    if (isInternational && (mode === 'road' || mode === 'train')) {
      alert(`No ${mode === 'train' ? 'railway' : 'road/cab'} transport is possible for this international route. Flight is the only available travel mode.`);
      return;
    }
    setTravelMode(mode);
    if (onOpenTransportPage) {
      onOpenTransportPage({
        origin: origin.trim() || (isInternational ? "Delhi" : "Vadodara"),
        destination: destination.trim() || (isInternational ? "Paris" : "Agra"),
        startDate,
        travelMode: isInternational ? "flight" : mode,
        membersCount
      });
    }
  };

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter(i => i !== interest));
      }
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const orig = origin.trim();
    const dest = destination.trim();
    if (!orig) {
      alert("Please enter your starting location.");
      return;
    }
    if (!dest) {
      alert("Please enter your destination location.");
      return;
    }
    if (isBudgetIrrelevant) {
      setBudgetError(`Irrelevant budget: Selected budget (₹${Number(budget).toLocaleString('en-IN')}) does not fulfill the trip requirement (Minimum ₹${minRequiredBudget.toLocaleString('en-IN')} needed for ${membersCount} traveler(s)).`);
      setTimeout(() => setBudgetError(""), 5000);
      return;
    }
    setBudgetError("");
    onGenerate({
      origin: orig,
      destination: dest,
      start_date: startDate,
      end_date: endDate,
      budget: parseFloat(budget) || 15000,
      members_count: parseInt(membersCount, 10) || 1,
      travel_mode: travelMode,
      interests: selectedInterests
    });
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm transition-all card-3d">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Sparkles className="w-6 h-6 text-sky-500" />
          Plan Your Next Journey
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Select where you are starting from to your destined location, cluster activities geographically, and compute live verified transit.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* FROM */}
          <div className="space-y-1.5">
            <PlaceSearchInput
              label="FROM"
              value={origin}
              onChange={setOrigin}
              placeholder="Enter starting city (e.g. Vadodara, Delhi, Mumbai...)"
              dark={false}
              required={true}
              id="trip-origin"
            />
          </div>

          {/* TO */}
          <div className="space-y-1.5">
            <PlaceSearchInput
              label="TO"
              value={destination}
              onChange={setDestination}
              placeholder="Enter destination city (e.g. Agra, Jaipur, Varanasi, Goa...)"
              dark={false}
              required={true}
              id="trip-destination"
            />
          </div>

          {/* Members Count */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              How Many Members Are Going?
            </label>
            <select
              value={membersCount}
              onChange={(e) => setMembersCount(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-sm cursor-pointer"
            >
              <option value={1}>1 Solo Traveler</option>
              <option value={2}>2 Members (Couple / Duo)</option>
              <option value={3}>3 Members (Family / Friends)</option>
              <option value={4}>4 Members (Family Group)</option>
              <option value={5}>5 Members (Group)</option>
              <option value={6}>6+ Members (Large Group)</option>
            </select>
          </div>

          {/* Transportation Mode */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              {travelMode === 'flight' ? (
                <Plane className="w-3.5 h-3.5 text-sky-600" />
              ) : travelMode === 'train' ? (
                <Train className="w-3.5 h-3.5 text-teal-600" />
              ) : (
                <Car className="w-3.5 h-3.5 text-amber-600" />
              )}
              Transportation Mode {isInternational ? "(International Flight Only)" : "(Live & Verified IRCTC / NH / Flight)"}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleSelectMode("road")}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isInternational
                    ? 'opacity-40 bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : travelMode === "road"
                      ? 'bg-amber-50 text-amber-900 border-amber-300 ring-2 ring-amber-400/20 shadow-xs cursor-pointer'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 cursor-pointer'
                }`}
                title={isInternational ? "Ola/Uber does not operate for international routes" : "Select Road and open Live Transport Browser"}
              >
                <Car className={`w-4 h-4 ${isInternational ? 'text-slate-400' : 'text-amber-600'}`} />
                <span>🚗 {isInternational ? 'Road (Not Available)' : 'By Road / Expressway'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectMode("train")}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isInternational
                    ? 'opacity-40 bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : travelMode === "train"
                      ? 'bg-teal-50 text-teal-900 border-teal-300 ring-2 ring-teal-400/20 shadow-xs cursor-pointer'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 cursor-pointer'
                }`}
                title={isInternational ? "No railway transport across international borders" : "Select Railway and open Live Transport Browser"}
              >
                <Train className={`w-4 h-4 ${isInternational ? 'text-slate-400' : 'text-teal-600'}`} />
                <span>🚆 {isInternational ? 'Train (Not Available)' : 'By Railway / Train'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectMode("flight")}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  travelMode === "flight"
                    ? 'bg-sky-50 text-sky-900 border-sky-300 ring-2 ring-sky-400/20 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
                title="Select Flight and open Live Transport Browser"
              >
                <Plane className="w-4 h-4 text-sky-600" />
                <span>✈️ By Flight / Air {isInternational ? '(Verified)' : ''}</span>
              </button>
            </div>

            {onOpenTransportPage && (
              <button
                type="button"
                onClick={() => onOpenTransportPage({
                  origin: origin.trim() || (isInternational ? "Delhi" : "Vadodara"),
                  destination: destination.trim() || (isInternational ? "Paris" : "Agra"),
                  startDate,
                  travelMode: isInternational ? "flight" : travelMode,
                  membersCount
                })}
                className="w-full mt-2.5 py-2 px-3 bg-gradient-to-r from-sky-50 via-indigo-50 to-teal-50 hover:from-sky-100 hover:to-indigo-100 text-sky-900 border border-sky-200 hover:border-sky-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>
                  {isInternational 
                    ? `🔍 View Available Flights for ${destination || "International Destination"} →` 
                    : `🔍 View All Available Road (Ola/Cabs), Railway (IRCTC Trains) & Flights From ${origin || "Selected Location"} →`}
                </span>
              </button>
            )}
          </div>

          {/* Budget in INR */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                Total Budget (INR ₹)
              </label>
              {isBudgetIrrelevant && (
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md border border-rose-200">
                  Irrelevant Budget
                </span>
              )}
            </div>
            <input
              type="number"
              min="500"
              max="2000000"
              step="500"
              required
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none transition-all text-sm ${
                isBudgetIrrelevant 
                  ? 'border-rose-400 ring-2 ring-rose-400/20 bg-rose-50/30' 
                  : 'border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500'
              }`}
            />
            {isBudgetIrrelevant && (
              <p className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>
                  Irrelevant budget: Selected budget (₹{Number(budget).toLocaleString('en-IN')}) does not fulfill the trip requirement (Minimum ₹{minRequiredBudget.toLocaleString('en-IN')} needed for {membersCount} member(s)).
                </span>
              </p>
            )}
            {budgetError && (
              <p className="text-xs font-bold text-rose-700 bg-rose-100 border border-rose-300 px-3 py-1.5 rounded-lg mt-1.5">
                ⚠️ {budgetError}
              </p>
            )}
          </div>

          {/* Start Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              Departure Date
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-sm"
            />
          </div>

          {/* End Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              Return Date
            </label>
            <input
              type="date"
              required
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-sm"
            />
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-2 pt-1">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            Trip Interests & Vibe
          </label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => {
              const selected = selectedInterests.includes(interest);
              return (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                    selected
                      ? 'bg-sky-50 text-sky-700 border-sky-300 ring-2 ring-sky-500/20 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${selected ? 'bg-sky-500' : 'bg-slate-300'}`} />
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 hover:from-sky-700 hover:to-indigo-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-sky-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Grounding Real Venues, Transit Buffers & Group Costs...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Grounded Itinerary for {membersCount} Member(s)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
