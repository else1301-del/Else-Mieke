
import React, { useState, useRef } from 'react';
import { extractContentFromImages } from '../services/extractorService';
import { ExtractorOutput } from '../types';

interface InputExtractorProps {
  onExtracted: (data: ExtractorOutput) => void;
  isCompact?: boolean;
}

const InputExtractor: React.FC<InputExtractorProps> = ({ onExtracted, isCompact }) => {
  const [images, setImages] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const startExtraction = async () => {
    if (images.length === 0) return;
    setIsExtracting(true);
    try {
      const result = await extractContentFromImages(images);
      onExtracted(result);
      setImages([]);
    } catch (err) {
      console.error(err);
      alert("Fout bij extractie. Probeer scherpere foto's.");
    } finally {
      setIsExtracting(false);
    }
  };

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className={`bg-white p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-8 animate-in fade-in duration-500 rounded-none`}>
      <div className="flex justify-between items-center border-b-4 border-black pb-4">
        <h3 className="text-xl font-black uppercase tracking-[0.2em] dalton-font flex items-center gap-3 text-black">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#0065bd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          BESTANDEN SCANNEN (OCR)
        </h3>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-[#0065bd] text-white px-6 py-3 text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 slanted-badge"
        >
          SELECTEER BEELDEN
        </button>
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange}
        />
      </div>

      {images.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square bg-slate-100 border-4 border-black overflow-hidden group shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-red-600 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity border-2 border-black"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-4">
             <button 
                onClick={startExtraction}
                disabled={isExtracting}
                className="flex-1 bg-[#c4d600] text-black font-black py-5 uppercase tracking-[0.3em] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.01] transition-all disabled:opacity-50 border-4 border-black"
              >
                {isExtracting ? 'ANALYSITE BEZIG...' : 'BRONNEN EXTRAHEREN'}
              </button>
              <button 
                onClick={() => setImages([])}
                className="bg-black text-white font-black px-10 py-5 uppercase tracking-[0.3em] hover:bg-red-600 transition-all border-4 border-black"
              >
                CLEAR
              </button>
          </div>
        </div>
      ) : (
        <div className="py-16 border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 bg-slate-50 group cursor-pointer hover:border-[#0065bd] transition-all" onClick={() => fileInputRef.current?.click()}>
           <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-6 opacity-10 group-hover:opacity-30 group-hover:text-[#0065bd] transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
           </svg>
           <p className="text-sm font-black uppercase tracking-[0.4em] text-black/20 group-hover:text-[#0065bd]">Sleep afbeeldingen hierheen of klik om te uploaden</p>
        </div>
      )}

      {isExtracting && (
        <div className="flex items-center gap-6 bg-slate-900 text-[#c4d600] p-6 border-l-[12px] border-[#c4d600] shadow-xl">
           <div className="w-8 h-8 border-4 border-[#c4d600]/20 border-t-[#c4d600] rounded-full animate-spin"></div>
           <div>
             <p className="text-xs font-black uppercase tracking-[0.4em]">OCR & CLASSIFICATIE ENGINE ACTIEF</p>
             <p className="text-[10px] opacity-60 font-bold mt-1">Syllabus-structuur wordt gedetecteerd...</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default InputExtractor;
