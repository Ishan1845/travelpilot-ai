import React from 'react';

export default function IndianFlagBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* High-Resolution Photo of Alpine Lake & Mountain Covering All Background */}
      <picture>
        <source srcSet="/images/alpine_lake_mountain_bg.webp" type="image/webp" />
        <img
          src="/images/alpine_lake_mountain_bg.png"
          alt="Scenic Alpine Mountain and Glacial Lake Background"
          className="w-full h-full object-cover object-center fixed inset-0 scale-[1.01]"
          style={{ 
            imageRendering: '-webkit-optimize-contrast',
            filter: 'contrast(1.04) brightness(1.02)'
          }}
          loading="eager"
          fetchpriority="high"
        />
      </picture>

      {/* Subtle atmospheric gradient overlay to preserve optimal contrast for text & cards */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/25 pointer-events-none" />
    </div>
  );
}

