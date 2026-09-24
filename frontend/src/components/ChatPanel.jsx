import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, MessageSquare, X, ExternalLink } from 'lucide-react';
import NamasteAvatar from './NamasteAvatar';

const SUGGESTED_QUESTIONS = [
  "What should I do tomorrow morning?",
  "Which activities are close to each other?",
  "What local food should I try?"
];

function renderMessageContent(text, isUser) {
  if (!text) return null;

  const lines = text.split('\n');

  return lines.map((line, lIdx) => {
    const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.substring(lastIndex, match.index));
      }
      const label = match[1];
      const url = match[2];
      parts.push(
        <a
          key={`link-${match.index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1 font-bold underline transition-colors mx-0.5 ${
            isUser ? 'text-amber-200 hover:text-white' : 'text-sky-600 hover:text-sky-800'
          }`}
        >
          <span>{label}</span>
          <ExternalLink className="w-3 h-3 shrink-0 inline" />
        </a>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < line.length) {
      parts.push(line.substring(lastIndex));
    }

    const renderedParts = parts.map((part, pIdx) => {
      if (typeof part === 'string') {
        const boldSegments = part.split(/(\*\*[^*]+\*\*)/g);
        return boldSegments.map((segment, sIdx) => {
          if (segment.startsWith('**') && segment.endsWith('**')) {
            return (
              <strong key={`b-${pIdx}-${sIdx}`} className="font-extrabold">
                {segment.slice(2, -2)}
              </strong>
            );
          }
          return segment;
        });
      }
      return part;
    });

    return (
      <React.Fragment key={`line-${lIdx}`}>
        {renderedParts}
        {lIdx < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

export default function ChatPanel({ itinerary, onSendMessage, messages, isLoading, onClose }) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const handleSuggestedClick = (text) => {
    if (isLoading) return;
    onSendMessage(text);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col h-[650px] transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <NamasteAvatar size={36} className="shadow-xs" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>Namaste AI</span>
              <span className="text-xs">🙏</span>
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Grounded in Live Itinerary
            </span>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
            title="Close Namaste AI"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Suggested prompts */}
      <div className="mb-4">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
          Quick Prompts:
        </span>
        <div className="flex flex-col gap-1.5">
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestedClick(q)}
              disabled={isLoading}
              className="text-left text-xs text-slate-600 bg-slate-50 hover:bg-sky-50/70 border border-slate-200/70 hover:border-sky-300 p-2 rounded-xl transition-all cursor-pointer truncate disabled:opacity-50"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-3.5 mb-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400">
            <NamasteAvatar size={48} className="mb-2 opacity-90 shadow-sm" />
            <p className="text-xs font-semibold text-slate-700">Namaste! How can I assist with your journey?</p>
            <p className="text-[11px] text-slate-400 mt-1">Ask any question about your travel schedule, places to visit, food, or timings.</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'agent' && (
              <NamasteAvatar size={28} className="mt-0.5 shadow-xs" />
            )}
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-sky-600 text-white font-medium rounded-tr-xs shadow-xs'
                  : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-xs shadow-xs'
              }`}
            >
              {renderMessageContent(msg.text, msg.role === 'user')}
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2.5 justify-start">
            <NamasteAvatar size={28} className="mt-0.5 shadow-xs animate-pulse" />
            <div className="bg-slate-50 border border-slate-200/80 text-slate-500 rounded-2xl rounded-tl-xs p-3 text-xs flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-600" />
              <span>Namaste AI is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="relative mt-auto pt-2 border-t border-slate-100">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask TripSaathi about your trip..."
          disabled={isLoading}
          className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-2 top-4 w-8 h-8 rounded-lg bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
