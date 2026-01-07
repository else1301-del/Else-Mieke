import { GoogleGenAI, Type } from "@google/genai";
import { GeneratorParams, ValidationReport } from "../types";

export const validateInput = async (params: GeneratorParams): Promise<ValidationReport> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Je bent de Preflight Validator voor Dalton Dordrecht. Analyseer of de huidige input (bronnen, leerdoelen, begrippen) kwalitatief en kwantitatief voldoende is om een toets te maken met de gevraagde RTTI verdeling.
  
  INPUT DATA:
  - Leerdoelen: ${params.leerdoelen}
  - Begrippen: ${params.begrippen}
  - Bronnen: ${params.bronnen}
  - Gevraagde RTTI: R=${params.rttiTarget.r}, T1=${params.rttiTarget.t1}, T2=${params.rttiTarget.t2}, I=${params.rttiTarget.i}

  🛑 REGELS: GEEN KOPPELTEKENS. GEEN EXTERNE KENNIS.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      temperature: 0.1,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
          quick_fixes: { type: Type.ARRAY, items: { type: Type.STRING } },
          missing_information: { type: Type.ARRAY, items: { type: Type.STRING } },
          feasibility: { type: Type.STRING, description: "'ok' or 'risk'" }
        },
        required: ["warnings", "quick_fixes", "missing_information", "feasibility"]
      }
    }
  });

  return JSON.parse(response.text) as ValidationReport;
};