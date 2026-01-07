
import React, { useState, useEffect } from 'react';
import { GeneratedTest, QuestionType, QAAuditReport, RTTITarget } from '../types';
import { auditTest } from '../services/qaAuditService';
import QAAuditPanel from './QAAuditPanel';

interface TestPreviewProps {
  test: GeneratedTest;
  targetRTTI: RTTITarget;
}

const renderMarkdown = (text: string) => {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

const TestPreview: React.FC<TestPreviewProps> = ({ test, targetRTTI }) => {
  const [activeTab, setActiveTab] = useState<'student' | 'teacher' | 'quality' | 'audit'>('student');
  const [auditReport, setAuditReport] = useState<QAAuditReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleAudit = async () => {
    setIsAuditing(true);
    try {
      const report = await auditTest(test, targetRTTI);
      setAuditReport(report);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditing(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'audit' && !auditReport && !isAuditing) {
      handleAudit();
    }
  }, [activeTab]);

  return (
    <div className="brutalist-card overflow-hidden rounded-none">
      {/* Dalton Tab Bar */}
      <div className="bg-[#004a8b] p-2 flex gap-1 no-print overflow-x-auto">
        {['student', 'teacher', 'quality', 'audit'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-8 py-5 font-black uppercase text-[10px] tracking-[0.3em] transition-all whitespace-nowrap ${
              activeTab === tab 
              ? 'bg-white text-black shadow-lg translate-y-[-2px]' 
              : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab === 'student' ? 'LEERLING' : tab === 'teacher' ? 'DOCENT' : tab === 'quality' ? 'KWALITEIT' : 'AUDIT'}
          </button>
        ))}
      </div>

      <div className="bg-white p-12 md:p-24 min-h-[1400px] text-black">
        {activeTab === 'student' && (
          <div className="space-y-24">
            {/* Header */}
            <div className="border-b-8 border-black pb-16 flex flex-col md:flex-row justify-between items-end gap-12">
              <div className="flex-1 space-y-8">
                <div className="flex items-center gap-6">
                    <div className="bg-[#c4d600] text-black px-8 py-2 font-black text-xs uppercase tracking-[0.4em] slanted-badge">OFFICIËLE TOETS</div>
                    <div className="h-2 w-32 bg-black"></div>
                </div>
                <h2 className="text-7xl font-black uppercase tracking-tighter leading-none dalton-font italic">{test.meta.titel}</h2>
                <div className="flex flex-wrap gap-12 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                    <div className="flex flex-col gap-1"><span className="text-black/20">LEVEL</span> {test.meta.niveau}</div>
                    <div className="flex flex-col gap-1"><span className="text-black/20">TIJD</span> {test.meta.tijd} MINUTEN</div>
                    <div className="flex flex-col gap-1"><span className="text-black/20">SCORE</span> {test.meta.totalPoints} PUNTEN</div>
                </div>
              </div>
              <div className="hidden lg:block">
                 <div className="bg-black text-white p-10 slanted-badge">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-50 text-center">CONSTRUCTEUR</div>
                    <div className="text-xl font-black uppercase tracking-widest dalton-font text-center">DALTON<br/>ENGINE</div>
                 </div>
              </div>
            </div>

            {/* Sources */}
            <div className="space-y-16">
              <h3 className="text-4xl font-black uppercase tracking-tighter dalton-font border-l-[12px] border-[#0065bd] pl-8 py-1">BRONNENMATERIAAL</h3>
              {test.sources.map((source) => (
                <div key={source.id} className="border-4 border-black p-12 relative bg-slate-50 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)]">
                  <div className="absolute -top-6 left-12 bg-black text-white px-8 py-3 text-[11px] font-black uppercase tracking-[0.4em]">
                    BRON {source.id} | {source.title}
                  </div>
                  <div 
                    className="mt-8 prose prose-xl prose-slate max-w-none text-black leading-relaxed whitespace-pre-wrap font-medium space-font"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(source.content) }}
                  />
                  <div className="mt-12 pt-8 border-t-2 border-slate-200 flex justify-between items-center opacity-40">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em]">{source.type} ARCHIEF</span>
                    <div className="flex gap-2">
                        {[...Array(5)].map((_, i) => <div key={i} className="w-2 h-2 bg-black"></div>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Questions */}
            <div className="space-y-32">
              <h3 className="text-4xl font-black uppercase tracking-tighter dalton-font border-l-[12px] border-[#c4d600] pl-8 py-1">OPGAVEN</h3>
              {test.student_view.map((q, idx) => (
                <div key={q.id} className="relative group">
                  <div className="flex justify-between items-start gap-8 mb-10">
                    <div className="font-black flex gap-8 items-center">
                      <div className="w-24 h-24 bg-black text-white flex items-center justify-center text-5xl dalton-font italic slanted-badge shadow-xl">
                        {idx + 1}
                      </div>
                      <div className="space-y-2">
                        <div className="text-black text-[12px] font-black tracking-[0.5em] uppercase">OPGAVE {idx + 1}</div>
                        <div className="text-slate-400 text-[10px] font-black tracking-[0.4em] uppercase">WAARDE: {q.punten} PUNTEN</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 no-print opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="bg-[#4aa8ff] text-white px-6 py-2 text-[9px] font-black uppercase tracking-widest">{q.dimensie}</span>
                       <span className="bg-black text-[#c4d600] px-6 py-2 text-[9px] font-black uppercase tracking-widest">LEVEL: {q.rtti}</span>
                    </div>
                  </div>
                  
                  <div 
                    className="text-3xl leading-tight text-black font-bold dalton-font pl-32 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(q.vraag_tekst) }}
                  />

                  {q.type === QuestionType.MEERKEUZE && q.opties && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 ml-32">
                      {q.opties.map((opt, oIdx) => (
                        <div key={oIdx} className="flex gap-8 items-center p-8 border-2 border-black hover:bg-[#c4d600]/10 transition-all cursor-pointer group/opt">
                          <span className="w-16 h-16 bg-black text-white flex items-center justify-center text-xl font-black group-hover/opt:bg-[#c4d600] group-hover/opt:text-black transition-colors">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span 
                            className="font-bold text-black text-xl leading-tight"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(opt) }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === QuestionType.OPEN && (
                    <div className="border-4 border-slate-100 h-48 w-full mt-16 ml-32 relative bg-slate-50/50">
                        <div className="absolute top-6 left-6 text-[10px] font-black uppercase text-slate-300 tracking-[0.6em]">UITWERKINGSRUIMTE</div>
                    </div>
                  )}
                  
                  <div className="mt-16 ml-32 flex items-center gap-10 opacity-20">
                     <div className="text-[10px] font-black uppercase tracking-[0.5em] shrink-0">CONCEPT: {q.kernconcept}</div>
                     <div className="h-px flex-1 bg-black"></div>
                     <div className="text-[10px] font-black uppercase tracking-[0.5em] shrink-0">DATA: BRON {q.bron_id.join(', ')}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center pt-32 border-t-8 border-black">
                <div className="inline-block bg-black text-[#c4d600] px-24 py-10 font-black uppercase tracking-[1.5em] text-lg shadow-2xl slanted-badge">
                    EINDE EXAMEN
                </div>
            </div>
          </div>
        )}

        {/* Teacher View */}
        {activeTab === 'teacher' && (
          <div className="space-y-24">
            <h2 className="text-6xl font-black uppercase tracking-tighter text-black dalton-font italic border-b-8 border-black pb-8">DOCENTENHANDLEIDING</h2>
            {test.teacher_view.map((item, idx) => (
              <div key={item.vraag_id} className="border-4 border-black mb-16 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <div className="bg-black text-white px-12 py-8 flex justify-between items-center">
                  <div className="flex items-center gap-6">
                    <span className="w-12 h-12 bg-[#c4d600] text-black flex items-center justify-center font-black text-xl italic slanted-badge">{idx + 1}</span>
                    <span className="font-black uppercase tracking-[0.5em] text-xs">LOGBOEK OPGAVE {idx + 1}</span>
                  </div>
                  <span className="text-[#c4d600] font-black text-lg">{item.punten} PUNTEN</span>
                </div>
                <div className="p-16 space-y-16">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="space-y-8">
                      <h4 className="text-[11px] font-black uppercase text-[#0065bd] tracking-[0.4em] flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#0065bd]"></div> MODELANTWOORD
                      </h4>
                      <div 
                        className="p-10 bg-slate-50 border-2 border-slate-100 text-black font-bold text-lg leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(item.antwoord_model) }}
                      />
                    </div>
                    <div className="space-y-8">
                      <h4 className="text-[11px] font-black uppercase text-red-600 tracking-[0.4em] flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-600"></div> VEELGEMAAKTE FOUTEN
                      </h4>
                      <div className="p-10 bg-red-50 border-2 border-red-100 text-red-900 font-bold italic leading-relaxed">
                        {item.veelgemaakte_fouten.join(', ')}
                      </div>
                    </div>
                  </div>
                  <div className="pt-10 border-t-2 border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-8">
                     <div className="space-y-2">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">RTTI</div>
                        <div className="text-sm font-black text-black">{item.rtti} ({item.motivatie})</div>
                     </div>
                     <div className="space-y-2">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">DOMEIN</div>
                        <div className="text-sm font-black text-black">{item.syllabus_domein}</div>
                     </div>
                     <div className="space-y-2">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SCHAAL</div>
                        <div className="text-sm font-black text-black">{item.geografische_schaal}</div>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quality View */}
        {activeTab === 'quality' && (
          <div className="space-y-20">
            <h2 className="text-6xl font-black uppercase tracking-tighter text-black dalton-font italic border-b-8 border-black pb-8">KWALITEITSSCAN</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               {[
                 { label: 'RTTI DEKKING', text: test.quality_report.rtti_dekking, color: '#0065bd' },
                 { label: 'BRONGEBRUIK', text: test.quality_report.bron_gebruik, color: '#c4d600' },
                 { label: 'TAALNIVEAU', text: test.quality_report.taal_check, color: '#4aa8ff' },
                 { label: 'GOOGLE PROOF', text: test.quality_report.google_proof_check, color: '#000000' }
               ].map((item, i) => (
                 <div key={i} className="border-4 border-black p-12 bg-white hover:bg-slate-50 transition-colors shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-16 h-16 bg-black text-white flex items-center justify-center font-black text-2xl slanted-badge" style={{ backgroundColor: item.color, color: item.color === '#c4d600' ? 'black' : 'white' }}>
                        0{i+1}
                      </div>
                      <h4 className="font-black text-black uppercase text-sm tracking-[0.4em]">{item.label}</h4>
                    </div>
                    <p className="text-lg text-slate-700 font-bold leading-relaxed space-font italic">
                      {item.text}
                    </p>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* Audit View */}
        {activeTab === 'audit' && (
          <div className="min-h-[700px]">
             {isAuditing ? (
              <div className="flex flex-col items-center justify-center py-48 space-y-12">
                <div className="w-32 h-32 border-[16px] border-slate-100 border-t-[#0065bd] animate-spin rounded-none"></div>
                <p className="text-black text-3xl font-black uppercase tracking-[0.5em] dalton-font italic">AUDIT ENGINE ACTIEF...</p>
              </div>
            ) : auditReport ? (
              <QAAuditPanel report={auditReport} isLoading={isAuditing} onRefresh={handleAudit} />
            ) : (
              <div className="flex flex-col items-center justify-center py-64 border-8 border-dashed border-slate-100 bg-slate-50/30">
                <button 
                  onClick={handleAudit}
                  className="bg-black text-white px-20 py-10 font-black uppercase tracking-[0.5em] shadow-[15px_15px_0px_0px_#c4d600] hover:scale-105 active:scale-95 transition-all text-2xl slanted-badge"
                >
                  START VOLLEDIGE AUDIT
                </button>
                <div className="mt-16 flex items-center gap-6 opacity-20">
                    <div className="h-1 w-24 bg-black"></div>
                    <p className="text-black text-[10px] font-black uppercase tracking-[0.5em]">CITO VALIDATIE ENGINE 4.0</p>
                    <div className="h-1 w-24 bg-black"></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPreview;
