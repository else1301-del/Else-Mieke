
import React, { useState } from 'react';
import { ChangeItem, CoConstructorResponse } from '../types';

interface CoConstructorPanelProps {
  onSend: (instruction: string, context: string) => void;
  isLoading: boolean;
  lastChanges?: ChangeItem[];
  qualityDelta?: CoConstructorResponse['quality_delta'] | null;
}

const CoConstructorPanel: React.FC<CoConstructorPanelProps> = ({ onSend, isLoading, lastChanges, qualityDelta }) => {
  const [instruction, setInstruction] = useState('');
  const [context, setContext] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim()) return;
    onSend(instruction, context);
    setInstruction('');
  };

  return (
    <div className={`fixed bottom-10 right-10 z-50 transition-all duration-500 no-print ${isOpen ? 'w-[500px]' : 'w-24 h-24'}`}>
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-24 h-24 bg-black text-[#c4d600] rounded-none shadow-[10px_10px_0px_0px_rgba(0,0,0,0.5)] flex items-center justify-center hover:bg-[#0065bd] hover:text-white transition-all transform hover:scale-110 active:scale-90 border-4 border-black slanted-badge"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      ) : (
        <div className="bg-white rounded-none shadow-[20px_20px_0px_0px_rgba(0,0,0,0.8)] border-4 border-black flex flex-col h-[750px] overflow-hidden">
          <div className="bg-black p-8 text-white flex justify-between items-center border-b-8 border-[#c4d600]">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-[#c4d600] animate-pulse"></div>
              <h3 className="font-black text-sm uppercase tracking-[0.4em] italic dalton-font">CO-CONSTRUCTIE</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-[#c4d600] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-10 text-black">
            {lastChanges && lastChanges.length > 0 && (
              <div className="bg-slate-50 p-8 border-l-[12px] border-[#0065bd] space-y-6">
                <p className="text-[11px] font-black text-[#0065bd] uppercase tracking-[0.3em]">SYSTEEM LOGBOEK</p>
                {lastChanges.map((change, i) => (
                  <div key={i} className="text-sm text-slate-800 leading-relaxed font-bold border-b-2 border-slate-200 pb-4 last:border-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white ${
                        change.change_type === 'edit' ? 'bg-[#0065bd]' :
                        change.change_type === 'add' ? 'bg-[#c4d600] !text-black' :
                        'bg-red-600'
                      }`}>
                        {change.change_type}
                      </span>
                      <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{change.target} {change.id}</span>
                    </div>
                    <div className="text-black font-black italic">"{change.after}"</div>
                  </div>
                ))}
                {qualityDelta && (
                  <div className="pt-6 border-t-2 border-slate-200 space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#0065bd]">INTEGRITEIT CHECK</p>
                    <div className="flex gap-4">
                        <div className={`w-4 h-4 ${qualityDelta.rtti_ok ? 'bg-[#c4d600]' : 'bg-red-600'} border border-black`} title="RTTI OK"></div>
                        <div className={`w-4 h-4 ${qualityDelta.types_ok ? 'bg-[#c4d600]' : 'bg-red-600'} border border-black`} title="Types OK"></div>
                        <div className={`w-4 h-4 ${qualityDelta.clustering_ok ? 'bg-[#c4d600]' : 'bg-red-600'} border border-black`} title="Clustering OK"></div>
                    </div>
                    {qualityDelta.notes.map((note, i) => (
                       <div key={i} className="text-[10px] text-slate-500 font-black italic">• {note}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="bg-[#4aa8ff]/10 p-8 text-sm text-[#0065bd] leading-relaxed border-2 border-[#4aa8ff]/20 font-bold italic shadow-inner">
              "Optimaliseer de resultaten via directe instructies aan de engine."
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-black/40 uppercase tracking-widest border-l-4 border-black pl-3">INSTRUCIE (PROMPT)</label>
                <textarea 
                  value={instruction}
                  onChange={e => setInstruction(e.target.value)}
                  placeholder="Maak vraag 4 complexer..."
                  className="w-full h-40 border-4 border-slate-100 rounded-none p-6 text-base focus:border-[#0065bd] outline-none resize-none font-bold"
                ></textarea>
              </div>
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-black/40 uppercase tracking-widest border-l-4 border-[#c4d600] pl-3">NIEUWE CONTEXT</label>
                <textarea 
                  value={context}
                  onChange={e => setContext(e.target.value)}
                  placeholder="Nieuwe brontekst..."
                  className="w-full h-32 border-4 border-slate-100 rounded-none p-6 text-sm focus:border-[#c4d600] outline-none resize-none font-bold"
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={isLoading || !instruction.trim()}
                className="w-full bg-black text-[#c4d600] font-black py-6 hover:bg-[#0065bd] hover:text-white transition-all disabled:opacity-50 uppercase tracking-[0.4em] text-sm shadow-[10px_10px_0px_0px_rgba(0,0,0,0.1)] slanted-badge"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-[#c4d600]/20 border-t-[#c4d600] rounded-full animate-spin mx-auto"></div>
                ) : (
                  <>HERZICHT GENEREREN</>
                )}
              </button>
            </form>
          </div>
          
          <div className="p-6 bg-slate-50 border-t-4 border-black text-[10px] font-black text-slate-400 text-center uppercase tracking-[0.5em]">
            DALTON DORDRECHT AI 2024
          </div>
        </div>
      )}
    </div>
  );
};

export default CoConstructorPanel;
