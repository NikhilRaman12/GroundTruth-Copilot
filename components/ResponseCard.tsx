
import React from 'react';
import { ChatMessage, UserContext } from '../types';
import { SAFETY_DISCLAIMER } from '../constants';
import WeatherWidget from './WeatherWidget';

interface Props {
  // FIX: Replaced non-existent CopilotResponse with ChatMessage
  response: ChatMessage;
  context: UserContext;
  onNewQuery: () => void;
}

const ResponseCard: React.FC<Props> = ({ response, context, onNewQuery }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      {response.weather && (
        <WeatherWidget weather={response.weather} location={context.district} />
      )}

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex items-center gap-3">
          <span className="text-xl">📢</span>
          <p className="text-xs font-black text-amber-900 uppercase tracking-tighter">{SAFETY_DISCLAIMER}</p>
        </div>

        <div className="p-8">
          <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed whitespace-pre-wrap font-medium text-lg">
            {response.text}
          </div>
        </div>

        {response.citations && response.citations.length > 0 && (
          <div className="px-8 pb-8 border-t border-slate-100 pt-8">
            <h4 className="text-[10px] font-black text-slate-400 uppercase mb-6 flex items-center gap-3 tracking-[0.2em]">
              <span className="w-12 h-[2px] bg-emerald-500/20"></span>
              Verified Sources
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {response.citations.map((cite, idx) => {
                const item = cite.web || cite.maps;
                if (!item) return null;
                return (
                  <a 
                    key={idx}
                    href={item.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-emerald-50 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm border border-slate-100">
                      {cite.web ? '🌐' : '📍'}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-black text-slate-700 truncate group-hover:text-emerald-700">{item.title || 'Official Portal'}</p>
                      <p className="text-[10px] text-slate-400 truncate font-mono mt-1">{new URL(item.uri).hostname}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center pt-4">
        <button 
          onClick={onNewQuery}
          className="bg-emerald-900 text-white px-10 py-4 rounded-full font-black shadow-2xl hover:bg-black transition-all transform active:scale-95 flex items-center gap-3 uppercase tracking-widest text-sm"
        >
          <span>↩</span> Reset Investigation
        </button>
      </div>
    </div>
  );
};

export default ResponseCard;
