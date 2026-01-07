
import { GoogleGenAI } from "@google/genai";
import { ExtractorOutput, NormalizedOutput } from "../types";

export const normalizeInput = async (extractedData: ExtractorOutput): Promise<NormalizedOutput> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Je bent Input Normalizer. Maak de input compact en consistent.
  
  DATA: ${JSON.stringify(extractedData)}
  
  Regels: Geen externe kennis. GEEN KOPPELTEKENS.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      temperature: 0.1,
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text) as NormalizedOutput;
};
