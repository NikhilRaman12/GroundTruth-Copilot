
import React, { useState, useEffect } from 'react';
import { UserContext, EditType } from '../types';
import { INDIAN_STATES, STATE_DISTRICT_MAP, BHARAT_LANGUAGES, PRIMARY_INTENTS, UI_LABELS } from '../constants';

interface Props {
  onComplete: (context: UserContext) => void;
  onPartialUpdate: (context: Partial<UserContext>) => void;
  onCancel?: () => void;
  initialContext?: Partial<UserContext>;
  editMode?: EditType;
}

const ContextForm: React.FC<Props> = ({ onComplete, onPartialUpdate, onCancel, initialContext, editMode }) => {
  const getInitialStep = () => {
    if (editMode === 'language') return 1;
    if (editMode === 'location') return 2;
    if (editMode === 'assumptions') return 3;
    if (editMode === 'query') return 4;
    return 1;
  };

  const [step, setStep] = useState(getInitialStep());
  const [state, setState] = useState(initialContext?.state || '');
  const [district, setDistrict] = useState(initialContext?.district || '');
  const [mandal, setMandal] = useState(initialContext?.mandal || '');
  const [village, setVillage] = useState(initialContext?.village || '');
  const [intent, setIntent] = useState(initialContext?.intent || '');
  const [crop, setCrop] = useState(initialContext?.cropOrTask || '');
  const [lang, setLang] = useState(initialContext?.language || 'hi');
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(
    initialContext?.location ? { lat: initialContext.location.latitude, lng: initialContext.location.longitude } : null
  );

  const labels = UI_LABELS[lang] || UI_LABELS.hi;
  const districts = state ? STATE_DISTRICT_MAP[state] || [] : [];

  useEffect(() => {
    onPartialUpdate({
      state, district, mandal, village, intent, cropOrTask: crop, language: lang,
      location: coords ? { latitude: coords.lat, longitude: coords.lng } : undefined
    });
  }, [state, district, mandal, village, intent, crop, lang, coords]);

  const handleLocate = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => setLocating(false)
    );
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (state && district && intent && crop && lang) {
      onComplete({
        state, district, mandal, village, intent, cropOrTask: crop, language: lang,
        location: coords ? { latitude: coords.lat, longitude: coords.lng } : undefined
      });
    }
  };

  const isStep1Valid = lang !== '';
  const isStep2Valid = state !== '' && district !== '';
  const isStep3Valid = mandal.trim() !== '' && village.trim() !== '';
  const isStep4Valid = intent !== '' && crop !== '';

  const buttonClass = (valid: boolean) => `flex-[2] py-5 font-black rounded-2xl shadow-xl transition-all uppercase tracking-widest text-[10px] ${
    valid ? 'bg-slate-900 text-white hover:bg-black' : 'bg-slate-100 text-slate-300 cursor-not-allowed'
  }`;

  return (
    <div className={`${editMode ? 'bg-transparent shadow-none border-none' : 'max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 mt-4 mb-20 overflow-hidden'}`}>
      {!editMode && step === 1 && (
        <div className="bg-slate-900 p-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 text-white rounded-2xl mb-4 text-3xl font-black shadow-lg">🛡️</div>
          <h2 className="text-2xl font-black tracking-tight">GroundTruth Setup</h2>
          <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-widest">Phase 1: Language</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className={`${editMode ? 'p-0' : 'p-8 md:p-12'} space-y-8`}>
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase mb-6 tracking-[0.2em]">🗣️ Language Selection</label>
            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {BHARAT_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => { setLang(l.code); if(!editMode) setStep(2); else handleSubmit(); }}
                  className={`py-4 px-4 rounded-2xl border-2 text-sm font-black transition-all ${
                    lang === l.code ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl scale-[1.02]' : 'bg-white border-slate-100 text-slate-600 hover:border-emerald-200'
                  }`}
                >
                  {l.name}
                </button>
              ))}
            </div>
            {onCancel && <div className="mt-8 flex justify-center"><button type="button" onClick={onCancel} className="text-xs font-black text-slate-400 uppercase underline">Cancel</button></div>}
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">📍 Phase 2: Jurisdiction Lock</label>
            <div className="space-y-4">
              <select value={state} onChange={(e) => { setState(e.target.value); setDistrict(''); }} className="w-full p-5 border-2 border-slate-100 rounded-2xl bg-slate-50 font-black text-slate-800 appearance-none shadow-sm" required>
                <option value="">Select State / UT</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full p-5 border-2 border-slate-100 rounded-2xl bg-slate-50 font-black text-slate-800 appearance-none shadow-sm disabled:opacity-50" required disabled={!state}>
                <option value="">Select District</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <button type="button" onClick={handleLocate} disabled={locating} className={`w-full py-4 border-2 font-black transition-all flex items-center justify-center gap-4 text-xs rounded-2xl ${coords ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-100 text-slate-400'}`}>
              {coords ? `✅ GPS Grounded` : locating ? labels.verifying : `📡 Enforce GPS Grounding`}
            </button>
            <div className="flex gap-4">
              {!editMode && <button type="button" onClick={() => setStep(1)} className="flex-1 py-5 border-2 border-slate-100 text-slate-400 font-black rounded-2xl uppercase text-[10px]">{labels.back}</button>}
              <button type="button" onClick={() => editMode ? handleSubmit() : setStep(3)} disabled={!isStep2Valid} className={buttonClass(isStep2Valid)}>{labels.next}</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">🔍 Phase 3: Sub-Location Lock</label>
            <div className="space-y-4">
              <input type="text" value={mandal} onChange={(e) => setMandal(e.target.value)} placeholder="Mandal / Block" className="w-full p-5 border-2 border-slate-100 rounded-2xl bg-slate-50 font-black text-slate-800 shadow-sm" required />
              <input type="text" value={village} onChange={(e) => setVillage(e.target.value)} placeholder="Village / Area" className="w-full p-5 border-2 border-slate-100 rounded-2xl bg-slate-50 font-black text-slate-800 shadow-sm" required />
            </div>
            <div className="flex gap-4">
              {!editMode && <button type="button" onClick={() => setStep(2)} className="flex-1 py-5 border-2 border-slate-100 text-slate-400 font-black rounded-2xl uppercase text-[10px]">{labels.back}</button>}
              <button type="button" onClick={() => editMode ? handleSubmit() : setStep(4)} disabled={!isStep3Valid} className={buttonClass(isStep3Valid)}>{labels.next}</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">🎯 Phase 4: Primary Intent</label>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {PRIMARY_INTENTS.map((i) => (
                <button key={i} type="button" onClick={() => setIntent(i)} className={`py-4 px-6 rounded-2xl border-2 text-sm font-black transition-all text-left flex justify-between items-center ${intent === i ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md' : 'bg-white border-slate-100 text-slate-600'}`}>{i} {intent === i && '✅'}</button>
              ))}
            </div>
            <input type="text" value={crop} onChange={(e) => setCrop(e.target.value)} placeholder="Specific Crop (e.g. Paddy)" className="w-full p-5 border-2 border-slate-100 rounded-2xl bg-slate-50 font-black text-slate-800 shadow-sm" required />
            <div className="flex gap-4">
              {!editMode && <button type="button" onClick={() => setStep(3)} className="flex-1 py-5 border-2 border-slate-100 text-slate-400 font-black rounded-2xl uppercase text-[10px]">{labels.back}</button>}
              <button type="submit" disabled={!isStep4Valid} className={`flex-[2] py-5 font-black rounded-2xl shadow-2xl transition-all text-sm uppercase ${isStep4Valid ? 'bg-emerald-600 text-white hover:bg-black' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}>{labels.lock_start}</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

// Fix: Add missing default export
export default ContextForm;
