import React from 'react';

/**
 * NamasteAvatar - An authentic, welcoming Indian girl joining hands in Namaste (Anjali Mudra).
 * Symbolizes warm Indian hospitality, respect, and intelligent local travel guidance.
 */
export default function NamasteAvatar({ size = 32, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-label="Namaste AI Avatar"
    >
      <defs>
        {/* Background Radial/Linear Gradient - Warm Festive Saffron, Amber & Coral */}
        <linearGradient id="namasteBgGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="45%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#E11D48" />
        </linearGradient>
        {/* Saree Shading Gradient */}
        <linearGradient id="sareeGrad" x1="20" y1="70" x2="80" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="50%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>
        {/* Soft Shadow Filter */}
        <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Circular Badge Background */}
      <circle cx="50" cy="50" r="48" fill="url(#namasteBgGrad)" />
      <circle cx="50" cy="50" r="46.5" stroke="#FDE68A" strokeWidth="1.5" strokeOpacity="0.85" />

      {/* Background Flower Gajra / Halo Accent */}
      <ellipse cx="50" cy="22" rx="14" ry="8" fill="#FEF3C7" />
      <circle cx="40" cy="21" r="3" fill="#FDE047" />
      <circle cx="45" cy="18" r="3" fill="#FFFBEB" />
      <circle cx="50" cy="17" r="3.2" fill="#FDE047" />
      <circle cx="55" cy="18" r="3" fill="#FFFBEB" />
      <circle cx="60" cy="21" r="3" fill="#FDE047" />

      {/* Hair Bun */}
      <circle cx="50" cy="22" r="10" fill="#1C1917" />

      {/* Shoulders & Traditional Attire */}
      <path
        d="M20 95 C22 75 35 70 50 70 C65 70 78 75 80 95 Z"
        fill="url(#sareeGrad)"
      />
      {/* Saree Golden Border Zari */}
      <path
        d="M25 94 C32 82 45 74 50 74 C55 74 68 82 75 94"
        stroke="#FCD34D"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M32 94 C40 86 46 80 50 80 C54 80 60 86 68 94"
        stroke="#F59E0B"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Neck */}
      <path d="M44 48 L44 58 L56 58 L56 48 Z" fill="#F7C49E" />
      {/* Delicate Gold Necklace */}
      <path d="M43 54 Q50 59 57 54" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <circle cx="50" cy="57" r="1.5" fill="#EF4444" />

      {/* Face */}
      <path
        d="M35 36 C35 48 41 56 50 56 C59 56 65 48 65 36 C65 24 58 18 50 18 C42 18 35 24 35 36 Z"
        fill="#FCD4B4"
      />

      {/* Hair front - Center parted elegant dark hair */}
      <path
        d="M35 36 C35 25 41 20 50 25 C59 20 65 25 65 36 C65 30 60 21 50 21 C40 21 35 30 35 36 Z"
        fill="#1C1917"
      />
      {/* Maang Tikka (Golden hairline ornament) */}
      <line x1="50" y1="21" x2="50" y2="28" stroke="#F59E0B" strokeWidth="1.2" />
      <circle cx="50" cy="28.5" r="1.4" fill="#DC2626" />

      {/* Traditional Red Bindi */}
      <circle cx="50" cy="33" r="1.8" fill="#DC2626" />

      {/* Gentle Smiling Eyes */}
      <path d="M40 39 Q44 42 47 39" stroke="#292524" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M53 39 Q56 42 60 39" stroke="#292524" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Eyebrows */}
      <path d="M39 36 Q43 34 47 36" stroke="#44403C" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M53 36 Q57 34 61 36" stroke="#44403C" strokeWidth="1.2" strokeLinecap="round" fill="none" />

      {/* Cute Nose */}
      <path d="M50 41 L49 44 L51 44" stroke="#E5A67D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Warm Friendly Smile */}
      <path d="M46 48 Q50 52 54 48" stroke="#DC2626" strokeWidth="1.6" strokeLinecap="round" fill="none" />

      {/* Gold Jhumka Earrings */}
      <circle cx="33.5" cy="42" r="1.8" fill="#FBBF24" />
      <path d="M32 44 Q33.5 47 35 44 Z" fill="#F59E0B" />
      <circle cx="66.5" cy="42" r="1.8" fill="#FBBF24" />
      <path d="M65 44 Q66.5 47 68 44 Z" fill="#F59E0B" />

      {/* Arms folded towards chest */}
      <path
        d="M26 80 C32 72 38 66 45 64"
        stroke="#F7C49E"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M74 80 C68 72 62 66 55 64"
        stroke="#F7C49E"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Golden Bangles on Wrists */}
      <line x1="42" y1="67" x2="44" y2="63" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="58" y1="67" x2="56" y2="63" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="40" y1="69" x2="42" y2="65" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="60" y1="69" x2="58" y2="65" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />

      {/* NAMASTE JOINED HANDS (Palms pressed together, fingers pointed upwards in prayer) */}
      <g filter="url(#softGlow)">
        {/* Palm & Fingers Silhouette */}
        <path
          d="M46 72 C45 68 45 60 48 53 C49 51 51 51 52 53 C55 60 55 68 54 72 C53 74 47 74 46 72 Z"
          fill="#FCD4B4"
          stroke="#E5A67D"
          strokeWidth="1.2"
        />
        {/* Center line indicating joined palms */}
        <line x1="50" y1="52" x2="50" y2="72" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" />
        {/* Subtle finger definition accents */}
        <line x1="48" y1="55" x2="48" y2="68" stroke="#F59E0B" strokeWidth="0.8" strokeOpacity="0.7" strokeLinecap="round" />
        <line x1="52" y1="55" x2="52" y2="68" stroke="#F59E0B" strokeWidth="0.8" strokeOpacity="0.7" strokeLinecap="round" />
      </g>
    </svg>
  );
}
