
import React from 'react';
import { QAAuditReport } from '../types';

interface QAAuditPanelProps {
  report: QAAuditReport;
  isLoading: boolean;
  onRefresh: () => void;
}

const QAAuditPanel: React.FC<QAAuditPanelProps> = ({ report, isLoading, onRefresh }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-stone-900 dalton-font uppercase tracking-tighter">QA Audit Rapportage</h2>
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="stone-element text-white px-6 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2"
        >
          {isLoading ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          SCAN VERNIEUWEN
        </button>
      </div>

      <div className={`p-8 rounded-2xl border-4 flex items-center gap-8 shadow-xl ${report.pass ? 'bg-emerald-50 border-emerald-500/30 text-emerald-900' : 'bg-red-50 border-red-500/30 text-red-900'}`}>
        <div className={`w-20 h-20 rounded-full flex items-center justify-center shrink-0 shadow-inner ${report.pass ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
          {report.pass ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
        </div>
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tight dalton-font">STATUS: {report.pass ? 'EXPEDITIE VEILIG' : 'GEVAAR GEDETECTEERD'}</h3>
          <p className="opacity-70 text-sm font-bold mt-2 leading-relaxed">
            {report.pass 
              ? 'De toets voldoet aan alle Cito kwaliteitsstandaarden en de RTTI verdeling is exact. Klaar voor gebruik.' 
              : 'Er zijn afwijkingen gevonden in de constructie die de validiteit van de toets in gevaar brengen.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-6">
          <h4 className="text-xs font-black text-stone-400 uppercase tracking-[0.4em] flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            AUDIT LOGBOEK ({report.issues.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {report.issues.map((issue, i) => (
              <div key={i} className={`p-6 rounded-2xl border-l-8 shadow-lg flex flex-col gap-4 bg-white ${
                issue.severity === 'high' ? 'border-red-600' :
                issue.severity === 'medium' ? 'border-amber-500' :
                'border-blue-500'
              }`}>
                <div className="flex justify-between items-start">
                  <span className={`px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest text-white ${
                    issue.severity === 'high' ? 'bg-red-600' :
                    issue.severity === 'medium' ? 'bg-amber-500' :
                    'bg-blue-500'
                  }`}>
                    {issue.severity}
                  </span>
                  <span className="text-stone-300 text-[8px] font-black uppercase tracking-widest">{issue.location}</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">Probleem</p>
                    <p className="text-sm font-bold text-stone-800 leading-relaxed">{issue.problem}</p>
                  </div>
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <p className="text-[9px] font-black text-green-600 uppercase tracking-widest mb-1">Fix Voorstel</p>
                    <p className="text-xs font-bold text-stone-600 italic leading-relaxed">{issue.suggested_fix}</p>
                  </div>
                </div>
              </div>
            ))}
            {report.issues.length === 0 && <div className="text-stone-400 font-bold italic text-sm p-12 border-4 border-dashed border-stone-200 rounded-3xl text-center bg-white/50">Geen afwijkingen in het logboek.</div>}
          </div>
        </div>

        <div className="space-y-6 pt-6 border-t-2 border-stone-100">
          <h4 className="text-xs font-black text-stone-400 uppercase tracking-[0.4em] flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            STRATEGISCHE VERBETERINGEN
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {report.suggested_fixes.map((fix, i) => (
              <div key={i} className="bg-stone-900 text-amber-50 p-5 rounded-2xl text-xs font-bold flex gap-4 shadow-xl border-l-4 border-green-500">
                <span className="text-green-500 font-black">#{i + 1}</span>
                <p className="leading-relaxed">{fix}</p>
              </div>
            ))}
            {report.suggested_fixes.length === 0 && <div className="text-stone-300 italic text-sm py-4">Geen aanvullende fixes aanbevolen.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QAAuditPanel;
