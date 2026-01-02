
import React from 'react';
import { UserContext, EditType } from '../types';
import { UI_LABELS, BHARAT_LANGUAGES } from '../constants';

interface Props {
  context: Partial<UserContext>;
  onEdit: (type: EditType) => void;
  visible: boolean;
}

const SelectionSummary: React.FC<Props> = ({ context, onEdit, visible }) => {
  if (!visible) return null;

  const langCode = context.language || 'hi';
  const labels = UI_LABELS[langCode] || UI_LABELS.hi;
  
  const currentLangName = BHARAT_LANGUAGES.find(l => l.code === context.language)?.name || labels.not_selected;

  return (
    <div className="sticky top-[88px] z-40 bg-slate-900 text-white border-b border-emerald-500/30 px-4 py-3 shadow-xl animate-in fade-in slide-in-from-top-2">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        
        {/* Language Selection */}
        <div className="flex items-center justify-between bg-slate-800/50 px-3 py-2 rounded-xl border border-slate-700">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">{labels.language}</span>
            <span className="text-sm font-bold truncate">{currentLangName}</span>
          </div>
          <button onClick={() => onEdit('language')} className="bg-slate-700 hover:bg-emerald-600 p-2 rounded-lg transition-colors text-xs">
            ✏️ {labels.edit}
          </button>
        </div>

        {/* Location Selection */}
        <div className="flex items-center justify-between bg-slate-800/50 px-3 py-2 rounded-xl border border-slate-700">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">{labels.location}</span>
            <span className="text-sm font-bold truncate">
              {context.state && context.district ? `${context.state}, ${context.district}` : labels.not_selected}
            </span>
          </div>
          <button onClick={() => onEdit('location')} className="bg-slate-700 hover:bg-emerald-600 p-2 rounded-lg transition-colors text-xs">
            ✏️ {labels.edit}
          </button>
        </div>

        {/* Mandal/Village Selection */}
        <div className="flex items-center justify-between bg-slate-800/50 px-3 py-2 rounded-xl border border-slate-700">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">{labels.mandal_village}</span>
            <span className="text-sm font-bold truncate">
              {context.mandal && context.village ? `${context.mandal}, ${context.village}` : labels.not_selected}
            </span>
          </div>
          <button onClick={() => onEdit('assumptions')} className="bg-slate-700 hover:bg-emerald-600 p-2 rounded-lg transition-colors text-xs">
            ✏️ {labels.edit}
          </button>
        </div>

      </div>
    </div>
  );
};

// Fix: Add missing default export
export default SelectionSummary;
