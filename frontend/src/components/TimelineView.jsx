import React, { useState } from 'react';
import { 
  Clock, MapPin, IndianRupee, Ban, Sparkles, Navigation, 
  CheckCircle, AlertTriangle, Users, ExternalLink 
} from 'lucide-react';

export default function TimelineView({ itinerary, onCancelStop, cancellingStopId, onSelectStop }) {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);

  if (!itinerary || !itinerary.days || itinerary.days.length === 0) {
    return null;
  }

  const members = itinerary.metadata?.members_count || 1;
  const currentDay = itinerary.days[selectedDayIdx] || itinerary.days[0];

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm transition-all card-3d">
      {/* Day Selector Header & Tabs */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-800 bg-sky-100/80 px-2.5 py-0.5 rounded-full">
              Day-by-Day Journey
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Curated Itinerary
            </span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Trip Schedule: {itinerary.metadata.destination}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 font-medium">
            <span>{itinerary.metadata.start_date} → {itinerary.metadata.end_date}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-700 font-bold">
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              {members} Member(s)
            </span>
          </p>
        </div>

        {/* Day Selector Pills */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl overflow-x-auto max-w-full">
          {itinerary.days.map((day, idx) => {
            const isSelected = selectedDayIdx === idx;
            const hasCancelled = day.stops?.some(s => s.status === 'cancelled');
            const hasAlt = day.stops?.some(s => s.status === 'suggested_alternative');

            return (
              <button
                key={day.day_number}
                type="button"
                onClick={() => setSelectedDayIdx(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  isSelected
                    ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                <span>Day {day.day_number}</span>
                {hasAlt && <span className="w-2 h-2 rounded-full bg-amber-400" title="Has AI Replacement" />}
                {hasCancelled && !hasAlt && <span className="w-2 h-2 rounded-full bg-rose-400" title="Has cancellation" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Theme Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 mb-8 flex items-center justify-between flex-wrap gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-black text-lg flex items-center justify-center shadow-md">
            D{currentDay.day_number}
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-400 block">
              Day {currentDay.day_number} Theme
            </span>
            <h4 className="text-base font-extrabold text-white">
              {currentDay.theme || `Day ${currentDay.day_number} Exploration`}
            </h4>
            <span className="text-xs text-slate-300 font-medium">{currentDay.date}</span>
          </div>
        </div>
        <div className="text-right sm:border-l sm:border-slate-700/80 sm:pl-5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Day Total ({members} Person{members > 1 ? 's' : ''})
          </span>
          <span className="text-xl font-black text-emerald-400">
            {Number(itinerary.trip_totals?.cost_per_day?.[currentDay.date] || 0) > 0
              ? `₹${Number(itinerary.trip_totals?.cost_per_day?.[currentDay.date] || 0).toLocaleString('en-IN')}`
              : 'Free Activities'}
          </span>
        </div>
      </div>

      {/* Timeline Stops - Attraction Gainer Visual Layout */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-sky-200 space-y-6">
        {currentDay.stops?.map((stop, idx) => {
          const isCancelled = stop.status === 'cancelled';
          const isAlternative = stop.status === 'suggested_alternative';
          const isBeingCancelled = cancellingStopId === stop.id;
          const stopGroupTotal = Number(stop.estimated_cost || 0) * members;

          return (
            <div key={stop.id} className="relative group">
              {/* Timeline dot marker */}
              <div 
                className={`absolute -left-[31px] sm:-left-[39px] top-5 w-4 h-4 rounded-full border-2 transition-all ${
                  isCancelled 
                    ? 'border-rose-400 bg-rose-50' 
                    : isAlternative 
                      ? 'border-amber-500 bg-amber-100 scale-110 shadow-xs' 
                      : 'border-sky-500 bg-white group-hover:scale-125 shadow-xs'
                }`} 
              />

              {/* Transit buffer ribbon when going from one place to another */}
              {stop.transit_from_prev && idx > 0 && (
                <div className="mb-3 -mt-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100/95 border border-slate-200/90 px-3.5 py-1.5 rounded-full shadow-2xs">
                    <Navigation className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>
                      Going from <strong>{stop.transit_from_prev.from_name || 'Previous stop'}</strong> to <strong>{stop.activity}</strong>: ~{stop.transit_from_prev.duration_minutes} min ({stop.transit_from_prev.distance_km} km)
                    </span>
                  </div>
                </div>
              )}

              {/* Attractive Stop Card without description clutter */}
              <div 
                className={`rounded-2xl border p-5 transition-all card-3d ${
                  isCancelled
                    ? 'bg-slate-50/70 border-slate-200 opacity-60'
                    : isAlternative
                      ? 'bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 border-amber-300 shadow-sm'
                      : 'bg-white border-slate-200/90 hover:border-sky-300 hover:shadow-md border-l-4 border-l-sky-500'
                }`}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
                  <div className="flex-1 min-w-0">
                    {/* Top Row: Time Slot and "Photos & Reviews" option (replacing landmark/planned) */}
                    <div className="flex items-center gap-2.5 flex-wrap mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 bg-slate-100 px-3 py-1 rounded-xl">
                        <Clock className="w-3.5 h-3.5 text-sky-600" />
                        <span>{stop.time_slot?.start} – {stop.time_slot?.end}</span>
                      </div>

                      {isAlternative && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          AI Replacement
                        </span>
                      )}

                      {isCancelled && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full">
                          <Ban className="w-3 h-3" />
                          Cancelled
                        </span>
                      )}
                    </div>

                    {/* Landmark Activity Title - Click to open Google Photos, Ratings & Reviews */}
                    <div>
                      <a 
                        href={`https://www.google.com/search?q=${encodeURIComponent(`${stop.activity} ${stop.location?.address || itinerary?.metadata?.destination || ''}`)}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block group/title cursor-pointer"
                        title="Click to view real photos, ratings & authentic traveler reviews on Google"
                      >
                        <h4 className={`text-lg font-black tracking-tight group-hover/title:text-sky-600 group-hover/title:underline transition-colors flex items-center gap-1.5 ${isCancelled ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          <span>{stop.activity}</span>
                          <ExternalLink className="w-4 h-4 text-sky-500 opacity-60 group-hover/title:opacity-100 group-hover/title:translate-x-0.5 transition-all shrink-0" />
                        </h4>
                      </a>
                    </div>

                    {/* Address with MapPin */}
                    {stop.location?.address && (
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{stop.location.address}</span>
                      </p>
                    )}
                  </div>

                  {/* Actions & Cost */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-right">
                      {stopGroupTotal > 0 ? (
                        <>
                          <span className="text-[11px] text-slate-400 uppercase font-bold block">
                            {members > 1 ? `Est. Total (${members} Persons)` : 'Ticket / Entry Fee'}
                          </span>
                          <span className="text-lg font-black text-emerald-700">
                            ₹{stopGroupTotal.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-slate-600 block font-semibold mt-0.5">
                            ₹{Number(stop.estimated_cost || 0).toLocaleString('en-IN')}/person
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-[11px] text-slate-400 uppercase font-bold block">
                            Entry / Activity
                          </span>
                          <span className="inline-flex items-center text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg mt-0.5">
                            Free Entry
                          </span>
                          <span className="text-[10px] text-slate-400 block font-medium mt-0.5">
                            (₹0 / No Ticket Required)
                          </span>
                        </>
                      )}
                    </div>

                    {!isCancelled && (
                      <button
                        type="button"
                        disabled={isBeingCancelled}
                        onClick={() => onCancelStop && onCancelStop(stop.id, `User cancelled ${stop.activity}`)}
                        className="text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                        title="Cancel this activity"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>{isBeingCancelled ? 'Cancelling...' : 'Cancel Stop'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
