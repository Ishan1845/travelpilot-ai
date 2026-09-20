import React, { useState, useEffect } from 'react';
import { Quote, Sparkles } from 'lucide-react';

const TRAVEL_QUOTES = [
  { text: "Travel is fatal to prejudice, bigotry, and narrow-mindedness.", author: "Mark Twain" },
  { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  { text: "The real voyage of discovery consists not in seeking new landscapes, but in having new eyes.", author: "Marcel Proust" },
  { text: "To travel is to live.", author: "Hans Christian Andersen" },
  { text: "Life is either a daring adventure or nothing at all.", author: "Helen Keller" },
  { text: "Travel makes one modest. You see what a tiny place you occupy in the world.", author: "Gustave Flaubert" },
  { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Jobs fill your pockets, but adventures fill your soul.", author: "Jaime Lyn Beatty" }
];

export default function QuoteCard() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % TRAVEL_QUOTES.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  const q = TRAVEL_QUOTES[index];

  return (
    <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-teal-50 border border-sky-100 rounded-2xl p-4 shadow-sm relative overflow-hidden transition-all duration-500">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-white rounded-xl shadow-xs text-sky-600">
          <Quote className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm italic font-serif text-slate-700 leading-relaxed">
            "{q.text}"
          </p>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-700 tracking-wide">— {q.author}</span>
            <button
              onClick={() => setIndex((prev) => (prev + 1) % TRAVEL_QUOTES.length)}
              className="text-[11px] text-slate-400 hover:text-sky-600 flex items-center gap-1 cursor-pointer transition-colors"
              title="Next quote"
            >
              <Sparkles className="w-3 h-3" />
              New Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
