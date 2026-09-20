import React, { useState } from 'react';
import { 
  ArrowLeft, Star, MapPin, Clock, IndianRupee, Heart, 
  CheckCircle2, Share2, Compass, Bookmark, ShieldCheck, Eye 
} from 'lucide-react';
import { getPlaceDetails } from '../data/placeData';

export default function PlaceDetailPage({ stop, destinationCity, onBack, onBookmark }) {
  const details = getPlaceDetails(stop.place_id || stop.id, stop.activity, stop.category, destinationCity);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkClick = () => {
    setIsBookmarked(true);
    if (onBookmark) onBookmark(stop, details);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-200/90 transition-all flex items-center gap-2 cursor-pointer shadow-xs card-3d"
        >
          <ArrowLeft className="w-4 h-4 text-sky-600" />
          <span>Back to Trip Schedule</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBookmarkClick}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs card-3d ${
              isBookmarked 
                ? 'bg-amber-500 text-white border border-amber-500' 
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-amber-50'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isBookmarked ? 'Saved to History' : 'Save Place to History'}</span>
          </button>
        </div>
      </div>

      {/* Hero Gallery & Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm card-3d">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Photos Left Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-md border border-slate-200">
              <img
                src={details.photos[activePhotoIdx] || details.photos[0]}
                alt={details.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="bg-slate-900/70 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{details.rating} / 5.0</span>
                </span>
                <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Real Photos & Reviews
                </span>
              </div>
            </div>

            {/* Thumbnail selector */}
            {details.photos.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {details.photos.map((imgUrl, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhotoIdx(i)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activePhotoIdx === i ? 'border-sky-600 ring-2 ring-sky-400/30' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Right Column */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-md">
                  {details.category}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {details.city}, {details.country}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {details.name}
              </h1>

              {/* Rating summary */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-800">{details.rating}</span>
                <span className="text-xs text-slate-400">({details.reviewsCount})</span>
              </div>

              {stop.location?.address && (
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>{stop.location.address}</span>
                </p>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-2xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Entry Ticket (INR)
                </span>
                <span className="text-lg font-extrabold text-emerald-700 flex items-center gap-1 mt-0.5">
                  {details.ticketPriceINR > 0 ? (
                    <>
                      <IndianRupee className="w-4 h-4" />
                      <span>₹{details.ticketPriceINR.toLocaleString('en-IN')}</span>
                    </>
                  ) : (
                    <span className="text-sm font-black text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-2 py-0.5 rounded-lg">
                      Free Entry
                    </span>
                  )}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-2xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Scheduled Slot
                </span>
                <span className="text-base font-extrabold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  {stop.time_slot?.start} - {stop.time_slot?.end}
                </span>
              </div>
            </div>

            {/* Best visiting advice */}
            <div className="bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-2xl text-xs text-amber-900">
              <span className="font-bold block mb-0.5">Optimal Visiting Hour:</span>
              <span>{details.bestTime}</span>
            </div>

            {/* Overview */}
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Overview & Heritage
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {details.overview}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights & Architectural Features */}
      {details.highlights && details.highlights.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm card-3d">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Compass className="w-5 h-5 text-sky-600" />
            <span>Key Visitor Highlights & Must-See Features</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {details.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{h}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real Traveler Reviews Section */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm card-3d space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>Real Traveler Reviews & Testimonials</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Authentic feedback and visitor tips from worldwide explorers.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            100% Genuine Reviews
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {details.reviews.map((rev, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl flex flex-col justify-between space-y-3 card-3d">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: rev.rating || 5 }).map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {rev.author[0]}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 leading-tight">{rev.author}</h5>
                  <span className="text-[10px] text-slate-400">{rev.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
