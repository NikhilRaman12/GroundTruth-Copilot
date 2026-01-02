import React from 'react';
import { UserContext, EditType } from '../types';

interface Props {
  context: UserContext;
  onEdit: (type: EditType) => void;
  onReset: () => void;
}

const ControlBar: React.FC<Props> = ({ context, onEdit, onReset }) => {
  return (
    <div className="sticky top-[88px] z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-sm">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <button 
            onClick={() => onEdit('query')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-700 transition-all text-[11px] font-black uppercase tracking-wider whitespace-nowrap"
          >
            <span>✏️</span> Edit Question
          </button>
          <button 
            onClick={() => onEdit('location')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-700 transition-all text-[11px] font-black uppercase tracking-wider whitespace-nowrap"
          >
            <span>📍</span> Location
          </button>
          <button 
            onClick={() => onEdit('language')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-700 transition-all text-[11px] font-black uppercase tracking-wider whitespace-nowrap"
          >
            <span>🗣️</span> Language
          </button>
          <button 
            onClick={() => onEdit('assumptions')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-700 transition-all text-[11px] font-black uppercase tracking-wider whitespace-nowrap"
          >
            <span>⚙️</span> Inputs
          </button>
        </div>
        
        <div className="hidden md:flex items-center gap-4 text-[10px] font-bold text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            {context.district}, {context.state}
          </span>
          <span className="h-3 w-[1px] bg-slate-200"></span>
          <button onClick={onReset} className="hover:text-red-500 transition-colors">RESET SESSION</button>
        </div>
      </div>
    </div>
  );
};

export default ControlBar;