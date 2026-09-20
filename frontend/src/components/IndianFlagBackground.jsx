import React from 'react';

export default function IndianFlagBackground() {
  return (
    <>
      {/* Real Mountain & Lake Natural Panorama Vector Art (Realistic Organic Mountain Geology) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <svg 
          viewBox="0 0 1920 1080" 
          preserveAspectRatio="xMidYMid slice" 
          className="w-full h-full object-cover"
          style={{ shapeRendering: 'geometricPrecision' }}
        >
          <defs>
            {/* Sky Alpenglow Sunrise Gradient */}
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fff8f0" stopOpacity="0.88" />
              <stop offset="25%" stopColor="#ffedd5" stopOpacity="0.68" />
              <stop offset="50%" stopColor="#f0f9ff" stopOpacity="0.78" />
              <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.92" />
            </linearGradient>

            {/* Realistic Mountain Sunlit Snow Couloirs */}
            <linearGradient id="snowSunlit" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
              <stop offset="50%" stopColor="#f8fafc" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.8" />
            </linearGradient>

            {/* Realistic Mountain Shadow Snow / Blue Ice */}
            <linearGradient id="snowShadow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#94a3b8" stopOpacity="0.82" />
              <stop offset="100%" stopColor="#64748b" stopOpacity="0.75" />
            </linearGradient>

            {/* Distant High Mountain Atmospheric Haze */}
            <linearGradient id="mountainDistant" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#64748b" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#475569" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#334155" stopOpacity="0.75" />
            </linearGradient>

            {/* Midground Rugged Granite Ridge Sunlit Face */}
            <linearGradient id="rockSunlit" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#475569" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#334155" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0.9" />
            </linearGradient>

            {/* Midground Rugged Granite Ridge Shadow Face */}
            <linearGradient id="rockShadow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#0f172a" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.98" />
            </linearGradient>

            {/* Pine & Spruce Evergreen Foothills */}
            <linearGradient id="pineFoothills" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#065f46" stopOpacity="0.7" />
              <stop offset="60%" stopColor="#047857" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#064e3b" stopOpacity="0.92" />
            </linearGradient>

            {/* Deep Alpine Lake Water Gradient */}
            <linearGradient id="lakeWater" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.55" />
              <stop offset="30%" stopColor="#0369a1" stopOpacity="0.62" />
              <stop offset="65%" stopColor="#0f766e" stopOpacity="0.58" />
              <stop offset="100%" stopColor="#115e59" stopOpacity="0.68" />
            </linearGradient>

            {/* Atmospheric Valley Mist Layer */}
            <linearGradient id="valleyMist" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Lake Surface Ripple Light Sheen */}
            <linearGradient id="waterSheen" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
              <stop offset="35%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="75%" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* Sky Gradient */}
          <rect width="1920" height="1080" fill="url(#skyGrad)" />

          {/* ========================================================
              LAYER 1: DISTANT HIGH HIMALAYAN SUMMITS (Jagged, Natural Organic Ridges)
              ======================================================== */}
          {/* Distant Mountain Massif Silhouette */}
          <path
            d="M0,450 
               L60,420 L120,435 L190,380 L250,395 L310,340 L380,360 L450,290 L510,315 L590,240 
               L650,270 L720,220 L780,245 L860,160 L920,195 L980,145 L1040,185 L1120,230 
               L1190,190 L1260,260 L1330,225 L1410,300 L1480,270 L1560,340 L1630,315 L1710,370 
               L1790,345 L1860,410 L1920,380 L1920,620 L0,620 Z"
            fill="url(#mountainDistant)"
          />

          {/* Distant Peak Snowcaps & Glacial Couloirs */}
          {/* Peak 1 (Left 310,340) */}
          <path d="M310,340 L345,390 L325,410 L300,380 L280,410 L270,390 Z" fill="url(#snowSunlit)" />
          {/* Peak 2 (590,240) */}
          <path d="M590,240 L625,310 L605,330 L580,290 L555,340 L535,320 Z" fill="url(#snowSunlit)" />
          {/* Peak 3 Great Summit (980,145) */}
          <path d="M980,145 L1020,230 L995,260 L970,220 L940,270 L915,245 L945,190 Z" fill="url(#snowSunlit)" />
          <path d="M980,145 L1020,230 L1060,220 L1085,250 L1040,270 L995,260 Z" fill="url(#snowShadow)" />
          {/* Peak 4 (1190,190) */}
          <path d="M1190,190 L1230,270 L1210,290 L1180,250 L1155,295 L1140,275 Z" fill="url(#snowSunlit)" />
          {/* Peak 5 (1560,340) */}
          <path d="M1560,340 L1595,410 L1570,425 L1545,390 L1525,415 L1515,395 Z" fill="url(#snowSunlit)" />

          {/* Atmospheric Aerial Haze Band Between Far & Mid Range */}
          <rect x="0" y="320" width="1920" height="140" fill="url(#valleyMist)" />

          {/* ========================================================
              LAYER 2: MIDGROUND RUGGED ALPINE MASSIFS (Natural Geological Facets & Crevasses)
              ======================================================== */}
          {/* Mountain Massif 1: West Alpine Ridge */}
          {/* Sunlit western facet */}
          <path
            d="M0,520 
               L80,440 L140,460 L220,380 L290,410 L370,330 L430,360 L500,310 
               L530,370 L480,430 L420,460 L360,510 L280,540 L180,560 L0,580 Z"
            fill="url(#rockSunlit)"
          />
          {/* Shadow eastern facet of Massif 1 */}
          <path
            d="M500,310 
               L570,365 L640,330 L710,400 L760,370 L830,450 L750,480 L670,520 
               L580,540 L500,560 L420,530 L480,430 L530,370 Z"
            fill="url(#rockShadow)"
          />

          {/* Realistic Snow Glaciers on Massif 1 following Gullies & Cirques */}
          <path
            d="M370,330 
               L395,360 L385,385 L415,375 L430,360 L465,340 L500,310 
               L485,340 L460,365 L480,390 L450,420 L425,395 L405,430 L380,410 L355,435 
               L350,380 L365,365 Z"
            fill="url(#snowSunlit)"
          />
          <path
            d="M500,310 
               L525,345 L545,335 L570,365 L555,390 L590,380 L620,420 L585,435 
               L565,410 L540,445 L515,415 L485,440 L480,390 L505,370 Z"
            fill="url(#snowShadow)"
          />

          {/* Mountain Massif 2: Great Central Throne Peak (Matterhorn / Nanda Devi profile) */}
          {/* Primary ridgeline descending from (940, 220) */}
          {/* Sunlit southwest facet */}
          <path
            d="M620,500 
               L690,440 L760,460 L830,380 L880,400 L940,220 
               L920,290 L880,340 L840,410 L790,460 L730,510 L660,540 Z"
            fill="url(#rockSunlit)"
          />
          {/* Shaded northeast facet with steep couloirs */}
          <path
            d="M940,220 
               L980,280 L1030,260 L1090,340 L1150,310 L1220,400 L1280,370 L1350,460 
               L1270,500 L1190,530 L1110,550 L1020,540 L930,520 L870,470 L920,380 L940,290 Z"
            fill="url(#rockShadow)"
          />

          {/* Glacial Snowpack & Ice Couloirs on Central Peak */}
          <path
            d="M940,220 
               L950,260 L935,285 L960,310 L945,340 L965,370 L930,410 L905,385 L885,420 
               L865,390 L840,410 L860,370 L880,340 L900,315 L915,270 Z"
            fill="url(#snowSunlit)"
          />
          <path
            d="M940,220 
               L965,250 L980,280 L970,305 L1005,295 L1030,260 L1045,300 L1025,325 
               L1065,320 L1090,340 L1070,375 L1110,365 L1135,405 L1095,420 L1065,385 
               L1040,425 L1010,395 L985,435 L960,390 L970,340 L955,300 Z"
            fill="url(#snowShadow)"
          />

          {/* Mountain Massif 3: East Alpine Ridge */}
          {/* Sunlit facet */}
          <path
            d="M1220,470 
               L1280,410 L1340,430 L1410,340 L1480,370 L1560,290 
               L1580,360 L1540,420 L1490,470 L1420,510 L1350,540 Z"
            fill="url(#rockSunlit)"
          />
          {/* Shaded facet */}
          <path
            d="M1560,290 
               L1620,350 L1680,320 L1750,400 L1810,375 L1880,450 L1920,430 L1920,580 
               L1820,570 L1720,550 L1620,530 L1530,500 L1580,420 L1560,360 Z"
            fill="url(#rockShadow)"
          />

          {/* Glaciers on Massif 3 */}
          <path
            d="M1560,290 
               L1545,330 L1560,360 L1530,380 L1545,410 L1510,435 L1480,405 L1455,440 
               L1440,400 L1410,425 L1425,380 L1450,360 L1480,370 L1515,340 Z"
            fill="url(#snowSunlit)"
          />
          <path
            d="M1560,290 
               L1585,325 L1605,315 L1620,350 L1605,375 L1645,365 L1680,320 L1695,360 
               L1675,385 L1715,380 L1750,400 L1725,435 L1690,410 L1665,450 L1630,420 
               L1605,455 L1575,415 L1590,370 Z"
            fill="url(#snowShadow)"
          />

          {/* Deep Craggy Rock Strata / Crevasse Accents */}
          <path d="M420,360 L450,420 L425,460" stroke="#0f172a" strokeWidth="2.5" strokeOpacity="0.6" fill="none" />
          <path d="M880,340 L910,410 L875,460" stroke="#0f172a" strokeWidth="3" strokeOpacity="0.7" fill="none" />
          <path d="M980,280 L1020,360 L990,420" stroke="#020617" strokeWidth="3.5" strokeOpacity="0.8" fill="none" />
          <path d="M1090,340 L1130,420 L1100,470" stroke="#020617" strokeWidth="3" strokeOpacity="0.7" fill="none" />
          <path d="M1480,370 L1510,430 L1475,480" stroke="#0f172a" strokeWidth="2.5" strokeOpacity="0.6" fill="none" />

          {/* ========================================================
              LAYER 3: FOREGROUND CLIFFS & PINE-COVERED FOOTHILLS
              ======================================================== */}
          {/* Valley Mist Floating Above Lakeshore */}
          <rect x="0" y="490" width="1920" height="90" fill="url(#valleyMist)" />

          {/* Natural Jagged Evergreen Tree Line & Pine Ridges */}
          <path
            d="M0,560 
               L40,545 L55,555 L80,535 L105,550 L140,530 L165,545 L200,520 L230,540 L270,515 L310,535 
               L350,510 L390,530 L430,505 L470,525 L520,500 L560,520 L610,495 L650,515 L700,490 L740,510 
               L790,485 L830,505 L880,480 L920,500 L970,475 L1010,495 L1060,470 L1100,490 L1150,465 L1190,485 
               L1240,460 L1280,480 L1330,455 L1370,475 L1420,450 L1460,470 L1510,445 L1550,465 L1600,440 L1640,460 
               L1690,435 L1730,455 L1780,430 L1820,450 L1870,425 L1920,445 L1920,620 L0,620 Z"
            fill="url(#pineFoothills)"
          />

          {/* Individual Sharp Conifer Silhouette Tips for Realistic Texture */}
          {Array.from({ length: 32 }).map((_, idx) => {
            const x = idx * 60 + 15;
            const baseY = 520 + (idx % 5) * 6;
            return (
              <polygon
                key={`pine_${idx}`}
                points={`${x},${baseY - 22} ${x + 9},${baseY} ${x - 9},${baseY}`}
                fill="#047857"
                opacity="0.85"
              />
            );
          })}

          {/* ========================================================
              LAYER 4: SERENE REALISTIC LAKESIDE WATERS & MOUNTAIN REFLECTIONS
              ======================================================== */}
          {/* Main Lake Water Body */}
          <rect x="0" y="550" width="1920" height="530" fill="url(#lakeWater)" />

          {/* Organic Inverted Mountain Mirror Reflections in Water */}
          {/* Reflection of West Ridge */}
          <path
            d="M220,550 L370,660 L430,630 L500,690 L570,630 L640,550 Z"
            fill="#0369a1"
            opacity="0.32"
          />
          {/* Reflection of Great Central Throne Peak */}
          <path
            d="M760,550 L880,670 L940,760 L1030,710 L1090,660 L1220,550 Z"
            fill="#0369a1"
            opacity="0.38"
          />
          {/* Reflection of East Ridge */}
          <path
            d="M1340,550 L1480,660 L1560,710 L1620,650 L1750,550 Z"
            fill="#0369a1"
            opacity="0.3"
          />

          {/* Gentle Shimmering Horizontal Lake Surface Ripples & Light Waves */}
          <ellipse cx="960" cy="590" rx="850" ry="14" fill="url(#waterSheen)" />
          <ellipse cx="960" cy="650" rx="900" ry="16" fill="url(#waterSheen)" />

          {/* Realistic Surface Wavelets (Varying Thickness & Depth) */}
          <path d="M80,575 Q480,568 960,575 T1840,575" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.4" fill="none" />
          <path d="M40,605 Q520,598 1000,605 T1880,605" stroke="#38bdf8" strokeWidth="1.6" strokeOpacity="0.38" fill="none" />
          <path d="M120,640 Q600,632 1080,640 T1800,640" stroke="#ffffff" strokeWidth="1.4" strokeOpacity="0.3" fill="none" />
          <path d="M60,685 Q540,675 1020,685 T1860,685" stroke="#0ea5e9" strokeWidth="2.2" strokeOpacity="0.28" fill="none" />
          <path d="M140,735 Q660,725 1180,735 T1780,735" stroke="#2dd4bf" strokeWidth="2.4" strokeOpacity="0.25" fill="none" />
          <path d="M80,795 Q580,785 1100,795 T1840,795" stroke="#38bdf8" strokeWidth="2.6" strokeOpacity="0.22" fill="none" />
          <path d="M40,865 Q620,855 1140,865 T1880,865" stroke="#0284c7" strokeWidth="3.0" strokeOpacity="0.2" fill="none" />
          <path d="M100,945 Q700,935 1240,945 T1820,945" stroke="#0f766e" strokeWidth="3.2" strokeOpacity="0.18" fill="none" />
          <path d="M60,1025 Q640,1015 1180,1025 T1860,1025" stroke="#115e59" strokeWidth="3.5" strokeOpacity="0.15" fill="none" />
        </svg>
      </div>

      {/* Subtle Indian Flag Gradient Layer */}
      <div className="indian-flag-bg" aria-hidden="true" />

      {/* Ashoka Chakra 24-Spoke SVG Watermark */}
      <div className="ashoka-chakra-watermark" aria-hidden="true">
        <svg viewBox="0 0 100 100" className="w-full h-full text-blue-900" fill="currentColor">
          {/* Outer circle */}
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2.5" />
          {/* Inner ring */}
          <circle cx="50" cy="50" r="41" fill="none" stroke="currentColor" strokeWidth="1" />
          {/* Center hub */}
          <circle cx="50" cy="50" r="8" fill="currentColor" />
          <circle cx="50" cy="50" r="4" fill="#ffffff" />
          {/* 24 Spokes */}
          {Array.from({ length: 24 }).map((_, i) => (
            <g key={i} transform={`rotate(${i * 15} 50 50)`}>
              <line x1="50" y1="50" x2="50" y2="9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <polygon points="48.8,14 51.2,14 50,8" fill="currentColor" />
            </g>
          ))}
        </svg>
      </div>
    </>
  );
}
