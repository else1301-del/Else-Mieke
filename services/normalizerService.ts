import { GoogleGenAI, Type } from "@google/genai";
import { ExtractorOutput, NormalizedOutput } from "../types";

export const normalizeInput = async (extractedData: ExtractorOutput): Promise<NormalizedOutput> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Je bent de Dalton Input Normalizer. Je hebt ruwe data gekregen uit een OCR scan van lesmateriaal. 
  Maak deze data schoon, combineer dubbele items en zorg dat alles in correct Nederlands staat zonder spellingfouten.
  
  DATA: ${JSON.stringify(extractedData)}
  
  🛑 REGELS:
  1. Gebruik GEEN externe kennis.
  2. Verwijder ELK koppelteken (-).
  3. Zorg dat bronnen een logisch ID krijgen (1, 2, 3...).`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      temperature: 0.1,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          normalized_leerdoelen: { type: Type.ARRAY, items: { type: Type.STRING } },
          normalized_begrippen: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING },
                definitie: { type: Type.STRING }
              }
            }
          },
          normalized_bronnen: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                bron_id: { type: Type.STRING },
                titel: { type: Type.STRING },
                bron_tekst: { type: Type.STRING }
              }
            }
          },
          normalized_leertekst: { type: Type.STRING },
          notes: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["normalized_leerdoelen", "normalized_begrippen", "normalized_bronnen"]
      }
    }
  });

  return JSON.parse(response.text) as NormalizedOutput;
};