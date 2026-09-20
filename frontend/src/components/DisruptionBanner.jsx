import React from 'react';
import { AlertCircle, CheckCircle2, ArrowRight, X, Sparkles } from 'lucide-react';

export default function DisruptionBanner({ summary, affectedDay, alternativeName, onClose }) {
  if (!summary) return null;

  return (
    <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-sm text-slate-800 relative transition-all animate-fadeIn mb-6">
      <div className="flex items-start gap-3.5">
        <div className="p-2 bg-amber-100 text-amber-700 rounded-xl mt-0.5">
          <Sparkles className="w-5 h-5 text-amber-600" />
        </div>
        <div className="flex-1 pr-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md">
              Dynamic Rebuild Activated
            </span>
            {affectedDay && (
              <span className="text-xs font-semibold text-slate-600">
                Targeted Adjustment: Day {affectedDay} Only
              </span>
            )}
          </div>
          <p className="mt-1.5 text-sm font-medium text-slate-800 leading-relaxed">
            {summary}
          </p>
          <div className="mt-2.5 flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-100/70 border border-emerald-200/80 px-3 py-1 rounded-lg w-fit">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero impact on other days — untouched itinerary integrity preserved.</span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-amber-100/60 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}


