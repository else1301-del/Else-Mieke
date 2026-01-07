
import React from 'react';
import { ValidationReport } from '../types';

interface PreflightReportProps {
  report: ValidationReport;
  onDismiss: () => void;
}

const PreflightReport: React.FC<PreflightReportProps> = ({ report, onDismiss }) => {
  return (
    <div className="bg-white border-4 border-black rounded-none shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] overflow-hidden mb-16 animate-in fade-in slide-in-from-top-10 duration-700">
      <div className={`px-10 py-8 flex justify-between items-center ${report.feasibility === 'ok' ? 'bg-[#c4d600] text-black' : 'bg-red-600 text-white'} border-b-4 border-black`}>
        <div className="flex items-center gap-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h3 className="font-black text-3xl uppercase tracking-tighter dalton-font italic">KWALITEITSSCAN RESULTAAT</h3>
        </div>
        <div className="flex items-center gap-8">
          <div className="bg-black text-white px-6 py-2 -skew-x-12 font-black text-xs uppercase tracking-widest">
            STATUS: {report.feasibility === 'ok' ? 'GEVRIJWAARD' : 'BLOKKADE'}
          </div>
          <button onClick={onDismiss} className="hover:rotate-90 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-8 text-black">
          <div className="flex items-center gap-4 text-red-600 font-black text-sm uppercase tracking-[0.4em] border-b-4 border-slate-100 pb-4">
            <div className="w-3 h-3 bg-red-600"></div>
            KRITIEKE WAARSCHUWINGEN
          </div>
          <ul className="space-y-6">
            {report.warnings.map((w, i) => (
              <li key={i} className="text-base text-black bg-red-50 p-8 border-l-[12px] border-red-600 font-bold italic leading-relaxed shadow-sm">
                "{w}"
              </li>
            ))}
            {report.warnings.length === 0 && <li className="text-sm text-slate-400 italic font-black uppercase tracking-widest text-center py-10 border-4 border-dashed border-slate-100">Systeem foutloos gedetecteerd.</li>}
          </ul>
        </div>

        <div className="space-y-8 text-black">
          <div className="flex items-center gap-4 text-[#0065bd] font-black text-sm uppercase tracking-[0.4em] border-b-4 border-slate-100 pb-4">
             <div className="w-3 h-3 bg-[#0065bd]"></div>
             STRATEGISCHE VERBETERACTIES
          </div>
          <ul className="space-y-6">
            {report.quick_fixes.map((f, i) => (
              <li key={i} className="text-base text-black bg-[#0065bd]/5 p-8 border-l-[12px] border-[#0065bd] font-bold leading-relaxed shadow-sm">
                <span className="text-[#0065bd] font-black mr-2">→</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="px-12 pb-12 space-y-10 border-t-4 border-slate-100 pt-12 text-black">
        <div className="flex items-center gap-4 text-[#4aa8ff] font-black text-sm uppercase tracking-[0.4em]">
          <div className="w-3 h-3 bg-[#4aa8ff]"></div>
          ONTBREKENDE PARAMETERS
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {report.missing_information.map((info, i) => (
            <div key={i} className="bg-slate-50 p-8 border-2 border-slate-100 font-bold text-sm leading-relaxed italic text-slate-600 shadow-sm">
              {info}
            </div>
          ))}
          {report.missing_information.length === 0 && <div className="col-span-3 text-center text-slate-300 text-[10px] font-black uppercase py-8 border-4 border-dashed border-slate-50">Geen ontbrekende data.</div>}
        </div>
      </div>

      <div className="bg-slate-100 p-8 border-t-4 border-black flex justify-between items-center">
        <div className="flex gap-4">
           <div className="w-4 h-4 bg-[#c4d600]"></div>
           <div className="w-4 h-4 bg-[#0065bd]"></div>
           <div className="w-4 h-4 bg-[#4aa8ff]"></div>
        </div>
        <button 
          onClick={onDismiss}
          className="bg-black text-white px-12 py-5 font-black uppercase tracking-[0.5em] text-xs hover:bg-[#0065bd] transition-all slanted-badge"
        >
          DOORGAAN NAAR CONSTRUCTIE
        </button>
      </div>
    </div>
  );
};

export default PreflightReport;
