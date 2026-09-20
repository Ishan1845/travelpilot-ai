import React from 'react';
import { AlertCircle, Bookmark, CheckCircle2, X, ArrowRight, Users, IndianRupee, Navigation, Calendar } from 'lucide-react';

export default function AlreadySelectedModal({ isOpen, onClose, onOpenSavedTrip, existingTrip, criteria }) {
  if (!isOpen) return null;

  const meta = existingTrip?.metadata || existingTrip || criteria || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative bg-white border border-amber-200/90 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl card-3d overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Tiranga top accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shadow-xs">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                Already Selected in History
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                Trip Already Exists
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
          A trip to <strong className="text-slate-900">{meta.destination}</strong> with the exact same criteria is already saved in your history section. TravelPilot does not create duplicate entries for the identical location and constraints.
        </p>

        {/* Existing Trip Criteria Summary */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-6 space-y-2.5 text-xs text-slate-700">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
            <span className="font-semibold text-slate-500">Destination:</span>
            <span className="font-extrabold text-slate-900">{meta.destination}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Users className="w-3.5 h-3.5 text-indigo-500" /> Members Count:
            </span>
            <span className="font-bold text-slate-800">{meta.members_count || 1} Member(s)</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500 font-medium">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-500" /> Budget:
            </span>
            <span className="font-bold text-emerald-700">₹{Number(meta.budget || 0).toLocaleString('en-IN')}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Navigation className="w-3.5 h-3.5 text-amber-500" /> Transportation:
            </span>
            <span className="font-bold capitalize text-slate-800">
              {meta.travel_mode === 'flight' ? '✈️ Flight' : meta.travel_mode === 'train' ? '🚆 Railway' : '🚗 Road'}
            </span>
          </div>

          {meta.start_date && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-sky-500" /> Dates:
              </span>
              <span className="font-bold text-slate-800">{meta.start_date} → {meta.end_date}</span>
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 flex-wrap">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Close / Dismiss
          </button>

          {onProceedAnyway && (
            <button
              type="button"
              onClick={() => {
                onProceedAnyway();
                onClose();
              }}
              className="px-4 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-xl transition-all cursor-pointer border border-amber-300"
            >
              Generate Fresh Anyway
            </button>
          )}

          {existingTrip && onOpenSavedTrip && (
            <button
              type="button"
              onClick={() => {
                onOpenSavedTrip(existingTrip);
                onClose();
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Open from Saved History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
