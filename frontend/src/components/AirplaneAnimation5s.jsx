import React, { useEffect, useRef, useState } from 'react';

/**
 * AirplaneAnimation5s (Now 2s Full-Screen with Clouds & No Text)
 * Plays the high-resolution IgniteMotion airplane animation (YouTube ID: YwEPRJVV7V8)
 * in pure full screen with drifting clouds and zero text for exactly 2 seconds.
 */
export default function AirplaneAnimation5s({ onComplete }) {
  const [useIframeFallback, setUseIframeFallback] = useState(false);
  const videoRef = useRef(null);

  // Exact 2-second timer with automatic completion
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Autoplay HTML5 video immediately
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay blocked, switching to iframe fallback:", err);
        setUseIframeFallback(true);
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen z-[9999] overflow-hidden bg-black flex items-center justify-center select-none pointer-events-none">
      {/* Fullscreen High-Resolution Video Background */}
      {!useIframeFallback ? (
        <video
          ref={videoRef}
          src="/videos/airplane-animation.mp4"
          poster="/videos/airplane-poster.jpg"
          autoPlay
          muted
          playsInline
          loop
          onError={() => setUseIframeFallback(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <iframe
          src="https://www.youtube-nocookie.com/embed/YwEPRJVV7V8?autoplay=1&mute=1&controls=0&loop=1&playlist=YwEPRJVV7V8&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3"
          title="Airplane Animation"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="w-full h-full border-0 object-cover scale-105 pointer-events-none"
        />
      )}

      {/* Atmospheric Cloud Layer 1 - Foreground Cloud Drifting Across Top */}
      <div 
        className="absolute -top-10 -left-[25vw] w-[65vw] max-w-[900px] h-[35vh] pointer-events-none opacity-85"
        style={{
          animation: 'cloudDriftFast 2.2s linear forwards'
        }}
      >
        <svg viewBox="0 0 500 200" className="w-full h-full" fill="none">
          <defs>
            <linearGradient id="cloudGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#e2e8f0" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.1" />
            </linearGradient>
            <filter id="cloudSoftBlur1" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="10" />
            </filter>
          </defs>
          <g filter="url(#cloudSoftBlur1)">
            <ellipse cx="140" cy="130" rx="90" ry="50" fill="url(#cloudGrad1)" />
            <ellipse cx="230" cy="90" rx="110" ry="70" fill="url(#cloudGrad1)" />
            <ellipse cx="340" cy="110" rx="95" ry="55" fill="url(#cloudGrad1)" />
            <ellipse cx="280" cy="140" rx="120" ry="45" fill="url(#cloudGrad1)" />
          </g>
        </svg>
      </div>

      {/* Atmospheric Cloud Layer 2 - Floating Billowing Cloud Across Mid-Center */}
      <div 
        className="absolute top-[32%] -left-[35vw] w-[75vw] max-w-[1100px] h-[40vh] pointer-events-none opacity-75"
        style={{
          animation: 'cloudDriftMid 2s linear forwards'
        }}
      >
        <svg viewBox="0 0 600 220" className="w-full h-full" fill="none">
          <defs>
            <linearGradient id="cloudGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#f8fafc" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.1" />
            </linearGradient>
            <filter id="cloudSoftBlur2" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="12" />
            </filter>
          </defs>
          <g filter="url(#cloudSoftBlur2)">
            <circle cx="150" cy="130" r="80" fill="url(#cloudGrad2)" />
            <circle cx="270" cy="95" r="95" fill="url(#cloudGrad2)" />
            <circle cx="390" cy="110" r="85" fill="url(#cloudGrad2)" />
            <circle cx="480" cy="140" r="70" fill="url(#cloudGrad2)" />
            <rect x="120" y="130" width="370" height="50" rx="25" fill="url(#cloudGrad2)" />
          </g>
        </svg>
      </div>

      {/* Atmospheric Cloud Layer 3 - Rolling Sky Mist & Lower Stratus Clouds */}
      <div 
        className="absolute -bottom-14 -left-[20vw] w-[120vw] h-[40vh] pointer-events-none opacity-70"
        style={{
          animation: 'cloudDriftSlow 2.3s ease-out forwards'
        }}
      >
        <svg viewBox="0 0 700 240" className="w-full h-full" fill="none">
          <defs>
            <linearGradient id="cloudGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="80%" stopColor="#f1f5f9" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.0" />
            </linearGradient>
            <filter id="cloudSoftBlur3" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
          </defs>
          <g filter="url(#cloudSoftBlur3)">
            <ellipse cx="200" cy="170" rx="140" ry="60" fill="url(#cloudGrad3)" />
            <ellipse cx="370" cy="140" rx="160" ry="70" fill="url(#cloudGrad3)" />
            <ellipse cx="540" cy="160" rx="130" ry="60" fill="url(#cloudGrad3)" />
          </g>
        </svg>
      </div>

      {/* Subtle Atmospheric Vignette Haze */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-white/10 pointer-events-none" />

      <style>{`
        @keyframes cloudDriftFast {
          0% {
            transform: translateX(0vw) scale(0.95);
            opacity: 0.1;
          }
          30% {
            opacity: 0.85;
          }
          100% {
            transform: translateX(90vw) scale(1.08);
            opacity: 0.05;
          }
        }

        @keyframes cloudDriftMid {
          0% {
            transform: translateX(0vw) scale(1);
            opacity: 0.2;
          }
          40% {
            opacity: 0.8;
          }
          100% {
            transform: translateX(100vw) scale(1.05);
            opacity: 0.1;
          }
        }

        @keyframes cloudDriftSlow {
          0% {
            transform: translateX(-5vw) scale(1);
            opacity: 0.2;
          }
          50% {
            opacity: 0.75;
          }
          100% {
            transform: translateX(30vw) scale(1.03);
            opacity: 0.25;
          }
        }
      `}</style>
    </div>
  );
}
