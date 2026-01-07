
import React from 'react';
import { GeneratorParams, QuestionType, LevelProfile, RTTIMode, Brondichtheid, Moeilijkheid, RTTITarget } from '../types';

interface TestConfigurationProps {
  params: GeneratorParams;
  setParams: React.Dispatch<React.SetStateAction<GeneratorParams>>;
}

const TestConfiguration: React.FC<TestConfigurationProps> = ({ params, setParams }) => {
  
  const updateRTTIWeight = (field: keyof RTTITarget, val: number) => {
    setParams(prev => ({
      ...prev,
      rttiWeights: { ...prev.rttiWeights, [field]: Math.max(0, val) }
    }));
  };

  const toggleType = (type: QuestionType) => {
    setParams(prev => ({
      ...prev,
      vraagTypes: prev.vraagTypes.includes(type)
        ? prev.vraagTypes.filter(t => t !== type)
        : [...prev.vraagTypes, type]
    }));
  };

  const niveauOptions = [
    { value: LevelProfile.MH_1, label: '1 mavo havo' },
    { value: LevelProfile.MH_2, label: '2 mavo havo' },
    { value: LevelProfile.HV_1, label: '1 havo vwo' },
    { value: LevelProfile.HV_2, label: '2 havo vwo' },
    { value: LevelProfile.M_3, label: '3 mavo' },
    { value: LevelProfile.M_4, label: '4 mavo' },
    { value: LevelProfile.H_3, label: '3 havo' },
    { value: LevelProfile.H_4, label: '4 havo' },
    { value: LevelProfile.H_5, label: '5 havo' }
  ];

  const handleProfileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const profile = e.target.value as LevelProfile;
    const label = niveauOptions.find(o => o.value === profile)?.label || '';
    
    setParams(prev => ({
      ...prev,
      niveauProfiel: profile,
      jaarlaag: label // Automatically derive human-readable level/year from profile label
    }));
  };

  return (
    <div className="space-y-6 no-print">
      {/* 1. Identiteit */}
      <section className="config-panel p-8 rounded-none border-white/20">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-4 text-white">
          <span className="w-10 h-10 bg-[#c4d600] text-black flex items-center justify-center font-black rounded-none slanted-badge">01</span>
          EXAMEN IDENTITEIT
        </h3>
        
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-[9px] font-black text-[#4aa8ff] uppercase mb-2">NIVEAUPROFIEL</label>
            <select 
              value={params.niveauProfiel}
              onChange={handleProfileChange}
              className="w-full bg-white/10 border-2 border-white/20 p-4 font-black text-xs text-white uppercase outline-none focus:border-[#c4d600] rounded-none cursor-pointer"
            >
              {niveauOptions.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-[#004a8b]">{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 2. Omvang */}
      <section className="config-panel p-8 rounded-none border-white/20">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-4 text-white">
          <span className="w-10 h-10 bg-white text-[#0065bd] flex items-center justify-center font-black rounded-none slanted-badge">02</span>
          TOETS OMVANG
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-[9px] font-black text-[#4aa8ff] uppercase mb-2">AANTAL OPGAVEN</label>
            <div className="flex bg-white/5 rounded-none border-2 border-white/20">
              <button onClick={() => setParams(p => ({...p, aantalVragen: Math.max(1, p.aantalVragen - 1)}))} className="px-6 py-4 bg-white/10 text-white font-black hover:bg-[#c4d600] hover:text-black transition-colors">-</button>
              <input type="number" value={params.aantalVragen} readOnly className="w-full text-center bg-transparent font-black text-sm text-white outline-none" />
              <button onClick={() => setParams(p => ({...p, aantalVragen: Math.min(40, p.aantalVragen + 1)}))} className="px-6 py-4 bg-white/10 text-white font-black hover:bg-[#c4d600] hover:text-black transition-colors">+</button>
            </div>
          </div>
          <div>
            <label className="block text-[9px] font-black text-[#4aa8ff] uppercase mb-2">TIJD: {params.toetstijd} MIN</label>
            <input 
              type="range" min="10" max="100" step="5"
              value={params.toetstijd}
              onChange={e => setParams(p => ({...p, toetstijd: parseInt(e.target.value)}))}
              className="w-full mt-6 accent-[#c4d600] bg-white/20 h-1 appearance-none cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* 3. RTTI Profiel */}
      <section className="config-panel p-8 rounded-none border-white/20">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-4 text-white">
            <span className="w-10 h-10 bg-[#4aa8ff] text-white flex items-center justify-center font-black rounded-none slanted-badge">03</span>
            RTTI
          </h3>
          <div className="flex bg-white/10 p-1 rounded-none border border-white/20">
            <button 
              onClick={() => setParams(p => ({...p, rttiMode: RTTIMode.PERCENTAGES}))}
              className={`px-6 py-2 text-[9px] font-black uppercase transition-all ${params.rttiMode === RTTIMode.PERCENTAGES ? 'bg-[#c4d600] text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
            >%</button>
            <button 
              onClick={() => setParams(p => ({...p, rttiMode: RTTIMode.COUNTS}))}
              className={`px-6 py-2 text-[9px] font-black uppercase transition-all ${params.rttiMode === RTTIMode.COUNTS ? 'bg-[#c4d600] text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
            >#</button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {(['r', 't1', 't2', 'i'] as const).map(level => (
            <div key={level}>
              <span className="block text-center text-[10px] font-black uppercase text-[#c4d600] mb-3">{level}</span>
              <div className="flex flex-col bg-white/5 border-2 border-white/10 overflow-hidden">
                <button onClick={() => updateRTTIWeight(level, params.rttiWeights[level] + 1)} className="py-2 bg-white/10 hover:bg-[#c4d600] hover:text-black transition-colors text-[9px] text-white">▲</button>
                <input type="number" value={params.rttiWeights[level]} readOnly className="w-full py-3 text-center bg-transparent text-white font-black text-sm outline-none" />
                <button onClick={() => updateRTTIWeight(level, params.rttiWeights[level] - 1)} className="py-2 bg-white/10 hover:bg-[#c4d600] hover:text-black transition-colors text-[9px] text-white">▼</button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex items-center gap-4 group cursor-pointer" onClick={() => setParams(p => ({...p, lockRtti: !p.lockRtti}))}>
          <div className={`w-6 h-6 rounded-none border-2 transition-all flex items-center justify-center ${params.lockRtti ? 'bg-[#c4d600] border-[#c4d600]' : 'border-white/30 bg-white/5'}`}>
            {params.lockRtti && <svg viewBox="0 0 24 24" className="w-4 h-4 text-black fill-current"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>}
          </div>
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">LOCK RTTI INTEGRITEIT</span>
        </div>
      </section>

      {/* 4. Vraagtypes */}
      <section className="config-panel p-8 rounded-none border-white/20">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-4 text-white">
          <span className="w-10 h-10 bg-[#c4d600] text-black flex items-center justify-center font-black rounded-none slanted-badge">04</span>
          VRAAGTYPES
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.values(QuestionType).map(type => (
            <div 
              key={type} 
              onClick={() => toggleType(type)}
              className={`p-4 cursor-pointer transition-all border-2 text-center flex items-center justify-center ${
                params.vraagTypes.includes(type) 
                ? 'bg-[#c4d600] border-[#c4d600] text-black scale-105 shadow-xl' 
                : 'bg-white/5 border-white/10 text-white/40 hover:border-white/40 hover:text-white'
              }`}
            >
              <span className="text-[9px] font-black uppercase tracking-widest leading-tight">{type.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Didactiek */}
      <section className="config-panel p-8 rounded-none border-white/20">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-4 text-white">
          <span className="w-10 h-10 bg-white text-[#0065bd] flex items-center justify-center font-black rounded-none slanted-badge">05</span>
          EIGENSCHAPPEN
        </h3>
        <div className="grid grid-cols-1 gap-10">
          <div>
            <label className="block text-[9px] font-black text-[#4aa8ff] uppercase mb-4 tracking-widest">LEESNIVEAU</label>
            <div className="flex bg-white/5 p-1 border-2 border-white/20">
              <button onClick={() => setParams(p => ({...p, leesniveau: '2F'}))} className={`flex-1 py-4 text-xs font-black uppercase transition-all ${params.leesniveau === '2F' ? 'bg-white text-[#0065bd]' : 'text-white/40'}`}>2F</button>
              <button onClick={() => setParams(p => ({...p, leesniveau: '3F'}))} className={`flex-1 py-4 text-xs font-black uppercase transition-all ${params.leesniveau === '3F' ? 'bg-white text-[#0065bd]' : 'text-white/40'}`}>3F</button>
            </div>
          </div>
          <div>
            <label className="block text-[9px] font-black text-[#4aa8ff] uppercase mb-4 tracking-widest">BRONDICHTHEID</label>
            <div className="flex bg-white/5 p-1 border-2 border-white/20">
              {Object.values(Brondichtheid).map(v => (
                <button key={v} onClick={() => setParams(p => ({...p, brondichtheid: v}))} className={`flex-1 py-4 text-[9px] font-black uppercase transition-all ${params.brondichtheid === v ? 'bg-[#c4d600] text-black' : 'text-white/40'}`}>{v}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[9px] font-black text-[#4aa8ff] uppercase mb-4 tracking-widest">MOEILIJKHEID</label>
            <div className="flex bg-white/5 p-1 border-2 border-white/20">
              {Object.values(Moeilijkheid).map(v => (
                <button key={v} onClick={() => setParams(p => ({...p, moeilijkheidsverdeling: v}))} className={`flex-1 py-4 text-[9px] font-black uppercase transition-all ${params.moeilijkheidsverdeling === v ? 'bg-[#4aa8ff] text-white' : 'text-white/40'}`}>{v}</button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TestConfiguration;
