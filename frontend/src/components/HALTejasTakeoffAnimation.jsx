import React, { useEffect } from 'react';

export default function HALTejasTakeoffAnimation({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center overflow-hidden bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      {/* Auspicious Atithi Devo Bhava Message Card in the Center */}
      <div className="relative z-10 text-center max-w-lg mx-4 p-8 rounded-3xl bg-white/95 border-2 border-orange-300 shadow-2xl space-y-4">
        {/* Tricolor Ribbon Glow */}
        <div className="w-20 h-1 bg-gradient-to-r from-orange-500 via-white to-emerald-500 mx-auto rounded-full shadow-xs" />

        {/* Sanskrit Inscription */}
        <div className="space-y-1">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 font-serif">
            अतिथि देवो भव
          </span>
          <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
            Atithi Devo Bhava • The Guest is God
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          Welcoming you to your next journey with reverence, warmth, and honor. Initializing a fresh travel itinerary...
        </p>

        {/* Spinning Ashoka Chakra Loader */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <div className="w-7 h-7 relative animate-spin">
            <svg viewBox="0 0 100 100" className="w-full h-full text-blue-900" fill="currentColor">
              <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="3" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="50" cy="50" r="8" fill="currentColor" />
              <circle cx="50" cy="50" r="4" fill="#ffffff" />
              {Array.from({ length: 24 }).map((_, i) => (
                <g key={i} transform={`rotate(${i * 15} 50 50)`}>
                  <line x1="50" y1="50" x2="50" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <polygon points="48.8,15 51.2,15 50,8" fill="currentColor" />
                </g>
              ))}
            </svg>
          </div>
          <span className="text-xs font-bold text-slate-600">
            HAL-TEJAS Escorting Your Flight...
          </span>
        </div>
      </div>

      {/* Realistic HAL Tejas Supersonic Aircraft flying from leftmost bottom corner to rightmost top corner */}
      <div 
        className="fixed pointer-events-none z-30"
        style={{
          left: 0,
          bottom: 0,
          animation: "tejasFlight 2.8s cubic-bezier(0.25, 1, 0.4, 1) forwards"
        }}
      >
        <div className="relative flex items-center">
          {/* Twin Afterburner Thrust & Supersonic Smoke Contrail */}
          <div className="absolute right-full mr-2 flex flex-col items-end gap-1 pointer-events-none">
            {/* Upper Contrail */}
            <div className="w-80 sm:w-96 h-2 bg-gradient-to-l from-orange-400 via-sky-300 to-transparent rounded-full blur-[2px] opacity-90" />
            {/* Radiant Afterburner Flame Core */}
            <div className="w-24 h-4 bg-gradient-to-l from-amber-400 via-orange-500 to-transparent rounded-full blur-[1px] shadow-lg shadow-orange-500/80" />
            {/* Lower Contrail */}
            <div className="w-72 sm:w-88 h-1.5 bg-gradient-to-l from-emerald-400 via-sky-200 to-transparent rounded-full blur-[2px] opacity-80" />
          </div>

          {/* Detailed Structural SVG of HAL TEJAS Aircraft (Cranked Arrow Compound Delta Wing) */}
          <svg
            width="320"
            height="180"
            viewBox="0 0 640 360"
            className="drop-shadow-2xl"
          >
            <defs>
              {/* Tactical Grey Fuselage Gradient */}
              <linearGradient id="tejasFuselage" x1="0%" y1="0%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="35%" stopColor="#94a3b8" />
                <stop offset="65%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>

              {/* Glass Cockpit Tint */}
              <linearGradient id="canopyGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>

              {/* Afterburner Glow */}
              <radialGradient id="engineAfterburner" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#38bdf8" />
                <stop offset="70%" stopColor="#f97316" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            {/* Jet Exhaust Nozzle */}
            <polygon points="120,170 145,160 145,200 120,190" fill="#1e293b" />
            <ellipse cx="125" cy="180" rx="14" ry="10" fill="url(#engineAfterburner)" />

            {/* Left Wing (Port Delta) */}
            <polygon 
              points="200,165 370,165 240,40 180,45 200,150" 
              fill="url(#tejasFuselage)" 
              stroke="#334155" 
              strokeWidth="2.5" 
            />
            {/* Port Wingtip Missile Rail */}
            <rect x="175" y="38" width="80" height="7" rx="3" fill="#1e293b" />
            <polygon points="255,41 270,41.5 255,42" fill="#ef4444" />

            {/* Right Wing (Starboard Delta) */}
            <polygon 
              points="200,195 370,195 240,320 180,315 200,210" 
              fill="url(#tejasFuselage)" 
              stroke="#334155" 
              strokeWidth="2.5" 
            />
            {/* Starboard Wingtip Missile Rail */}
            <rect x="175" y="315" width="80" height="7" rx="3" fill="#1e293b" />
            <polygon points="255,318 270,318.5 255,319" fill="#ef4444" />

            {/* Main Fuselage Body with Aerodynamic Contours */}
            <path 
              d="M135,170 
                 L220,158 
                 L340,155 
                 L450,165 
                 L570,178 
                 L610,180 
                 L570,182 
                 L450,195 
                 L340,205 
                 L220,202 
                 L135,190 Z" 
              fill="url(#tejasFuselage)" 
              stroke="#1e293b" 
              strokeWidth="3" 
            />

            {/* Long Pitot Tube / Nose Radome Probe */}
            <line x1="610" y1="180" x2="638" y2="180" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />

            {/* Twin Side Air Intakes */}
            <polygon points="340,155 365,148 375,155 350,162" fill="#0f172a" />
            <polygon points="340,205 365,212 375,205 350,198" fill="#0f172a" />

            {/* Bubble Cockpit Canopy with Pilot Silhouette */}
            <path 
              d="M410,172 
                 C440,162 480,162 505,175 
                 C480,188 440,188 410,178 Z" 
              fill="url(#canopyGlass)" 
              stroke="#0369a1" 
              strokeWidth="2" 
            />
            <ellipse cx="455" cy="175" rx="10" ry="4" fill="#0f172a" opacity="0.75" />

            {/* Vertical Tail Fin / Stabilizer */}
            <polygon 
              points="140,178 230,177 170,135 150,135" 
              fill="#64748b" 
              stroke="#1e293b" 
              strokeWidth="2" 
            />

            {/* Indian Air Force Fin Flash (Tricolor on vertical tail) */}
            <rect x="155" y="140" width="18" height="6" fill="#f97316" />
            <rect x="155" y="146" width="18" height="6" fill="#ffffff" />
            <rect x="155" y="152" width="18" height="6" fill="#15803d" />

            {/* Indian Air Force Roundel on Left Wing */}
            <g transform="translate(250, 100)">
              <circle cx="0" cy="0" r="18" fill="#f97316" />
              <circle cx="0" cy="0" r="12" fill="#ffffff" />
              <circle cx="0" cy="0" r="6" fill="#15803d" />
            </g>

            {/* Indian Air Force Roundel on Right Wing */}
            <g transform="translate(250, 260)">
              <circle cx="0" cy="0" r="18" fill="#f97316" />
              <circle cx="0" cy="0" r="12" fill="#ffffff" />
              <circle cx="0" cy="0" r="6" fill="#15803d" />
            </g>

            {/* Official Stencil Markings: "HAL-TEJAS" & "IAF" */}
            <text 
              x="260" 
              y="184" 
              fill="#0f172a" 
              fontSize="16" 
              fontWeight="900" 
              fontFamily="Arial, sans-serif" 
              letterSpacing="2.5"
            >
              HAL-TEJAS
            </text>
            <text 
              x="230" 
              y="130" 
              fill="#0f172a" 
              fontSize="12" 
              fontWeight="800" 
              fontFamily="Arial, sans-serif" 
              letterSpacing="1.5"
            >
              IAF
            </text>
            <text 
              x="230" 
              y="235" 
              fill="#0f172a" 
              fontSize="12" 
              fontWeight="800" 
              fontFamily="Arial, sans-serif" 
              letterSpacing="1.5"
            >
              IAF
            </text>
          </svg>
        </div>
      </div>

      {/* Keyframe animation for takeoff from leftmost bottom corner to rightmost top corner */}
      <style>{`
        @keyframes tejasFlight {
          0% {
            transform: translate(-140px, 140px) rotate(-38deg) scale(0.65);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          88% {
            opacity: 1;
          }
          100% {
            transform: translate(calc(100vw + 160px), calc(-100vh - 160px)) rotate(-42deg) scale(1.35);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
