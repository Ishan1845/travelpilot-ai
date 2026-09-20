import React, { useEffect } from 'react';
import { Plane } from 'lucide-react';

export default function AirplaneTakeoffAnimation({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="animate-plane-takeoff flex items-center gap-3">
      {/* Jet contrail */}
      <div className="w-48 h-1.5 bg-gradient-to-l from-sky-400 via-indigo-300 to-transparent rounded-full blur-[1px] opacity-80" />
      {/* 3D Airplane */}
      <div className="p-3 bg-gradient-to-tr from-sky-600 to-indigo-700 text-white rounded-2xl shadow-2xl border-2 border-white/60 transform rotate-45">
        <Plane className="w-8 h-8" />
      </div>
    </div>
  );
}
