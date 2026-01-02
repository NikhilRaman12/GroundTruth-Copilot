
import React from 'react';
import { WeatherData } from '../types';

interface Props {
  weather: WeatherData;
  location: string;
}

const WeatherWidget: React.FC<Props> = ({ weather, location }) => {
  const tempVal = parseInt(weather.temp);
  const windVal = parseInt(weather.wind);
  
  const isHeatRisk = !isNaN(tempVal) && tempVal > 38;
  const isWindRisk = !isNaN(windVal) && windVal > 30;

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6 border-2 border-slate-100">
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Authentic District Data</span>
        </div>
        <div className="bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
          <span className="text-[9px] font-black text-emerald-400 uppercase">{weather.condition}</span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl transition-all ${isHeatRisk ? 'bg-orange-50 border-orange-200 border-2' : 'bg-slate-50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🌡️</span>
            <span className="text-[10px] font-black text-slate-400 uppercase">Temp</span>
          </div>
          <div className="text-3xl font-black text-slate-900">{weather.temp}</div>
          {isHeatRisk && <div className="text-[8px] font-black text-orange-600 uppercase mt-1">⚠️ IMD Heat Alert</div>}
        </div>

        <div className="p-4 rounded-2xl bg-slate-50">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🌧️</span>
            <span className="text-[10px] font-black text-slate-400 uppercase">Rain</span>
          </div>
          <div className="text-3xl font-black text-slate-900">{weather.rainfall}</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">💧</span>
            <span className="text-[10px] font-black text-slate-400 uppercase">Humid</span>
          </div>
          <div className="text-3xl font-black text-slate-900">{weather.humidity}</div>
        </div>

        <div className={`p-4 rounded-2xl transition-all ${isWindRisk ? 'bg-blue-50 border-blue-200 border-2' : 'bg-slate-50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🌬️</span>
            <span className="text-[10px] font-black text-slate-400 uppercase">Wind</span>
          </div>
          <div className="text-3xl font-black text-slate-900">{weather.wind}</div>
          {isWindRisk && <div className="text-[8px] font-black text-blue-600 uppercase mt-1">⚠️ Gust Advisory</div>}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
