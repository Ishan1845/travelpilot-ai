import React, { useState, useEffect, useRef } from 'react';
import { Plane, Sparkles, ShieldCheck, MapPin, Compass } from 'lucide-react';

/**
 * AirplaneAnimation5s
 * High-Resolution 5-Second Airplane Animation Modal
 * Plays the high-definition IgniteMotion airplane animation (YouTube ID: YwEPRJVV7V8)
 * for exactly 5 seconds when planning a grounded trip.
 */
export default function AirplaneAnimation5s({ destination, origin, onComplete }) {
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [useIframeFallback, setUseIframeFallback] = useState(false);
  const videoRef = useRef(null);

  // Exact 5-second timer countdown and completion trigger
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    const completionTimer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 5000);

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(completionTimer);
    };
  }, [onComplete]);

  // Attempt autoplay for HTML5 video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn("HTML5 autoplay blocked or failed, switching to iframe/muted fallback:", err);
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => setUseIframeFallback(true));
        } else {
          setUseIframeFallback(true);
        }
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl animate-fadeIn p-4 sm:p-6 overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#007BFF]/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#FF6A00]/30 rounded-full blur-[140px] pointer-events-none" />

      {/* Main High-Resolution Animation Card */}
      <div className="relative w-full max-w-4xl bg-slate-900/95 border-2 border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center">
        
        {/* Top Header Strip */}
        <div className="w-full px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2 z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-[#007BFF] to-sky-400 text-white shadow-md shadow-sky-500/20">
              <Plane className="w-5 h-5 transform -rotate-45 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <span>Grounded Flight En Route</span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  HD 1080p
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
                <MapPin className="w-3 h-3 text-[#FF8800]" />
                <span>{origin || "Current Location"}</span>
                <span className="text-slate-500">→</span>
                <span className="text-amber-300 font-bold">{destination || "Destination"}</span>
              </p>
            </div>
          </div>

          {/* 5-Second Countdown Badge */}
          <div className="flex items-center gap-2">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center gap-2 text-xs font-black text-white shadow-inner">
              <Compass className="w-3.5 h-3.5 text-[#007BFF] animate-spin" />
              <span>Departing in <span className="text-[#FF8800] text-sm">{secondsRemaining}s</span></span>
            </div>
          </div>
        </div>

        {/* Video Player Display Container (16:9 High-Resolution) */}
        <div className="relative w-full aspect-video bg-black overflow-hidden flex items-center justify-center">
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
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          ) : (
            <iframe
              src="https://www.youtube-nocookie.com/embed/YwEPRJVV7V8?autoplay=1&mute=1&controls=0&loop=1&playlist=YwEPRJVV7V8&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3"
              title="Airplane Animation"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="w-full h-full border-0 select-none pointer-events-none"
            />
          )}

          {/* Subtle cinematic vignette gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

          {/* Center Flight Status Overlay */}
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white pointer-events-none z-10">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-bold text-sky-300">
                <Sparkles className="w-3 h-3 text-[#FF6A00]" />
                <span>Synchronizing Real-Time Landmarks & Fair Budgets...</span>
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <span className="text-[10px] text-slate-400 block font-mono">IgniteMotion HD Animation</span>
            </div>
          </div>
        </div>

        {/* 5-Second Linear Progress Bar Strip */}
        <div className="w-full bg-slate-800 h-1.5 overflow-hidden relative">
          <div 
            className="h-full bg-gradient-to-r from-[#007BFF] via-[#FF6A00] to-[#FF8800] transition-all"
            style={{
              animation: "airplaneProgress 5s linear forwards"
            }}
          />
        </div>

        {/* Bottom Status Footer */}
        <div className="w-full px-6 py-3.5 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-300">TripSaathi Grounded Engine</span>
            <span>•</span>
            <span className="text-slate-400">Zero duplicate stops guaranteed</span>
          </div>

          <button
            type="button"
            onClick={onComplete}
            className="text-[11px] font-extrabold text-slate-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Skip to Itinerary →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes airplaneProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
