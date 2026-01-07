
import React, { useState, useEffect } from 'react';

const messages = [
  "Bronnen scannen op integriteit...",
  "RTTI verdeling herberekenen...",
  "Syllabus doelen synchroniseren...",
  "Antwoordmodellen juridisch dichtmetselen...",
  "Kernconcepten labelen...",
  "Taalniveau audit uitvoeren...",
  "Afleiders controleren op plausibiliteit...",
  "Foutanalyses genereren...",
  "Toetsmatrijs finaliseren...",
  "Validatie door constructeurs..."
];

const LoadingOverlay: React.FC = () => {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="brutalist-card flex flex-col items-center justify-center py-48 space-y-16 rounded-none relative overflow-hidden bg-white text-black">
      <div className="absolute top-0 left-0 w-full h-4 bg-[#c4d600]"></div>
      
      <div className="relative">
        <div className="w-32 h-32 border-8 border-black animate-spin flex items-center justify-center">
            <div className="w-16 h-16 bg-[#0065bd] animate-pulse"></div>
        </div>
      </div>
      
      <div className="relative w-72 h-3 bg-slate-100 border-2 border-black overflow-hidden">
        <div className="h-full bg-[#c4d600] animate-[loading_2s_infinite] shadow-[0_0_20px_rgba(196,214,0,0.4)]"></div>
      </div>

      <div className="text-center space-y-10 max-w-xl px-12 relative z-10">
        <p className="text-5xl font-black text-black uppercase tracking-tighter dalton-font italic drop-shadow-sm">
          ENGINE START...
        </p>
        <div className="bg-slate-50 p-10 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-base text-black font-black uppercase tracking-widest italic leading-relaxed">
              "{messages[msgIdx]}"
            </p>
        </div>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.6em]">
          DORDRECHT DALTON EXAMEN ENGINE
        </p>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;
