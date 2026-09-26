import React from 'react';
import { Compass, Sparkles, PlaneTakeoff, Bookmark, Globe, IndianRupee, Phone, Mail, Clock } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, onTriggerNewTrip, savedCount }) {
  return (
    <header className="sticky top-0 z-40 transition-all shadow-xs">
      {/* TravelTour Top Sub-Bar */}
      <div className="bg-[#19202E] text-slate-300 text-[11px] py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3 h-3 text-[#FA5B0F]" />
              <span className="font-semibold">+91 1800-TRIP-SAATHI</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-3 h-3 text-[#FA5B0F]" />
              <span>contact@tripsaathi.ai</span>
            </span>
            <span className="hidden lg:flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3 h-3 text-[#FA5B0F]" />
              <span>Mon - Sun: 24/7 AI Real-Time Transit</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
              <IndianRupee className="w-2.5 h-2.5 text-[#FA5B0F]" />
              INR Grounded Fares
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-[#ECE8E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand */}
          <div 
            onClick={() => setActivePage('showcase')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#FA5B0F] flex items-center justify-center text-white shadow-md shadow-[#FA5B0F]/25 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-[#19202E] font-serif">
                  Trip<span className="text-[#FA5B0F]">Saathi</span>
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#FFF4EE] text-[#FA5B0F] border border-[#FED7AA] px-2 py-0.5 rounded-md">
                  Tour AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                Curated Grounded Journeys • Real Transit • Zero Repeated Stops
              </p>
            </div>
          </div>

          {/* Page Nav Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActivePage('showcase')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activePage === 'showcase'
                  ? 'bg-[#19202E] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#FA5B0F] hover:bg-[#FFF4EE]'
              }`}
            >
              <Globe className={`w-4 h-4 ${activePage === 'showcase' ? 'text-[#FA5B0F]' : 'text-slate-500'}`} />
              <span>Discover & Tours</span>
            </button>

            <button
              onClick={() => setActivePage('planner')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activePage === 'planner'
                  ? 'bg-[#19202E] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#FA5B0F] hover:bg-[#FFF4EE]'
              }`}
            >
              <Compass className={`w-4 h-4 ${activePage === 'planner' ? 'text-[#FA5B0F]' : 'text-slate-500'}`} />
              <span>Trip Planner</span>
            </button>

            <button
              onClick={() => setActivePage('history')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 relative ${
                activePage === 'history'
                  ? 'bg-[#19202E] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#FA5B0F] hover:bg-[#FFF4EE]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${activePage === 'history' ? 'text-[#FA5B0F]' : 'text-slate-500'}`} />
              <span>Saved Tours</span>
              <span className="min-w-4 px-1 h-4 bg-[#FA5B0F] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {savedCount || 0}
              </span>
            </button>
          </nav>

          {/* New Trip Action with TravelTour Orange Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onTriggerNewTrip}
              className="traveltour-btn-primary text-xs sm:text-sm font-extrabold px-4 sm:px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
              title="Starts plane takeoff and launches a fresh trip"
            >
              <PlaneTakeoff className="w-4 h-4" />
              <span className="hidden sm:inline">New Journey</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
