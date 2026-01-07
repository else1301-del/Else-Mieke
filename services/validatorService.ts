
import { GoogleGenAI } from "@google/genai";
import { GeneratorParams, ValidationReport } from "../types";

export const validateInput = async (params: GeneratorParams): Promise<ValidationReport> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Je bent Preflight Validator voor een gesloten systeem Aardrijkskunde toetsgenerator.
  
  Controleer of de input rijk genoeg is voor de gekozen RTTI aantallen.
  
  INPUT DATA:
  - Leerdoelen: ${params.leerdoelen}
  - Begrippen: ${params.begrippen}
  - Bronnen: ${params.bronnen}
  - RTTI: R=${params.rttiTarget.r}, T1=${params.rttiTarget.t1}, T2=${params.rttiTarget.t2}, I=${params.rttiTarget.i}

  🛑 REGELS: GEEN KOPPELTEKENS. GEEN EXTERNE KENNIS.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      temperature: 0.1,
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text) as ValidationReport;
};
