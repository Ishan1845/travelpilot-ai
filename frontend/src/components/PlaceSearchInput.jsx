import React, { useState, useRef, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import { searchPlaces } from '../data/placesData';

export default function PlaceSearchInput({
  label,
  value,
  onChange,
  placeholder = "Search city or monument...",
  dark = false,
  iconColor = "text-[#007BFF]",
  labelColor = "text-[#FF8800]",
  id,
  required = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const filteredPlaces = searchPlaces(value);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (place) => {
    onChange(place.city);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input Container Box */}
      <div 
        className={`rounded-xl p-3 border transition-all ${
          dark 
            ? 'bg-slate-800/80 border-slate-700 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500/30' 
            : 'bg-slate-50 border-slate-200 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-500/20'
        }`}
      >
        {label && (
          <label 
            htmlFor={id} 
            className={`text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
              dark ? labelColor : 'text-slate-700'
            }`}
          >
            <MapPin className={`w-3 h-3 ${dark ? iconColor : 'text-sky-600'}`} />
            {label}
          </label>
        )}

        <div className="relative flex items-center mt-1">
          <input
            id={id}
            type="text"
            required={required}
            value={value}
            autoComplete="off"
            onChange={(e) => {
              onChange(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className={`w-full bg-transparent font-bold text-xs sm:text-sm focus:outline-none pr-6 ${
              dark 
                ? 'text-white placeholder:text-slate-500' 
                : 'text-slate-900 placeholder:text-slate-400'
            }`}
          />
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                setIsOpen(true);
              }}
              className="absolute right-0 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Floating Suggestions Dropdown */}
      {isOpen && (
        <div 
          className={`absolute left-0 right-0 mt-1.5 rounded-xl border shadow-2xl z-50 max-h-60 overflow-y-auto backdrop-blur-md divide-y transition-all ${
            dark 
              ? 'bg-slate-900/95 border-slate-700 divide-slate-800/80 text-white' 
              : 'bg-white/95 border-slate-200 divide-slate-100 text-slate-900'
          }`}
        >
          {filteredPlaces.length > 0 ? (
            filteredPlaces.map((place, idx) => (
              <div
                key={`${place.city}-${idx}`}
                onMouseDown={() => handleSelect(place)}
                className={`p-2.5 cursor-pointer transition-colors text-left ${
                  dark 
                    ? 'hover:bg-slate-800/90' 
                    : 'hover:bg-sky-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-extrabold text-xs sm:text-sm flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                    <span>{place.city}</span>
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 ${
                    dark 
                      ? 'bg-slate-800 text-sky-300 border border-slate-700' 
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {place.state || place.country}
                  </span>
                </div>
                {place.monuments && (
                  <p className={`text-[11px] truncate mt-0.5 ${
                    dark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    ★ {place.monuments}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-xs text-slate-400">
              No direct matches found. You can still use &quot;{value}&quot;!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
