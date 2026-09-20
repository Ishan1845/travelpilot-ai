import React, { useState } from 'react';
import { 
  Bookmark, Calendar, Users, Navigation, IndianRupee, 
  Trash2, ExternalLink, Sparkles, MapPin, Edit3, Check, Clock, ArrowLeft, CheckCircle2 
} from 'lucide-react';

export default function HistoryPage({ 
  savedTrips = [], 
  currentTrip = null,
  onReloadTrip, 
  onOpenSelectedTrip,
  onDeleteTrip, 
  onUpdateNotes, 
  onBack 
}) {
  const validTrips = Array.isArray(savedTrips) 
    ? savedTrips.filter(t => t && typeof t === 'object') 
    : [];

  const initialSelectedId = currentTrip?.trip_id || currentTrip?.id || (validTrips[0]?.trip_id || validTrips[0]?.id) || null;
  const [selectedTripId, setSelectedTripId] = useState(initialSelectedId);
  const [editingId, setEditingId] = useState(null);
  const [noteText, setNoteText] = useState("");

  const selectedTrip = validTrips.find(t => (t.trip_id || t.id) === selectedTripId) || currentTrip || validTrips[0] || null;

  const startEditNote = (trip) => {
    if (!trip) return;
    setEditingId(trip.trip_id || trip.id);
    setNoteText(trip.personal_notes || "");
  };

  const saveNote = (tripId) => {
    if (onUpdateNotes) {
      onUpdateNotes(tripId, noteText);
    }
    setEditingId(null);
  };

  const handleOpenTrip = (trip) => {
    if (onOpenSelectedTrip) {
      onOpenSelectedTrip(trip);
    } else if (onReloadTrip) {
      onReloadTrip(trip);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Strip: Two Back Options as Requested */}
      <div className="flex items-center justify-start gap-3 flex-wrap">
        {/* Option 1: Back to Selected Trip (Directly re-opens the selected itinerary) */}
        {selectedTrip && (
          <button
            type="button"
            onClick={() => handleOpenTrip(selectedTrip)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 hover:from-sky-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl border border-sky-600 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            title="Open and resume viewing the selected trip itinerary"
          >
            <Navigation className="w-4 h-4 text-amber-300 group-hover:rotate-45 transition-transform" />
            <span>
              ← Back to Selected Trip {selectedTrip.metadata?.destination ? `(${selectedTrip.metadata.destination})` : ''}
            </span>
          </button>
        )}

        {/* Option 2: Back to Planner Form */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 hover:text-slate-950 font-extrabold text-xs rounded-xl border border-slate-200 hover:border-slate-300 transition-all shadow-xs cursor-pointer group"
            title="Go to trip planner form"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:-translate-x-1 transition-transform" />
            <span>← Back to Planner</span>
          </button>
        )}
      </div>

      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm card-3d">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Saved Itineraries & History
                </h2>
                <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full">
                  {validTrips.length} Saved
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Select any trip below to resume. Click <span className="font-semibold text-sky-600">'Back to Selected Trip'</span> to jump straight into the full itinerary.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {validTrips.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center text-slate-400 space-y-3">
          <Bookmark className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-700">No Saved Places or Itineraries Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            When you generate a trip, it automatically saves to your local history and will appear here.
          </p>
        </div>
      ) : (
        /* Saved List Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {validTrips.map((item, index) => {
            const id = item.trip_id || item.id || `saved_${index}`;
            const meta = item.metadata || item || {};
            const totals = item.trip_totals || {};
            const isEditing = editingId === id;
            const isSelected = (selectedTripId === id) || (selectedTrip && (selectedTrip.trip_id || selectedTrip.id) === id);
            const destName = meta.destination || item.city || item.monument_name || "Custom Destination";
            const monumentTitle = meta.monument || item.monument_name || `${destName} Journey`;

            let savedDateStr = 'Saved';
            try {
              if (item.saved_at) {
                const parsedDate = new Date(item.saved_at);
                if (!isNaN(parsedDate.getTime())) {
                  savedDateStr = parsedDate.toLocaleDateString('en-IN');
                }
              }
            } catch (e) {
              savedDateStr = 'Saved';
            }

            const estCost = Number(totals.estimated_total_cost || 0);

            return (
              <div
                key={id}
                onClick={() => setSelectedTripId(id)}
                className={`bg-white border rounded-3xl p-6 shadow-sm card-3d flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected 
                    ? 'border-sky-500 ring-2 ring-sky-500/30 shadow-md bg-sky-50/10' 
                    : 'border-slate-200/80 hover:border-sky-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-sky-600" />
                      {destName}
                    </span>
                    
                    <div className="flex items-center gap-1.5">
                      {isSelected && (
                        <span className="text-[10px] font-extrabold bg-sky-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Selected
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 font-medium">
                        {savedDateStr}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    {monumentTitle}
                  </h3>

                  {/* Trip details */}
                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    {meta.start_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{meta.start_date} → {meta.end_date || meta.start_date}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{meta.members_count || 1} Member(s) Going</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Navigation className="w-3.5 h-3.5 text-amber-500" />
                      <span className="capitalize">
                        Mode: {meta.travel_mode === 'flight' ? '✈️ Flight' : meta.travel_mode === 'train' ? '🚆 Railway' : '🚗 Road'}
                      </span>
                    </div>

                    {estCost > 0 && (
                      <div className="flex items-center gap-2 font-bold text-slate-800 pt-1">
                        <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Total Est: ₹{estCost.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>

                  {/* Personal Notes Section */}
                  <div className="mt-4 pt-3 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Personal Travel Notes:
                      </span>
                      {!isEditing && (
                        <button
                          type="button"
                          onClick={() => startEditNote(item)}
                          className="text-[11px] text-sky-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{item.personal_notes ? 'Edit' : 'Add Note'}</span>
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="e.g. Hotel notes, packing checklist..."
                          className="w-full p-2 text-xs border border-sky-300 rounded-xl bg-sky-50/40 focus:outline-none"
                        />
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="px-2 py-1 text-[11px] text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => saveNote(id)}
                            className="px-2.5 py-1 text-[11px] font-bold bg-sky-600 text-white rounded-lg cursor-pointer flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-xl border border-slate-100">
                        {item.personal_notes || "No custom notes yet. Click 'Add Note' to record reminders."}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => onDeleteTrip && onDeleteTrip(id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                    title="Delete saved trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenTrip(item)}
                    className="flex-1 py-2 px-3 bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white font-bold text-xs rounded-xl border border-sky-200 hover:border-sky-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Selected Trip</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
