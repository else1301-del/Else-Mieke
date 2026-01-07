
import { GeneratorParams, ValidationReport } from "../types";

export const validateInput = async (params: GeneratorParams): Promise<ValidationReport> => {
  const prompt = `Je bent Preflight Validator voor een gesloten systeem Aardrijkskunde toetsgenerator.
  
  Controleer of de input rijk genoeg is voor de gekozen RTTI aantallen.
  
  INPUT DATA:
  - Leerdoelen: ${params.leerdoelen}
  - Begrippen: ${params.begrippen}
  - Bronnen: ${params.bronnen}
  - RTTI: R=${params.rttiTarget.r}, T1=${params.rttiTarget.t1}, T2=${params.rttiTarget.t2}, I=${params.rttiTarget.i}

  🛑 REGELS: GEEN KOPPELTEKENS. GEEN EXTERNE KENNIS.`;

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.1,
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Validatie mislukt via proxy.");
  }

  const data = await response.json();
  return JSON.parse(data.text) as ValidationReport;
};
