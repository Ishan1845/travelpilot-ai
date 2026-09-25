import React from 'react';
import { Car, Train, Plane, Clock, CheckCircle2, ExternalLink, IndianRupee } from 'lucide-react';
import { isInternationalTransit } from '../data/transportData';

/**
 * TransportationCard
 * Displays the verified grounded transportation mode details for the current itinerary,
 * and allows opening the Live Transport Browser directly.
 */
export default function TransportationCard({ transportation, membersCount = 1, onOpenTransportPage }) {
  if (!transportation) return null;

  const currentMode = transportation.mode || 'road';
  const isInternational = Boolean(
    transportation.is_international || 
    isInternationalTransit(transportation.origin, transportation.destination || transportation.route_name)
  );

  const ModeIcon = currentMode === 'flight' ? Plane : currentMode === 'train' ? Train : Car;

  const getDirectBookingUrl = () => {
    const orig = encodeURIComponent(transportation.origin || "Delhi");
    const dest = encodeURIComponent(transportation.destination || "Agra");
    if (currentMode === 'flight') {
      return `https://www.google.com/travel/flights?q=flights+from+${orig}+to+${dest}`;
    } else if (currentMode === 'train') {
      return `https://www.irctc.co.in/nget/train-search`;
    }
    return `https://maps.google.com/?q=directions+from+${orig}+to+${dest}`;
  };

  const totalFair = (transportation.cost_per_person || 0) * membersCount;

  return (
    <div className="bg-gradient-to-br from-white via-sky-50/30 to-indigo-50/20 border border-sky-200/80 rounded-3xl p-6 shadow-sm card-3d">
      {/* Header Banner */}
      <div className="flex items-start justify-between gap-4 flex-wrap pb-4 border-b border-sky-100/80">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-emerald-600 text-white shadow-md">
            <ModeIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-800 bg-sky-100/80 px-2.5 py-0.5 rounded-full">
                {currentMode === 'flight' 
                  ? (isInternational ? '✈️ Verified International Flight Route' : '✈️ Verified Flight Route') 
                  : (currentMode === 'train' ? '🚆 Verified Railway Route' : '🚗 Verified Road Expressway')}
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Live Date Verified
              </span>
            </div>
            <h4 className="text-base font-extrabold text-slate-900 mt-1">
              {transportation.route_name}
            </h4>
          </div>
        </div>

        {onOpenTransportPage && (
          <button
            type="button"
            onClick={() => onOpenTransportPage(transportation.mode)}
            className="text-xs font-extrabold text-indigo-700 hover:text-white bg-indigo-50 hover:bg-indigo-600 border border-indigo-200 hover:border-indigo-600 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <span>Open Live Transport Browser →</span>
          </button>
        )}
      </div>

      {/* Transit Details Strip */}
      <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Carrier / Vehicle</span>
          <p className="text-sm font-extrabold text-slate-800 line-clamp-1 mt-0.5" title={transportation.carrier_info}>
            {transportation.carrier_info || "Confirmed Transit Service"}
          </p>
          <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5" title={transportation.schedule}>
            {transportation.schedule || "Verified Departure Schedule"}
          </p>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Duration</span>
          <div className="flex items-center gap-1.5 mt-0.5 text-sm font-extrabold text-slate-800">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{transportation.duration_hours || transportation.estimated_duration_hours || "—"} hrs</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-0.5">Real Highway / Flight Buffer</span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Fair ({membersCount} Member{membersCount > 1 ? 's' : ''})</span>
          <div className="flex items-center gap-1 mt-0.5 text-base font-black text-emerald-700">
            <IndianRupee className="w-4 h-4" />
            <span>{totalFair > 0 ? totalFair.toLocaleString('en-IN') : 'Live Fare'}</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-0.5">₹{(transportation.cost_per_person || 0).toLocaleString('en-IN')} / person</span>
        </div>
      </div>

      {/* Action Footer: Live Transport Browser & Operator Portal */}
      <div className="pt-4 flex items-center justify-between flex-wrap gap-2.5">
        <a
          href={getDirectBookingUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-sky-700 transition-colors"
        >
          <span>Official Booking & Schedule Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {onOpenTransportPage && (
          <button
            type="button"
            onClick={() => onOpenTransportPage(transportation.mode)}
            className="py-2 px-4 bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 hover:from-sky-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>👉 Open Live Transport Browser</span>
          </button>
        )}
      </div>
    </div>
  );
}
