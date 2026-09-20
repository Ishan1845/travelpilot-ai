import React from 'react';
import { RotateCcw, Trash2, Check, X, History, MapPin, Bookmark } from 'lucide-react';

export default function RefreshSavePromptModal({ 
  isOpen, 
  onYes, 
  onNo, 
  trip,
  savedCount = 0
}) {
  if (!isOpen) return null;

  const meta = trip?.metadata || trip;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative bg-white border border-sky-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl card-3d overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* National Flag Subtle Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center shadow-xs">
              <RotateCcw className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 bg-sky-100/80 px-2.5 py-0.5 rounded-full">
                Page Refreshed
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                Want to save history or not?
              </h3>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-5">
          You refreshed the page. <strong>Want to save history or not?</strong> Choose <strong>Yes</strong> to save the history, or <strong>No</strong> to delete the saved history.
        </p>

        {/* History / Active Session Status Box */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-6 space-y-2 text-xs text-slate-700">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
            <span className="font-semibold text-slate-500 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-sky-600" /> Saved History:
            </span>
            <span className="font-extrabold text-slate-900">
              {savedCount} trip(s) currently saved
            </span>
          </div>

          {meta?.destination && (
            <div className="flex items-center justify-between pt-1">
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <MapPin className="w-3.5 h-3.5 text-orange-500" /> Active Trip:
              </span>
              <span className="font-bold text-slate-800">
                {meta.origin ? `${meta.origin} → ` : ''}{meta.destination}
              </span>
            </div>
          )}
        </div>

        {/* Yes or No Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* YES: Save the history */}
          <button
            type="button"
            onClick={onYes}
            className="py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            title="Yes - Save History"
          >
            <Bookmark className="w-4 h-4" />
            <span>Yes</span>
          </button>

          {/* NO: Delete the saved history */}
          <button
            type="button"
            onClick={onNo}
            className="py-3 px-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-rose-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            title="No - Delete Saved History"
          >
            <Trash2 className="w-4 h-4" />
            <span>No</span>
          </button>
        </div>
      </div>
    </div>
  );
}
