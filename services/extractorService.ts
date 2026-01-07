import { GoogleGenAI, Type } from "@google/genai";
import { ExtractorOutput } from "../types";

export const extractContentFromImages = async (base64Images: string[]): Promise<ExtractorOutput> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const imageParts = base64Images.map(img => {
    const [header, data] = img.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
    return {
      inlineData: {
        mimeType: mimeType,
        data: data || img,
      },
    };
  });

  const textPart = {
    text: `Je bent de Dalton Input Extractor. Analyseer de bijgevoegde afbeeldingen (foto's van aardrijkskunde lesboeken, schriften of kaarten). 
    Extraheer alle tekst en categoriseer dit in: leerdoelen, begrippenlijst (met definities), bronnen (titel en tekst), en algemene leertekst.
    
    🛑 BELANGRIJKE REGELS:
    1. Gebruik GEEN externe kennis, alleen wat je ziet.
    2. Verwijder ALLE koppeltekens (-). Vervang door een spatie of komma.
    3. Lever uitsluitend JSON.`
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [...imageParts, textPart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          pages: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                page_id: { type: Type.STRING },
                raw_text: { type: Type.STRING },
                warnings: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["page_id", "raw_text"]
            }
          },
          leerdoelen: { type: Type.ARRAY, items: { type: Type.STRING } },
          begrippen: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING },
                definitie: { type: Type.STRING }
              },
              required: ["term", "definitie"]
            } 
          },
          bronnen: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                bron_id: { type: Type.STRING },
                titel: { type: Type.STRING },
                bron_tekst: { type: Type.STRING }
              },
              required: ["bron_id", "titel", "bron_tekst"]
            }
          },
          leertekst: { type: Type.STRING },
          global_warnings: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["leerdoelen", "begrippen", "bronnen"]
      }
    }
  });

  return JSON.parse(response.text) as ExtractorOutput;
};