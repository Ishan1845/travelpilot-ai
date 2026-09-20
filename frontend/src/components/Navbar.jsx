import React from 'react';
import { Compass, Sparkles, PlaneTakeoff, ShieldCheck, Bookmark, Globe, IndianRupee } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, onTriggerNewTrip, savedCount }) {
  return (
    <header className="bg-white/85 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setActivePage('showcase')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-sky-900 to-indigo-900 bg-clip-text text-transparent">
                TravelPilot
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-orange-50 text-orange-800 border border-orange-200 px-2 py-0.5 rounded-full">
                <IndianRupee className="w-2.5 h-2.5 text-orange-600" />
                INR Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden md:block">
              Intelligent Itineraries • Disruption Healing • Live Verified Transit
            </p>
          </div>
        </div>

        {/* Page Nav Tabs */}
        <nav className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/70">
          <button
            onClick={() => setActivePage('showcase')}
            className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activePage === 'showcase'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-sky-600" />
            <span>Discover & Monuments</span>
          </button>

          <button
            onClick={() => setActivePage('planner')}
            className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activePage === 'planner'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span>Trip Planner</span>
          </button>

          <button
            onClick={() => setActivePage('history')}
            className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 relative ${
              activePage === 'history'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-600" />
            <span>Saved History</span>
            {savedCount > 0 && (
              <span className="w-4 h-4 bg-amber-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* New Trip Action with User Palette Gradient */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTriggerNewTrip}
            className="text-xs font-black text-white bg-gradient-to-r from-[#007BFF] via-[#FF6A00] to-[#FF8800] hover:brightness-110 px-3.5 py-2 rounded-xl shadow-md shadow-[#007BFF]/20 hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
            title="Starts plane takeoff and launches a fresh trip"
          >
            <PlaneTakeoff className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">New Trip</span>
          </button>
        </div>
      </div>
    </header>
  );
}
