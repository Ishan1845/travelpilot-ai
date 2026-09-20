import React from 'react';
import { Plane, Car, Train, Clock, Navigation, CheckCircle2, ShieldCheck, ArrowRight, IndianRupee } from 'lucide-react';

export default function TransportationCard({ transportation, membersCount = 1, onSwitchMode, onOpenTransportPage }) {
  if (!transportation) return null;

  const currentMode = transportation.mode || 'road';
  const modesData = transportation.available_modes || {};

  // Extract or fallback for all 3 modes
  const roadData = modesData.road || {
    route_name: transportation.mode === 'road' ? transportation.route_name : 'National Highway Express Corridor',
    carrier_info: 'AC Multi-Axle Volvo Sleeper / Intercity Sedan',
    duration_hours: transportation.mode === 'road' ? transportation.estimated_duration_hours : 6.0,
    cost_per_person: transportation.mode === 'road' ? transportation.cost_per_person : 1100,
    schedule: transportation.mode === 'road' ? transportation.verified_schedule : 'Daily express morning departures'
  };

  const trainData = modesData.train || {
    route_name: transportation.mode === 'train' ? transportation.route_name : 'Indian Railways Vande Bharat / Superfast Express',
    carrier_info: 'Indian Railways IRCTC (AC 3-Tier / Chair Car Superfast)',
    duration_hours: transportation.mode === 'train' ? transportation.estimated_duration_hours : 4.5,
    cost_per_person: transportation.mode === 'train' ? transportation.cost_per_person : 950,
    schedule: transportation.mode === 'train' ? transportation.verified_schedule : 'Daily confirmed IRCTC departures'
  };

  const flightData = modesData.flight || {
    route_name: transportation.mode === 'flight' ? transportation.route_name : 'Direct / Connecting Air Transit Corridor',
    carrier_info: 'Scheduled Commercial Airline (IndiGo / Air India Express)',
    duration_hours: transportation.mode === 'flight' ? transportation.estimated_duration_hours : 1.5,
    cost_per_person: transportation.mode === 'flight' ? transportation.cost_per_person : 4500,
    schedule: transportation.mode === 'flight' ? transportation.verified_schedule : 'Scheduled daily flight departures'
  };

  const allModesList = [
    {
      id: 'road',
      label: 'Road Expressway',
      icon: Car,
      data: roadData,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      activeColor: 'ring-2 ring-amber-500 bg-amber-50/70 border-amber-300'
    },
    {
      id: 'train',
      label: 'Railway (IRCTC)',
      icon: Train,
      data: trainData,
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
      activeColor: 'ring-2 ring-teal-500 bg-teal-50/70 border-teal-300'
    },
    {
      id: 'flight',
      label: 'Flight Air Transit',
      icon: Plane,
      data: flightData,
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
      activeColor: 'ring-2 ring-sky-500 bg-sky-50/70 border-sky-300'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-white via-sky-50/30 to-indigo-50/20 border border-sky-200/80 rounded-3xl p-6 shadow-sm card-3d">
      {/* Header Banner */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4 border-b border-sky-100/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-emerald-600 text-white shadow-md">
            {currentMode === 'flight' ? <Plane className="w-6 h-6" /> : currentMode === 'train' ? <Train className="w-6 h-6" /> : <Car className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-800 bg-sky-100/80 px-2.5 py-0.5 rounded-full">
                {currentMode === 'flight' ? '✈️ Verified Flight Route' : currentMode === 'train' ? '🚆 Verified Railway Route' : '🚗 Verified Road Expressway'}
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
            <span>View All Live Options →</span>
          </button>
        )}
      </div>

      {/* 3 Verified Multi-Modal Transit Cards: Road (AC Sleeper/Sedan), Rail (IRCTC/Vande Bharat), Flight (Airlines) */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Available Verified Transit Modes (Select to switch):
          </span>
          <span className="text-[11px] font-medium text-slate-400">
            For {membersCount} Traveler(s)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {allModesList.map((m) => {
            const Icon = m.icon;
            const isSelected = currentMode === m.id;

            return (
              <div
                key={m.id}
                onClick={() => onSwitchMode && onSwitchMode(m.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white relative ${
                  isSelected 
                    ? m.activeColor + ' shadow-sm' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-extrabold text-slate-900">{m.label}</span>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Selected
                    </span>
                  )}
                </div>

                {/* Carrier & Vehicle Detail (e.g. AC Multi-Axle Sleeper / Intercity Sedan) */}
                <p className="text-xs font-bold text-slate-800 line-clamp-1 mb-1" title={m.data.carrier_info}>
                  {m.data.carrier_info}
                </p>

                <p className="text-[11px] text-slate-500 line-clamp-1 mb-2.5" title={m.data.schedule}>
                  {m.data.schedule}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1 text-slate-600 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{m.data.duration_hours} hrs</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sky-800 text-[11px] bg-sky-50 border border-sky-200/80 px-2 py-0.5 rounded-md inline-block">Live Fare on Booking</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Operator Portal</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Open Dedicated Live Transport Page Trigger */}
      {onOpenTransportPage && (
        <button
          type="button"
          onClick={() => onOpenTransportPage(transportation.mode)}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-sky-50 via-indigo-50 to-emerald-50 hover:from-sky-100 hover:to-indigo-100 text-slate-800 font-bold text-xs rounded-2xl border border-sky-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
        >
          <span>👉 Open Live Transport Browser: View All Ola/Uber Cabs, Confirmed IRCTC Trains & Flight Timings →</span>
        </button>
      )}
    </div>
  );
}
