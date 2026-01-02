
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-emerald-900 text-white py-6 px-4 md:px-8 sticky top-0 z-50 shadow-lg">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded flex items-center justify-center font-bold text-xl shadow-inner">GT</div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">GroundTruth Copilot</h1>
            <p className="text-xs text-emerald-300 font-medium uppercase tracking-widest">Safety-Critical Agricultural Intel</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-emerald-800/50 px-3 py-1.5 rounded-full border border-emerald-700">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Public Interest Infrastructure</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
