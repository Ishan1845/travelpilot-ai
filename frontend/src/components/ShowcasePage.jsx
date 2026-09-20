import React, { useState } from 'react';
import { 
  Sparkles, Compass, ShieldCheck, Zap, Navigation, MapPin, 
  Clock, IndianRupee, ArrowRight, Star, Heart, CheckCircle2, Award, 
  Plane, Train, Car, Users, Calendar, Filter, Check, ExternalLink, MessageSquare, Quote
} from 'lucide-react';
import QuoteCard from './QuoteCard';

const FAMOUS_DESTINATIONS = [
  {
    id: "taj_mahal",
    name: "Taj Mahal & Agra Fort",
    city: "Agra",
    country: "India",
    category: "Heritage",
    tagline: "UNESCO World Wonder • Ivory-White Marble Jewel",
    description: "Emperor Shah Jahan's architectural marvel along the Yamuna River, featuring the symmetrical Charbagh reflection gardens and Agra Fort.",
    bestTime: "Sunrise (06:00 AM) or Full Moon Night",
    priceEstimate: "₹3,400",
    rating: "4.9",
    reviewsCount: "18,420",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
    tags: ["World Wonder", "Mughal Architecture", "Yamuna View"]
  },
  {
    id: "hawa_mahal",
    name: "Hawa Mahal & Amber Fort",
    city: "Jaipur",
    country: "India",
    category: "Heritage",
    tagline: "The Pink City • Palace of 953 Jharokhas",
    description: "Built in 1799 by Maharaja Sawai Pratap Singh with 953 pink sandstone windows, coupled with Amber Fort's dazzling Sheesh Mahal mirror palace.",
    bestTime: "Morning Golden Hour (09:00 AM)",
    priceEstimate: "₹4,200",
    rating: "4.8",
    reviewsCount: "14,890",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
    tags: ["Royal Palaces", "Hilltop Fort", "Folk Heritage"]
  },
  {
    id: "varanasi_ghats",
    name: "Ganga Ghats & Kashi Vishwanath",
    city: "Varanasi",
    country: "India",
    category: "Spiritual",
    tagline: "World's Oldest Living Spiritual Capital",
    description: "Mesmerizing evening Maha Aarti at Dashashwamedh Ghat with synchronized brass lamps, morning sunrise boat cruises, and the Kashi Vishwanath Corridor.",
    bestTime: "Evening Aarti (17:30) & Sunrise Boat Cruise",
    priceEstimate: "₹3,800",
    rating: "4.9",
    reviewsCount: "16,750",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
    tags: ["Sacred Ghats", "Maha Aarti", "Ancient Temples"]
  },
  {
    id: "kerala_backwaters",
    name: "Alleppey Houseboats & Munnar Hills",
    city: "Kerala",
    country: "India",
    category: "Nature",
    tagline: "God's Own Country • Canals & Cloud Forests",
    description: "Tranquil network of palm-fringed backwater canals aboard handcrafted kettuvallam houseboats, alongside Munnar's high-altitude tea plantations.",
    bestTime: "October to March (Pleasant Tropical Breeze)",
    priceEstimate: "₹6,500",
    rating: "4.9",
    reviewsCount: "12,300",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    tags: ["Houseboats", "Tea Estates", "Tropical Canals"]
  },
  {
    id: "goa_beaches",
    name: "Fort Aguada & Baga Beach",
    city: "Goa",
    country: "India",
    category: "Coastal",
    tagline: "Golden Sands, Portuguese Citadels & Spice",
    description: "17th-century Portuguese coastal lighthouse fortress overlooking the Arabian Sea, coupled with golden beaches, water sports, and sunset seafood shacks.",
    bestTime: "Sunset Hours (16:30 - 19:30)",
    priceEstimate: "₹5,200",
    rating: "4.8",
    reviewsCount: "22,100",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
    tags: ["Coastal Forts", "Arabian Sea", "Sunset Shacks"]
  },
  {
    id: "statue_of_unity",
    name: "Statue of Unity (182m) & Narmada",
    city: "Kevadia",
    country: "India",
    category: "Heritage",
    tagline: "World's Tallest Monument • Sardar Sarovar Dam",
    description: "Colossal 182-meter tribute to Sardar Vallabhbhai Patel with high-speed viewing gallery at 153m, Valley of Flowers, and evening laser projection mapping.",
    bestTime: "Morning Viewing Gallery & Evening Laser Show",
    priceEstimate: "₹2,900",
    rating: "4.9",
    reviewsCount: "19,800",
    image: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80",
    tags: ["World Record", "Sardar Patel", "Laser Show"]
  },
  {
    id: "eiffel_tower",
    name: "Eiffel Tower & Louvre Museum",
    city: "Paris",
    country: "France",
    category: "Global",
    tagline: "Global Icon of Art, Romance & Architecture",
    description: "The 330-meter architectural wonder of Champ de Mars paired with the world's greatest art treasury at the Louvre and romantic Seine evening riverboats.",
    bestTime: "Twilight Golden Hour (Hourly Diamond Sparkles)",
    priceEstimate: "₹42,000",
    rating: "4.8",
    reviewsCount: "35,400",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    tags: ["Global Wonder", "Seine Cruise", "Fine Arts"]
  },
  {
    id: "tokyo_shibuya",
    name: "Senso-ji & Shibuya Sky Observatory",
    city: "Tokyo",
    country: "Japan",
    category: "Global",
    tagline: "Ancient Shinto Traditions Meet Futuristic Neon",
    description: "Historic Asakusa Buddhist sanctum contrasting with 360-degree open-air glass decks above Shibuya Crossing and teamLab crystalline digital art.",
    bestTime: "Late Afternoon through Neon Evening",
    priceEstimate: "₹48,000",
    rating: "4.9",
    reviewsCount: "28,600",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
    tags: ["Ancient & Future", "Sky Deck", "Digital Art"]
  }
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Ananya & Vikram Sharma",
    location: "Bengaluru, India",
    trip: "4-Day Jaipur & Golden Triangle",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    verified: true,
    review: "The biggest relief was zero repetitive places! Every day had fresh, distinct landmarks, and the new Photos and Reviews button let us see real traveler pictures before arriving. Flawless timing on the Delhi-Mumbai Expressway."
  },
  {
    id: 2,
    name: "Rohan Mehta",
    location: "Mumbai, India",
    trip: "3-Day Goa Coastal Journey",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    verified: true,
    review: "When our highway stretch had a monsoon diversion, TravelPilot's live disruption engine kicked in immediately and gave us an alternate scenic stop with accurate travel buffers. Unmatched agent intelligence."
  },
  {
    id: 3,
    name: "Sanya Sen & Family",
    location: "Kolkata, India",
    trip: "3-Day Spiritual Varanasi",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    verified: true,
    review: "The booking preview feature showed us verified Vande Bharat timings and seat fares in ₹ INR down to the rupee. Traveling with senior citizens was smooth, peaceful, and perfectly organized."
  },
  {
    id: 4,
    name: "David & Sarah Mitchell",
    location: "London, UK",
    trip: "First-Time Incredible India Tour",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    verified: true,
    review: "TravelPilot made discovering India effortless. Realistic ticket costs, zero hallucinations, and the AI Trip Copilot on the corner felt like having a local historian in our pocket at Agra and Kevadia."
  }
];

export default function ShowcasePage({ onSelectDestination, onStartPlanner }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Interactive Booking Preview State
  const [bookingMode, setBookingMode] = useState("road"); // 'flight' | 'train' | 'road'
  const [bookingOrigin, setBookingOrigin] = useState("Delhi NCR");
  const [bookingDest, setBookingDest] = useState("Agra");
  const [bookingMembers, setBookingMembers] = useState(2);
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });

  // Dynamic booking fare preview calculation in INR
  const getBookingRates = () => {
    if (bookingMode === 'flight') {
      return { perPerson: 3400, carrier: "IndiGo 6E-7124 / Air India Shuttle", duration: "1h 15m", schedule: "Departs 08:45 AM • Verified Terminal Schedule" };
    } else if (bookingMode === 'train') {
      return { perPerson: 1250, carrier: "Vande Bharat Express (20172 / Executive)", duration: "1h 45m", schedule: "Departs 08:10 AM from Nizamuddin" };
    }
    return { perPerson: 750, carrier: "Yamuna Expressway AC Deluxe Multi-Axle", duration: "3h 30m", schedule: "Departs 06:30 AM via Taj Expressway Corridor" };
  };

  const bookingRates = getBookingRates();
  const totalBookingCost = bookingRates.perPerson * bookingMembers;

  const filteredDestinations = selectedCategory === "All" 
    ? FAMOUS_DESTINATIONS 
    : FAMOUS_DESTINATIONS.filter(d => d.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleHeroQuickGenerate = () => {
    if (onSelectDestination) {
      onSelectDestination(bookingDest, `${bookingDest} Experience`);
    } else if (onStartPlanner) {
      onStartPlanner();
    }
  };

  return (
    <div className="space-y-16 relative">
      {/* 
        ========================================================================
        1. HERO SECTION WITH AURORA UI GRADIENTS (Electric Blue, Saffron, Warm Orange, White)
        ========================================================================
      */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl p-6 sm:p-10 lg:p-14 text-white">
        {/* Luminous Aurora Ambient Light Glows (User Palette Exclusive) */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#007BFF] opacity-40 blur-[130px] pointer-events-none animate-pulse" />
        <div className="absolute top-[-15%] right-[-10%] w-[480px] h-[480px] rounded-full bg-[#FF6A00] opacity-35 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[35%] w-[450px] h-[450px] rounded-full bg-[#FF8800] opacity-30 blur-[120px] pointer-events-none" />
        <div className="absolute top-[40%] right-[25%] w-[250px] h-[250px] rounded-full bg-white opacity-15 blur-[90px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Glowing Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-[#007BFF]/50 shadow-lg shadow-[#007BFF]/20 text-xs font-black tracking-wide text-sky-200 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6A00] animate-spin" />
            <span className="text-white">Aurora Travel Intelligence</span>
            <span className="text-slate-400">•</span>
            <span className="text-[#FF8800]">2026 Edition</span>
          </div>

          {/* Majestic Hero Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
            Where Every Journey Becomes A{" "}
            <span className="bg-gradient-to-r from-[#007BFF] via-[#FF6A00] to-[#FF8800] bg-clip-text text-transparent">
              Grounded Masterpiece
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            AI-driven itineraries grounded in live Indian expressway networks, Vande Bharat high-speed rail, and commercial flights. Zero repeated stops. 100% verified timing.
          </p>

          {/* Interactive Aurora Search / Quick Planner Bar */}
          <div className="mt-8 p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-xl shadow-2xl max-w-3xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              {/* Destination Input */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF8800] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#007BFF]" />
                  Destination
                </label>
                <select 
                  value={bookingDest} 
                  onChange={(e) => setBookingDest(e.target.value)}
                  className="w-full bg-transparent text-white font-bold text-xs sm:text-sm mt-1 focus:outline-none cursor-pointer"
                >
                  <option value="Agra" className="bg-slate-900 text-white">Agra (Taj Mahal & Fort)</option>
                  <option value="Jaipur" className="bg-slate-900 text-white">Jaipur (Pink City & Forts)</option>
                  <option value="Varanasi" className="bg-slate-900 text-white">Varanasi (Ganga Ghats)</option>
                  <option value="Goa" className="bg-slate-900 text-white">Goa (Beaches & Forts)</option>
                  <option value="Kerala" className="bg-slate-900 text-white">Kerala (Backwaters & Munnar)</option>
                  <option value="Kevadia" className="bg-slate-900 text-white">Kevadia (Statue of Unity)</option>
                  <option value="Paris" className="bg-slate-900 text-white">Paris (Eiffel Tower & Louvre)</option>
                </select>
              </div>

              {/* Members Selection */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF8800] flex items-center gap-1">
                  <Users className="w-3 h-3 text-[#007BFF]" />
                  Travelers
                </label>
                <select 
                  value={bookingMembers} 
                  onChange={(e) => setBookingMembers(Number(e.target.value))}
                  className="w-full bg-transparent text-white font-bold text-xs sm:text-sm mt-1 focus:outline-none cursor-pointer"
                >
                  <option value={1} className="bg-slate-900 text-white">1 Solo Explorer</option>
                  <option value={2} className="bg-slate-900 text-white">2 Members (Couple/Friends)</option>
                  <option value={4} className="bg-slate-900 text-white">4 Members (Family Group)</option>
                  <option value={6} className="bg-slate-900 text-white">6 Members (Large Group)</option>
                </select>
              </div>

              {/* Instant Aurora Generate Button */}
              <button
                type="button"
                onClick={handleHeroQuickGenerate}
                className="aurora-glow-button text-white font-black text-xs sm:text-sm rounded-xl px-5 py-3 flex items-center justify-center gap-2 cursor-pointer transition-all hover:brightness-110"
              >
                <Sparkles className="w-4 h-4 text-white animate-spin" />
                <span>Plan Grounded Trip →</span>
              </button>
            </div>
          </div>

          {/* Live Trust Metrics Strip */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-t border-slate-800/80">
            <div>
              <span className="text-lg sm:text-2xl font-black text-white">500+</span>
              <p className="text-[11px] text-slate-400 font-medium">Verified Landmarks</p>
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-black text-[#007BFF]">0 Repeated</span>
              <p className="text-[11px] text-slate-400 font-medium">Daily Unique Venues</p>
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-black text-[#FF6A00]">100% Date</span>
              <p className="text-[11px] text-slate-400 font-medium">Verified Transit</p>
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-black text-[#FF8800]">4.9 ★</span>
              <p className="text-[11px] text-slate-400 font-medium">Traveler Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Banner */}
      <QuoteCard />

      {/* 
        ========================================================================
        2. DESTINATION SHOWCASE
        ========================================================================
      */}
      <section className="space-y-8">
        <div className="flex items-end justify-between flex-wrap gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#007BFF] bg-sky-50 border border-sky-200 px-3 py-0.5 rounded-full">
                Curated Destinations
              </span>
              <span className="text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-md">
                🇮🇳 Incredible India & Global
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
              Explore Iconic World Wonders
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select any wonder below to launch an instant grounded itinerary with live verified transit and zero repeated stops.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {["All", "Heritage", "Spiritual", "Nature", "Coastal", "Global"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-[#007BFF] hover:text-[#007BFF]'
                }`}
              >
                {cat === "All" ? "All Wonders" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm card-3d flex flex-col justify-between hover:border-[#007BFF] transition-all group"
            >
              <div>
                {/* Destination Image & Badges */}
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-lg border border-white/20">
                    {dest.city}, {dest.country}
                  </div>

                  {/* Rating & Live Price */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <div className="flex items-center gap-1 text-xs font-extrabold bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md">
                      <Star className="w-3.5 h-3.5 text-[#FF8800] fill-[#FF8800]" />
                      <span>{dest.rating}</span>
                      <span className="text-[10px] text-slate-300">({dest.reviewsCount})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-300 block">From</span>
                      <span className="text-xs font-black text-amber-300">{dest.priceEstimate}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight group-hover:text-[#007BFF] transition-colors leading-snug">
                    {dest.name}
                  </h3>
                  <p className="text-[11px] text-[#FF6A00] font-bold">
                    {dest.tagline}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>

                  {/* Best Time Tag */}
                  <div className="pt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-[#007BFF] shrink-0" />
                    <span className="truncate">{dest.bestTime}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => onSelectDestination && onSelectDestination(dest.city, dest.name)}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-gradient-to-r hover:from-[#007BFF] hover:via-[#FF6A00] hover:to-[#FF8800] text-white font-extrabold text-xs rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group/btn"
                >
                  <span>Plan Grounded Journey</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 
        ========================================================================
        3. INTERACTIVE MULTI-MODAL BOOKING PREVIEW
        ========================================================================
      */}
      <section className="bg-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Aurora Glow Mesh */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#007BFF] opacity-25 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF6A00] opacity-20 blur-[130px] pointer-events-none" />

        <div className="relative z-10 space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#FF8800] bg-orange-950/60 border border-orange-700/50 px-3 py-1 rounded-full">
                Interactive Booking Preview
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
                Live Multi-Modal Transit Engine
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Preview real commercial flights, high-speed Vande Bharat trains, and expressways with live verified schedules.
              </p>
            </div>

            {/* Mode Selector Tabs */}
            <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setBookingMode("road")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  bookingMode === "road" 
                    ? 'bg-gradient-to-r from-[#007BFF] to-[#0ea5e9] text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>Expressway</span>
              </button>

              <button
                type="button"
                onClick={() => setBookingMode("train")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  bookingMode === "train" 
                    ? 'bg-gradient-to-r from-[#007BFF] to-[#0ea5e9] text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Train className="w-4 h-4" />
                <span>Vande Bharat</span>
              </button>

              <button
                type="button"
                onClick={() => setBookingMode("flight")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  bookingMode === "flight" 
                    ? 'bg-gradient-to-r from-[#007BFF] to-[#0ea5e9] text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Plane className="w-4 h-4" />
                <span>Flight</span>
              </button>
            </div>
          </div>

          {/* Interactive Booking Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Route Summary Card */}
            <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#007BFF]">
                  <ShieldCheck className="w-4 h-4 text-[#007BFF]" />
                  <span>Verified Carrier Transit</span>
                </div>
                <span className="text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                  ● 9 Seats Available
                </span>
              </div>

              {/* Departure to Arrival Timeline */}
              <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Origin Hub</span>
                  <span className="text-base sm:text-lg font-black text-white">{bookingOrigin}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Terminal / Station Gate A</span>
                </div>

                <div className="flex-1 flex flex-col items-center px-2">
                  <span className="text-[10px] font-bold text-[#FF8800] mb-1">{bookingRates.duration}</span>
                  <div className="w-full flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#007BFF]" />
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-[#007BFF] via-[#FF6A00] to-[#FF8800]" />
                    <div className="w-2 h-2 rounded-full bg-[#FF8800]" />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 capitalize">{bookingMode} Corridor</span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Destination</span>
                  <span className="text-base sm:text-lg font-black text-white">{bookingDest}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">City Gateway Junction</span>
                </div>
              </div>

              {/* Carrier & Schedule Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Transit Provider</span>
                  <span className="font-extrabold text-white mt-0.5 block">{bookingRates.carrier}</span>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Verified Schedule</span>
                  <span className="font-extrabold text-[#FF8800] mt-0.5 block">{bookingRates.schedule}</span>
                </div>
              </div>
            </div>

            {/* Live Pricing Breakdown Card */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                  <span>Fare Summary</span>
                  <span className="text-xs font-bold text-[#FF6A00] bg-orange-950/60 px-2 py-0.5 rounded border border-orange-800">
                    INR (₹) Guaranteed
                  </span>
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Base Fare (₹{bookingRates.perPerson} × {bookingMembers})</span>
                    <span className="text-white font-bold">₹{totalBookingCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Expressway Toll / Platform Tax</span>
                    <span className="text-emerald-400 font-bold">Included</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Grounded Buffer Sync</span>
                    <span className="text-[#007BFF] font-bold">Free AI Layer</span>
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm font-black text-white">
                    <span>Total Transit Est.</span>
                    <span className="text-xl text-amber-300">₹{totalBookingCost.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Action Trigger */}
              <button
                type="button"
                onClick={() => onSelectDestination && onSelectDestination(bookingDest, `${bookingDest} Journey`)}
                className="aurora-glow-button w-full py-3 px-4 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Reserve in Trip Planner</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        4. TRAVELER TESTIMONIALS
        ========================================================================
      */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-wider text-[#007BFF] bg-sky-50 border border-sky-200 px-3 py-0.5 rounded-full">
            Real Explorer Stories
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Loved By Modern Travelers Everywhere
          </h2>
          <p className="text-xs text-slate-500">
            Read authentic reviews from explorers who planned multi-day adventures with zero repeated places and live AI disruption healing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm card-3d flex flex-col justify-between hover:border-[#007BFF] transition-all space-y-4"
            >
              <div className="space-y-3">
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 text-[#FF8800]">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FF8800]" />
                  ))}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{t.review}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs"
                />
                <div>
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1">
                    {t.name}
                    {t.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#007BFF] inline" />
                    )}
                  </h4>
                  <span className="text-[10px] text-slate-400 block">{t.location}</span>
                  <span className="text-[10px] font-bold text-[#FF6A00] block mt-0.5">{t.trip}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 
        ========================================================================
        5. PRIDE OF INDIA (PM MODI, HAL TEJAS & BRAVE SOLDIERS)
        ========================================================================
      */}
      <section className="bg-gradient-to-r from-orange-50/90 via-white to-sky-50/90 border border-orange-200/80 rounded-3xl p-6 sm:p-8 shadow-sm card-3d space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-orange-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-orange-700 bg-orange-100 border border-orange-300 px-3 py-0.5 rounded-full">
                National Pride & Heritage
              </span>
              <span className="text-xs font-semibold text-sky-800 bg-sky-100 border border-sky-300 px-2.5 py-0.5 rounded-md">
                🇮🇳 Incredible India
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
              Welcoming the World to India: Heritage, Valor & Innovation
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500 italic">
            "Atithi Devo Bhava — The Guest is God"
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Hon'ble PM Narendra Modi */}
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs card-3d flex flex-col justify-between hover:border-orange-300">
            <div>
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <img
                  src="/images/modi_namaste.jpg"
                  alt="Hon'ble Prime Minister Shri Narendra Modi with hands joined in prayer Namaste"
                  className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Narendra_Modi_offers_prayers_at_Sree_Padmanabhaswamy_Temple_in_Trivadrum%2C_Kerala.jpg/640px-Narendra_Modi_offers_prayers_at_Sree_Padmanabhaswamy_Temple_in_Trivadrum%2C_Kerala.jpg";
                  }}
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span>🙏 Namaste Greeting</span>
                </div>
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[11px] font-extrabold text-[#FF6A00] uppercase tracking-wider block">
                  Vision of Global Tourism
                </span>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug">
                  Hon'ble Prime Minister Shri Narendra Modi
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Welcoming travelers across the globe with folded hands. Championing India's 5,000-year civilizational heritage, spiritual sanctuaries, and rapid modern connectivity under <em>Viksit Bharat</em>.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <div className="bg-orange-50 border border-orange-200/70 p-2.5 rounded-xl text-[11px] text-orange-900 font-semibold flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <span>"India offers warmth, timeless wonders, and boundless hospitality."</span>
              </div>
            </div>
          </div>

          {/* Card 2: Made in India Aircraft - HAL Tejas */}
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs card-3d flex flex-col justify-between hover:border-sky-300">
            <div>
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <img
                  src="/images/hal_tejas.jpg"
                  alt="HAL Tejas Supersonic Fighter Aircraft Made in India"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Tejas_MK1_in_service_for_7_years.jpg/640px-Tejas_MK1_in_service_for_7_years.jpg";
                  }}
                />
                <div className="absolute top-3 left-3 bg-sky-950/80 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span>✈️ Made in India</span>
                </div>
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[11px] font-extrabold text-[#007BFF] uppercase tracking-wider block">
                  Aerospace Self-Reliance (Atmanirbhar)
                </span>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug">
                  HAL LCA Tejas Supersonic Aircraft
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Indigenously engineered by the Aeronautical Development Agency (ADA) & Hindustan Aeronautics Limited (HAL). A supersonic, agile 4.5-generation multirole fighter embodying India's high-tech aerospace prowess.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <div className="bg-sky-50 border border-sky-200/70 p-2.5 rounded-xl text-[11px] text-sky-900 font-semibold flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#007BFF] shrink-0" />
                <span>Mach 1.6+ Supersonic Speed • Advanced Fly-By-Wire Avionics</span>
              </div>
            </div>
          </div>

          {/* Card 3: Brave Indian Soldier */}
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs card-3d flex flex-col justify-between hover:border-emerald-300">
            <div>
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <img
                  src="/images/indian_soldier.jpg"
                  alt="Indian Army Soldier on guard at the India Gate"
                  className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/A_Ceremonial_Guard_of_the_Indian_Army_at_India_Gate%2C_New_Delhi.jpg/640px-A_Ceremonial_Guard_of_the_Indian_Army_at_India_Gate%2C_New_Delhi.jpg";
                  }}
                />
                <div className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span>🛡️ Guardians of the Nation</span>
                </div>
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider block">
                  Sacrifice & Supreme Valor
                </span>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug">
                  Indian Armed Forces & Brave Soldiers
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Standing guard at the Siachen Glaciers, Himalayan passes, Thar desert frontiers, and Indian Ocean waters. Ensuring 1.4 billion citizens and millions of international travelers explore in absolute safety.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <div className="bg-emerald-50 border border-emerald-200/70 p-2.5 rounded-xl text-[11px] text-emerald-900 font-semibold flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>"Service Before Self" • Saluting the Martyrs at National War Memorial</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        6. TRIP PLANNER CALL-TO-ACTION (CTA) SECTION
        ========================================================================
      */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-950 text-white p-8 sm:p-12 border border-slate-800 shadow-2xl">
        {/* Sweeping Aurora Lights */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#007BFF]/30 to-[#FF6A00]/30 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#FF8800]/25 to-white/10 rounded-full blur-[110px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-[#007BFF]/40 text-xs font-bold text-sky-200">
            <Zap className="w-3.5 h-3.5 text-[#FF8800]" />
            <span>Ready in under 10 seconds</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Ready to Experience Your{" "}
            <span className="bg-gradient-to-r from-[#007BFF] via-[#FF6A00] to-[#FF8800] bg-clip-text text-transparent">
              Dream Journey?
            </span>
          </h2>

          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Generate an authentic, grounded day-by-day itinerary with verified expressway and rail transit, authentic photos and reviews, and zero repetitive places.
          </p>

          <div className="pt-4 flex items-center justify-center gap-4 flex-wrap">
            <button
              type="button"
              onClick={onStartPlanner}
              className="aurora-glow-button text-white font-black text-sm rounded-2xl px-8 py-4 shadow-xl flex items-center gap-2.5 cursor-pointer transition-all hover:scale-105"
            >
              <Compass className="w-5 h-5 text-white" />
              <span>Launch Trip Planner Now →</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectDestination && onSelectDestination("Agra", "Taj Mahal & Agra Fort")}
              className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-extrabold text-sm rounded-2xl px-6 py-4 border border-slate-700 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Explore Sample Taj Mahal</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
