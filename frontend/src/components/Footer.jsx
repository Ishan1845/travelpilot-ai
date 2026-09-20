import React from 'react';
import { 
  Compass, MapPin, Navigation, ShieldCheck, Sparkles, 
  Heart, Train, Plane, Car, Bookmark, Award, ExternalLink 
} from 'lucide-react';

export default function Footer({ onNavigatePage }) {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t-4 border-t-amber-500 relative z-20 mt-16 shadow-2xl">
      {/* Patriotic Tricolor Accent Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand & National Tribute */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
                <Compass className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  TravelPilot
                  <span className="text-[10px] font-extrabold bg-orange-500/30 text-orange-300 px-1.5 py-0.5 rounded border border-orange-500/40">
                    INDIA
                  </span>
                </span>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                  अतिथि देवो भव • Atithi Devo Bhava
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Intelligent, date-verified day-by-day travel planning agent designed for Bharat and the world. Grounded in real heritage POIs, expressway corridors, high-speed rail, and commercial flights.
            </p>

            <div className="pt-2 border-t border-slate-800 space-y-1.5 text-[11px] text-slate-400">
              <p className="flex items-center gap-1.5 text-amber-400/90 font-medium">
                <span>🇮🇳</span>
                <span>Dedicated to Bharat Nirman & Indian Armed Forces</span>
              </p>
              <p className="text-slate-500 text-[10px]">
                Saluting the leadership of Hon'ble PM Narendra Modi Ji for modern world-class expressways & high-speed transit.
              </p>
            </div>
          </div>

          {/* Col 2: Famous Destinations */}
          <div className="space-y-3">
            <h4 className="text-xs font-black tracking-wider uppercase text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>Incredible Destinations</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                <span>Taj Mahal & Agra Fort (Agra)</span>
              </li>
              <li className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                <span>Hawa Mahal & Amber Palace (Jaipur)</span>
              </li>
              <li className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                <span>Statue of Unity & Narmada (Gujarat)</span>
              </li>
              <li className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                <span>Ganga Ghats & Kashi Vishwanath (Varanasi)</span>
              </li>
              <li className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                <span>Alleppey Houseboats & Munnar (Kerala)</span>
              </li>
              <li className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                <span>Fort Aguada & Dudhsagar Falls (Goa)</span>
              </li>
              <li className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                <span>Eiffel Tower & Louvre (Paris)</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Verified Transit Modes */}
          <div className="space-y-3">
            <h4 className="text-xs font-black tracking-wider uppercase text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-sky-400" />
              <span>Multi-Modal Verified Transit</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <Car className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-200 font-bold block">National Expressways (NHAI)</span>
                  <span className="text-[11px] text-slate-500">Delhi-Mumbai NE-4, Yamuna & Purvanchal Corridors</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Train className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-200 font-bold block">Vande Bharat Express</span>
                  <span className="text-[11px] text-slate-500">IRCTC high-speed semi-bullet trains & Rajdhani network</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Plane className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-200 font-bold block">Commercial Aviation</span>
                  <span className="text-[11px] text-slate-500">Direct flights via Air India, IndiGo & Alliance Air</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Smart Features & Privacy */}
          <div className="space-y-3">
            <h4 className="text-xs font-black tracking-wider uppercase text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Intelligent Agent Tech</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Google Gemini AI Agent
                </span>
                <p className="text-[10px] text-slate-400 mt-1">
                  Powered by Gemini 3.6 Flash for adaptive conversational guidance and real-time transit coordination.
                </p>
              </div>

              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-sky-400" />
                  100% Client-Side Privacy
                </span>
                <p className="text-[10px] text-slate-400 mt-1">
                  Saved trips & personal notes stay safely encrypted in your browser storage with instant resume.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Horizontal Divider */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            {/* 24-Spoke Ashoka Chakra Symbol */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-500" fill="currentColor">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
              {Array.from({ length: 12 }).map((_, i) => (
                <line 
                  key={i} 
                  x1="12" y1="12" 
                  x2={12 + 8 * Math.cos((i * 30 * Math.PI) / 180)} 
                  y2={12 + 8 * Math.sin((i * 30 * Math.PI) / 180)} 
                  stroke="currentColor" 
                  strokeWidth="0.8" 
                />
              ))}
            </svg>
            <span>© 2026 TravelPilot India • All Rights Reserved</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap justify-center">
            <span className="flex items-center gap-1 text-slate-300 font-semibold">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> in Bharat
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-400/90 font-medium">Jai Hind 🇮🇳</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400/90 font-medium">Vande Mataram</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
