import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, UserContext, EditType } from '../types';
import { SAFETY_DISCLAIMER } from '../constants';
import WeatherWidget from './WeatherWidget';
import ControlBar from './ControlBar';

interface Props {
  messages: ChatMessage[];
  context: UserContext;
  onFollowUp: (query: string) => void;
  onReset: () => void;
  onEdit: (type: EditType) => void;
  isLoading: boolean;
}

const ConversationView: React.FC<Props> = ({ messages, context, onFollowUp, onReset, onEdit, isLoading }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onFollowUp(input);
      setInput('');
    }
  };

  const initialWeather = messages.find(m => m.weather)?.weather;

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-100px)]">
      <ControlBar context={context} onEdit={onEdit} onReset={onReset} />
      
      <div ref={scrollRef} className="flex-grow overflow-y-auto space-y-6 pb-40 px-2 pt-6 scroll-smooth custom-scrollbar">
        {initialWeather && (
          <WeatherWidget weather={initialWeather} location={context.district} />
        )}

        <div className="bg-amber-50 px-6 py-4 rounded-2xl border border-amber-100 flex items-center gap-3 shadow-sm">
          <span className="text-xl">📢</span>
          <p className="text-[10px] font-black text-amber-900 uppercase tracking-tighter">{SAFETY_DISCLAIMER}</p>
        </div>

        {messages.map((msg, idx) => {
          if (msg.role === 'system') {
            return (
              <div key={idx} className="flex justify-center px-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <span className="animate-pulse">⚡</span> {msg.text}
                </div>
              </div>
            );
          }

          return (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`max-w-[85%] md:max-w-[75%] rounded-3xl p-6 shadow-sm ${
                msg.role === 'user' 
                ? 'bg-emerald-900 text-white rounded-tr-none' 
                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
              }`}>
                <div className="prose prose-sm md:prose-base max-w-none whitespace-pre-wrap font-medium leading-relaxed md:leading-loose tracking-wide">
                  {msg.text}
                </div>

                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Verified Sources</p>
                    <div className="flex flex-wrap gap-2">
                      {msg.citations.map((cite, cIdx) => {
                        const item = cite.web || cite.maps;
                        if (!item) return null;
                        return (
                          <a 
                            key={cIdx}
                            href={item.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] bg-slate-100 hover:bg-emerald-100 px-3 py-1.5 rounded-full border border-slate-200 transition-all font-bold truncate max-w-[200px]"
                          >
                            {cite.web ? '🌐' : '📍'} {item.title || 'Official Source'}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white border border-slate-200 rounded-3xl rounded-tl-none p-6 flex gap-2 items-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-150"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Consulting Verified Data...</span>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-10 pb-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3 bg-white p-2 pl-6 rounded-full shadow-2xl border-2 border-slate-200 ring-8 ring-slate-50/50">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
            placeholder="Ask follow-up..."
            className="flex-grow py-3 bg-transparent outline-none font-bold text-slate-700 text-sm md:text-base"
          />
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSubmit}
              disabled={!input.trim() || isLoading}
              className={`px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all ${
                input.trim() && !isLoading 
                ? 'bg-emerald-600 text-white shadow-lg hover:bg-black' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationView;