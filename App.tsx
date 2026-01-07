
import React, { useState, useEffect, useMemo } from 'react';
import { GeneratorParams, QuestionType, GeneratedTest, LevelProfile, RTTIMode, Brondichtheid, Moeilijkheid, ValidationReport, ChangeItem, ExtractorOutput, CoConstructorResponse } from './types';
import { generateTest } from './services/geminiService';
import { validateInput } from './services/validatorService';
import { coConstructUpdate } from './services/coConstructorService';
import { normalizeInput } from './services/normalizerService';
import { calculateRTTICounts } from './utils/rttiCalculator';
import TestPreview from './components/TestPreview';
import LoadingOverlay from './components/LoadingOverlay';
import PreflightReport from './components/PreflightReport';
import CoConstructorPanel from './components/CoConstructorPanel';
import InputExtractor from './components/InputExtractor';
import TestConfiguration from './components/TestConfiguration';

const App: React.FC = () => {
  const [params, setParams] = useState<GeneratorParams>({
    jaarlaag: '1 mavo havo', 
    niveauProfiel: LevelProfile.MH_1,
    vraagTypes: [QuestionType.OPEN, QuestionType.MEERKEUZE, QuestionType.BRONANALYSE],
    rttiTarget: { r: 0, t1: 0, t2: 0, i: 0 },
    rttiWeights: { r: 25, t1: 25, t2: 25, i: 25 },
    rttiMode: RTTIMode.PERCENTAGES,
    aantalVragen: 8,
    brondichtheid: Brondichtheid.MIDDEL,
    leerdoelen: '',
    begrippen: '',
    bronnen: '',
    leesniveau: '3F',
    moeilijkheidsverdeling: Moeilijkheid.GEBANCEERD,
    toetstijd: 50,
    lockRtti: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isCoConstructing, setIsCoConstructing] = useState(false);
  const [isNormalizing, setIsNormalizing] = useState(false);
  const [test, setTest] = useState<GeneratedTest | null>(null);
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [lastChanges, setLastChanges] = useState<ChangeItem[]>([]);
  const [qualityDelta, setQualityDelta] = useState<CoConstructorResponse['quality_delta'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dyslexiaMode, setDyslexiaMode] = useState(false);

  const rttiCounts = useMemo(() => {
    return calculateRTTICounts(params.aantalVragen, params.rttiWeights);
  }, [params.aantalVragen, params.rttiWeights]);

  useEffect(() => {
    setParams(p => ({ ...p, rttiTarget: rttiCounts }));
  }, [rttiCounts]);

  useEffect(() => {
    if (dyslexiaMode) {
      document.body.classList.add('dyslexia-mode');
    } else {
      document.body.classList.remove('dyslexia-mode');
    }
  }, [dyslexiaMode]);

  const handleValidate = async () => {
    if (!params.bronnen.trim()) {
      setError("Voeg a.u.b. brontekst toe of upload bestanden voor de scan.");
      return;
    }
    setError(null);
    setIsValidating(true);
    try {
      const report = await validateInput(params);
      setValidationReport(report);
    } catch (err: any) {
      console.error(err);
      setError("Validatie mislukt.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleGenerate = async () => {
    if (!params.bronnen.trim()) {
      setError("Voeg a.u.b. brontekst toe of upload bestanden.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setValidationReport(null);
    try {
      const result = await generateTest(params);
      setTest(result);
    } catch (err: any) {
      console.error(err);
      setError("Fout bij genereren.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoConstruct = async (instruction: string, context: string) => {
    if (!test) return;
    setIsCoConstructing(true);
    setError(null);
    try {
      const result = await coConstructUpdate(test, instruction, context);
      setTest(result.updated_test);
      setLastChanges(result.changes);
      setQualityDelta(result.quality_delta);
    } catch (err: any) {
      console.error(err);
      setError("Co Constructie mislukt.");
    } finally {
      setIsCoConstructing(false);
    }
  };

  const handleExtracted = async (data: ExtractorOutput) => {
    setIsNormalizing(true);
    setError(null);
    try {
      const normalized = await normalizeInput(data);
      const leerdoelenText = normalized.normalized_leerdoelen.join('\n');
      const begrippenText = normalized.normalized_begrippen.map(b => `${b.term}: ${b.definitie}`).join('\n');
      const bronnenText = normalized.normalized_bronnen.map(b => `BRON ${b.bron_id}: ${b.titel}\n${b.bron_tekst}`).join('\n\n');

      setParams(prev => ({
        ...prev,
        leerdoelen: (prev.leerdoelen ? prev.leerdoelen + '\n' : '') + leerdoelenText,
        begrippen: (prev.begrippen ? prev.begrippen + '\n' : '') + begrippenText,
        bronnen: (prev.bronnen ? prev.bronnen + '\n\n' : '') + bronnenText + (normalized.normalized_leertekst ? `\n\nLEERTEKST:\n${normalized.normalized_leertekst}` : '')
      }));
    } catch (err: any) {
      console.error(err);
      setError("Extractie verwerking mislukt.");
    } finally {
      setIsNormalizing(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-[#c4d600] selection:text-black">
      <header className="py-12 px-8 no-print border-b-2 border-white/20">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-10">
            <div className="text-center md:text-left">
              <h1 className="text-7xl font-black tracking-tight uppercase dalton-font leading-none italic">DALTON</h1>
              <h1 className="text-4xl font-black uppercase tracking-[0.2em] mt-2 dalton-font text-[#c4d600]">DORDRECHT</h1>
              <div className="mt-4 inline-flex">
                <div className="bg-black text-white -skew-x-12 px-6 py-1 font-black text-sm uppercase tracking-widest">
                  {params.jaarlaag.toUpperCase()}
                </div>
              </div>
            </div>
            <div className="hidden lg:block w-px h-32 bg-white/20"></div>
            <div className="hidden lg:block">
               <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#4aa8ff] mb-2">INTELLIGENTE CONSTRUCTIE</div>
               <div className="text-2xl font-black uppercase dalton-font">EXAMEN ENGINE 2.0</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setDyslexiaMode(!dyslexiaMode)} 
              className="bg-white text-[#0065bd] px-8 py-3 font-black uppercase text-xs border-2 border-transparent hover:border-white hover:bg-transparent hover:text-white transition-all rounded-none"
            >
               DYSLEXIE: {dyslexiaMode ? 'AAN' : 'UIT'}
            </button>
            <button 
              onClick={() => window.print()} 
              disabled={!test} 
              className="bg-[#c4d600] hover:bg-[#a8b800] text-black px-10 py-3 font-black uppercase text-xs shadow-lg disabled:opacity-50 transition-all rounded-none active:scale-95"
            >
              PDF EXPORT
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
        <div className="lg:col-span-4 space-y-10 no-print">
          <TestConfiguration params={params} setParams={setParams} />
          
          <div className="space-y-4 pt-4">
            <button 
              onClick={handleValidate} 
              disabled={isLoading || isValidating || isNormalizing} 
              className="w-full bg-[#004a8b] text-white border-2 border-[#4aa8ff] font-black py-5 uppercase tracking-[0.2em] text-xs hover:bg-[#0065bd] transition-all active:scale-95 rounded-none"
            >
              KWALITEITSSCAN
            </button>
            <button 
              onClick={handleGenerate} 
              disabled={isLoading || isValidating || isNormalizing} 
              className="w-full bg-[#c4d600] text-black font-black py-8 uppercase tracking-[0.4em] text-sm shadow-[10px_10px_0px_0px_rgba(0,0,0,0.3)] hover:scale-105 transition-all active:scale-95 rounded-none"
            >
              {isLoading ? 'BEZIG...' : 'TOETS GENEREREN'}
            </button>
          </div>

          {error && <div className="bg-red-600 text-white p-6 font-black uppercase text-xs border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">{error}</div>}
        </div>

        <div className="lg:col-span-8 space-y-10">
          {validationReport && <PreflightReport report={validationReport} onDismiss={() => setValidationReport(null)} />}
          
          {!test && !isLoading && (
            <div className="space-y-10">
              {/* Image Input Section */}
              <InputExtractor onExtracted={handleExtracted} isCompact={true} />
              
              {isNormalizing && (
                <div className="brutalist-card p-12 text-center bg-[#c4d600] text-black border-4 border-black">
                  <div className="flex items-center justify-center gap-6 animate-pulse">
                    <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-black uppercase tracking-[0.4em] text-xl">GEGEVENS NORMALISEREN...</span>
                  </div>
                </div>
              )}

              {/* Text Input Section */}
              <div className="brutalist-card p-12 space-y-12 rounded-none text-black bg-white">
                <div className="flex items-center justify-between border-b-4 border-black pb-4 mb-8">
                  <h3 className="text-2xl font-black uppercase tracking-widest dalton-font italic">TEKSTUELE INPUT</h3>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-[#c4d600]"></div>
                    <div className="w-3 h-3 bg-[#0065bd]"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-black/40 uppercase tracking-widest border-l-4 border-[#0065bd] pl-4">Bronnen & Context (Tekst)</label>
                  <textarea 
                    value={params.bronnen}
                    onChange={e => setParams(p => ({...p, bronnen: e.target.value}))}
                    placeholder="Plak hier teksten of artikelen... AI-scans worden hier automatisch toegevoegd."
                    className="w-full h-80 bg-slate-50 border-2 border-slate-200 rounded-none p-8 focus:border-[#0065bd] outline-none text-black placeholder:text-slate-300 font-medium"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-black/40 uppercase tracking-widest border-l-4 border-[#c4d600] pl-4">Vaktaal / Begrippen</label>
                    <textarea 
                      value={params.begrippen} 
                      onChange={e => setParams(p => ({...p, begrippen: e.target.value}))} 
                      className="w-full h-40 bg-slate-50 border-2 border-slate-200 rounded-none p-4 focus:border-[#c4d600] outline-none text-black placeholder:text-slate-300 font-medium"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-black/40 uppercase tracking-widest border-l-4 border-[#4aa8ff] pl-4">Leerdoelen</label>
                    <textarea 
                      value={params.leerdoelen} 
                      onChange={e => setParams(p => ({...p, leerdoelen: e.target.value}))} 
                      className="w-full h-40 bg-slate-50 border-2 border-slate-200 rounded-none p-4 focus:border-[#4aa8ff] outline-none text-black placeholder:text-slate-300 font-medium"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isLoading && <LoadingOverlay />}
          
          {test && (
            <div className="animate-in fade-in slide-in-from-bottom-10 duration-500">
              <TestPreview test={test} targetRTTI={params.rttiTarget} />
              <CoConstructorPanel onSend={handleCoConstruct} isLoading={isCoConstructing} lastChanges={lastChanges} qualityDelta={qualityDelta} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
